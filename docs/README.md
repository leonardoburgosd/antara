# Documentación de la Plataforma Antara

Este directorio contiene la **documentación global** de Antara: los estándares, principios y reglas que **todas** las aplicaciones (Desktop, Mobile y Web) deben respetar. Es el punto de referencia obligatorio antes de implementar cualquier funcionalidad nueva.

## Propósito

- Definir una arquitectura ordenada, modular y mantenible por plataforma.
- Garantizar una experiencia visual y de usuario consistente entre Desktop, Mobile y Web.
- Establecer convenciones de nombres, organización, implementación, pruebas y mantenimiento.
- Permitir que cualquier desarrollador —humano o agente de IA— implemente una nueva funcionalidad consultando únicamente esta documentación.

## Tecnologías

| Plataforma | Tecnologías | Ubicación | Alcance |
|---|---|---|---|
| **Desktop** | Rust, Tauri 2, React 19, TypeScript, Tailwind CSS v4, Motion (framer-motion) | `apps/desktop/` | Exclusivamente Windows |
| **Mobile** | Kotlin, Jetpack Compose, Material 3 personalizado, AndroidX Media3 (ExoPlayer, MediaSession, MediaSessionService), Gradle | `apps/mobile/` | Exclusivamente Android |
| **Web** | React 19, TypeScript, Tailwind CSS v4, Motion (framer-motion), Vite | `apps/web/` | Navegadores modernos |
| **Backend** | .NET 10, C#, Dapper | Fuera de este repositorio | API consumida por los tres clientes |

> Los clientes **nunca** acceden directamente a las bases de datos. Toda comunicación con los servicios del backend pasa por la capa de infraestructura definida en [api-integration.md](api-integration.md).

## Organización del repositorio

```text
/
├── apps/
│   ├── desktop/          # Tauri 2 + React (Windows)
│   │   └── docs/         # Documentación específica de Desktop
│   ├── mobile/           # Kotlin + Jetpack Compose (Android)
│   │   └── docs/         # Documentación específica de Mobile
│   └── web/              # React + Vite (navegadores)
│
└── docs/                 # ← ESTE DIRECTORIO: estándares globales
    ├── README.md                       (este archivo)
    ├── project-overview.md
    ├── global-architecture.md
    ├── architecture-principles.md
    ├── project-structure.md
    ├── coding-standards.md
    ├── design-system.md
    ├── responsive-design.md
    ├── ui-consistency.md
    ├── api-integration.md
    ├── error-handling.md
    ├── security.md
    ├── testing-strategy.md
    ├── development-workflow.md
    ├── implementation-instructions.md
    └── decisions/
        └── README.md
```

## Documentación global vs. específica

| Tipo | Ubicación | Contenido | Regla |
|---|---|---|---|
| **Global** | `docs/` | Estándares comunes, principios, sistema de diseño, flujo de desarrollo | Aplica a las tres plataformas |
| **Específica Desktop** | `apps/desktop/docs/` | Arquitectura Tauri/Rust, System Tray, reproducción de audio en Windows | Complementa, **nunca sustituye**, a la global |
| **Específica Mobile** | `apps/mobile/docs/` | Arquitectura Android, reproducción en segundo plano, MediaSession, permisos | Complementa, **nunca sustituye**, a la global |
| **Web** | Sin carpeta propia | Sigue íntegramente la documentación global y la estructura de `apps/web/` | Ver [project-structure.md](project-structure.md) |

**Regla fundamental:** la documentación global define *qué* y *cómo* se debe hacer en todos los proyectos; la documentación específica define las decisiones técnicas y procedimientos propios de cada plataforma. Si existe conflicto, la especificidad de la plataforma prevalece **solo** en materia técnica exclusiva de esa plataforma (por ejemplo: System Tray solo aplica a Desktop); en todo lo demás prevalece la global.

## Orden recomendado de lectura

1. [project-overview.md](project-overview.md) — qué es la plataforma y qué está implementado.
2. [global-architecture.md](global-architecture.md) — arquitectura general y comunicación con el backend.
3. [architecture-principles.md](architecture-principles.md) — principios obligatorios de diseño.
4. [project-structure.md](project-structure.md) — organización del código por plataforma.
5. [coding-standards.md](coding-standards.md) — estándares por lenguaje (TypeScript, React, Rust, Kotlin).
6. [design-system.md](design-system.md) — tokens visuales, tipografía, componentes, iconografía y animaciones.
7. [responsive-design.md](responsive-design.md) — adaptación a dimensiones y dispositivos.
8. [ui-consistency.md](ui-consistency.md) — coherencia visual entre plataformas.
9. [api-integration.md](api-integration.md) y [error-handling.md](error-handling.md) — comunicación y errores.
10. [security.md](security.md), [testing-strategy.md](testing-strategy.md), [development-workflow.md](development-workflow.md).
11. [implementation-instructions.md](implementation-instructions.md) — **procedimiento obligatorio de implementación**.
12. Documentación específica de la plataforma en la que se trabaje:
    - Desktop: [`apps/desktop/docs/README.md`](../apps/desktop/docs/README.md)
    - Mobile: [`apps/mobile/docs/README.md`](../apps/mobile/docs/README.md)
13. [decisions/README.md](decisions/README.md) — decisiones arquitectónicas registradas.

## Procedimiento obligatorio para implementar nuevas funcionalidades

> **Ningún desarrollador o agente de IA debe implementar una funcionalidad nueva sin consultar primero la documentación correspondiente.**

1. Consultar [implementation-instructions.md](implementation-instructions.md) (procedimiento de 7 pasos).
2. Consultar los documentos globales indicados allí.
3. Si se trabaja en Desktop, consultar obligatoriamente [`apps/desktop/docs/implementation-instructions.md`](../apps/desktop/docs/implementation-instructions.md).
4. Si se trabaja en Mobile, consultar obligatoriamente [`apps/mobile/docs/implementation-instructions.md`](../apps/mobile/docs/implementation-instructions.md).
5. Si la funcionalidad toca una comportamiento protegido (System Tray, reproducción en segundo plano, MediaSession, permisos, consistencia visual), consultar el documento especializado indicado en la [tabla de funcionalidades obligatorias](implementation-instructions.md#funcionalidades-obligatorias).

**Si una implementación contradice una instrucción documentada, el agente debe detenerse, explicar la contradicción y proponer una solución antes de introducir una nueva convención.**
