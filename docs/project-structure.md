# Estructura del proyecto (Project Structure)

Define la organización esperada del código en las tres aplicaciones. **Se adapta a los proyectos existentes**: no se reorganizan archivos arbitrariamente ni se eliminan convenciones útiles; la estructura objetivo se alcanza por evolución controlada conforme se implementan funcionalidades.

## Estado actual del código

| Aplicación | Archivos fuente | Estado |
|---|---|---|
| `apps/desktop` | 28 TS/TSX/CSS + 2 Rust | Tauri 2 con tokens propios, navegación por estado, reproductor simulado, login real contra el backend (`services/api/`) y configuración de servidores. Bandeja y motor de audio pendientes |
| `apps/mobile` | 51 Kotlin + resources | App Compose con design system propio, navegación por estado, ViewModels, login real (`core/network/` + `data/remote/`), `MediaSessionService` con ExoPlayer y DI manual |
| `apps/web` | 28 TS/TSX/CSS | Vite + React con tokens propios, navegación por estado, reproductor simulado, login real (`services/api/`) y configuración de servidores |

Deudas detectadas (detalle en la sección final y en [`decisions/README.md`](decisions/README.md)): `packages/` inexistente pese a lo que indica el README raíz, logs y artefactos de build versionados en `apps/mobile`, token de sesión sin cifrar y `csp: null` en Desktop.

## Estructura por plataforma

### Desktop — `apps/desktop/`

```text
apps/desktop/
├── src/                        # Frontend React + TypeScript
│   ├── main.tsx                # Bootstrap
│   ├── app/                    # Composición de la aplicación
│   │   ├── App.tsx             # Shell: providers, router, layout raíz
│   │   ├── router.tsx          # Rutas
│   │   └── providers.tsx       # Providers globales (tema, sesión, errores)
│   ├── components/             # Componentes genéricos del design system
│   │   ├── Button.tsx, Input.tsx, Modal.tsx, Toast.tsx, Skeleton.tsx…
│   │   └── index.ts            # Exportaciones públicas
│   ├── features/               # Funcionalidades por dominio
│   │   ├── auth/  library/  search/  playlists/  player/  settings/
│   │   └── <feature>/
│   │       ├── components/     # Componentes de la feature
│   │       ├── hooks/          # Hooks de la feature
│   │       └── index.ts
│   ├── stores/                 # Estado global (p. ej. player, session)
│   ├── services/
│   │   ├── api/                # ApiClient + endpoints + mappers
│   │   └── playback/           # PlaybackEngine (interfaz + implementaciones)
│   ├── hooks/                  # Hooks transversales (useKeyboard, useMediaQuery…)
│   ├── integrations/tauri/     # Wrappers tipados de invoke/listen/tray
│   ├── types/                  # Tipos compartidos y DTOs
│   ├── styles/                 # index.css con tokens (@theme de Tailwind v4)
│   └── utils/                  # Utilidades puras
├── src-tauri/                  # Backend nativo Rust
│   ├── src/
│   │   ├── main.rs             # Punto de entrada
│   │   ├── lib.rs              # Builder de Tauri: plugins, setup, eventos de ventana
│   │   ├── commands/           # Comandos delgados (firma + delegación)
│   │   ├── services/           # Servicios nativos (tray.rs, window.rs…)
│   │   ├── state.rs            # Estado gestionado por Tauri (app.manage)
│   │   └── error.rs            # Tipo de error común
│   ├── capabilities/           # Permisos mínimos por ventana
│   └── tauri.conf.json
├── docs/                       # Documentación específica (obligatoria)
└── package.json
```

### Mobile — `apps/mobile/`

Organización por **capas** con funcionalidades agrupadas, respetando el módulo único `:app` actual (no se crean módulos Gradle prematuramente):

```text
app/src/main/java/com/antara/app/
├── AntaraApplication.kt        # Contenedor de DI manual (AppContainer)
├── MainActivity.kt             # Única Activity, edge-to-edge, setContent
├── core/                       # Transversal
│   ├── designsystem/           # Tokens (Color/Type/Shape) + componentes comunes
│   ├── network/                # ApiClient, errores de red, DTOs base
│   ├── datastore/              # Preferencias y sesión
│   └── common/                 # Result, dispatchers, extensiones
├── data/                       # Implementación de datos
│   ├── remote/                 # Servicios HTTP + DTOs por feature
│   ├── local/                  # Fuentes locales (DataStore)
│   └── repository/             # Implementaciones de repositorios
├── domain/                     # Reglas de negocio
│   ├── model/                  # Entidades
│   ├── repository/             # Interfaces de repositorio
│   └── usecase/                # Solo cuando aporten valor real
├── player/                     # Reproducción (propiedad de la sesión)
│   ├── PlaybackService.kt      # MediaSessionService
│   ├── PlayerController.kt     # Envoltorio tipado de MediaController
│   └── PlaybackConnection.kt   # Conexión + Flujos hacia la UI
├── navigation/                 # Grafo de navegación + rutas
├── features/                   # Funcionalidades
│   ├── auth/  library/  albums/  artists/  tracks/  playlists/  search/  settings/
│   └── <feature>/
│       ├── ui/                 # Screens + composables de la feature
│       └── <Feature>ViewModel.kt
└── (test/)                     # src/test y src/androidTest
```

### Web — `apps/web/`

Sigue la estructura de Desktop **sin** la carpeta `integrations/tauri/` ni `src-tauri/`:

