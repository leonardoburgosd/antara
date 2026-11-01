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

Aplicación basada en la plantilla de Android Studio con una pantalla de bienvenida (`WelcomeScreen.kt`):

- **Existe:** módulo único `:app`; `MainActivity` con edge-to-edge; tema Material 3 de plantilla (colores por defecto, `dynamicColor = true`); dependencias Media3 1.4.1 **declaradas sin usar**; permisos `INTERNET`, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MEDIA_PLAYBACK` en el manifest; version catalog con Kotlin 2.0.21, Compose BOM 2024.10.00, compileSdk/targetSdk 34, minSdk 24.
- **No existe:** ViewModels, navegación, cliente HTTP, repositorios, `MediaSessionService`, servicios declarados, DI, pruebas.
- **Bloqueos de build conocidos:** faltan recursos `@mipmap/ic_launcher` (referenciados en el manifest); falta `gradle-wrapper.jar` y el script `gradlew` Unix (solo existe `gradlew.bat`); `local.properties` está versionado. Ver [../../docs/decisions/README.md](../../../docs/decisions/README.md) ADR-012.

## Reglas inamovibles de Android

1. Consultar [implementation-instructions.md](implementation-instructions.md) antes de escribir código.
2. **La reproducción en segundo plano y la sincronización con MediaSession no se comprometen** por ninguna funcionalidad nueva (ver [background-playback.md](background-playback.md) y [media-session.md](media-session.md)).
3. La `MediaSession` es la **fuente única** del estado de reproducción expuesto al sistema; la UI la observa mediante `MediaController` (nunca un segundo estado de reproducción en la UI).
4. Permisos mínimos y justificados ([permissions-and-lifecycle.md](permissions-and-lifecycle.md)).
5. UI con los tokens del design system global ([../../docs/design-system.md](../../../docs/design-system.md) + [ui-guidelines.md](ui-guidelines.md)); Material 3 **personalizado**, no los estilos por defecto.
