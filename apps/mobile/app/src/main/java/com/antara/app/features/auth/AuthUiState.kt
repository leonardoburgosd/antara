package com.antara.app.features.auth

/** Estado de UI del formulario de autenticación (solo inicio de sesión). */
data class AuthUiState(
    val email: String = "",
    val password: String = "",
    val passwordVisible: Boolean = false,
    val isLoading: Boolean = false,
    val emailErrorRes: Int? = null,
    val passwordErrorRes: Int? = null,
    val generalErrorRes: Int? = null,
) {
    val canSubmit: Boolean get() = !isLoading
}
