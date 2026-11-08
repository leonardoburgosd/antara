# Integración con la API (API Integration)

Reglas para consumir el backend (.NET 10 + Dapper) desde las tres aplicaciones.

> **Regla de oro:** este repositorio **no contiene el backend ni sus contratos**. Antes de implementar cualquier integración, leer los endpoints, DTOs y códigos de error del repositorio del backend. **Prohibido inventar endpoints, modelos o contratos.** Si se detecta una discrepancia entre lo esperado y el backend real, documentarla en [`decisions/README.md`](decisions/README.md) y detenerse a resolverla.

## Cliente HTTP centralizado

Cada plataforma tendrá **un** cliente de infraestructura (ningún componente hará peticiones directas). Fase 1 implementada (ADR-016) para `POST /api/usuario/login`; el resto de endpoints se añaden al catálogo y al servicio correspondiente.

| Plataforma | Cliente | Notas |
|---|---|---|
| Web | `services/api/apiClient.ts` sobre `fetch` | Timeout con `AbortController`; errores → `ApiError` |
| Desktop | El mismo `apiClient.ts` (código conceptualmente idéntico al de Web) | Ver decisión de transporte abajo |
| Mobile | `core/network/ApiClient.kt` con `HttpURLConnection` + `org.json` (suspend) | Sin dependencias nuevas; Retrofit/OkHttp queda como objetivo si crece el número de endpoints |

Responsabilidades del cliente:

1. Componer la URL base + path desde un catálogo central de endpoints (`endpoints.ts` / `Endpoints.kt`).
2. Adjuntar headers comunes (`Authorization`, `Content-Type`, `Accept`, `X-Request-Id` si el backend lo usa).
3. Aplicar timeout y cancelación.
4. Serializar/deserializar DTOs.
5. Traducir respuestas y errores a `Result<T, AppError>` (ver [error-handling.md](error-handling.md)).
6. Ejecutar la política de reintentos.

### Transporte en Desktop (decisión)

- **Primera opción:** `fetch` nativo (mismo código que Web, máxima reutilización).
- **Restricción:** las peticiones desde el WebView de Tauri están sujetas a CORS; el origen de producción es `http://tauri.localhost` (Windows) y en dev `http://localhost:1420`. Si el backend no permite esos orígenes, se sustituye **solo el transporte** por `@tauri-apps/plugin-http` (reqwest en Rust, sin CORS) manteniendo la misma interfaz `ApiClient`. El cambio queda registrado en [`decisions/README.md`](decisions/README.md).
- El streaming de audio **no** pasa por el `ApiClient`: el motor de reproducción consume la URL del endpoint de audio directamente (ver [`apps/desktop/docs/audio-playback.md`](../apps/desktop/docs/audio-playback.md)).

## Configuración de URL base

**Regla (ADR-016): la URL base la introduce el usuario manualmente y el endpoint se añade por ruta relativa.**

- Cada app guarda una lista de servidores (IP o dominio, con puerto y esquema opcionales) y un servidor activo; la normalización vive en `core/network/ServerAddress.kt` (Android) y `stores/servers.tsx` (Web/Desktop).
- La URL base es el origen (`http://192.168.1.10:5006`, `https://mi-servidor.com`), opcionalmente con un prefijo de ruta si el backend vive tras un proxy inverso; **nunca** incluye la ruta del endpoint.
- El catálogo central (`endpoints.ts` / `Endpoints.kt`) contiene **solo rutas relativas** (`/api/usuario/login`) y el cliente compone `baseUrl + path` en cada consulta.
- Prohibido hardcodear hosts o rutas completas en componentes, servicios o DTOs.
- Android permite HTTP en claro (`android:usesCleartextTraffic="true"`) porque el servidor suele ser una IP de la red local; en producción se documenta el uso de HTTPS.
- El cambio de servidor no requiere recompilar: basta con seleccionar otro servidor activo en la app.

## Autenticación

- Patrón según contrato del backend (documentado aquí cuando se conozca): credenciales → token(s) → header `Authorization: Bearer <token>`.
- El token **solo** vive en la capa de infraestructura y el almacén seguro de sesión; los componentes nunca lo ven.
- **Renovación de tokens:** si el backend define refresh, el `ApiClient` intercepta `401`, intenta **una** renovación con mecanismo *single-flight* (varias peticiones en vuelo comparten el mismo refresh) y reintenta la original una vez. Si falla → evento global `session:expired` → logout.
- **Interceptores / mecanismos equivalentes:** en Web/Desktop, wrappers alrededor de `fetch`; en Android, `Interceptor` de OkHttp + `Authenticator`. Un solo punto de aplicación.

## Serialización y deserialización

- JSON estricto: DTOs tipados en ambos extremos del cliente.
- TS: interfaces/ tipadas; parsear con funciones `mapXxx(dto): Entidad` en `services/api/mappers` (o `data/remote/mapper/` en Mobile). Sin `any`; campos opcionales según contrato.
- Kotlin: `@Serializable` (kotlinx.serialization) con `@SerialName` exacto al JSON del backend.
- Fechas/horas: formato definido por el backend (ISO-8601 asumido **solo si el contrato lo confirma**); centralizar el parseo.
- Deserialización defensiva: campos desconocidos se ignoran; campos ausentes → valor por defecto solo si el contrato lo permite.

