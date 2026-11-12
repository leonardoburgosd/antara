package com.antara.app.core.network

import java.net.URLEncoder

/**
 * Catálogo central de rutas del backend.
 *
 * Regla de integración (ADR-016): aquí solo viven rutas relativas. La URL base
 * la configura el usuario en la pantalla de servidores y [ApiClient] compone
 * `baseUrl + path` en cada consulta. Nunca se escribe un host en estas rutas.
 *
 * Fuente: `docs/api.md` del repositorio `antara.backend`. Los controladores son
 * la referencia definitiva: cuando aparezca un endpoint nuevo, se añade aquí
 * antes de usarlo desde un repositorio o ViewModel.
 */
object Endpoints {

    private fun encode(value: String): String = URLEncoder.encode(value, Charsets.UTF_8.name())

    // Sistema (`SistemaController`)

    /** `GET` → estado del servicio, sin token (healthcheck de Docker). */
    const val HEALTH = "/api/sistema/health"

    /** `GET` → unidades del host visibles para la API; Bearer admin. */
    const val HOST_UNITS = "/api/sistema/unidades-host"

    /** `GET` → indica si ya existe un administrador registrado. */
    const val FIRST_ADMIN_STATUS = "/api/sistema/crear-primer-admin"

    /** `POST` → crea el primer admin si no hay ninguno. */
    const val CREATE_FIRST_ADMIN = "/api/sistema/crea-primero-admin"

    // Autenticación y usuarios (`UsuarioController`)

    /** `POST { email, password }` → usuario + token. */
    const val LOGIN = "/api/usuario/login"

    /** `GET` → lista de usuarios; admin. */
    const val USERS = "/api/usuario/todos"

    /** `POST` → crea un usuario; admin. */
    const val CREATE_USER = "/api/usuario"

    /** `PUT` → actualiza un usuario; admin. */
    fun updateUser(userId: String): String = "/api/usuario/" + encode(userId)

    /** `DELETE` → elimina un usuario; admin. */
    fun deleteUser(userId: String): String = "/api/usuario/" + encode(userId)

    /** `GET` → datos del usuario autenticado. */
    const val PROFILE = "/api/usuario/perfil"

    /** `PUT` → actualiza el perfil propio. */
    const val UPDATE_PROFILE = "/api/usuario/perfil"

    /** `POST` → cambia la contraseña propia. */
    const val CHANGE_PASSWORD = "/api/usuario/perfil/password"

    // Álbumes (`AlbumController`)

    /** `GET` → lista de álbumes; exige Bearer admin. */
    const val ALBUMS = "/api/album/todos"

    /** `GET` → álbumes de un usuario (sin token). */
    fun albumsByUser(userId: String): String = "/api/album/todos/" + encode(userId)

    /** `GET` → un álbum por id (sin token). */
    fun album(albumId: String): String = "/api/album/" + encode(albumId)

    /** `POST` → crea un álbum; admin. */
    const val CREATE_ALBUM = "/api/album"

    /** `PUT` → edita un álbum; admin. */
    fun updateAlbum(albumId: String): String = "/api/album/" + encode(albumId)

    /** `PUT` → alterna publicado/borrador; admin. */
    fun publishAlbum(albumId: String): String = "/api/album/" + encode(albumId) + "/publicar"

    /** `DELETE` → elimina un álbum; admin. */
    fun deleteAlbum(albumId: String): String = "/api/album/" + encode(albumId)

    // Pistas (`PistaController`)

    /** `GET` → biblioteca de pistas; admin. */
    const val TRACKS = "/api/pista/todos"

    /** `GET` → pistas del álbum. */
    fun albumTracks(albumId: String): String = "/api/pista/todos/album/" + encode(albumId)

    /** `GET` → canciones de la playlist. */
    fun playlistTracks(playlistId: String): String =
        "/api/pista/todos/playlist/" + encode(playlistId)

    /**
     * `GET` → contenido de audio de la pista (`PistaController.ObtenerPistaAsync`).
     * Sirve el archivo con `Accept-Ranges`, así que ExoPlayer puede hacer seek.
     */
    fun trackStream(trackId: String): String = "/api/pista/" + encode(trackId)

    /** `PUT` → suma una reproducción a la pista. */
    fun registerPlay(trackId: String): String = "/reproducir/" + encode(trackId)

    /** `GET` → rutas de audio activas para elegir destino de subida; admin. */
    const val UPLOAD_ROUTES = "/api/pista/subir/rutas"

    /** `POST` multipart → sube un audio; admin. */
    const val UPLOAD_TRACK = "/api/pista/subir"

