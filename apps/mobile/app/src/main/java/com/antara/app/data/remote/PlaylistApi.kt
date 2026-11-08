package com.antara.app.data.remote

import com.antara.app.core.network.ApiClient
import com.antara.app.core.network.Endpoints
import com.antara.app.data.remote.dto.PistaDto
import com.antara.app.data.remote.dto.PlaylistDto

/**
 * Consumidor de los endpoints de playlists.
 *
 * - `GET /api/playlist/todos` (admin) → resúmenes de playlists.
 * - `GET /api/pista/todos/playlist/{PlaylistId}` (público) → sus canciones.
 */
class PlaylistApi {

    suspend fun todos(baseUrl: String, token: String): List<PlaylistDto> {
        val array = ApiClient.getJsonArray(
            baseUrl = baseUrl,
            path = Endpoints.PLAYLISTS,
            token = token,
        )

        return (0 until array.length()).mapNotNull { index ->
            array.optJSONObject(index)?.let(PlaylistDto::fromJson)
        }
    }

    suspend fun pistas(baseUrl: String, playlistId: String): List<PistaDto> {
        val array = ApiClient.getJsonArray(
            baseUrl = baseUrl,
            path = Endpoints.playlistTracks(playlistId),
        )

        return (0 until array.length()).mapNotNull { index ->
            array.optJSONObject(index)?.let(PistaDto::fromJson)
        }
    }
}
