# Controles multimedia del sistema (MediaSession)

Documento **obligatorio**: integración completa con los controles multimedia de Android mediante `MediaSession` de Media3. Complementa a [background-playback.md](background-playback.md).

> **La `MediaSession` es la fuente de verdad del estado de reproducción expuesto al sistema.** No implementar una notificación independiente que simule los controles: Media3 proporciona la integración.

> **Estado actual:** **aún no implementado** (depende de [background-playback.md](background-playback.md); ver [README.md](README.md)). Este documento define el diseño objetivo (ADR-005).

## Objetivo

Mientras el usuario reproduce música, Android debe mostrar los controles multimedia en:

- La **notificación** multimedia (panel de notificaciones / Quick Settings).
- La **pantalla de bloqueo** (controles de media).
- Interfaces del sistema compatibles (botones físicos, auriculares Bluetooth/AVRCP).
- (Futuro, si se contempla: Android Auto — requiere `MediaLibraryService` + browse, fuera de alcance actual.)

## Información multimedia expuesta

| Campo | Fuente |
|---|---|
| Título de la canción | `MediaMetadata.title` (desde el `MediaItem` de la pista) |
| Artista | `MediaMetadata.artist` / `albumArtist` |
| Álbum | `MediaMetadata.albumTitle` |
| Portada | `MediaMetadata.artworkUri` (carga: ver abajo) |
| Duración | `mediaItem.duration` / duración del `Player` |
| Posición actual | Estado del `Player` expuesto vía `PlaybackState` (la sesión lo deriva del player) |

Los metadatos se configuran al construir los `MediaItem` (`MediaMetadata`); la sesión y la notificación los reflejan automáticamente.

## Controles expuestos

- Reproducir / Pausar (`COMMAND_PLAY_PAUSE`).
- Pista anterior (`COMMAND_SEEK_TO_PREVIOUS`).
- Siguiente pista (`COMMAND_SEEK_TO_NEXT`).
- Seek (disponible vía `COMMAND_SEEK_IN_CURRENT_MEDIA_ITEM` cuando el player lo soporta; en la notificación el seek se hace con la barra de progreso en Android 13+ / pantallas compatibles).
- Acciones adicionales opcionales (shuffle, repeat) vía comandos personalizados (ver "Personalización" abajo).

`DefaultMediaNotificationProvider` incluye por defecto: play/pause, previous, next.

## Estado dinámico

- La posición de reproducción debe **actualizarse** (la sesión expone `PlaybackState` con posición; verificar la actualización periódica disponible en Media3 1.4.1 al implementar).
- El botón cambia entre Play y Pause según `isPlaying`.
- La información y portada cambian al cambiar de pista (`onMediaMetadataChanged`).
- El estado se mantiene **sincronizado con el reproductor real** porque la sesión contiene al `Player`: no hay estado que "actualizar a mano" (regla de un solo dueño, ADR-011).
- Si la UI (mini player, pantalla completa) necesita refrescar: observar el `MediaController` (mismo estado), no duplicar.

## Integración técnica

| Elemento | Implementación |
|---|---|
| `MediaSession` | Creada en `PlaybackService.onCreate()` con `MediaSession.Builder(context, player)` — ver [background-playback.md](background-playback.md#1-el-servicio-playerplaybackservicekt) |
| `MediaMetadata` | En cada `MediaItem` (`MediaItem.Builder().setMediaMetadata(...)`) con título, artista, álbum, `artworkUri`, duración |
| `PlaybackState` | Derivado automáticamente del `Player` por Media3 (posición, estado de reproducción, comandos disponibles) |
| Notificación | `DefaultMediaNotificationProvider` (proveedor por defecto de `MediaSessionService`): crea canal de notificación, `MediaStyle`, acciones play/pause/prev/next |
| `MediaSessionService` | Servicio declarado en Manifest con `foregroundServiceType="mediaPlayback"` |
| `MediaController` | La UI se conecta vía `SessionToken` → `MediaController.Builder().buildAsync()` (ver [background-playback.md](background-playback.md#3-conexión-desde-la-ui-playerplaybackconnectionkt--playercontrollerkt)) |
| Comandos disponibles | Definidos por el `Player`; la sesión informa al sistema qué comandos existen (`Player.Commands`) |

### Personalización de la notificación

- Proveedor por defecto: suficiente para play/pause/prev/next + metadata.
- Para acciones extra (shuffle/repeat/cola): usar `DefaultMediaNotificationProvider.Builder` + `setMediaButtonPreferences` en la sesión y manejar los comandos en `MediaSession.Callback.onCustomCommand` (el System UI envía comandos personalizados directamente a la sesión desde Android 13).
- Orden/compact view: `COMMAND_KEY_COMPACT_VIEW_INDEX` para definir qué acciones aparecen en la vista compacta.
- No construir una notificación manual con `NotificationCompat` para simular controles: se perdería la integración con la sesión.

### Carga de portadas

- La sesión usa por defecto un `BitmapLoader` = `CacheBitmapLoader(DataSourceBitmapLoader(context))`.
- **Consideración:** si las URLs de portadas requieren autenticación, el loader por defecto no adjunta headers → sustituir con `MediaSession.Builder.setBitmapLoader(...)` usando un `DataSourceBitmapLoader` con un `DataSource.Factory` que inyecte el token, o resolver URLs accesibles en `onAddMediaItems`.
- Caché: mantener `CacheBitmapLoader` envolviendo el loader para no recargar por cada actualización de notificación.
- Tamaño: la notificación usa la portada como `largeIcon`; en pantalla de bloqueo se muestra como arte grande. Respetar relación 1:1 y comprimir razonablemente (evitar bitmaps gigantes en memoria).

## Superficies del sistema cubiertas

| Superficie | Comportamiento esperado |
|---|---|
| Panel de notificaciones | Título/artista/portada + controles play/pause/prev/next + barra de posición |
| Quick Settings (Android 13+) | Controles de media en tiles expandibles |
| Pantalla de bloqueo | Mismo contenido de media (controles + portada) |
| Auriculares Bluetooth (AVRCP) | Metadatos + play/pause/next/prev enviados por la sesión |
| Botones físicos de media | `KEYCODE_MEDIA_*` enrutados a la sesión |
| Asistente/Auto | Solo si se implementa `MediaLibraryService` (futuro documentado) |

## Reglas

1. **Sin duplicados:** no crear notificaciones propias de "now playing" fuera de Media3.
2. **Sin estado paralelo:** la sesión es dueña; UI solo observa (ADR-011).
3. **Metadatos completos siempre:** toda pista reproducible debe llevar metadata mínima (título, artista, portada si existe) — afecta a notificación, Bluetooth y lock screen.
4. Si cambia la fuente de metadata (p. ej. backend), actualizar este documento.

## Pruebas (resumen; detalle en [testing.md](testing.md))

1. Al reproducir: aparece notificación con título/artista/portada correctos.
2. Pausar/reanudar desde notificación → la UI al volver refleja el estado.
3. Siguiente/anterior desde notificación → cambia pista y metadata.
4. Cambiar de pista → notificación y lock screen se actualizan.
5. Seek desde notificación (si el SO lo muestra) → posición coherente.
6. Pantalla de bloqueo: muestra controles y metadatos.
7. Botones de auriculares físicos/Bluetooth funcionan.
8. Al detener la reproducción: la notificación se retira según el ciclo de vida.
9. Portadas autenticadas cargan (o fallback correcto sin portada).
10. La UI y la notificación nunca muestran estados distintos al mismo tiempo.
