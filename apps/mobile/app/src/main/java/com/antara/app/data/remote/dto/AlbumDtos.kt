package com.antara.app.data.remote.dto

import org.json.JSONObject

/**
 * Elemento de `GET /api/album/todos` (AlbumDto del backend).
 * Solo se modelan los campos que consume la UI de Home.
 */
data class AlbumDto(
    val id: String,
    val nombre: String,
    val descripcion: String?,
    val artista: String?,
    val portadaUrl: String?,
    /** Fecha ISO-8601 del backend; de ahí sale el año que muestra el detalle. */
    val fechaPublicacion: String?,
    val estaPublicado: Boolean,
    val estaActivo: Boolean,
) {
    companion object {
        fun fromJson(json: JSONObject): AlbumDto? {
            val id = json.optionalText("id") ?: return null
            val nombre = json.optionalText("nombre") ?: return null

            return AlbumDto(
                id = id,
                nombre = nombre,
                descripcion = json.optionalText("descripcion"),
                artista = json.optionalText("artista"),
                portadaUrl = json.optionalText("portadaUrl"),
                fechaPublicacion = json.optionalText("fechaPublicacion"),
                estaPublicado = json.optBoolean("estaPublicado", false),
                estaActivo = json.optBoolean("estaActivo", true),
            )
        }
    }
}

/** `optString` devuelve `"null"` cuando el JSON trae null; se normaliza a `null`. */
private fun JSONObject.optionalText(key: String): String? {
    if (isNull(key)) return null
    return optString(key).takeIf { it.isNotBlank() }
}
