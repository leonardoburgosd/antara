# Estructura del proyecto Desktop

Estructura modular objetivo de `apps/desktop/`, adaptable a la estructura existente (hoy: plantilla con `src/components/WelcomeScreen.tsx` y `src-tauri/src/{main,lib}.rs`). **No se reorganiza de forma masiva**: la estructura se alcanza conforme se implementan funcionalidades.

## Frontend — `apps/desktop/src/`

```text
src/
├── main.tsx                     # Bootstrap (ReactDOM + StrictMode)
├── app/
│   ├── App.tsx                  # Shell: providers, router, layout raíz
│   ├── router.tsx               # Definición de rutas
│   └── providers.tsx            # Provider de tema, sesión, errores (ErrorBoundary)
├── components/                  # Design system (sin conocimiento de dominio)
│   ├── Button.tsx  Input.tsx  Modal.tsx  Toast.tsx  Skeleton.tsx  EmptyState.tsx
│   ├── PlayerBar.tsx  Sidebar.tsx  SongRow.tsx  AlbumCard.tsx  ArtistCard.tsx
│   └── index.ts                 # Exportaciones públicas
├── features/                    # Una carpeta por funcionalidad
│   ├── auth/        library/     search/      playlists/
│   ├── favorites/   player/      queue/       settings/
│   └── <feature>/
│       ├── components/           # Componentes propios de la feature
│       ├── hooks/                # useXxx de la feature
│       └── index.ts
├── stores/                      # Estado global (zustand): session.ts, player.ts, ui.ts
├── services/
│   ├── api/
│   │   ├── apiClient.ts          # Cliente HTTP central (fetch / plugin-http)
│   │   ├── endpoints.ts          # Catálogo de paths (del contrato real)
│   │   ├── errors.ts             # Mapeo HTTP → AppError
│   │   └── mappers/              # DTO → entidad
│   └── playback/
│       ├── PlaybackEngine.ts     # Interfaz del motor (contrato)
│       ├── HtmlAudioEngine.ts    # Implementación fase 1 (ver audio-playback.md)
│       └── formatSupport.ts      # Detección de códecs soportados
├── hooks/                       # Transversales: useKeyboardShortcut, useMediaQuery, useReducedMotion
├── integrations/tauri/          # Único punto con invoke/listen de Tauri
│   ├── commands.ts              # Wrappers tipados de comandos Rust
│   ├── events.ts                # Suscripciones a eventos Rust (con cleanup)
│   └── window.ts                # Utilidades de ventana si las hay
├── types/                       # Tipos compartidos y contratos
├── styles/
│   └── index.css                # Tailwind v4 + tokens (@theme) — ver design-system.md
└── utils/                       # Funciones puras
```

## Backend nativo — `apps/desktop/src-tauri/`

```text
src-tauri/src/
├── main.rs                      # Punto de entrada (delega en lib)
├── lib.rs                       # Builder: plugins, .setup(), eventos de ventana, comandos
├── commands/
│   ├── mod.rs
│   └── tray.rs                  # Comandos relacionados con bandeja/estado para la UI
├── services/
│   ├── mod.rs
│   ├── tray.rs                  # Creación de bandeja, menú, handlers (ver system-tray.md)
│   └── window.rs                # Show/hide/foco, integración con window-state
├── state.rs                     # Estado gestionado (app.manage)
└── error.rs                     # AppError → serializable para el frontend
```

Complementos de configuración:

```text
src-tauri/
├── tauri.conf.json              # Ventana, bundle, CSP
├── capabilities/default.json    # Permisos mínimos
└── icons/                       # Iconos multi-resolución (incluye .ico para bandeja)
```

## Ubicación de piezas — referencia rápida

| Pieza | Ubicación |
|---|---|
| Componente visual reutilizable | `src/components/` |
| Componente de una funcionalidad | `src/features/<f>/components/` |
| Pantalla/ruta | `src/features/<f>/` + `src/app/router.tsx` |
| Hook reutilizable | `src/hooks/`; de feature: `src/features/<f>/hooks/` |
| Servicio HTTP / endpoints | `src/services/api/` |
| Motor de reproducción | `src/services/playback/` |
| Estado global | `src/stores/` |
| Tipos/DTOs | `src/types/` (DTOs también junto al cliente API) |
| Utilidades | `src/utils/` |
| Integración Tauri (invoke/eventos) | `src/integrations/tauri/` |
| Código Rust | `src-tauri/src/{commands,services}` |
| Recursos estáticos | `public/` (frontend), `src-tauri/icons/` |
| Pruebas | `src/**\/*.test.ts(x)`, `src-tauri/src/**` con `#[cfg(test)]` |
| Documentación | `apps/desktop/docs/` (este directorio) |

## Convenciones de nombres

- Componentes: `PascalCase.tsx`; hooks: `useXxx.ts`; servicios/stores/utils: `camelCase.ts`.
- Módulos Rust: `snake_case.rs`; comandos Tauri en `snake_case` (el wrapper TS los espelza).
- Eventos Tauri: `dominio:accion`.
- Un archivo = una responsabilidad principal; `index.ts` como cara pública de cada carpeta.

## Estado actual vs. objetivo

| Hoy (plantilla) | Destino |
|---|---|
| `src/components/WelcomeScreen.tsx` (único componente) | Se mantiene como pantalla inicial, movida a `features/auth/` (o `features/onboarding/`) cuando exista routing |
| `src/App.tsx` renderiza una sola pantalla | `app/App.tsx` con providers + router |
| `src/App.css` con CSS muerto de plantilla | `styles/index.css` con tokens; eliminar restos de plantilla (ADR-012) |
| `src-tauri/src/lib.rs` con `greet` | `lib.rs` ensambla servicios (tray/window) y registra comandos reales |
| Sin `stores/`, `services/`, `integrations/` | Se crean con la primera feature que los necesite |

## Reglas

1. **No** importar entre `features/` directamente (pasar por `components/`, `stores/` o props).
2. **No** colocar `fetch`/`invoke` fuera de `services/` e `integrations/tauri/`.
3. **No** añadir archivos raíz sueltos: todo vive en una de las carpetas anteriores.
4. Cada feature nueva que altere esta estructura lo documenta aquí.
