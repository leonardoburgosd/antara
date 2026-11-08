package com.antara.app.data.remote.dto

import org.json.JSONObject

/**
 * Elemento de `GET /api/pista/todos/album/{AlbumId}` (PistaDto del backend).
 * Solo se modelan los campos que consume la reproducción: id, título,
 * intérprete, álbum de pertenencia y duración.
 */
data class PistaDto(
    val id: String,
    val nombre: String,
    val interprete: String?,
    val albumId: String,
    val duracionSegundos: Int,
) {
    companion object {
        fun fromJson(json: JSONObject): PistaDto? {
            val id = json.optionalText("id") ?: return null

            return PistaDto(
                id = id,
                nombre = json.optionalText("nombre").orEmpty(),
                interprete = json.optionalText("interprete"),
                albumId = json.optionalText("albumId").orEmpty(),
                duracionSegundos = json.optInt("duracionSegundos", 0),
            )
        }
    }
}

/** `optString` devuelve `"null"` cuando el JSON trae null; se normaliza a `null`. */
private fun JSONObject.optionalText(key: String): String? {
    if (isNull(key)) return null
    return optString(key).takeIf { it.isNotBlank() }
}
