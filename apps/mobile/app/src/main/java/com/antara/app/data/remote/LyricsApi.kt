package com.antara.app.data.remote

import com.antara.app.core.network.ApiClient
import com.antara.app.core.network.ApiError
import com.antara.app.core.network.Endpoints

/**
 * Consumidor de `GET /api/pista/{id}/letra-sincronizada`.
 *
 * El backend responde `{ "letraSincronizada": "<LRC>" }` y usa 404 cuando la
 * canción no tiene una versión sincronizada. En ese caso se devuelve `null`
 * para que la UI muestre el estado vacío, no un error.
 */
class LyricsApi {

    suspend fun synchronized(baseUrl: String, token: String, trackId: String): String? {
        val json = try {
            ApiClient.getJsonObject(
                baseUrl = baseUrl,
                path = Endpoints.synchronizedLyrics(trackId),
                token = token,
            )
        } catch (error: ApiError) {
            if (error == ApiError.NotFound) return null
            throw error
        }

        return json.optString("letraSincronizada").takeIf { it.isNotBlank() }
    }
}
