package com.antara.app.data.remote

import com.antara.app.core.network.ApiClient
import com.antara.app.core.network.Endpoints
import com.antara.app.data.remote.dto.AlbumDto
import com.antara.app.data.remote.dto.PistaDto

/**
 * Consumidor de los endpoints de álbumes.
 * La URL base llega desde el servidor activo configurado por el usuario; aquí
 * solo se añade la ruta del catálogo [Endpoints].
 */
class AlbumApi {

    /**
     * `GET /api/album/todos`. Requiere un token con rol admin; el backend
     * responde 403 si la cuenta no lo tiene (se traduce a `ApiError.Forbidden`).
     */
    suspend fun todos(baseUrl: String, token: String): List<AlbumDto> {
        val array = ApiClient.getJsonArray(
            baseUrl = baseUrl,
            path = Endpoints.ALBUMS,
            token = token,
        )

        return (0 until array.length()).mapNotNull { index ->
            array.optJSONObject(index)?.let(AlbumDto::fromJson)
        }
    }

    /**
     * `GET /api/pista/todos/album/{AlbumId}`. Endpoint público: no requiere token.
     * Devuelve las pistas del álbum, incluida la de pertenencia (`albumId`).
     */
    suspend fun pistas(baseUrl: String, albumId: String): List<PistaDto> {
        val array = ApiClient.getJsonArray(
            baseUrl = baseUrl,
            path = Endpoints.albumTracks(albumId),
        )

        return (0 until array.length()).mapNotNull { index ->
            array.optJSONObject(index)?.let(PistaDto::fromJson)
        }
    }
}
