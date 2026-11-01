# Estándares de código — Android

Estándares **adicionales** a los globales ([../../docs/coding-standards.md](../../../docs/coding-standards.md)) para Kotlin, Coroutines/Flow, ViewModel, Jetpack Compose, DI, errores, navegación y pruebas.

## Kotlin idiomático

- Preferir expresiones a statements; `when` exhaustivo; `let`/`also` solo cuando aclaran; sin `!!` (usar tipos nulos y manejar el caso nulo explícitamente).
- Data classes para datos; `value class`/`enum class` cuando representen conceptos.
- Extensiones para comportamiento reutilizable de tipos concretos (no `ObjectUtils` genéricos).
- Funciones pequeñas con nombres de intención; parámetros con nombres en llamadas con >1 arg booleano.
- `require`/`check` para invariantes de programación; errores de usuario vía flujo de `AppResult`, no excepciones lanzadas a la UI.

## Coroutines y Flow

- `suspend` para operaciones de una sola emisión (red); `Flow` para estado continuo; `StateFlow`/`SharedFlow` para estado observable.
- **Scope correcto:** `viewModelScope` para UI; scope del servicio para el reproductor; **nunca** `GlobalScope`.
- `Dispatchers` inyectados (`DispatcherProvider`): IO para red/disco en repositorios; `viewModelScope` (Main) para UI. El dominio no conoce dispatchers salvo que se inyecten.
- Cancelación respetada: sin `NonCancellable` salvo justificación; sin `runBlocking` en producción.
- `StateFlow` desde repositorios/ViewModel; `collectAsStateWithLifecycle()` en composables (no `collectAsState` para datos de red).
- `SharedFlow` para eventos one-shot (navegación, toasts) con `replay = 0`, consumidos una sola vez.

## ViewModel

- Un ViewModel por pantalla/flujo; expone `StateFlow<UiState>` (data class inmutable) o `StateFlow<PlayerUiState>` cuando observe al reproductor.
- Sin referencias a `Context`/`Activity`/`NavController`; la navegación se emite como evento del UiState o SharedFlow.
- Toda acción del usuario es un método del ViewModel (`onSongClick(id)`, `onRetry()`), no lógica en el composable.
- Manejo de errores centralizado: mapear `AppResult.Error` → `UiState.Error(message)` con mensaje comprensible (ver [../../docs/error-handling.md](../../../docs/error-handling.md)).
- Sin estado que duplique al reproductor: usar `PlayerController` (ADR-011).

## Jetpack Compose

- **Composables pequeños y especializados** (objetivo <150 líneas); extraer subcomposables antes de crecer.
- **Sin efectos secundarios no controlados en composición:**
  - Nada de `Random()`, `Date()`, `System.currentTimeMillis()` directamente en el cuerpo: usar `remember { Random(...) }` o derivar de estado.
  - `LaunchedEffect` solo para efectos reales (suscripciones, carga), con `key` correcta.
  - `remember`/`derivedStateOf` para valores derivados caros.
- **State hoisting:** los composables reciben estado (valores) y callbacks; sin estado propio salvo estado de UI interno (p. ej. expansión de un acordeón) con `rememberSaveable`.
- **Sin ViewModel ni repositorios dentro de composables.**
- Listas: `LazyColumn`/`LazyGrid` con `key` estable por id; `Modifier.animateItem()` para animación de reordenamiento.
- `Modifier` orden convencional: `padding` al final; sin `Modifier` hardcodeado fuera de tokens.
- Accesibilidad: `contentDescription` en iconos con acción (`null` en decorativos), tamaños de texto en `sp`, semánticas para lectores de pantalla.
- Recomposición: sin funciones/lambdas inestables innecesarias en listas (precompilar referencias); sin trabajo pesado en composición.

## Inyección de dependencias

- Todo dependiente se construye en `AppContainer` y se entrega por constructor (ViewModels vía `Factory`).
- Sin `object` singletons con estado para repositorios/servicios.
- Los ViewModels no instancian dependencias: las reciben.

## Gestión de errores

- Tipos: `AppError` (sealed) en `core/common` con categorías alineadas a [../../docs/error-handling.md](../../../docs/error-handling.md) y al mapeo mínimo de [../../docs/api-integration.md](../../../docs/api-integration.md) (`Network`, `Timeout`, `Unauthorized`, `Forbidden`, `NotFound`, `Validation`, `Conflict`, `RateLimited`, `Server`, `Parsing`, `Playback`, `Cancelled`).
- Repositorios devuelven `AppResult<T>` (o `Flow<AppResult<T>>`); las cancelaciones (`CancellationException`) **no** se capturan como error.
- La UI solo ve mensajes/estados ya traducidos; sin `printStackTrace` ni excepciones crudas en composables.

## Navegación

- Rutas centralizadas en `navigation/Routes.kt`; sin strings de ruta repartidos por features.
- Argumentos tipados; sin rutas duplicadas.
- El `NavController` vive en `MainActivity`/NavHost; los ViewModels emiten eventos de navegación, no navegan directamente.

## Organización de composables

- `features/<f>/ui/` para pantallas; componentes compartidos en `core/designsystem/components/`.
- Un composable principal por pantalla (`<Feature>Screen`) que ensambla subcomponentes y conecta callbacks al ViewModel.
- Los archivos de pantalla pueden contener composables privados internos; si se reutilizan, suben a `core/designsystem`.

## Gestión del estado

- `UiState` data class con todos los estados posibles de la pantalla (loading/empty/error/data) — sin flags dispersos.
- Estados del reproductor: solo de `PlayerController` (ver [media-session.md](media-session.md)).
- `rememberSaveable` para estado de UI sobreviviente a rotación; el estado de negocio vive en ViewModel.

## Pruebas

Ver [testing.md](testing.md). Reglas mínimas:

- Todo ViewModel con tests unitarios (coroutines-test + Turbine para Flow).
- Todo mapper/repositorio con tests (repositorio con fake de data source).
- Composables de pantallas con tests de UI (androidTest) para estados clave.
- Sin dependencias de red real en tests (fakes/`MockWebServer`).

## Build y calidad

- `gradlew lint` sin errores nuevos; `ktlint`/`ktfmt` si se adopta (registrar en decisiones).
- `compileSdk/targetSdk` actuales (34 hoy): actualizar solo con justificación y registro (ADR).
- ProGuard/minify: evaluar al preparar release; reglas de conservación mínimas.
