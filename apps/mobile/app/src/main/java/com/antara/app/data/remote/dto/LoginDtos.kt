package com.antara.app.data.remote.dto

import org.json.JSONObject

/** Cuerpo de `POST /api/usuario/login` (LoginUsuarioDto del backend). */
data class LoginRequestDto(
    val email: String,
    val password: String,
) {
    fun toJson(): JSONObject = JSONObject().apply {
        put("email", email)
        put("password", password)
    }
}

/**
 * Respuesta de `POST /api/usuario/login`: datos del usuario + `token`.
 * El backend solo garantiza `token` en minúsculas; el resto llega en camelCase.
 */
data class LoginResponseDto(
    val id: String,
    val email: String,
    val nombre: String,
    val tipo: String,
    val token: String,
) {
    companion object {
        fun fromJson(json: JSONObject): LoginResponseDto? {
            val token = json.optString("token")
            if (token.isBlank()) return null

            return LoginResponseDto(
                id = json.optString("id"),
                email = json.optString("email"),
                nombre = json.optString("nombre"),
                tipo = json.optString("tipo").ifBlank { "usuario" },
                token = token,
            )
        }
    }
}