    /** `POST { rutaId?, subcarpeta?, url }` → descarga audio de YouTube; admin. */
    const val UPLOAD_FROM_URL = "/api/pista/subir/url"

    /** `GET` → proveedores de metadatos habilitados; admin. */
    const val METADATA_PROVIDERS = "/api/pista/metadatos/proveedores"

    /** `GET ?cadena=&proveedor=` → coincidencias de metadatos; admin. */
    fun metadataSearch(cadena: String, proveedor: String = "todos"): String =
        "/api/pista/metadatos/buscar?cadena=" + encode(cadena) + "&proveedor=" + encode(proveedor)

    /** `POST { idExterno, proveedor }` → aplica metadatos a la pista; admin. */
    fun trackMetadata(trackId: String): String =
        "/api/pista/" + encode(trackId) + "/metadatos"

    /**
     * `GET` → letra sincronizada (LRC) de la pista; responde 404 cuando la
     * canción no tiene una versión sincronizada.
     */
    fun synchronizedLyrics(trackId: String): String =
        "/api/pista/" + encode(trackId) + "/letra-sincronizada"

    // Playlists (`PlaylistController`)

    /** `GET` → playlists con pistas y artistas; exige Bearer admin. */
    const val PLAYLISTS = "/api/playlist/todos"

    /** `GET` → playlists de un usuario. */
    fun playlistsByUser(userId: String): String = "/api/playlist/todos/" + encode(userId)

    /** `GET` → una playlist por id. */
    fun playlist(playlistId: String): String = "/api/playlist/" + encode(playlistId)

    /**
     * `POST` multipart (`Nombre`, `Descripcion?`, `UsuarioId?`, `PortadaUrl?`,
     * `imagenDePortada?`) → crea la playlist y responde 201 con el DTO.
     * Lo puede usar cualquier usuario autenticado; solo un admin puede crearla
     * a nombre de otro `UsuarioId`.
     */
    const val CREATE_PLAYLIST = "/api/playlist"

    /** `PUT` multipart → edita nombre, descripción o portada. */
    fun updatePlaylist(playlistId: String): String = "/api/playlist/" + encode(playlistId)

    /** `DELETE` → elimina la playlist. */
    fun deletePlaylist(playlistId: String): String = "/api/playlist/" + encode(playlistId)

    /** `GET` → pistas de la playlist. */
    fun playlistItems(playlistId: String): String =
        "/api/playlist/" + encode(playlistId) + "/pistas"

    /** `POST { pistaId }` → agrega una pista a la playlist. */
    fun addPlaylistTrack(playlistId: String): String =
        "/api/playlist/" + encode(playlistId) + "/pistas"

    /** `DELETE` → quita la pista de la playlist. */
    fun removePlaylistTrack(playlistId: String, trackId: String): String =
        "/api/playlist/" + encode(playlistId) + "/pistas/" + encode(trackId)

    // Rutas de audio (`RutaAudioController`)

    /** `GET` → rutas de almacenamiento configuradas; admin. */
    const val AUDIO_ROUTES = "/api/rutas-audio"

    /** `POST` → crea una ruta de audio; admin. */
    const val CREATE_AUDIO_ROUTE = "/api/rutas-audio"

    /** `PUT` → actualiza una ruta; admin. */
    fun updateAudioRoute(routeId: String): String = "/api/rutas-audio/" + encode(routeId)

    /** `DELETE` → elimina una ruta; admin. */
    fun deleteAudioRoute(routeId: String): String = "/api/rutas-audio/" + encode(routeId)

    /** `GET` → comprueba que la ruta es accesible; admin. */
    fun testAudioRoute(routeId: String): String =
        "/api/rutas-audio/" + encode(routeId) + "/probar"

    // Dashboard y escaneo (`DashboardController`, `EscaneoAudioController`)

    /** `GET` → métricas del panel; admin. */
    const val DASHBOARD = "/api/dashboard"

    /** `POST` → inicia un escaneo de la biblioteca; admin. */
    const val START_SCAN = "/api/escaneo-audio"

    /** `GET` → estado del escaneo en curso; admin. */
    const val CURRENT_SCAN = "/api/escaneo-audio/actual"

    /** `GET` → estado de un escaneo por id; admin. */
    fun scan(scanId: String): String = "/api/escaneo-audio/" + encode(scanId)

    /** `DELETE` → cancela un escaneo; admin. */
    fun cancelScan(scanId: String): String = "/api/escaneo-audio/" + encode(scanId) + "/cancelar"
}
