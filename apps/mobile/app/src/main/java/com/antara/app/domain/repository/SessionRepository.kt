package com.antara.app.domain.repository

import com.antara.app.domain.model.SessionState
import kotlinx.coroutines.flow.Flow

/** Contrato de sesión local (mock mientras no exista backend de autenticación). */
interface SessionRepository {
    val session: Flow<SessionState>

    suspend fun signIn(name: String, email: String)

    suspend fun signOut()
}
