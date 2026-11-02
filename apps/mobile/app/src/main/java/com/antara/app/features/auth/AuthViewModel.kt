package com.antara.app.features.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.antara.app.R
import com.antara.app.domain.repository.SessionRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * ViewModel del inicio de sesión.
 *
 * Mientras no exista backend, la autenticación es local (mock): valida el formulario
 * y guarda la sesión en DataStore. El contrato real se conectará en esta capa.
 */
class AuthViewModel(
    private val sessionRepository: SessionRepository,
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
            try {
                // Simula la llamada de red del contrato de autenticación.
                delay(600)
                val email = state.email.trim()
                sessionRepository.signIn(name = displayNameFromEmail(email), email = email)
            } catch (_: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        generalErrorRes = R.string.auth_error_generic,
                    )
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

    companion object {
        private const val MIN_PASSWORD_LENGTH = 6
        private val EMAIL_REGEX = Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")

        fun factory(repository: SessionRepository) = viewModelFactory {
            initializer { AuthViewModel(repository) }
        }
    }
}
