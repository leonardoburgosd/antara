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
    /** Duración legible que ya formatea el backend ("3:48", "1:02:05"). */
    val duracion: String?,
) {
    /** Etiqueta para la fila: usa `duracion` del backend o deriva de los segundos. */
    val durationLabel: String
        get() = duracion?.takeIf { it.isNotBlank() } ?: formatDurationSeconds(duracionSegundos)

    companion object {
        fun fromJson(json: JSONObject): PistaDto? {
            val id = json.optionalText("id") ?: return null

            return PistaDto(
                id = id,
                nombre = json.optionalText("nombre").orEmpty(),
                interprete = json.optionalText("interprete"),
                albumId = json.optionalText("albumId").orEmpty(),
                duracionSegundos = json.optInt("duracionSegundos", 0),
                duracion = json.optionalText("duracion"),
            )
        }
    }
}

/** `optString` devuelve `"null"` cuando el JSON trae null; se normaliza a `null`. */
private fun JSONObject.optionalText(key: String): String? {
    if (isNull(key)) return null
    return optString(key).takeIf { it.isNotBlank() }
}

/** Formato de respaldo cuando el backend no envía `duracion` (mismo criterio del reproductor). */
private fun formatDurationSeconds(seconds: Int): String {
    if (seconds <= 0) return ""

    val hours = seconds / 3600
    val minutes = (seconds % 3600) / 60
    val rest = seconds % 60

    return if (hours > 0) {
        "%d:%02d:%02d".format(hours, minutes, rest)
    } else {
        "%d:%02d".format(minutes, rest)
    }
}
