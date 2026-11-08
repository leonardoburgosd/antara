# Visión general del proyecto (Project Overview)

## Propósito

**Antara** es un sistema de administración y reproducción musical multiplataforma. Permite a los usuarios gestionar su biblioteca musical y reproducir archivos de audio originales desde tres tipos de cliente —Desktop (Windows), Mobile (Android) y Web— sincronizados mediante un backend común.

## Dominio funcional

Entidades y conceptos centrales del producto:

| Concepto | Descripción |
|---|---|
| **Usuarios** | Cuentas que acceden al sistema; su sesión identifica biblioteca, favoritos y preferencias |
| **Biblioteca musical** | Colección del usuario: artistas, álbumes y pistas |
| **Artistas** | Intérpretes/compositores vinculados a álbumes y pistas |
| **Álbumes** | Agrupaciones de pistas con portada y metadatos |
| **Pistas** | Canciones individuales; unidad de reproducción |
| **Metadatos musicales** | Título, artista, álbum, duración, número de pista, año, géneros, portada |
| **Rutas físicas de archivos** | Ubicación del archivo de audio original en el servidor; referencia interna, **nunca** expuesta al usuario ni en mensajes de error |
| **Listas de reproducción** | Colecciones ordenadas creadas por el usuario |
| **Favoritos** | Marcado de pistas/álbumes/artistas como favoritos |
| **Cola de reproducción** | Secuencia de pistas a reproducir, editable en tiempo real |
| **Estado de reproducción** | Pista actual, posición, volumen, shuffle/repeat, reproduciendo o pausado |
| **Reproducción de archivos originales** | Se sirve y reproduce el archivo original sin transcodificación innecesaria, preservando la calidad del archivo |
| **Sincronización entre dispositivos** | La biblioteca, la cola y el estado viven en el backend; cualquier cliente los refleja |

## Plataformas y responsabilidades

### Desktop — `apps/desktop/` (Windows)

Aplicación de escritorio construida con **Tauri 2** (backend nativo en Rust + frontend React en WebView2).

Responsabilidades:

- Experiencia de escritorio de alta densidad: navegación lateral, paneles, cuadrículas amplias.
- Reproducción de audio en streaming HTTP con soporte de seek (HTTP Range).
- Integración con Windows: **System Tray con "Close to Tray"** (la aplicación sigue activa y reproduciendo al cerrar la ventana), menú contextual de bandeja con controles de reproducción.
- Atajos de teclado, ventanas redimensionables, persistencia de tamaño/posición.
- Consumo del backend mediante la capa de infraestructura definida en [api-integration.md](api-integration.md).

### Mobile — `apps/mobile/` (Android)

Aplicación nativa en **Kotlin + Jetpack Compose** con **AndroidX Media3**.

Responsabilidades:

- Experiencia táctil: navegación inferior, listas verticales, mini reproductor y reproductor a pantalla completa.
- **Reproducción en segundo plano** mediante `MediaSessionService` + `ExoPlayer`: la música continúa al cambiar de aplicación, volver al home, bloquear o apagar la pantalla.
- **Controles multimedia del sistema** (`MediaSession`): notificación multimedia, pantalla de bloqueo, panel de notificaciones, auriculares Bluetooth, botones físicos.
- Permisos y ciclo de vida conforme a las restricciones de Android 13/14+.
- Consumo del backend y del endpoint de audio con HTTP Range.

### Web — `apps/web/` (navegadores)

Aplicación **React + TypeScript + Vite** ejecutada en navegador.

Responsabilidades:

- Acceso al producto sin instalar nada, con distribución equivalente a Desktop adaptada a ventanas de navegador.
- Reproducción de audio en streaming HTTP con HTTP Range (limitaciones de formatos según navegador, ver [audio-playback de Desktop](../apps/desktop/docs/audio-playback.md) para referencia de compatibilidad).
- Responsive design conforme a [responsive-design.md](responsive-design.md).

### Backend (fuera de este repositorio)

Desarrollado con **.NET 10, C# y Dapper**. Expone la API que los tres clientes consumen: autenticación, biblioteca, listas, favoritos, cola/estado y el endpoint de audio con soporte HTTP Range.

