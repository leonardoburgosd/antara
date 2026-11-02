package com.antara.app.domain.model

/** Sesión autenticada del usuario. El token real vivirá en el almacén seguro cuando exista backend. */
data class UserSession(
    val name: String,
    val email: String,
    val token: String? = null,
)

/** Estado observable de la sesión (incluye el arranque para no mostrar login antes de leer preferencias). */
sealed interface SessionState {
    data object Loading : SessionState
    data object SignedOut : SessionState
    data class SignedIn(val session: UserSession) : SessionState
}
