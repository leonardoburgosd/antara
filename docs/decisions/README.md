# Decisiones arquitectónicas (ADRs)

Registro de decisiones arquitectónicas y técnicas relevantes de Antara. **Toda decisión estructural nueva se registra aquí** (nueva dependencia, patrón, excepción de consistencia, cambio de convención).

## Formato

Cada entrada sigue la estructura:

```markdown
### ADR-NNN: Título
- **Estado:** Aceptada | Propuesta | Obsoleta (reemplazada por ADR-XXX)
- **Fecha:** YYYY-MM-DD
- **Contexto:** qué problema o situación obligó a decidir.
- **Decisión:** qué se decidió.
- **Consecuencias:** implicaciones, deudas y condiciones de revisión.
```

Numeración secuencial (`ADR-001`, `ADR-002`…). Las entradas se agregan al final; no se reescriben (una decisión obsoleta se marca y se enlaza a su reemplazo).

---

## Decisiones registradas

### ADR-001: Documentación como fuente de verdad del desarrollo

- **Estado:** Aceptada
- **Fecha:** 2026-11-01
- **Contexto:** el repositorio no tenía documentación; las tres apps son scaffolds de plantilla con riesgo alto de divergencia y de implementación inconsistente.
- **Decisión:** crear `docs/` global + `apps/desktop/docs/` + `apps/mobile/docs/` como referencia obligatoria pre-implementación, con el procedimiento de 7 pasos de [`docs/implementation-instructions.md`](../implementation-instructions.md) y la regla de contradicción.
- **Consecuencias:** todo cambio significativo debe pasar por el flujo de [development-workflow.md](../development-workflow.md); la documentación desactualizada es un bug.

### ADR-002: Tauri 2 + React para Desktop (sin cambio de tecnología)

- **Estado:** Aceptada
- **Fecha:** 2026-11-01
- **Contexto:** Desktop ya está montado sobre Tauri 2, React 19, TypeScript, Tailwind v4 y framer-motion.
- **Decisión:** mantener la stack seleccionada. La lógica de producto vive en React; Rust se reserva para capacidades nativas de Windows (bandeja, ciclo de ventana, integración con el SO). Los comandos Tauri son delgados.
- **Consecuencias:** ver [`apps/desktop/docs/architecture.md`](../../apps/desktop/docs/architecture.md).

### ADR-003: Motor de reproducción en Desktop — abstracción `PlaybackEngine` con fase 1 en `HTMLAudioElement`

