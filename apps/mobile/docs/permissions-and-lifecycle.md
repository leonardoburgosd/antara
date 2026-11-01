# Permisos y ciclo de vida de Android

Documento **obligatorio** para permisos, servicios y ciclo de vida. Requisitos documentados para el objetivo actual del proyecto: `minSdk 24`, `compileSdk/targetSdk 34` (Android 14) — ver `app/build.gradle.kts`.

## Permisios

### Declarados hoy (manifest actual)

| Permiso | Tipo | Necesario | Notas |
|---|---|---|---|
| `android.permission.INTERNET` | Instalación | ✅ Sí | Requisito mínimo para streaming y API |
| `android.permission.FOREGROUND_SERVICE` | Instalación | ✅ Sí | Obligatorio desde API 28 para servicios en primer plano |
| `android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK` | Instalación | ✅ Sí | **Obligatorio desde API 34** (targetSdk 34) para FGS de tipo `mediaPlayback`; ya declarado, coherente con el plan de reproducción |

### A declarar según implementación

| Permiso | Tipo | Cuándo | Notas |
|---|---|---|---|
| `android.permission.WAKE_LOCK` | Instalación | Al usar `ExoPlayer.setWakeMode(C.WAKE_MODE_NETWORK)` en `PlaybackService` | Para mantener CPU+red con pantalla apagada durante streaming. Solo durante reproducción activa |
| `android.permission.POST_NOTIFICATIONS` | **Runtime (API 33+)** | **No requerido** para notificaciones de sesión multimedia: las notificaciones de *media sessions* están **exentas** del cambio de permiso de Android 13 (fuente: documentación oficial de notificaciones de Android). Media3 no lo necesita para la notificación de reproducción | Agregarlo **solo** si la app publica otras notificaciones no ligadas a media (hoy no las hay). Si se agrega: solicitarlo en contexto, con justificación, y documentarlo aquí |

### No solicitar (regla de mínimos)

- Sin permisos de almacenamiento (`READ_MEDIA_AUDIO`/`READ_EXTERNAL_STORAGE`): la app reproduce **streams** del backend; no accede a archivos locales. (Solo si en el futuro se agregan archivos locales, solicitar el permiso correspondiente a su versión con flujo de justificación.)
- Sin `WAKE_LOCK` si no se usa wake mode.
- Sin permisos de ubicación, contactos, cámara, micrófono, teléfono.
- Sin `IGNORE_BATTERY_OPTIMIZATIONS` (el FGS de reproducción no lo requiere; pedirlo viola políticas de Play).

### Resumen de obligatoriedad por versión

| Permiso | ≤ API 28 | API 29-32 | API 33 (13) | API 34 (14) |
|---|---|---|---|---|
| `INTERNET` | ✅ | ✅ | ✅ | ✅ |
| `FOREGROUND_SERVICE` | ✅ (desde 28) | ✅ | ✅ | ✅ |
| `FOREGROUND_SERVICE_MEDIA_PLAYBACK` | — | — | — | ✅ **obligatorio** (targetSdk 34) |
| `POST_NOTIFICATIONS` (media) | — | — | Exento para media sessions | Exento para media sessions |
| `WAKE_LOCK` | Condicional | Condicional | Condicional | Condicional |

## Declaración del servicio en AndroidManifest

```xml
<service
    android:name=".player.PlaybackService"
    android:exported="true"
    android:foregroundServiceType="mediaPlayback">
    <intent-filter>
        <action android:name="androidx.media3.session.MediaSessionService" />
    </intent-filter>
</service>
```

- `foregroundServiceType="mediaPlayback"` es **obligatorio** con targetSdk 34 para coincidir con `FOREGROUND_SERVICE_MEDIA_PLAYBACK`.
- `exported="true"` con intent-filter: lo requiere el patrón de `MediaSessionService` para que el sistema y controllers externos se conecten.
- Hoy **no hay `<service>`**: debe agregarse al implementar reproducción ([background-playback.md](background-playback.md)).

## Restricciones de Android 13, 14 y posteriores

