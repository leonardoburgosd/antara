package com.antara.app.data.remote.dto

import org.json.JSONObject

/**
 * Elemento de `GET /api/playlist/todos` (PlaylistResumenDto del backend).
 *
 * Una playlist mezcla artistas: el backend ya calcula cuántas pistas y cuántos
 * artistas distintos reúne, junto con sus nombres.
 */
data class PlaylistDto(
    val id: String,
    val nombre: String,
    val descripcion: String?,
    val artistas: String?,
    val totalPistas: Int,
    val totalArtistas: Int,
) {
    companion object {
        fun fromJson(json: JSONObject): PlaylistDto? {
            val id = json.optionalText("id") ?: return null

            return PlaylistDto(
                id = id,
                nombre = json.optionalText("nombre").orEmpty(),
                descripcion = json.optionalText("descripcion"),
                artistas = json.optionalText("artistas"),
                totalPistas = json.optInt("totalPistas", 0),
                totalArtistas = json.optInt("totalArtistas", 0),
            )
        }
    }
}

/** `optString` devuelve `"null"` cuando el JSON trae null; se normaliza a `null`. */
private fun JSONObject.optionalText(key: String): String? {
    if (isNull(key)) return null
    return optString(key).takeIf { it.isNotBlank() }
}
