# Documentación de la aplicación Desktop (Antara para Windows)

Aplicación de escritorio de Antara para **Windows**, construida con **Tauri 2** (backend Rust + frontend React en WebView2).

> Esta documentación **complementa** a la global; nunca la sustituye. Antes de cualquier trabajo, consultar [`../../docs/README.md`](../../../docs/README.md).

## Índice

| Documento | Contenido |
|---|---|
| [README.md](README.md) | Este índice |
| [architecture.md](architecture.md) | Arquitectura: React vs. Rust, comandos Tauri, eventos, servicios, estado |
| [project-structure.md](project-structure.md) | Estructura modular del código Desktop |
| [coding-standards.md](coding-standards.md) | Estándares Rust, Tauri 2, React/TS, Tailwind, Motion, Windows |
| [ui-guidelines.md](ui-guidelines.md) | Adaptación del sistema visual a Windows (ventana, DPI, teclado) |
| [system-tray.md](system-tray.md) | **System Tray y Close-to-Tray** (obligatorio para ciclo de vida) |
| [audio-playback.md](audio-playback.md) | **Reproducción musical en Windows** (streaming, Range, motor) |
| [testing.md](testing.md) | Pruebas de componentes, Rust, tray, reproducción, ciclo de vida |
| [implementation-instructions.md](implementation-instructions.md) | **Guía operativa obligatoria** para implementar en Desktop |

## Documentación global relacionada

- [Índice global](../../../docs/README.md)
- [Arquitectura global](../../../docs/global-architecture.md)
- [Principios](../../../docs/architecture-principles.md)
- [Design System](../../../docs/design-system.md) · [Consistencia](../../../docs/ui-consistency.md) · [Responsivo](../../../docs/responsive-design.md)
- [API](../../../docs/api-integration.md) · [Errores](../../../docs/error-handling.md) · [Seguridad](../../../docs/security.md)
- [Flujo de desarrollo](../../../docs/development-workflow.md) · [Instrucciones de implementación](../../../docs/implementation-instructions.md)
- [Decisiones](../../../docs/decisions/README.md)

## Estado actual del código (saber con qué se trabaja)

Aplicación basada en la plantilla de Tauri 2 con una pantalla de bienvenida (`WelcomeScreen.tsx`) como única vista:

- **Existe:** pipeline Vite + React 19 + Tailwind v4 + framer-motion; ventana única 800×600; plugin `opener`; comando de plantilla `greet` (sin uso).
- **No existe:** routing, estado global, capa HTTP, motor de reproducción, System Tray, persistencia de ventana, pruebas, identidad de producto (`productName`/título siguen como "tauri-app") y CSP (`"csp": null`).
- Deudas detectadas y su tratamiento: [decisions/ADR-012](../../../docs/decisions/README.md#adr-012-corrección-de-deudas-de-plantilla-como-prerequisito-de-features).

## Reglas inamovibles de Desktop

1. Consultar [implementation-instructions.md](implementation-instructions.md) antes de escribir código.
2. **System Tray y Close-to-Tray** no se eliminan ni modifican sin justificación técnica documentada (ver [system-tray.md](system-tray.md)).
3. La reproducción no depende de la visibilidad de la ventana principal (ver [audio-playback.md](audio-playback.md)).
4. Rust no implementa lógica de producto compleja; React no accede directamente al SO (ver [architecture.md](architecture.md)).
5. UI conforme a [../../docs/design-system.md](../../../docs/design-system.md) y [ui-guidelines.md](ui-guidelines.md).
