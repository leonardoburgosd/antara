# Estructura del proyecto Android

Organización de `apps/mobile/`. Respetando el módulo único `:app` actual (no se crean módulos Gradle prematuramente: KISS/YAGNI), la estructura se alcanza conforme se implementan funcionalidades.

## Árbol de paquetes objetivo

```text
app/src/main/java/com/antara/app/
├── AntaraApplication.kt          # AppContainer (DI manual)
├── MainActivity.kt               # Única Activity: edge-to-edge, AntaraTheme, NavHost
│
├── core/
│   ├── designsystem/
│   │   ├── color/ AntaraColors.kt        # Tokens de color (ver design-system.md)
│   │   ├── typography/ AntaraTypography.kt
│   │   ├── shape/ AntaraShapes.kt
│   │   ├── AntaraTheme.kt                # Material 3 personalizado
│   │   └── components/                   # Botón, Card, SongRow, Skeleton, Toast…
│   ├── network/
│   │   ├── ApiClient.kt                  # Retrofit + OkHttp + interceptores
│   │   ├── NetworkError.kt               # Mapeo a AppError
│   │   └── (dto base, auth interceptor)
│   ├── datastore/
│   │   ├── SessionStore.kt               # Token/sesión (cifrado)
│   │   └── PreferencesStore.kt
│   └── common/
│       ├── AppResult.kt                  # Resultado tipado + errores
│       ├── DispatcherProvider.kt
│       └── extensions/
│
├── domain/
│   ├── model/        Track.kt, Album.kt, Artist.kt, Playlist.kt, User.kt…
│   ├── repository/   TrackRepository.kt, LibraryRepository.kt… (interfaces)
│   └── usecase/      (solo los justificados; ver architecture.md)
│
├── data/
│   ├── remote/
│   │   ├── dto/          TrackDto.kt, AlbumDto.kt… (@Serializable)
│   │   ├── service/      TrackService.kt, AuthService.kt… (Retrofit)
│   │   └── mapper/       TrackMappers.kt…
│   ├── local/            SessionStore implementation, mappers locales
│   └── repository/       TrackRepositoryImpl.kt…
│
├── player/
│   ├── PlaybackService.kt        # MediaSessionService (dueño de ExoPlayer + MediaSession)
│   ├── PlayerController.kt       # Envoltorio tipado de MediaController
│   ├── PlaybackConnection.kt     # Conexión + StateFlow hacia la UI
│   └── (PlayerUiState.kt)        # Estado de reproducción observable por la UI
│
├── navigation/
│   ├── AntaraNavHost.kt
│   └── Routes.kt
│
└── features/
    ├── auth/        library/   albums/   artists/
    ├── tracks/      playlists/ search/   settings/
    └── <feature>/
        ├── ui/                  # <Feature>Screen.kt + composables internos
        ├── <Feature>ViewModel.kt
        └── <Feature>UiState.kt
```

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
| DTO y servicio Retrofit | `data/remote/` |
| Cliente HTTP / errores de red | `core/network/` |
| Reproducción | `player/` |
| Navegación | `navigation/` |
| Tokens/tema | `core/designsystem/` |
| Preferencias/sesión | `core/datastore/` |
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

| Hoy (tras feature Home) | Destino |
|---|---|
| `MainActivity.kt` → `AntaraTheme` + `AppRoot` (nav por pestañas con estado, sin librería) | `MainActivity` → `AntaraTheme` + `NavHost` (al añadir rutas con argumentos/ViewModels) |
| `core/designsystem/` creado: `AntaraTheme`, `AntaraTypography`, `color/`, `shape/`, `spacing/` con tokens globales y `dynamicColor` ausente (false) | Mantener; añadir `components/` (AntaraButton, SongRow, Skeleton…) al primer uso compartido |
| `navigation/AppRoot.kt`: 3 pestañas (Inicio/Búsqueda/Tu biblioteca) + bottom nav 56dp+insets | Ampliar con `navigation/Routes.kt` y NavHost al crecer destinos |
| `features/home/ui/`: `HomeScreen`, `HomeComponents`, `HomeData` (datos mock en español) | Migrar datos mock a `data/` + repositorio cuando exista backend |
| `WelcomeScreen.kt` con estilos inline y `Random` en composición (no se muestra; reservada para auth/onboarding) | Migrar a tokens de `core/designsystem/`; `Random` con `remember` (bug conocido, ADR-012); mover a `features/auth/` o `features/onboarding/` |
| Sin `domain/`, `data/`, `player/` | Se crean con la primera feature que los necesite |
| Manifest sin `<service>` | Agregar `PlaybackService` al implementar reproducción (ver [background-playback.md](background-playback.md)) |

## Reglas

1. **No** importar entre `features/` (compartir vía `core/designsystem/`, `domain/` o composición).
2. **No** HTTP fuera de `core/network`+`data/remote`; **no** `MediaController` fuera de `player/`.
3. **No** clases "utilidad" genericas (`Utils.kt` de todo): crear extensiones o utilidades concretas por dominio.
4. Todo cambio estructural se documenta aquí.