> **Este repositorio no contiene el código del backend.** Los contratos (endpoints, DTOs, códigos de error) deben leerse del repositorio del backend antes de implementar cualquier integración. **Está prohibido inventar endpoints, modelos o contratos** (ver [api-integration.md](api-integration.md)).

## Estado actual de funcionalidades

> Fuente: análisis de código de `apps/desktop`, `apps/mobile` y `apps/web` (ver resumen en [project-structure.md](project-structure.md#estado-actual-del-código)).

### Implementadas (presentes en este repositorio)

| Funcionalidad | Desktop | Mobile | Web |
|---|---|---|---|
| Compilación y pipeline de desarrollo (Vite / Gradle / Tauri) | ✅ | ⚠️ Parcial (faltan recursos `mipmap` y wrapper Gradle completo) | ✅ |
| Pantalla de bienvenida (mock visual con animación de partículas) | ✅ | ✅ | ✅ |
| Tema base (Tailwind v4 / Material 3 de plantilla) | ⚠️ Sin tokens propios | ⚠️ Tema Material 3 de plantilla, sin personalizar | ⚠️ Tokens CSS sin usar por la UI |

### No implementadas (pendientes) — todas las funcionalidades de producto

En **las tres plataformas** están pendientes:

- Autenticación y gestión de sesión: **login** implementado en las tres apps (ADR-016); faltan registro, recuperación y almacén cifrado de token.
- Comunicación con el backend: **cliente HTTP propio y `POST /api/usuario/login`** implementados en las tres apps (ADR-016); el resto de endpoints sigue pendiente.
- Biblioteca: los **álbumes** se listan en Home desde `/api/album/todos`; al pulsar uno se abre su lista de reproducción con `GET /api/pista/todos/album/{AlbumId}` y se reproduce con `GET /api/pista/{id}` (Web/Desktop/Mobile). Artistas, pistas globales y búsqueda siguen pendientes.
- Listas de reproducción y favoritos.
- Cola de reproducción y sincronización de estado entre dispositivos.
- Reproducción de audio (motor de reproducción, streaming HTTP, seek).
- Estados de carga, vacíos y de error en la UI.
- Routing/navegación multi-pantalla.
- Pruebas automatizadas y CI.

Además, pendientes **específicas por plataforma**:

| Plataforma | Pendientes específicos |
|---|---|
| Desktop | System Tray y Close-to-Tray; motor de reproducción; integración con teclas multimedia de Windows; persistencia de ventana; identidad de producto (nombre/identificador aún de plantilla) |
| Mobile | `MediaSessionService`, `ExoPlayer`, `MediaController`, notificación multimedia; permisos y servicios en manifest (hoy solo permisos declarados sin servicio); navegación; ViewModels; iconos de lanzamiento (bloquean la compilación) |
| Web | Habilitar `strict` en TypeScript; routing; tokens de diseño efectivos |

> La lista de funcionalidades marcadas como `[x]` en el `README.md` raíz **no coincide** con el código real de los clientes de este repositorio. Tratar ese README como descripción de producto aspiracional, no como estado verificado. Este documento es la fuente de verdad del estado real.

## Restricciones de producto

- **Calidad original:** se reproduce el archivo original; no se transcodifica salvo que el formato no sea soportado por el dispositivo y el backend ofrezca una alternativa.
- **Sin acceso directo a BD** desde los clientes.
- **Una identidad visual, tres implementaciones:** misma paleta, tipografía, iconografía y patrones; distribuciones adaptadas a cada dispositivo (ver [design-system.md](design-system.md) y [ui-consistency.md](ui-consistency.md)).
- **Funcionalidad paritaria:** una función disponible en una plataforma debe estarlo en las tres, salvo excepción documentada (ver [ui-consistency.md](ui-consistency.md#reglas-de-paridad-funcional)).

## Documentación relacionada

- Arquitectura general: [global-architecture.md](global-architecture.md)
- Principios: [architecture-principles.md](architecture-principles.md)
- Instrucciones de implementación: [implementation-instructions.md](implementation-instructions.md)
- Desktop: [`apps/desktop/docs/README.md`](../apps/desktop/docs/README.md)
- Mobile: [`apps/mobile/docs/README.md`](../apps/mobile/docs/README.md)
