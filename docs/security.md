# Seguridad (Security)

Buenas prácticas de seguridad aplicables a las tres plataformas y al manejo del backend. Este documento no sustituye un análisis de seguridad formal; establece el mínimo obligatorio.

## Gestión de credenciales

- **Nunca** almacenar contraseñas en el cliente. El usuario envía credenciales una vez al backend; el cliente solo guarda tokens (o cookies, según el contrato).
- **Nunca** secretos en el código fuente: claves de API, cadenas de conexión, credenciales de servicio. Van en variables de entorno / propiedades locales / secreto del CI.
- Revisar el historial de git si un secreto llega a commitearse: rotar el valor **y** limpiar el historial.
- El `README` y la documentación no contienen credenciales reales.

## Almacenamiento seguro de tokens

| Plataforma | Almacenamiento recomendado | Reglas |
|---|---|---|
| **Web** | Hoy: `localStorage` (`antara:session`) para conservar la sesión entre recargas, limitada por la vigencia real del token (8 h) y borrada al cerrar sesión. Objetivo si el backend lo permite: cookie `httpOnly` + `Secure` + `SameSite` | No exponer el token en URLs; descartar entradas vencidas o corruptas al restaurar y limpiar al logout |
| **Desktop** | Almacenamiento cifrado del sistema: **Windows Credential Manager** vía crate `keyring` (evaluar al implementar auth). Interim aceptable: plugin `tauri-plugin-store` con archivo en `APPDATA` y permisos restringidos, marcado como deuda | Nunca tokens en claro en el código o en logs; borrar al logout |
| **Android** | DataStore cifrado con Android Keystore (`EncryptedSharedPreferences`/`Security-Crypto`) o KeyStore directo | Excluir del backup (`data_extraction_rules`); nunca en `SharedPreferences` en claro |

- Cargar el token en memoria solo en la capa de infraestructura; no pasarlo a componentes de UI ni a `Log`.
- Logout siempre limpia almacén + estado en memoria.

## Configuración de conexiones

- **HTTPS obligatorio** en producción; en desarrollo se permite `http://localhost` documentado.
- Verificar certificados (no desactivar `TrustManager`/cert pinning a la ligera).
- URL base configurada por el usuario (servidor activo) y ruta relativa del endpoint resuelta por el cliente HTTP (ver [api-integration.md](api-integration.md#configuración-de-url-base) y ADR-016); no URLs hardcodeadas en componentes.
- **HTTP en claro solo en desarrollo/red local:** Android declara `android:usesCleartextTraffic="true"` para servidores `http://` de la LAN; en producción el servidor debe exponerse por HTTPS.
- **Deuda conocida:** en Android el token de sesión se guarda sin cifrar en DataStore; en Web/Desktop se guarda en `localStorage` (`antara:session`) y se restaura mientras el `exp` del token siga vigente (8 h), descartándose al expirar o al cerrar sesión. Migrar al almacén cifrado cuando se evalúe esa dependencia.
- **Desktop (Tauri):** habilitar CSP en `tauri.conf.json` (hoy está en `null`, deuda conocida). CSP mínima sugerida:

```jsonc
"csp": {
  "default-src": "'self'",
  "connect-src": "'self' https://api.tu-dominio.example",
  "img-src": "'self' data: https://api.tu-dominio.example",
  "media-src": "'self' https://api.tu-dominio.example",
  "style-src": "'self' 'unsafe-inline'",
  "script-src": "'self'"
}
```

  Ajustar orígenes reales; `assetProtocol` solo si se sirven archivos locales (con scope mínimo).
- **Capabilities de Tauri:** mínimo privilegio; solo permisos que la ventana usa (ver [`apps/desktop/docs/architecture.md`](../apps/desktop/docs/architecture.md)).

## Validación de datos

- **Cliente:** valida entradas de usuario (longitudes, formatos, campos obligatorios) para UX; **no** es una barrera de seguridad.
- **Servidor:** es la autoridad real (autorización, integridad, límites). El cliente asume que puede recibir cualquier respuesta hostil y la valida igualmente (tipos, rangos, tamaños).
- Sanitizar todo lo que se renderice como texto (React/Compose lo hacen por defecto; no usar `dangerouslySetInnerHTML`/`Html` con contenido del servidor).
- Validar tamaños de payload antes de procesar (p. ej. límites razonables de listas).

## Control de sesiones

- Expiración manejada centralmente (ver [api-integration.md](api-integration.md#autenticación)).
- Logout en todas las plataformas limpia: tokens, estado en memoria, cachés de usuario y datos personales en disco.
- Múltiples sesiones/dispositivos: comportamiento definido por el backend; el cliente reacciona ante `401`/revocación sin asumir control sobre otros dispositivos.
- Bloqueo de sesión opcional (Mobile): considerar reautenticación tras periodo largo de inactividad si el contrato lo requiere.

## Protección de información sensible

- **Rutas físicas de archivos de audio:** solo entre backend y motor de reproducción; nunca en UI, logs, mensajes de error ni analítica.
- No mostrar en la UI: tokens, identificadores internos de BD, stack traces, nombres de tablas, detalles de SQL.
- Capturas de pantalla/pantalla de bloqueo (Mobile): si la app muestra información sensible, evaluar `FLAG_SECURE` (decisión documentada; por defecto no es necesario para un reproductor musical).
- Analítica/telemetría (futura): sin PII; opt-in.

## Manejo de logs

- Niveles: `debug` solo en desarrollo; en producción como máximo `info`.
- Nunca registrar: credenciales, tokens, cabeceras `Authorization`, cookies, contenido de formularios de login.
- Redactar query strings con parámetros sensibles antes de loguear URLs.
- Los logs de red registran método/path/status/duración, no cuerpos con datos personales.

## Permisos específicos por plataforma

| Plataforma | Regla |
|---|---|
| **Desktop (Tauri)** | Capabilities por ventana, un solo capability hoy (`core:default`, `opener:default` + los que agreguen las features). Cada plugin nuevo (http, store, tray…) exige permiso explícito: agregar **solo** los permisos mínimos usados. No habilitar `shell`/`fs` globales. |
| **Android** | Declarar **solo** permisos necesarios (ver [`apps/mobile/docs/permissions-and-lifecycle.md`](../apps/mobile/docs/permissions-and-lifecycle.md)). Nada de permisos "por si acaso" (sin almacenamiento para streaming, sin ubicación, sin contactos). Solicitar permisos en contexto, con justificación al usuario. |
| **Web** | Nada de permisos del navegador innecesarios; no pedir notificaciones/micrófono/cámara salvo funcionalidad que los requiera y esté documentada. |

## Comunicación segura

- TLS en producción; HSTS en el backend.
- Tokens solo en cabeceras (nunca en query string, salvo que el mecanismo de stream del backend lo exija — entonces evitar que aparezcan en logs de servidor y clientes).
- Respuestas con `Content-Type` correcto y validación del tipo esperado.
- Orígenes CORS del backend: restringidos a los orígenes reales de los clientes (Web en producción; `http://tauri.localhost` y `http://localhost:1420` para Desktop si se usa `fetch`; `localhost` de dev para Vite).

## Checklist de seguridad por feature

1. ¿Algún secreto en el código o en el repositorio?
2. ¿Dónde se guarda el token y está cifrado/excluido de backups?
3. ¿Los mensajes/UI exponen internals o rutas físicas?
4. ¿Los logs contienen datos sensibles?
5. ¿Se agregó algún permiso/capability sin necesidad real?
6. ¿La comunicación es HTTPS y los datos de entrada se validan?
