package com.antara.app.data.remote

import com.antara.app.core.network.ApiClient
import com.antara.app.core.network.ApiError
import com.antara.app.core.network.Endpoints
import com.antara.app.data.remote.dto.LoginRequestDto
import com.antara.app.data.remote.dto.LoginResponseDto

/**
 * Consumidor de los endpoints de usuario.
 * La URL base llega desde el servidor activo configurado por el usuario; aquí
 * solo se añade la ruta del catálogo [Endpoints].
 */
class AuthApi {

    /** `POST /api/usuario/login`. Lanza [ApiError] si falla. */
    suspend fun login(
        baseUrl: String,
        email: String,
        password: String,
    ): LoginResponseDto {
        val json = ApiClient.postJson(
            baseUrl = baseUrl,
            path = Endpoints.LOGIN,
            body = LoginRequestDto(email = email, password = password).toJson(),
        )
        return LoginResponseDto.fromJson(json) ?: throw ApiError.Parsing
    }
}
