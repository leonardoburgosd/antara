# Estructura del proyecto Android

Organización de `apps/mobile/`. Respetando el módulo único `:app` actual (no se crean módulos Gradle prematuramente: KISS/YAGNI), la estructura se alcanza conforme se implementan funcionalidades.

## Árbol de paquetes actual

```text
app/src/main/java/com/antara/app/
├── AntaraApplication.kt          # Application + AppContainer (DI manual)
├── AppContainer.kt               # Repositorios y PlayerConnection
├── MainActivity.kt               # Única Activity: edge-to-edge, AntaraTheme, AppRoot
│
├── core/
│   ├── designsystem/
│   │   ├── AntaraTheme.kt                 # Material 3 personalizado + spacing
│   │   ├── AntaraTypography.kt            # Escala tipográfica global
│   │   ├── color/ AntaraColors.kt         # Tokens (única fuente de colores)
│   │   ├── shape/ AntaraShapes.kt
│   │   ├── spacing/ AntaraSpacing.kt
│   │   └── components/                    # AntaraPrimaryButton, AntaraTextField,
│   │                                      # AntaraFilterChips, AntaraTrackRow,
│   │                                      # AntaraSectionHeader, AntaraMiniPlayer…
│   └── network/
│       └── ServerAddress.kt               # Normalización/validación de IP o dominio
│
├── domain/
│   ├── model/        UserSession.kt, ServerConfig.kt
│   └── repository/   SessionRepository.kt, ServerRepository.kt
│
├── data/
│   └── local/        AntaraPreferences.kt, SessionRepositoryImpl.kt,
│                     ServerRepositoryImpl.kt (DataStore Preferences)
│
├── player/
│   ├── PlaybackService.kt        # MediaSessionService (dueño de ExoPlayer + MediaSession)
│   ├── PlayerConnection.kt       # MediaController + StateFlow hacia la UI
│   ├── PlayerUiState.kt          # Estado de reproducción observable
│   └── PlayerViewModel.kt
│
├── navigation/
│   ├── AppRoot.kt                # Arranque, auth, servidores, pestañas, overlays
│   └── Routes.kt                 # Rutas (claves de estado, ADR-013)
│
└── features/
    ├── auth/       AuthUiState.kt, AuthViewModel.kt, ui/AuthScreen.kt
    ├── servers/    ServersUiState.kt, ServersViewModel.kt, ui/ServersScreen.kt
    ├── home/       ui/HomeScreen.kt, HomeComponents.kt, HomeData.kt,
    │               ui/DetailScreen.kt, DetailComponents.kt, DetailData.kt
    ├── player/     ui/PlayerScreen.kt
    └── profile/    ui/ProfileScreen.kt
```

> El antiguo `WelcomeScreen.kt` de plantilla se eliminó al implementar la autenticación real (ADR-014).

## Pruebas

```text
app/src/test/java/com/antara/app/        # Unidades: ViewModels, use cases, mappers, stores
app/src/androidTest/java/com/antara/app/ # Instrumentadas: composables, navegación, servicio
```

## Ubicación de piezas — referencia rápida

| Pieza | Ubicación |
|---|---|
| Pantalla (composable de nivel feature) | `features/<f>/ui/` |
| Componente reutilizable del design system | `core/designsystem/components/` |
| ViewModel + UiState de feature | `features/<f>/` |
| Regla de negocio / entidad | `domain/` |
| Interface de repositorio | `domain/repository/` |
| Implementación de repositorio | `data/repository/` |
| DTO y servicio del backend | `data/remote/` |
| Cliente HTTP / errores de red | `core/network/` |
| Reproducción | `player/` |
| Navegación | `navigation/` |
| Tokens/tema | `core/designsystem/` |
| Preferencias/sesión | `data/local/` (DataStore; `core/datastore/` si se extrae interfaz propia) |
| DI | `AntaraApplication.kt` + `AppContainer` |
| Documentación | `apps/mobile/docs/` (este directorio) |

## Convenciones de nombres

- Archivos/clases: `PascalCase.kt`; funciones/variables: `camelCase`; constantes: `UPPER_SNAKE_CASE`.
- Composables: `PascalCase` (sustantivo + propósito: `AlbumGrid`, `PlayerBar`); sin prefijo `Composable`.
- ViewModel: `<Feature>ViewModel`; UiState: `<Feature>UiState`.
- Interfaces de repositorio sin sufijo; implementación `…Impl`.
- DTOs con sufijo `Dto`; mappers `…Mappers`/`…toDomain()`.
- Paquetes en minúsculas; una responsabilidad por paquete.

## Estado actual vs. objetivo

| Hoy | Destino |
|---|---|
| `MainActivity.kt` → `AntaraTheme` + `AppRoot` (arranque auth/servidores y pestañas con estado, sin librería) | `MainActivity` → `AntaraTheme` + `NavHost` (al añadir rutas con argumentos/ViewModels) |
| `core/designsystem/` con tokens globales, `AntaraTheme`, `AntaraSpacing` y `components/` compartidos | Mantener; ampliar componentes con cada uso realmente compartido |
| `navigation/AppRoot.kt`: Loading → Auth → Servers (forzado si no hay ninguno) → Main; 4 pestañas; overlay de detalle y de reproductor; `BackHandler` | Ampliar con NavHost al crecer destinos (rutas ya centralizadas en `navigation/Routes.kt`) |
| `features/home/ui/`: Home, detalle y datos mock en español; filtros funcionales | Migrar datos mock a `data/` + repositorio cuando exista backend |
| `features/auth/`, `features/servers/`, `features/profile/` con ViewModel + UiState + pantalla; login real vía `core/network` y sesión/token persistidos en DataStore | Token en almacén cifrado; registro y recuperación si el backend los expone |
| `player/`: `PlaybackService` (MediaSessionService), `PlayerConnection` (MediaController), `PlayerUiState`, `PlayerViewModel`; audio demo local de 90 s | Reproducir streams reales; evaluar resumption de Media3 |
| Sin pruebas automatizadas | Pruebas unitarias de ViewModels/repositorios al estabilizar contratos |

## Reglas

1. **No** importar entre `features/` (compartir vía `core/designsystem/`, `domain/` o composición).
2. **No** HTTP fuera de `core/network`+`data/remote`; **no** `MediaController` fuera de `player/`.
3. **No** clases "utilidad" genericas (`Utils.kt` de todo): crear extensiones o utilidades concretas por dominio.
4. Todo cambio estructural se documenta aquí.
