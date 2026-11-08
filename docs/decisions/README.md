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
- **Actualización (2026-11-08):** se implementó la fase 1 con `fetch` en Web/Desktop y `HttpURLConnection` + `org.json` en Android (sin dependencias nuevas). Retrofit/OkHttp queda como objetivo, no como obligación. Ver [ADR-016](#adr-016-url-base-configurada-por-el-usuario--ruta-relativa-del-endpoint).

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

### ADR-015: UI de Web y Desktop sobre tokens replicados, fuentes locales y store de reproductor sin dependencias nuevas

- **Estado:** Aceptada (fase 1 de UI)
- **Fecha:** 2026-11-02
- **Contexto:** Web y Desktop seguían siendo la plantilla (`WelcomeScreen` duplicado, CSS de plantilla, sin tokens). Había que arrancar la interfaz con la misma identidad que Android sin introducir `packages/` (ADR-010) ni dependencias de estado/iconos.
- **Decisión:**
  1. **Tokens:** un bloque CSS de variables + `@theme inline` de Tailwind v4 por app (`apps/web/src/index.css`, `apps/desktop/src/styles/index.css`) con los valores exactos de [design-system.md](../design-system.md). Tema oscuro por defecto y claro vía `data-theme="light"`.
  2. **Componentes:** `Icon`, `Sidebar`, `MediaRow`, `SectionHeader`, `FilterChips`, `FeaturedCard` y `PlayerBar` replicados en ambas apps (duplicación intencional mientras ADR-010 no se revise).
  3. **Tipografía e iconografía:** Inter variable y Material Symbols Outlined (ADR-008) **vendorizados** en `public/fonts/` como `woff2`, servidos con `@font-face`; sin CDN, de modo que Desktop funciona sin red al empaquetar.
  4. **Estado del reproductor:** `stores/player.tsx` con `Context` + `useReducer` (único dueño del estado, ADR-011). Sin Zustand ni motor de audio todavía: la posición avanza con un temporizador hasta que exista `PlaybackEngine` (ADR-003).
  5. **Limpieza de plantilla:** se eliminan `WelcomeScreen`, `App.css`, assets de la plantilla Vite y el sprite de redes sociales `public/icons.svg`; `strict: true` activado en el `tsconfig.app.json` de Web.
- **Consecuencias:**
  - Los tokens y los componentes deben mantenerse idénticos a mano entre Web y Desktop (criterio de revisión de [ui-consistency.md](../ui-consistency.md)).
  - La reproducción no emite audio hasta implementar `PlaybackEngine`; la UI ya expone los controles y estados equivalentes a Android.
  - Rutas y HTTP siguen pendientes: Home usa datos mock locales, sin `services/api/`.
  - En Desktop queda pendiente el cambio de identidad en `tauri.conf.json` (`productName`, identificador `tauri-app`) y el `csp: null` de ADR-012.

---

### ADR-016: URL base configurada por el usuario + ruta relativa del endpoint

- **Estado:** Aceptada (fases 1 y 2: Login y álbumes)
- **Fecha:** 2026-11-08
- **Contexto:** El backend se ejecuta en un servidor que el usuario elige (IP o dominio de su red local, o un host remoto), por lo que Web, Desktop y Mobile no pueden depender de una URL base fijada en build. Hasta ahora el Login era mock y no existía capa HTTP en ninguna plataforma.
- **Decisión:**
  1. **URL base manual:** cada app reutiliza su pantalla de servidores (ADR-014 y equivalente en Web/Desktop): el usuario introduce IP o dominio, con puerto y esquema opcionales, y se guarda un servidor activo. La normalización conserva esquema, host, puerto y, si existe, un prefijo de ruta (útil detrás de un proxy inverso); nunca la ruta del endpoint.
  2. **Ruta relativa:** el catálogo central de endpoints contiene únicamente rutas (`/api/usuario/login`): `services/api/endpoints.ts` en Web y Desktop, `core/network/Endpoints.kt` en Android. Prohibido hardcodear hosts o rutas completas en componentes, servicios y DTOs.
  3. **Composición en el cliente:** la URL final se arma en un solo lugar por plataforma (`apiRequest`/`buildUrl` en TS, `ApiClient.buildUrl` en Kotlin) como `baseUrl.trimEnd('/') + '/' + path.trimStart('/')`. Todas las implementaciones de endpoints futuras siguen esta misma forma en las tres plataformas.
  4. **Fase 1 — Login:** `POST {baseUrl}/api/usuario/login` con `{ email, password }`; respuesta 200 con datos del usuario y `token`. Traducción de errores: 404/401 → credenciales incorrectas, 503 → sin administrador registrado, 5xx → error del servidor, sin red → error de conexión.
  5. **Sesión real:** Web/Desktop arrancan sin sesión y `signIn` recibe `{ user, token, tipo }`; Android persiste el token en DataStore junto con el usuario. Los componentes consumen `user`, nunca el token directamente.
  6. **HTTP en claro:** Android declara `usesCleartextTraffic="true"` para permitir servidores `http://` de la red local; en producción se documenta HTTPS.
  7. **Fase 2 — Álbumes:** la sección "Playlists diarias" de Home consume `GET {baseUrl}/api/album/todos` con el token de sesión. El endpoint exige rol `admin`/`administrador`; un `403` se muestra como error de permisos.
  8. **Fase 3 — Detalle del álbum (Web, Desktop y Mobile):** al pulsar una fila de álbum se abre su lista de reproducción y se cargan las pistas con `GET {baseUrl}/api/pista/todos/album/{AlbumId}`. La navegación sigue siendo por estado local (`App.tsx` en Web/Desktop, estado de `AppRoot` en Mobile). La reproducción pide el contenido a `GET {baseUrl}/api/pista/{id}` (`PistaController.ObtenerPistaAsync`, con `Accept-Ranges`) y no a la ruta almacenada en `url`; solo se ofrece audio de pistas que pertenecen a un álbum.
  9. **Fase 4 — Subidas (Web):** "Mis archivos" envía audio al servidor con `POST {baseUrl}/api/pista/subir` (multipart: `archivo`, `rutaId?`, `subcarpeta?`) o descarga desde YouTube con `POST {baseUrl}/api/pista/subir/url`, eligiendo destino desde `GET {baseUrl}/api/pista/subir/rutas`. El cliente multipart vive en `apiRequest` (`formData`, sin `Content-Type` manual) con timeouts de 120 s / 180 s. Ambos endpoints exigen hoy rol `admin`/`administrador`: el `403` se informa como restricción temporal y la UI no se condiciona al rol, para que baste con liberar el backend.
  10. **Fase 5 — Playlists destacadas (Web):** "Curado y en tendencia" pide las playlists a `GET {baseUrl}/api/playlist/todos` (admin, misma deuda que los álbumes) y las muestra como tarjetas; al abrir una se cargan sus canciones con `GET {baseUrl}/api/pista/todos/playlist/{PlaylistId}`. A diferencia de un álbum, el detalle muestra el intérprete de cada pista (la playlist mezcla artistas) y el audio se reproduce por `GET {baseUrl}/api/pista/{id}`. Si la consulta de playlists falla, la sección conserva el contenido mock para no romper Home.
- **Consecuencias:**
  - Cambiar de servidor no requiere recompilar: basta con seleccionar otro servidor activo.
  - El Login real deja de usar el atajo mock (`signIn("alex@antara.app")` desaparece de los sidebars); sin backend accesible el formulario muestra el error de conexión.
  - **Deuda:** en Android el token se guarda sin cifrar en DataStore; en Web/Desktop vive solo en memoria y se pierde al recargar (no hay persistencia de sesión todavía). Migrar al almacén seguro cuando se evalúe esa dependencia (ver [security.md](../security.md)).
  - El catálogo `ENDPOINTS`/`Endpoints` crece con cada endpoint integrado; ningún servicio compone rutas por su cuenta.
  - **Deuda:** "Playlists diarias" usa `GET /api/album/todos`, pensado para el panel de administración, porque aún no existe un endpoint público de álbumes. Revisar el contrato cuando el backend lo exponga y, mientras tanto, mostrar el `403` como mensaje de permisos.
  - Retrofit/OkHttp sigue siendo el objetivo en Android si el número de endpoints crece (ADR-007).

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
