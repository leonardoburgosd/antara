# Pruebas — Desktop

Estrategia de pruebas de la aplicación Tauri 2, complementando a [../../docs/testing-strategy.md](../../../docs/testing-strategy.md).

> Estado actual: **no existe ninguna prueba ni framework instalado**. Las herramientas propuestas se instalan con la primera feature que las necesite (registrar la adición en [../../docs/decisions/README.md](../../../docs/decisions/README.md)).

## Componentes React

- **Herramienta:** Vitest + @testing-library/react (jsdom).
- **Cubrir:**
  - Render de componentes del design system con todas sus variantes (primary/secondary/ghost/danger, disabled, error).
  - Estados de pantallas: loading (skeleton), empty, error con reintento, success.
  - Interacciones: clics que emiten callbacks (no lógica interna), navegación por teclado en menús y listas.
  - Accesibilidad: roles/labels de los iconos con acción, foco visible en tabs.
- **No:** testear clases CSS internas ni implementación; testear comportamiento (textos, roles, callbacks).

## Hooks

- `renderHook` de @testing-library/react.
- Casos: `useKeyboardShortcut` (disparo, ignorado con input enfocado), `useMediaQuery`/región de ventana, suscripciones de `integrations/tauri/events` (cleanup al desmontar — simular `listen` con mock).

## Servicios

| Servicio | Qué probar |
|---|---|
| `apiClient` | Composición URL+headers, timeout, cancelación (`AbortController`), mapeo de status → `AppError`, reintentos solo en GET, sin reintentos en 4xx |
| mappers | DTO → entidad con casos borde (campos ausentes, nulls, formatos de fecha) |
| `player` store | Transiciones de estado (loading→playing→error), fin de pista según repeat, cola siguiente/anterior con shuffle, persistencia |
| `PlaybackEngine` (mock) | El store reacciona a eventos `ready/timeupdate/ended/error` del motor simulado |
| `formatSupport` | `canPlayType` con formatos soportados/no soportados simulados |

- **Simulación HTTP:** MSW (Mock Service Worker) para respuestas del backend simulando el contrato real (leído del repositorio del backend).

## Comandos Rust

- `cargo test` en `src-tauri/src/` con `#[cfg(test)]`:
  - `commands/`: validación de argumentos y propagación de errores (con `AppHandle` simulado donde sea posible; extraer lógica testeable en funciones puras de `services/`).
  - `services/tray.rs`: construcción de menú (IDs correctos, separadores), `update_menu_labels` con estados play/pause (si la API lo permite sin app real; si no, extraer la lógica de texto a función pura y probarla).
  - `error.rs`: conversión a payload serializable.
- `cargo clippy -- -D warnings` y `cargo fmt --check` como gate.

## Eventos Tauri (frontend↔Rust)

- Mock de `@tauri-apps/api/core` (`invoke`) y `event` (`listen`):
  - Wrapper `set_playback_state` invoca el comando con payload correcto y relanza errores como `AppError`.
  - Suscripción a `tray:toggle-play` ejecuta la acción del store; al limpiar, no quedan listeners.
- **Contrato:** test de que cada comando registrado en `lib.rs` tiene wrapper TS (lista compartida o test de existencia) — evita desincronización.

## Integración con Windows / System Tray / ciclo de vida

La bandeja y el ciclo de ventana son difícilmente automatizables sin Windows real; usar **checklist manual estructurado** (obligatorio en cada cambio que toque esos archivos), definido en [system-tray.md](system-tray.md#pruebas-obligatorias):

1. Cerrar (X) durante reproducción → oculta + audio continúa + icono presente.
2. Cerrar sin reproducción → oculta, sin errores.
3. Restaurar desde bandeja (click izquierdo y "Abrir").
4. Pausar/reanudar desde menú contextual (etiqueta refleja estado).
5. Siguiente/anterior desde menú contextual.
6. "Salir" → proceso terminado (sin huérfanos en el Administrador de tareas).
7. Segunda instancia → enfoca la existente (single-instance).
8. Ciclos X→mostrar→X repetidos → X sigue funcionando.
9. Geometría persistida (si `window-state`): restaura tamaño/posición.

Automatización futura evaluable: `tauri-driver`/WebDriver para smoke E2E de ventana (abrir, navegar, cerrar); registrar como ADR si se adopta.

## Reproducción

- **Unidad:** store + motor simulado (ver servicios).
- **Manual estructurado:**
  1. Reproducir pista → estados loading→playing correctos.
  2. Pausar/reanudar, cambiar volumen, mute.
  3. Seek hacia adelante y atrás (verifica Range real con el backend).
  4. Cambiar de pista, cola siguiente/anterior, shuffle/repeat.
  5. Reproducir con la ventana **oculta** (bandeja) → continúa; restaurar → UI coherente.
  6. Desconectar red durante reproducción → reintento → mensaje comprensible.
  7. Pista con formato no soportado → mensaje claro.
  8. Cambiar de pista rápidamente 10 veces → sin estados huérfanos ni audio duplicado.
- **Con backend real:** probar seek en archivo VBR largo (valida `Accept-Ranges` del servidor).

## Regresión

- Antes de release: smoke test del flujo crítico (arranque → login (cuando exista) → biblioteca → reproducción → ocultar/restaurar → salir).
- Las pruebas nuevas no reemplazan a las existentes: todas deben seguir en verde.

## Checklist por feature (resumen)

1. Unit de lógica nueva (ver [../../docs/testing-strategy.md](../../../docs/testing-strategy.md)).
2. Componentes con estados loading/empty/error.
3. Errores de red simulados con mensaje comprensible.
4. Navegación sin roturas.
5. Si toca tray/ciclo de vida: checklist manual de system-tray.
6. Si toca reproducción: checklist manual de audio-playback.
7. `tsc` sin errores, lint sin errores nuevos, `cargo clippy` limpio.
