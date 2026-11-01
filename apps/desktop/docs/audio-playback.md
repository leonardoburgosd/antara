# Reproducción de audio en Desktop (Windows)

Documento **obligatorio** para todo lo relacionado con reproducción musical en Desktop. Describe responsabilidades, streaming HTTP con Range, seek, buffering, cola, estado, volumen, errores, persistencia, formatos e integración con Windows.

> **Estado actual:** el motor de reproducción **aún no existe** (la app es la plantilla Tauri 2 sin features de audio; ver [README.md](README.md)). Este documento define el diseño objetivo (fase 1: `HTMLAudioElement`, ADR-003 en [../../docs/decisions/README.md](../../../docs/decisions/README.md)).

> La UI **nunca** mezcla lógica de reproducción con componentes visuales: los componentes leen el store del reproductor y emiten acciones (ver [../../docs/global-architecture.md](../../../docs/global-architecture.md#gestión-del-estado)).

## Responsabilidades

| Pieza | Responsabilidad |
|---|---|
| `services/playback/PlaybackEngine.ts` | **Interfaz** (contrato) del motor: load/play/pause/seek/volumen/eventos |
| `services/playback/HtmlAudioEngine.ts` | Implementación fase 1 con `HTMLAudioElement` |
| `stores/player.ts` | Estado dueño: pista actual, cola, posición, volumen, shuffle/repeat, estado de carga/error |
| `features/player/` + `components/PlayerBar.tsx` | UI: barra inferior, controles, progreso, cola |
| `services/api/` | Resolución de la URL/identificador de stream desde el backend (contrato real) |
| `integrations/tauri/` | Futura: comandos de SMTC/teclas multimedia (fase 2) |

## Arquitectura del motor (abstracción)

Toda la app habla con `PlaybackEngine`; el motor es intercambiable (ADR-003 en [../../docs/decisions/README.md](../../../docs/decisions/README.md)):

```ts
export interface PlaybackEngine {
  load(source: { url: string; trackId: string; startAt?: number }): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  seek(seconds: number): void;
  setVolume(level: number): void;          // 0..1
  getCurrentTime(): number;
  getDuration(): number;
  getBufferedEnd(): number;
  destroy(): void;
  on(event: EngineEvent, cb: Handler): () => void;
  // eventos: 'ready' | 'timeupdate' | 'ended' | 'error' | 'stalled' | 'playing' | 'paused'
}
```

- La UI/store **no** toca `HTMLAudioElement` directamente.
- La máquina de estados del motor: `idle → loading → ready → playing ⇄ paused → ended`, con `error` accesible desde cualquier estado.
- Cambiar de motor (fase 2) = nueva implementación de la interfaz, sin tocar componentes.

## Streaming HTTP y Range

- El backend expone un **endpoint de audio existente** (identificarlo en el repositorio del backend; no inventarlo).
- El motor carga la URL en `HTMLAudioElement`. La pila de medios de Chromium (WebView2) realiza **solicitudes HTTP Range** (`Range: bytes=…`, respuesta `206 Partial Content` con `Content-Range`) y un **buffering con ventana deslizante** (high/low watermark): no se descarga el archivo completo antes de reproducir.
- Requisitos del servidor (verificar y, si falla, registrar incidencia):
  - `Accept-Ranges: bytes`
  - Soporte de rangos arbitrarios (crítico para seek en archivos VBR)
  - `Content-Type` correcto del tipo de audio
- Seek: `audio.currentTime = x` dispara una nueva petición de rango; no requiere código propio.
- Cancelación: al cambiar de pista, asignar otra `src` aborta la petición anterior (comportamiento nativo).
- **Autenticación del stream:** según contrato del backend (token en query / header no es posible en `<audio>` directo → si exige header, evaluar proxy por Rust o URL pre-firmada; documentar la solución elegida aquí cuando se conozca el contrato).

## Estado del reproductor

Store único dueño (ADR-011):

```ts
interface PlayerState {
  queue: Track[];
  currentIndex: number;
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';
  position: number;          // segundos, actualizado por 'timeupdate'
  duration: number;
  buffered: number;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  error?: AppError;
}
```

- Acciones del store delegan en el `PlaybackEngine`; los eventos del motor actualizan el store.
- **Posición:** usar el evento `timeupdate` (≈4 Hz), **no** `requestAnimationFrame` (se suspende con la ventana oculta; además es innecesario para la barra). Para una barra de progreso más suave, `rAF` solo mientras la ventana está visible (`document.visibilityState`).
- Persistencia de sesión (última pista, posición, volumen): `localStorage`/plugin-store al pausar o cambiar de pista; restaurar en pausa, **nunca autoplay** al abrir (política de autoplay + UX).

## Cambio de pista y cola

- La cola se gestiona en el store (agregar, quitar, reordenar, siguiente/anterior con shuffle/repeat).
- `ended` → siguiente según repeat (`one` repite, `all` cicla, `off` detiene al final).
- Errores de pista → reintentos (ver abajo) → si persiste, saltar a la siguiente y registrar.
- La cola se sincroniza con el backend cuando el contrato lo defina (estado compartido entre dispositivos).

## Volumen y mute

- `setVolume`/`muted` en el motor; el valor vive en el store y persiste.
- Cambios desde UI o (fase 2) teclas de volumen del sistema.
- No reiniciar la reproducción al cambiar volumen.

## Errores de reproducción

| Error | Detección | Acción |
|---|---|---|
| Red caída / stream caído | evento `error`/`stalled` del motor + `navigator.onLine` | Reintento automático con backoff (máx. 2); luego estado `error` con "Reintentar" y "Siguiente pista" |
| `404` / archivo no disponible | HTTP en la carga | Mensaje "Este contenido no está disponible"; no reintentar en bucle |
| `401`/`403` en stream | HTTP | Delegar en el flujo de sesión del `ApiClient` (refresco) y recargar |
| Códec no soportado | evento `error` del motor + `canPlayType` previo | Mensaje "Formato no soportado en este dispositivo" (ver compatibilidad) |
| Autoplay bloqueado | `play()` rechaza con `NotAllowedError` | No es error de red: mostrar estado pausado; el usuario inicia con un gesto |

Reglas: los mensajes salen del flujo de [../../docs/error-handling.md](../../../docs/error-handling.md); **nunca** mostrar la URL ni rutas físicas.

## Compatibilidad de formatos

WebView2 usa Chromium. Soporte esperado de audio en `<audio>` (verificar con `canPlayType()` en runtime, es la fuente de verdad):

| Formato | Soporte esperado (Chromium/WebView2) |
|---|---|
| MP3 | ✅ |
| AAC / M4A | ✅ (codecs propietarios incluidos en Edge/WebView2) |
| FLAC | ✅ |
| WAV (PCM) | ✅ |
| Opus (Ogg/WebM) | ✅ |
| Vorbis (Ogg) | ✅ |
| **WMA / WMV** | ❌ |
| **ALAC (Apple Lossless)** | ❌ |
| **APE (Monkey's Audio)** | ❌ |
| **AIFF** | ❌ |
| MIDI | ❌ |

- **No se presupone** que el WebView soporta todos los formatos: detectar con `canPlayType()` antes de reproducir cuando el formato del contrato no esté garantizado y mostrar error claro si falla.
- Estrategia ante formato no soportado: (1) informar al usuario; (2) evaluar alternativa del backend (si existe transcodificación en el contrato) o (3) **fase 2**: motor en Rust con decodificador (p. ej. symphonia) que cubra los formatos faltantes — decisión registrada como ADR al activarse (ADR-003).

## Ciclo de vida y ventana oculta

- **Window oculta (Close-to-Tray) ≠ destruida:** el webview sigue vivo y **el audio continúa** (requisito central de [system-tray.md](system-tray.md)).
- El store y el motor no se pausan por `visibilitychange`; solo se suspenden actualizaciones costosas (rAF) y se reduce el trabajo de render.
- Al **salir explícitamente** ("Salir" de la bandeja): pausar/destruir el motor antes de `app.exit(0)` para liberar el dispositivo de audio.
- Si Windows termina el proceso: no se garantiza persistencia (igual que en Android con detención forzada).

## Buffering

- Delegado a la pila de medios de Chromium (ventana deslizante). No implementar buffer propio en fase 1.
- UI: mostrar `buffered` en la barra de progreso (`border-strong`) y estado `loading` al iniciar pista (skeleton del reproductor).
- Si el backend es lento, Chromium reanuda solo; la UI informa con "Reconectando…" tras los reintentos agotados.

## Integración con controles multimedia de Windows (fase 2)

- **Fase 1:** no hay integración con teclas multimedia/SMTC; documentado como limitación. Las teclas de medios del teclado/OS no controlarán la app.
- **Fase 2 (evaluar):** exponer estado y comandos al *System Media Transport Controls* de Windows desde Rust (crate `windows`, interfaz `SystemMediaTransportControls`) alimentado por eventos del frontend (`integrations/tauri/` → `services/smct.rs`). Requiere: metadata de pista, estado play/pause, posición, acciones prev/next.
- Activación de la fase 2: al primer requerimiento funcional de teclas multimedia (condición de revisión de ADR-003). Registrar como ADR nuevo.

## Rendimiento

- Un solo `HTMLAudioElement` (o por pista con precarga `none`); no crear elementos por fila de lista.
- Sin bucles de alta frecuencia (ver estado del reproductor).
- Portadas y metadatos separados del stream de audio.
- Memoria: streaming sin descarga completa; evitar `blob:` de archivos completos.

## Checklist de implementación de reproducción

1. Motor tras la interfaz `PlaybackEngine`; UI sin `HTMLAudioElement` directo.
2. Streaming por URL del backend con Range; sin descarga completa.
3. Estados loading/playing/paused/ended/error reflejados en la UI.
4. Cola, shuffle/repeat, volumen persistidos según contrato.
5. Errores con mensajes comprensibles (sin URLs/rutas).
6. Funciona con la ventana oculta en bandeja.
7. `canPlayType` y mensaje claro para formatos no soportados.
8. Pruebas de [testing.md](testing.md) en verde.
