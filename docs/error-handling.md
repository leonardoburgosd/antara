# Manejo de errores (Error Handling)

Estrategia común para las tres plataformas: errores técnicos registrados para diagnóstico, mensajes humanos y seguros para el usuario.

## Principios

1. **Un modelo de error único por plataforma** (`AppError` en TS, sealed class en Kotlin, `enum`/`thiserror` en Rust). La infraestructura traduce errores crudos a ese modelo; la UI solo ve el modelo.
2. **Registro técnico ≠ mensaje al usuario.** Se registra el detalle (código, endpoint, causa raíz); se muestra una frase comprensible.
3. **Nunca exponer:** excepciones internas, stack traces, rutas físicas de archivos, URLs completas, identificadores internos, tokens, datos de otros usuarios.
4. **Todo estado de carga tiene salida:** éxito, error o vacío. Ninguna pantalla se queda en spinner indefinidamente.
5. **Las cancelaciones no son errores** para el usuario.

## Taxonomía de errores

| Categoría | Orígenes típicos | Registro | Mensaje al usuario (ejemplo) |
|---|---|---|---|
| **Red** | Sin conexión, timeout, DNS, TLS | Log técnico con detalle | "No pudimos conectar. Revisa tu conexión e inténtalo de nuevo." + acción "Reintentar" |
| **Autenticación** | `401`, token caducado, refresh fallido | Log técnico | "Tu sesión expiró. Inicia sesión nuevamente." → redirigir a login |
| **Autorización** | `403` | Log técnico | "No tienes permiso para esta acción." |
| **Servidor** | `5xx`, mantenimiento | Log con status/endpoint | "Estamos teniendo problemas. Intenta más tarde." |
| **Recurso no disponible** | `404`, archivo de audio ausente, portada inexistente | Log técnico | "Este contenido no está disponible." (estado vacío o fila deshabilitada) |
| **Validación** | `400/422`, límites de formulario | Log mínimo | Mensaje específico junto al campo ("El nombre es obligatorio") |
| **Reproducción** | Códec no soportado, error de decoder, stall persistente, stream caído | Log con `error.code` del motor | "No se pudo reproducir este archivo." / "Formato no soportado en este dispositivo." + acción "Reintentar" / "Siguiente pista" |
| **Permisos** | Permiso denegado (Android), alcance denegado (Tauri) | Log | Explicar **por qué** se necesita y cómo habilitarlo; nunca volver a pedir en bucle |
| **Desconexión** | Pérdida de red durante reproducción/carga | Log | "Se perdió la conexión." + reintento automático razonable o acción manual |
| **Parsing/datos** | JSON inesperado, contrato cambiado | Log alto (alerta de contrato) | "No pudimos leer la respuesta del servidor." (genérico) |
| **Cancelada** | Usuario canceló, navegación, desmontaje | Sin log de error | Nada |
| **Desconocida** | Cualquier fallback | Log con contexto | "Algo salió mal. Intenta de nuevo." |

## Manejo por capa

### Infraestructura (ApiClient / core/network)

- Traduce status HTTP, errores de red y fallos de parseo a `AppError`.
- Aplica timeouts, reintentos y refresh (ver [api-integration.md](api-integration.md)).
- Registra: método, path (sin query sensible), status, `AppError` type, `requestId` si existe. **Nunca** cuerpo con credenciales ni tokens.

### Capa de servicio/repositorio

- Convierte `Result<T, AppError>` en estado de dominio (`Loading/Success/Error`) o lo propaga.
- Decide reintento/refresh de datos según el caso (p. ej. revalidar al volver a la pantalla).

### UI

- Traduce `AppError` → mensaje + acción:
  - `network` → mensaje + botón "Reintentar".
  - `unauthorized` → logout/redirect automático.
  - `notFound` → estado vacío.
  - `parsing`/`server` → mensaje genérico + "Reintentar".