```text
apps/web/src/
├── main.tsx  App.tsx
├── app/            # providers, router
├── components/     # design system compartido conceptualmente con Desktop
├── features/       # mismas features que Desktop
├── stores/  services/api/  services/playback/  hooks/  types/  styles/  utils/
```

> **Web no tiene carpeta `docs/` propia:** su referencia es la documentación global más la estructura existente de `apps/web/`. Si en el futuro Web acumula decisiones técnicas propias significativas, se creará `apps/web/docs/` siguiendo el patrón de Desktop/Mobile.

## Responsabilidad de cada carpeta

| Carpeta | Contiene | No contiene |
|---|---|---|
| `components/` (o `core/designsystem/`) | UI genérica reutilizable, sin conocimiento de dominio | Lógica de negocio, llamadas a API |
| `features/<name>/` | Todo lo específico de una funcionalidad | Código de otras features (importar de `components/`, `services/`) |
| `stores/` (React) / `ViewModel` (Android) | Estado de UI + acciones | Accesos directos a HTTP (pasan por servicios/repositorios) |
| `services/api/` | Cliente HTTP, endpoints, mappers DTO→entidad | Reglas de negocio, UI |
| `services/playback/` (React) / `player/` (Android) | Motor y estado de reproducción | Componentes visuales |
| `integrations/tauri/` | `invoke`/`listen` tipados | Lógica de negocio compleja (ver reglas en [`coding-standards de Desktop`](../apps/desktop/docs/coding-standards.md)) |
| `types/` / `domain/model/` | Contratos y entidades | Comportamiento con efectos (red, SO) |
| `utils/` | Funciones puras | Estado, efectos, I/O |
| `docs/` | Documentación de la plataforma | Código |

## Convenciones de nombres

| Elemento | TypeScript / React | Kotlin | Rust |
|---|---|---|---|
| Archivo componente | `PascalCase.tsx` (`AlbumCard.tsx`) | — | — |
| Archivo no-componente | `camelCase.ts` (`usePlayer.ts`, `apiClient.ts`) | `PascalCase.kt` (`PlaybackService.kt`) | `snake_case.rs` (`player_service.rs`) |
| Componente / clase | `PascalCase` | `PascalCase` | — |
| Hook | `useXxx` | — | — |
| Variable / función | `camelCase` | `camelCase` | `snake_case` |
| Tipo / interfaz / enum | `PascalCase`; DTOs de API con sufijo `Dto`/`DTO` si hay ambigüedad | `PascalCase` | `PascalCase` para tipos |
| Constante | `UPPER_SNAKE_CASE` en módulos de config | `UPPER_SNAKE_CASE` | `UPPER_SNAKE_CASE` |
| Paquete (Android) | — | `com.antara.app.<capa>.<feature>` en minúsculas | `snake_case` |
| Eventos Tauri | `dominio:accion` (p. ej. `player:state-changed`) | — | — |
| Rutas / endpoints | definidos por contrato backend; centralizados en `services/api/` | idem | — |

## Modelos y contratos

- **DTOs de API** viven junto a la capa de datos (`services/api/` en React; `data/remote/` en Android) y se transforman a **entidades de dominio** antes de llegar a la UI.
- Los tipos compartidos entre features se definen en `types/` (React) o `domain/model/` (Android).
- Los contratos con el backend se leen del repositorio del backend; **no se inventan**.

## Gestión del estado

- React (Desktop/Web): estado local por defecto; `stores/` (Zustand) para estado global de baja frecuencia y alto compartimiento (sesión, reproductor). Ver [coding-standards.md](coding-standards.md#react).
- Android: `StateFlow<UiState>` por ViewModel; estado de reproducción dueño de `player/` (MediaSession).

## Utilidades, configuración y recursos estáticos

- `utils/` (React) / `core/common/` (Android): funciones puras, sin estado.
- Configuración: variables de entorno por plataforma (ver [global-architecture.md](global-architecture.md#gestión-de-configuración)).
- Recursos estáticos: `public/` (Vite), `src-tauri/icons/` (Tauri), `res/` (Android). Los assets de marca (logo, iconos) se centralizan por plataforma y se referencian desde el design system.

## Pruebas

- React: `src/**/*.test.tsx` junto al código o `src/__tests__/`.
- Kotlin: `app/src/test/` (unidades) y `app/src/androidTest/` (instrumentadas).
- Rust: módulos `#[cfg(test)]` en `src-tauri/src/`.

Detalle en [testing-strategy.md](testing-strategy.md) y en los `testing.md` de cada plataforma.

## Documentación

| Ubicación | Contenido |
|---|---|
| `docs/` | Estándares globales (este directorio) |
| `apps/desktop/docs/` | Decisiones y procedimientos de Desktop (obligatorios) |
| `apps/mobile/docs/` | Decisiones y procedimientos de Android (obligatorios) |
| `docs/decisions/` | Registro de decisiones arquitectónicas (ADRs) |

## Paquetes compartidos (candidato futuro, no implementado)

El `README.md` raíz menciona `packages/shared` y `packages/types`, **que no existen hoy**. Reglas:

1. **No** se crea `packages/` hasta que exista duplicación real y medida (umbral orientativo: la misma lógica o token duplicado en ≥2 aplicaciones y con cambios sincronizados en ≥2 ocasiones).
2. Candidato principal: **tokens de diseño** y componentes React compartidos entre Desktop y Web (misma tecnología), manteniendo el acoplamiento con Tauri fuera del paquete.
3. **Nunca** se fuerza código React dentro de Android: los tokens se replican en Kotlin/Compose conforme a [design-system.md](design-system.md).
4. La creación de `packages/` requiere registro en [`decisions/README.md`](decisions/README.md).
