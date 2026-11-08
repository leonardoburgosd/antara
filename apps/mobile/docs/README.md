# Documentación de la aplicación Mobile (Antara para Android)

Aplicación nativa de Antara para **Android**: Kotlin, Jetpack Compose, Material 3 personalizado y AndroidX Media3 (ExoPlayer, MediaSession, MediaSessionService).

> Esta documentación **complementa** a la global; nunca la sustituye. Antes de cualquier trabajo, consultar [`../../docs/README.md`](../../../docs/README.md).

## Índice

| Documento | Contenido |
|---|---|
| [README.md](README.md) | Este índice |
| [architecture.md](architecture.md) | Arquitectura Android: Presentation/Domain/Data/Core, MVVM, UI State, DI, navegación |
| [project-structure.md](project-structure.md) | Organización de paquetes y archivos |
| [coding-standards.md](coding-standards.md) | Kotlin idiomático, coroutines/Flow, ViewModel, Compose, DI, errores, pruebas |
| [ui-guidelines.md](ui-guidelines.md) | Traslado del design system global a Jetpack Compose / Material 3 |
| [background-playback.md](background-playback.md) | **Reproducción en segundo plano con Media3** (obligatorio) |
| [media-session.md](media-session.md) | **Controles multimedia del sistema (MediaSession)** (obligatorio) |
| [permissions-and-lifecycle.md](permissions-and-lifecycle.md) | **Permisos, servicios y ciclo de vida de Android** (obligatorio) |
| [testing.md](testing.md) | Pruebas de ViewModels, repositorios, servicios, composables, reproducción |
| [implementation-instructions.md](implementation-instructions.md) | **Guía operativa obligatoria** para implementar en Android |

## Documentación global relacionada

- [Índice global](../../../docs/README.md)
- [Arquitectura global](../../../docs/global-architecture.md) · [Principios](../../../docs/architecture-principles.md)
- [Design System](../../../docs/design-system.md) · [Consistencia](../../../docs/ui-consistency.md) · [Responsivo](../../../docs/responsive-design.md)
- [API](../../../docs/api-integration.md) · [Errores](../../../docs/error-handling.md) · [Seguridad](../../../docs/security.md)
- [Flujo de desarrollo](../../../docs/development-workflow.md) · [Instrucciones](../../../docs/implementation-instructions.md)
- [Decisiones](../../../docs/decisions/README.md)

## Estado actual del código (saber con qué se trabaja)

Aplicación Android funcional construida sobre la plantilla, con las interfaces de autenticación, configuración de servidores, Home, detalle de canciones y reproductor:

- **Existe:** módulo único `:app`; `MainActivity` edge-to-edge; `AntaraTheme` con los tokens del design system (sin `dynamicColor`); navegación por estado en `navigation/AppRoot.kt` (ADR-013); inicio de sesión real contra `POST /api/usuario/login` usando el servidor configurado (URL base manual + ruta relativa, ADR-016) con sesión y token persistidos en DataStore; acceso a la configuración de servidores desde el login; alta/selección de servidores (IP/dominio) en DataStore con validación y normalización; Home con filtros y carrusel; detalle con lista de canciones; reproductor a pantalla completa; mini player; perfil con cierre de sesión; `PlaybackService` (`MediaSessionService` con ExoPlayer 1.4.1) + `PlayerConnection`/`PlayerViewModel`; `MediaController` solo en `player/`; cliente HTTP propio en `core/network/` (`HttpURLConnection` + `org.json`) y `data/remote/`; DI manual (`AntaraApplication` + `AppContainer`); recursos en español; audio de ejemplo en `res/raw/antara_sample.wav` (90 s) para reproducción offline.
- **No existe todavía:** catálogo real de la biblioteca (los datos de Home/Detalle son mock en `features/home/ui/*Data.kt`), resto de endpoints del backend, almacenamiento cifrado de token, pruebas automatizadas.
- **Bloqueos de build conocidos:** falta `gradle-wrapper.jar` y el script `gradlew` Unix (solo existe `gradlew.bat`); `local.properties` está versionado. El build se verificó con Gradle 8.14.3 en caché (ver ADR-012).


## Reglas inamovibles de Android

1. Consultar [implementation-instructions.md](implementation-instructions.md) antes de escribir código.
2. **La reproducción en segundo plano y la sincronización con MediaSession no se comprometen** por ninguna funcionalidad nueva (ver [background-playback.md](background-playback.md) y [media-session.md](media-session.md)).
3. La `MediaSession` es la **fuente única** del estado de reproducción expuesto al sistema; la UI la observa mediante `MediaController` (nunca un segundo estado de reproducción en la UI).
4. Permisos mínimos y justificados ([permissions-and-lifecycle.md](permissions-and-lifecycle.md)).
5. UI con los tokens del design system global ([../../docs/design-system.md](../../../docs/design-system.md) + [ui-guidelines.md](ui-guidelines.md)); Material 3 **personalizado**, no los estilos por defecto.