- **Estado:** Aceptada (fase 1); revisar en fase 2
- **Fecha:** 2026-11-01
- **Contexto:** no existe motor de reproducción. Hay que elegir entre el elemento multimedia del WebView2 (Chromium) o un motor en Rust (p. ej. symphonia + cpal/rodio), considerando formatos, memoria, rendimiento y streams HTTP con Range.
- **Decisión:** definir una interfaz `PlaybackEngine` en la capa `services/playback/` e implementar la **fase 1** con `HTMLAudioElement`, que trae de serie el streaming HTTP con Range, buffering y seek sin código propio. La interfaz permite sustituir el motor sin tocar la UI.
- **Consecuencias:**
  - Límite conocido: formatos según Chromium (ver [`apps/desktop/docs/audio-playback.md`](../../apps/desktop/docs/audio-playback.md#compatibilidad-de-formatos)); sin integración con teclas multimedia de Windows en fase 1.
  - **Fase 2 (evaluar):** motor Rust si se requieren formatos no soportados (WMA, ALAC…), gapless o integración SMTC completa; la migración se documenta aquí.
- **Condición de revisión:** al primer requerimiento de formato no soportado o de teclas multimedia del SO.

### ADR-004: System Tray implementado en Rust con `TrayIconBuilder` (feature `tray-icon`)

- **Estado:** Aceptada
- **Fecha:** 2026-11-01
- **Contexto:** el producto requiere "Close to Tray": la app sigue viva y reproduciendo al pulsar X.
- **Decisión:** usar la API de bandeja de Tauri 2 **en Rust** (`tauri::tray::TrayIconBuilder` con feature `tray-icon` de Cargo), interceptando `WindowEvent::CloseRequested` con `api.prevent_close()` + `window.hide()`, y salida explícita desde el menú. La API de JS (`@tauri-apps/api/tray`) solo se usaría si la lógica vive en el frontend; requeriría `core:tray:default` en capabilities.
- **Consecuencias:** ver [`apps/desktop/docs/system-tray.md`](../../apps/desktop/docs/system-tray.md); requiere plugins `single-instance` (evitar instancias duplicadas) y `window-state` (recordar geometría).

### ADR-005: Reproducción en segundo plano en Android con `MediaSessionService` de Media3

- **Estado:** Aceptada
- **Fecha:** 2026-11-01
- **Contexto:** la música debe continuar fuera de la Activity; ya se declararon dependencias Media3 1.4.1 y permisos de servicio sin usarlos.
- **Decisión:** `ExoPlayer` + `MediaSession` dentro de un `MediaSessionService` (foreground service tipo `mediaPlayback`); la UI se conecta mediante `MediaController`. La `MediaSession` es la **fuente única** del estado de reproducción expuesto al sistema.
- **Consecuencias:** ver [`apps/mobile/docs/background-playback.md`](../../apps/mobile/docs/background-playback.md), [`media-session.md`](../../apps/mobile/docs/media-session.md) y [`permissions-and-lifecycle.md`](../../apps/mobile/docs/permissions-and-lifecycle.md).

### ADR-006: Inyección de dependencias manual (`AppContainer`) en Android

- **Estado:** Aceptada (con criterio de migración)
- **Fecha:** 2026-11-01
- **Contexto:** no hay DI en el proyecto; Hilt/Koin añaden dependencias y build logic (KSP).
- **Decisión:** contenedor DI manual en `AntaraApplication` mientras el grafo sea pequeño (KISS/YAGNI). Sin singletons con estado fuera del contenedor.
- **Consecuencias:** migrar a Hilt cuando el grafo supere un umbral razonable (p. ej. >10 módulos de dependencias o necesidad real de scopes/`@HiltViewModel`); registrar la migración como ADR nuevo.

### ADR-007: Cliente HTTP propio centralizado por plataforma

- **Estado:** Aceptada
- **Fecha:** 2026-11-01
- **Contexto:** ninguna plataforma tiene capa HTTP; se necesita una sola puerta de entrada al backend.
- **Decisión:** `ApiClient` en TS para Web/Desktop (fetch, con opción `@tauri-apps/plugin-http` si CORS lo exige) y Retrofit + OkHttp en Android. Contratos leídos del backend real; sin endpoints inventados. Detalle en [`docs/api-integration.md`](../api-integration.md).
- **Consecuencias:** si se opta por `plugin-http` en Desktop, queda registrado en un ADR nuevo con el motivo (CORS).

### ADR-008: Material Symbols como set único de iconografía

- **Estado:** Aceptada
- **Fecha:** 2026-11-01
- **Contexto:** consistencia entre plataformas; existen sprites sin usar en Web (`public/icons.svg`) y ninguna app tiene set de iconos definido.
- **Decisión:** Material Symbols (*Outlined*, peso 400) en las tres plataformas (web font en React, recurso en Android). Prohibido mezclar sets de terceros.
- **Consecuencias:** detalle en [`docs/design-system.md`](../design-system.md#iconografía).

### ADR-009: Material 3 personalizado y color dinámico desactivado por defecto en Android

- **Estado:** Aceptada
- **Fecha:** 2026-11-01
- **Contexto:** la plantilla usa Material 3 con `dynamicColor = true` (paleta del wallpaper) que rompería la identidad de marca, y la UI actual ignora el tema (valores inline).
- **Decisión:** `AntaraTheme` se personaliza con los tokens de [design-system.md](../design-system.md) (colores, tipografía completa, shapes). Color dinámico **off por defecto** (opción futura documentada en ajustes si se desea).
- **Consecuencias:** ver [`apps/mobile/docs/ui-guidelines.md`](../../apps/mobile/docs/ui-guidelines.md).

### ADR-010: Sin `packages/` compartidos hasta evidencia de duplicación

- **Estado:** Aceptada
- **Fecha:** 2026-11-01
- **Contexto:** el README raíz menciona `packages/shared` y `packages/types` que **no existen**; Desktop y Web comparten `WelcomeScreen.tsx` duplicado byte a byte (riesgo de divergencia).
- **Decisión:** no crear `packages/` aún (YAGNI). Criterio: extraer tokens/componentes React compartidos cuando haya duplicación medida y cambios sincronizados en ≥2 ocasiones. Nunca compartir código React con Android.
- **Consecuencias:** mientras tanto, los tokens deben mantenerse idénticos entre el `index.css` de Web y el de Desktop (creado al implementar tokens; revisión manual); ver [`docs/project-structure.md`](../project-structure.md#paquetes-compartidos-candidato-futuro-no-implementado).

### ADR-011: Estado de reproducción con un solo dueño por plataforma

- **Estado:** Aceptada
- **Fecha:** 2026-11-01
- **Contexto:** alto riesgo de duplicar estado del reproductor entre UI, bandeja/notificación y lógica de producto.
- **Decisión:** un único estado dueño: store de reproducción en React (Desktop/Web) y `MediaSession`+`MediaController` en Android. La UI y los elementos nativos (tray, notificación) **leen** ese estado; nadie mantiene una copia.
- **Consecuencias:** ver [`docs/global-architecture.md`](../global-architecture.md#gestión-del-estado).

### ADR-012: Corrección de deudas de plantilla como prerequisito de features

- **Estado:** Propuesta (en progreso)
- **Fecha:** 2026-11-01
- **Contexto:** detectadas deudas: `csp: null` en Tauri, `strict` ausente en Web, CSS muerto de plantilla, identidad "tauri-app" sin renombrar, recursos `mipmap` faltantes en Android (bloquean build), wrapper Gradle incompleto, logs versionados en `apps/*.log`, `local.properties` versionado, bug de `isAppearanceLightStatusBars` invertido, `Random` sin `remember` en composables.
- **Decisión:** abordarlas de forma incremental **al tocar cada área** (no una mega-refactorización), priorizando: (1) bloqueos de build de Android, (2) tokens/CSP/strict, (3) limpieza de plantilla.
- **Consecuencias:** cada corrección se aplica dentro del flujo de [development-workflow.md](../development-workflow.md); eliminar código de plantilla no usado está permitido y deseable.
- **Progreso (2026-11-01, feature Home Android):** resueltos los `mipmap` faltantes (iconos de lanzamiento generados por densidad) y los errores de compilación de `WelcomeScreen.kt` (`Float * Dp` y `.value` sobre `Float`). Siguen pendientes: `Random` sin `remember` en `WelcomeScreen`, wrapper Gradle incompleto y migración de `WelcomeScreen` a tokens.

### ADR-013: Navegación con estado local (sin `navigation-compose`) en Android

- **Estado:** Aceptada
- **Fecha:** 2026-11-01
- **Contexto:** Home necesita abrir dos destinos de detalle ("Canciones que te gustan" y álbumes) conservando el estado de Home (filtro y scroll). Las dependencias nuevas pasan por evaluación y hoy solo hay 3 pestañas + 2 rutas de detalle.
- **Decisión:** usar estado local (`detailRoute: String` con `rememberSaveable` + `BackHandler`) en `navigation/AppRoot.kt`, con rutas centralizadas en `navigation/Routes.kt`. El detalle se compone como overlay sobre Home (que permanece compuesto debajo para preservar su estado). Sin librería de navegación.
- **Consecuencias:** al añadir rutas con argumentos/ViewModels o más pantallas, migrar a `navigation-compose` (revisar entonces también el back stack por pestaña). La hoja de opciones de cada canción usa `ModalBottomSheet` de Material 3 con acciones placeholder (mock).

### ADR-014: Autenticación local, servidores y reproductor Media3 en la app Android

- **Estado:** Aceptada
- **Fecha:** 2026-11-02
- **Contexto:** La app Android necesitaba el flujo completo de arranque (autenticación y configuración de servidores), las interfaces de Home/Detalle (referencia compartida) y un reproductor real con controles del sistema. Hasta ahora Media3 estaba declarado sin usar, no había persistencia local ni ViewModels. Además, la pantalla `WelcomeScreen` de la plantilla quedó obsoleta.
- **Decisión:**
  1. **Navegación:** extender ADR-013 con estado local en `navigation/AppRoot.kt` (`Loading → Auth → Servers → Main`, overlays de detalle y reproductor, `BackHandler`). Sin `navigation-compose`.
  2. **Persistencia:** `androidx.datastore:datastore-preferences:1.1.1` en `data/local/` para sesión mock y lista de servidores (direcciones normalizadas), expuesta mediante `SessionRepository`/`ServerRepository`.
  3. **ViewModels:** `androidx.lifecycle:lifecycle-viewmodel-compose:2.8.6` con `viewModelFactory` manual; UiState inmutable en `StateFlow` por feature (`Auth`, `Servers`, `Player`).
  4. **Reproducción:** implementar `PlaybackService` (`MediaSessionService` + ExoPlayer 1.4.1), `PlayerConnection` (`MediaController`, única vía de la UI al player) y `PlayerViewModel`. La notificación usa `DefaultMediaNotificationProvider` con icono propio; audio demo local `res/raw/antara_sample.wav` (90 s) para funcionar offline.
  5. **UI:** `androidx.compose.material:material-icons-extended` (gestionado por Compose BOM) y componentes compartidos en `core/designsystem/components/` (botones, input, chips, fila de canción, cabecera de sección, mini player).
  6. **Permisos:** se añade `WAKE_LOCK` por `setWakeMode(C.WAKE_MODE_NETWORK)`; `POST_NOTIFICATIONS` sigue sin declararse (exención de media sessions).
  7. **Limpieza:** se elimina `WelcomeScreen.kt` de la plantilla, sustituido por `features/auth/ui/AuthScreen.kt`.
  8. **Login:** formulario único de inicio de sesión (sin registro). Incluye una tarjeta de servidor que abre la configuración con retorno al login; si tras autenticarse no hay servidores, se muestra la configuración en modo primera ejecución antes del contenido.
- **Consecuencias:**
  - La autenticación es **mock local** (cualquier email válido y contraseña ≥ 6 caracteres); al existir backend debe sustituirse en `AuthViewModel` y guardar el token en almacén cifrado.
  - El audio de todas las pistas mock es el mismo recurso local; al integrar el backend se cambiará el `Uri` en `PlayerConnection`.
  - `MainActivity.onStop()` libera el `MediaController`; el servicio continúa reproduciendo (verificado con notificación y `dumpsys media_session`).
  - Al crecer el número de destinos con argumentos, migrar a `navigation-compose` (revisar ADR-013).
  - Si se añaden notificaciones distintas a la multimedia, declarar `POST_NOTIFICATIONS` y actualizar `permissions-and-lifecycle.md`.

---

## Plantilla para nuevas entradas

```markdown
### ADR-NNN: Título
- **Estado:** Propuesta
- **Fecha:** YYYY-MM-DD
- **Contexto:**
- **Decisión:**
- **Consecuencias:**
```