- Los componentes **nunca** muestran `error.message` crudo del sistema.

## Estados de carga

Todo flujo asíncrono de UI modela al menos tres estados:

```text
idle → loading → success | error | empty
```

- `loading`: skeleton para contenido; spinner para acciones puntuales (ver [design-system.md](design-system.md#componentes)).
- `empty`: cuando el éxito trae cero elementos (no es error).
- Reintentos: el usuario puede reintentar desde `error`; las reintentos automáticos se limitan según [api-integration.md](api-integration.md#reintentos-controlados).
- Evitar parpadeos: mantener el contenido previo visible mientras se revalida (stale-while-revalidate ligero).

## Errores de reproducción

- **Red caída durante stream:** el motor reintenta con backoff (ExoPlayer/`<audio>` lo hacen de forma nativa con sus propios mecanismos); tras N fallos → estado `error` con acción "Reintentar" y opción "Siguiente pista".
- **Códec no soportado:** detectar antes de reproducir cuando sea posible (`canPlayType` en Web/Desktop; `MediaCodecList`/error de ExoPlayer en Android) y mostrar mensaje claro (ver [`apps/desktop/docs/audio-playback.md`](../apps/desktop/docs/audio-playback.md#compatibilidad-de-formatos)).
- **Seek a posición no disponible:** devolver a la última posición válida; informar solo si persiste.
- **Error de cola:** si falla una pista, saltar a la siguiente tras el reintento y registrar; si fallan consecutivas, detener con mensaje.
- **Nunca** se muestra al usuario un mensaje que contenga la ruta física del archivo o la URL del stream.

## Operaciones canceladas

- Las cancelaciones (navegación, cambio de búsqueda, desmontaje, cambio de pista) se propagan como `AbortError`/`CancellationException` y se **ignoran** en la UI: no toasts, no logs de error.
- Distinguir cancelación explícita de timeout (timeout es error de red).

## Reintentos

- Automáticos: solo los definidos en [api-integration.md](api-integration.md#reintentos-controlados), visibles al usuario solo si persisten (p. ej. barra "Reconectando…").
- Manuales: toda pantalla de error ofrece una acción de reintento cuando tenga sentido.
- Reintentos de reproducción: máximo 2 automáticos antes de rendir la pista.

## Registro (logs)

| Plataforma | Mecanismo | Reglas |
|---|---|---|
| Web | `console` con nivel en dev; servicio de log en prod (cuando exista) | Sin PII ni tokens; agrupar por `requestId` |
| Desktop | Frontend: igual que Web. Rust: `log`/`tracing` a archivo de log de la app | Niveles (error/warn/info/debug); debug solo en dev |
| Android | `Log`/`Timber`-equivalente (agregar librería solo si se justifica) | Tag por módulo; `Log.e` solo para fallos; no loguear payloads completos |

- **Prohibido** registrar: contraseñas, tokens, cabeceras `Authorization`, URLs con credenciales, contenido de biblioteca de otros usuarios.
- Los logs son para diagnóstico técnico; el usuario jamás ve un log como mensaje principal.

## Errores globales

- **React:** `ErrorBoundary` en la raíz de la app (Desktop/Web) que muestra pantalla de error recuperable ("Algo salió mal" + "Recargar"); errores de promesas no capturadas → logger global.
- **Rust:** `panic` en comandos se evita propagando `Result`; un panic no debe tumbar la app (revisar handlers).
- **Android:** `Thread.setDefaultUncaughtExceptionHandler` opcional para log de crash; los `ViewModel` no deben dejar excepciones escapar de sus flujos.

## Checklist

1. ¿Todo flujo asíncrono tiene loading/empty/error?
2. ¿Los mensajes son comprensibles y no exponen internals?
3. ¿Las cancelaciones no generan errores visibles?
4. ¿Los reintentos respetan las reglas?
5. ¿Los logs contienen contexto técnico sin datos sensibles?
