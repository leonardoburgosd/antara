package com.antara.app.domain.repository

import com.antara.app.domain.model.SessionState
import kotlinx.coroutines.flow.Flow

/** Contrato de sesión (token emitido por `POST /api/usuario/login`). */
interface SessionRepository {
    val session: Flow<SessionState>

    suspend fun signIn(name: String, email: String, token: String)

    suspend fun signOut()
}
