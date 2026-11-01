# Pruebas — Android

Estrategia de pruebas de la aplicación Mobile, complementando a [../../docs/testing-strategy.md](../../../docs/testing-strategy.md).

> Estado actual: **no existen pruebas** (no hay directorios `src/test` ni `src/androidTest`), aunque Gradle ya declara JUnit, Espresso y las dependencias de UI Test de Compose. Se instalarán/activarán las herramientas con la primera feature que las necesite (registrar en [../../docs/decisions/README.md](../../../docs/decisions/README.md)).

## ViewModels

- **Herramientas:** JUnit + `kotlinx-coroutines-test` (`runTest`, `StandardTestDispatcher`), Turbine para `Flow`/`StateFlow`.
- **Cubrir:**
  - Transiciones de `UiState`: `loading → data | empty | error` ante resultados del repositorio (fake).
  - Acciones del usuario delegan correctamente (verificar llamadas al repositorio/fake con `verify` o estados resultantes).
  - Manejo de errores: `AppResult.Error` → mensaje comprensible en `UiState.Error` (sin textos técnicos).
  - Emisión de eventos one-shot (navegación/toasts) sin pérdida por replay.
  - Cero estado duplicado del reproductor (si el VM observa `PlayerController`, usar fake del controller).

## Use Cases y reglas de negocio

- Tests unitarios puros: construcción de cola, shuffle/repeat, límites, validaciones.
- Sin Android ni coroutines salvo que el caso las use (entonces `runTest`).

## Repositorios

- Tests con **fake de data sources** (remote/local): mapeo DTO→entidad, merge de caché, propagación de `AppError`.
- `data/remote` con `MockWebServer` (OkHttp): respuestas exitosas, 401/404/500, JSON malformado, timeout.
- Mappers con casos borde (campos ausentes/nulls).

## Servicios (player) y ExoPlayer

- La lógica propia del servicio (construcción de `MediaItem`, resolución de metadata, manejo de errores) se extrae en clases testeables con **fakes de `Player`** donde sea posible.
- `PlayerController`/`PlaybackConnection`: con `MediaController` fake (interfaz propia sobre el controller para poder sustituirla) → acciones delegan y los `Player.Listener` se traducen a `StateFlow`.
- Pruebas de integración de reproducción real → instrumentadas o manuales (ver abajo).

## MediaSession, MediaSessionService y notificación

Automatización parcial; combinación de:

- **Unidad:** callbacks de `MediaSession` (`onAddMediaItems`, `onCustomCommand`) con fakes; mapeo de errores de `PlaybackException` → `AppError`.
- **Instrumentadas (androidTest):**
  - Conectar `MediaController` al servicio real y verificar: play/pause/seek/cola.
  - Verificar que al iniciar reproducción se crea la notificación y el servicio está en foreground (lectura con `NotificationManager`).
  - Metadata correcta en la sesión al cambiar de pista.
- **Manual estructurado** (obligatorio en cada cambio que toque reproducción): checklist de [background-playback.md](background-playback.md) y [media-session.md](media-session.md).

## Reproducción en segundo plano (checklist manual obligatorio)

1. Reproducir → salir a home → la música continúa.
2. Abrir otra app (p. ej. navegador) → continúa.
3. Bloquear pantalla → continúa; desbloquear → controles visibles en notificación.
4. Apagar pantalla → continúa (si wake mode está activo).
5. Pausar/reanudar desde notificación → la UI al volver muestra el estado correcto.
6. Siguiente/anterior desde notificación.
7. Desconectar auriculares → pausa automática.
8. Llamada entrante/interrupción → pausa y reanudación correcta.
9. Desconectar red → reintento → error comprensible.
10. Matar la app desde recientes **con música sonando** → comportamiento esperado según ciclo de vida (documentar resultado).
11. Rotar el dispositivo durante reproducción → estado coherente, sin reiniciar la pista.
12. Forzar detención → sin crash; al reabrir, estado razonable.

## Navegación

- Tests de UI (Compose): llegar a cada pantalla desde el home; back de Android cierra sheets/menús y luego navega; argumentos de ruta correctos.
- Sin pantallas "fantasma" (rutas duplicadas/inválidas).

## Composables

- **androidTest + Compose UI Test:** render de estados (skeleton/empty/error/data), interacción principal (tap → acción del VM verificada), accesibilidad básica (`contentDescription` presente).
- Componentes de `core/designsystem`: test de variantes y estados (enabled/disabled/error).
- No testear implementación interna (nodos/ids privados); testear comportamiento visible.

## Integración HTTP

- `MockWebServer` para: auth (headers correctos), paginación, errores mapeados, timeout/cancelación.
- Sin red real en CI ni en tests.

## Interrupciones y bloqueo de pantalla

- Instrumentadas donde sea viable: `ACTION_AUDIO_BECOMING_NOISY` simulado → pausa; pérdida de audio focus (simular con `AudioManager`/fakes en unidades del handler).
- Bloqueo de pantalla: manual (checklist) o con `adb` en instrumentadas (`adb shell input keyevent 26`).

## Regresión

- Smoke manual antes de release: arranque → biblioteca (cuando exista) → reproducción → notificación → segundo plano → bloqueo → volver.
- Todas las suites en verde: `gradlew test` (unidades) + `gradlew connectedAndroidTest` (instrumentadas).

## Checklist por feature (resumen)

1. Unidad de VM/repo/mappers/lógica.
2. Estados de pantalla (loading/empty/error).
3. Errores de red simulados con mensaje comprensible.
4. Navegación y accesibilidad básicas.
5. Si toca reproducción: checklist manual de background-playback/media-session.
6. Si toca permisos: prueba en API 33/34 + denegación de permiso.
7. `gradlew lint test` sin errores nuevos.