## DTOs

- Los DTOs viven en la capa de datos (`services/api/types` o `data/remote/dto`).
- **No** se exponen DTOs a la UI: se mapean a entidades de dominio.
- Cuando el backend cambie, el cambio se concentra en DTOs + mappers.

## Manejo de errores HTTP

Mapeo mínimo obligatorio (detalle de mensajes en [error-handling.md](error-handling.md)):

| HTTP | AppError | Acción por defecto |
|---|---|---|
| 400 | `validation` | Mostrar mensaje del backend si es seguro; nunca reintentar |
| 401 | `unauthorized` | Refresco (si aplica) o logout |
| 403 | `forbidden` | Mensaje "no tienes permisos" |
| 404 | `notFound` | Estado vacío o "recurso no disponible" |
| 409/422 | `conflict`/`validation` | Mostrar motivo |
| 408/timeout | `network` | Reintento si es GET; mensaje de conexión |
| 429 | `rateLimited` | Respetar `Retry-After`; mensaje genérico |
| 5xx | `server` | Reintento limitado (GET); mensaje "problemas en el servidor" |
| Sin red / DNS / TLS | `network` | Estado offline + reintento manual |
| Error de parseo | `parsing` | Registrar técnico; mensaje genérico |

## Timeouts

| Tipo | Timeout |
|---|---|
| API (JSON) | 10 s |
| Operaciones grandes (export, sync inicial) | 30 s |
| Imágenes | sin timeout propio (caché del navegador/plataforma) |
| Streaming de audio | sin timeout: lo gestiona el motor de reproducción (buffer/estallido) |

## Cancelación de solicitudes

- TS: `AbortController`; el `ApiClient` acepta una `signal` y los servicios la propagan; los ViewModels/hooks cancelan al desmontar o al sustituir la petición (búsqueda con debounce incluida).
- Kotlin: cancelación natural de corrutinas (`viewModelScope.cancel`/job cancel); OkHttp cancela la conexión subyacente.
- Las cancelaciones **no** se reportan como error al usuario (ver [error-handling.md](error-handling.md#operaciones-canceladas)).

## Reintentos controlados

- Solo `GET` (y `HEAD` si aplica) y solo idempotentes.
- Máximo 2 reintentos; backoff exponencial con jitter (500 ms → 1.5 s).
- Solo ante: error de red, timeout, `5xx`, `429` (respetando `Retry-After`).
- Nunca reintentar `4xx` distintos de `408/429`.
- Las mutaciones (`POST/PUT/DELETE`) no se reintentan automáticamente: se reintentan solo bajo acción explícita del usuario.

## Paginación

- Formato exacto según contrato del backend (page/size, cursor, etc.). **No asumir**.
- Si el backend pagina por page/size, el cliente expone un tipo genérico `Paginated<T>` y un helper de carga incremental (`loadMore`), sin duplicar lógica por feature.
- Las listas grandes (biblioteca, pistas) usan carga incremental; nunca traen catálogos completos sin paginar.

## Carga de imágenes (portadas)

- `loading="lazy"` + `decoding="async"` en React; dimensiones fijas (relación 1:1) para evitar layout shift.
- Placeholder `surface` con icono mientras carga; reintentar una vez en error → fallback `album`.
- Caché: confiar en los headers del backend y en la caché del navegador. En Android, cuando se introduzca carga de imágenes, evaluar Coil (dependencia justificada: portadas de biblioteca y notificación) — registrar en decisiones al añadirla.
- Las URLs de portadas pueden requerir autenticación según contrato: en Android, el `BitmapLoader` de MediaSession debe usar la misma fuente autenticada (ver [`apps/mobile/docs/media-session.md`](../apps/mobile/docs/media-session.md#carga-de-portadas)).

## Streaming de audio y HTTP Range

- Los clientes consumen el **endpoint de audio existente** (identificado en el backend) respetando HTTP Range:
  - Requests con `Range: bytes=<inicio>-<fin>` → respuesta `206 Partial Content` con `Content-Range`.
  - Verificar `Accept-Ranges: bytes`; si el backend no lo soporta, seek parcial no funcionará → registrar incidencia.
- **Nunca** descargar el archivo completo antes de reproducir: el motor de reproducción pide solo los rangos que necesita (la pila de medios del navegador/ExoPlayer lo hace automáticamente).
- Seek: requiere que el servidor resuelva rangos arbitrarios (importante en VBR).
- Cancelación: al cambiar de pista, el motor aborta las peticiones en vuelo (nativo en `<audio>`/ExoPlayer).
- Autenticación del stream: según contrato (token en query, header o URL pre-firmada). **No inventar**: usar el mecanismo que exija el backend y documentarlo aquí cuando se conozca.

## Checklist de integración de una feature

1. ¿El endpoint existe en el contrato del backend y está centralizado en el catálogo de endpoints?
2. ¿DTO tipado + mapper a entidad?
3. ¿Errores mapeados a `AppError`?
4. ¿Timeout/cancelación aplicados?
5. ¿Reintentos solo donde corresponde?
6. ¿Ningún componente importa `fetch`/OkHttp directamente?
