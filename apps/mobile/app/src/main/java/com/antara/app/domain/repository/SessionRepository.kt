package com.antara.app.domain.repository

import com.antara.app.domain.model.SessionState
import kotlinx.coroutines.flow.Flow

/** Contrato de sesión (token emitido por `POST /api/usuario/login`). */
interface SessionRepository {
    val session: Flow<SessionState>

    /** Email que el usuario pidió recordar para rellenar el formulario al cerrar sesión. */
    val rememberedEmail: Flow<String?>

    suspend fun signIn(name: String, email: String, token: String)

    suspend fun signOut()

    /** Guarda el email recordado o lo borra con `null`. La contraseña nunca se guarda. */
    suspend fun rememberEmail(email: String?)
}
