package com.antara.app.features.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.antara.app.R
import com.antara.app.core.network.ApiError
import com.antara.app.data.remote.AuthApi
import com.antara.app.domain.repository.ServerRepository
import com.antara.app.domain.repository.SessionRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * ViewModel del inicio de sesión.
 *
 * Consulta `POST /api/usuario/login` contra el servidor activo configurado por
 * el usuario (ADR-016) y persiste la sesión con el token devuelto.
 */
class AuthViewModel(
    private val sessionRepository: SessionRepository,
    private val serverRepository: ServerRepository,
    private val authApi: AuthApi,
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    fun onEmailChange(value: String) {
        _uiState.update { it.copy(email = value, emailErrorRes = null) }
    }

    fun onPasswordChange(value: String) {
        _uiState.update { it.copy(password = value, passwordErrorRes = null) }
    }

    fun togglePasswordVisibility() {
        _uiState.update { it.copy(passwordVisible = !it.passwordVisible) }
    }

    fun submit() {
        val state = _uiState.value
        if (state.isLoading) return

        val emailError = when {
            state.email.isBlank() -> R.string.auth_error_email_empty
            !EMAIL_REGEX.matches(state.email.trim()) -> R.string.auth_error_email_invalid
            else -> null
        }
        val passwordError = when {
            state.password.isBlank() -> R.string.auth_error_password_empty
            state.password.length < MIN_PASSWORD_LENGTH -> R.string.auth_error_password_short
            else -> null
        }

        if (emailError != null || passwordError != null) {
            _uiState.update {
                it.copy(
                    emailErrorRes = emailError,
                    passwordErrorRes = passwordError,
                    generalErrorRes = null,
                )
            }
            return
        }

        _uiState.update { it.copy(isLoading = true, generalErrorRes = null) }
        viewModelScope.launch {
            val server = serverRepository.servers.first().active
            if (server == null) {
                _uiState.update {
                    it.copy(isLoading = false, generalErrorRes = R.string.auth_error_no_server)
                }
                return@launch
            }

            try {
                val response = authApi.login(
                    baseUrl = server.address,
                    email = state.email.trim(),
                    password = state.password,
                )
                sessionRepository.signIn(
                    name = response.nombre.ifBlank { displayNameFromEmail(response.email) },
                    email = response.email.ifBlank { state.email.trim() },
                    token = response.token,
                )
            } catch (error: ApiError) {
                _uiState.update {
                    it.copy(isLoading = false, generalErrorRes = error.toMessageRes())
                }
            } catch (_: Exception) {
                _uiState.update {
                    it.copy(isLoading = false, generalErrorRes = R.string.auth_error_generic)
                }
            }
        }
    }

    private fun displayNameFromEmail(email: String): String =
        email.substringBefore('@')
            .replace('.', ' ')
            .replace('_', ' ')
            .replace('-', ' ')
            .trim()
            .split(' ')
            .filter(String::isNotBlank)
            .joinToString(" ") { word ->
                word.replaceFirstChar { char -> if (char.isLowerCase()) char.titlecase() else char.toString() }
            }
            .ifBlank { "Melómano" }

    private fun ApiError.toMessageRes(): Int = when (this) {
        ApiError.NotFound,
        ApiError.Unauthorized,
        ApiError.Validation,
        -> R.string.auth_error_invalid_credentials

        ApiError.Unavailable -> R.string.auth_error_no_admin
        ApiError.Network -> R.string.auth_error_network
        ApiError.Server,
        ApiError.Parsing,
        -> R.string.auth_error_server
    }

    companion object {
        private const val MIN_PASSWORD_LENGTH = 6
        private val EMAIL_REGEX = Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")

        fun factory(
            sessionRepository: SessionRepository,
            serverRepository: ServerRepository,
            authApi: AuthApi,
        ) = viewModelFactory {
            initializer { AuthViewModel(sessionRepository, serverRepository, authApi) }
        }
    }
}