| Versión | Restricción | Aplicación a Antara |
|---|---|---|
| **13 (API 33)** | Permiso runtime de notificaciones; usuarios pueden descartar notificaciones de FGS | La notificación de media está exenta; los usuarios pueden descartar la notificación de FGS en 13+ (Media3 maneja el ciclo) — no asumir notificación indestructible |
| **13** | Cambios en `MediaSession`/controles de media del sistema | Usar Media3 actualizado (1.4.1) evita APIs obsoletas |
| **14 (API 34)** | `foregroundServiceType` obligatorio + permiso correspondiente por tipo | `mediaPlayback` ya contemplado |
| **14** | Inicio de FGS desde segundo plano restringido con excepciones (incluye casos de media) | Implementar `MediaSessionService.Listener.onForegroundServiceStartNotAllowedException()` y manejar el fallo (no crashear; informar al usuario) |
| **15+ (futuro)** | Nuevos cambios de FGS/permisos | Al subir `targetSdk`, actualizar este documento **antes** del cambio (checklist de migración) |

## Audio Focus

- Gestión mediante `ExoPlayer.setAudioAttributes(attrs, handleAudioFocus = true)`:
  - **Pérdida permanente** (llamada, otra app de audio): pausa.
  - **Pérdida transitoria** (asistente, navegación con voz): pausa/ducking según política; comportamiento esperado: pausar y reanudar al recuperar si el usuario no intervino.
  - **Ganancia**: reanudar solo si la pausa fue por pérdida transitoria y el usuario no pausó manualmente.
- La app **no** pide permisos de audio focus adicionales (no existen: se solicita por API).
- La UI debe reflejar la pausa por interrupción sin mostrar error.

## Interrupciones de audio

- **Llamadas telefónicas:** pérdida de audio focus → pausa (manejado por ExoPlayer + AudioFocus).
- **Desconexión de auriculares / `ACTION_AUDIO_BECOMING_NOISY`:** `setHandleAudioBecomingNoisy(true)` → pausa automática. **No** reanudar automáticamente al reconectar.
- **Notificaciones de otras apps con sonido:** política de audio focus del sistema; documentar si se requiere ducking personalizado (por defecto ExoPlayer maneja).
- **Vibración/others:** no aplica.

## Cambios de conectividad

- Pérdida de red durante stream → `PlaybackException` de IO → reintento limitado con backoff; si persiste → estado de error con "Reintentar" (ver [../../docs/error-handling.md](../../../docs/error-handling.md)).
- Cambio WiFi↔datos: ExoPlayer reanuda la carga con su propio mecanismo; si falla, el reintento aplica.
- Modo avión: error de red; sin mensajes técnicos al usuario.
- **No** solicitar `ACCESS_NETWORK_STATE` salvo necesidad concreta de observar conectividad (evaluar; si se usa, declarar y documentar).

## Políticas de batería

- El servicio `mediaPlayback` es un tipo de FGS permitido para uso prolongado de reproducción; **no** pedir exenciones de optimización de batería.
- `WAKE_LOCK` solo durante reproducción (release en `onDestroy`/stop).
- No usar alarmas, jobs periódicos ni servicios ocultos para la reproducción.
- Evaluar impacto: la app debe funcionar con ahorro de batería (reproducción de audio permitida); si el sistema limita el servicio, aplicar resumption ([background-playback.md](background-playback.md#ciclo-de-vida)).

## Ciclo de vida (resumen operativo)

| Evento | Acción de la app |
|---|---|
| Usuario abre la app | Conectar `MediaController`, observar estado |
| Play desde la UI | Servicio pasa a foreground con notificación |
| Usuario navega fuera | La UI **libera** su controller si ya no se usa; el servicio continúa |
| Pantalla apagada | Wake mode activo mientras reproduce |
| Pausa >10 min | Servicio sale de foreground (Media3); implementar resumption |
| Usuario fuerza detención | Todo muere; no prometer continuidad |
| `onTaskRemoved` | Comportamiento por defecto de Media3 (no destruir si sigue reproduciendo); no implementar `onTaskRemoved` manual sin leer la doc de Media3 |
| Proceso recreado | Restaurar desde DataStore + resumption de sesión si aplica |

## Checklist de permisos por feature

1. ¿Este feature necesita un permiso? ¿Es imprescindible? (si no, no agregarlo)
2. ¿Está declarado con el tipo correcto para targetSdk 34?
3. Si es runtime: ¿se solicita en contexto con justificación y manejo de denegación?
4. ¿Se actualizó este documento si cambió la lista?
5. ¿Se probó en API 33 y 34 (o simulador) además de una API baja?
