package com.antara.app.core.network

import java.net.URLEncoder

/**
 * Catálogo central de rutas del backend.
 *
 * Regla de integración (ADR-016): aquí solo viven rutas relativas. La URL base
 * la configura el usuario en la pantalla de servidores y [ApiClient] compone
 * `baseUrl + path` en cada consulta. Nunca se escribe un host en estas rutas.
 */
object Endpoints {

    /** `POST { email, password }` → usuario + token (`UsuarioController.LoginAsync`). */
    const val LOGIN = "/api/usuario/login"

    /** `GET` → lista de álbumes; exige Bearer con rol admin (`AlbumController.ObtenerTodosAlbumesAsync`). */
    const val ALBUMS = "/api/album/todos"

    /** `GET` → pistas del álbum (`PistaController.ObtenerTodosPistasDeAlbumAsync`). */
    fun albumTracks(albumId: String): String =
        "/api/pista/todos/album/" + URLEncoder.encode(albumId, Charsets.UTF_8.name())

    /**
     * `GET` → contenido de audio de la pista (`PistaController.ObtenerPistaAsync`).
     * Sirve el archivo con `Accept-Ranges`, así que ExoPlayer puede hacer seek.
     */
    fun trackStream(trackId: String): String =
        "/api/pista/" + URLEncoder.encode(trackId, Charsets.UTF_8.name())

    /** `GET` → playlists con pistas y artistas; exige Bearer admin (`PlaylistController.ObtenerTodasAsync`). */
    const val PLAYLISTS = "/api/playlist/todos"

    /** `GET` → canciones de la playlist (`PistaController.ObtenerTodosPistasDePlaylistAsync`). */
    fun playlistTracks(playlistId: String): String =
        "/api/pista/todos/playlist/" + URLEncoder.encode(playlistId, Charsets.UTF_8.name())
}
