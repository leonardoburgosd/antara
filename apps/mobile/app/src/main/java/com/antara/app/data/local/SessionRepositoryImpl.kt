package com.antara.app.data.local

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import com.antara.app.domain.model.SessionState
import com.antara.app.domain.model.UserSession
import com.antara.app.domain.repository.SessionRepository
import java.io.IOException
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.emitAll
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map

/**
 * Sesión persistida en DataStore, incluido el token emitido por el backend.
 *
 * Deuda conocida: DataStore no cifra el token; migrar al almacén seguro cuando
 * se evalúe esa dependencia (`docs/security.md`).
 */
class SessionRepositoryImpl(
    private val context: Context,
) : SessionRepository {

    override val rememberedEmail: Flow<String?> = context.antaraDataStore.data
        .catch { error ->
            if (error is IOException) emit(emptyPreferences()) else throw error
        }
        .map { preferences ->
            preferences[PreferencesKeys.REMEMBERED_EMAIL]?.takeIf { it.isNotBlank() }
        }

    override val session: Flow<SessionState> = flow {
        emit(SessionState.Loading)
        emitAll(
            context.antaraDataStore.data
                .catch { error ->
                    if (error is IOException) emit(emptyPreferences()) else throw error
                }
                .map { preferences ->
                    val authenticated = preferences[PreferencesKeys.AUTHENTICATED] == true
                    if (!authenticated) {
                        SessionState.SignedOut
                    } else {
                        SessionState.SignedIn(
                            UserSession(
                                name = preferences[PreferencesKeys.USER_NAME]?.takeIf { it.isNotBlank() }
                                    ?: "Melómano",
                                email = preferences[PreferencesKeys.USER_EMAIL].orEmpty(),
                                token = preferences[PreferencesKeys.USER_TOKEN]?.takeIf { it.isNotBlank() },
                            ),
                        )
                    }
                },
        )
    }

    override suspend fun signIn(name: String, email: String, token: String) {
        context.antaraDataStore.edit { preferences ->
            preferences[PreferencesKeys.AUTHENTICATED] = true
            preferences[PreferencesKeys.USER_NAME] = name
            preferences[PreferencesKeys.USER_EMAIL] = email
            preferences[PreferencesKeys.USER_TOKEN] = token
        }
    }

    override suspend fun signOut() {
        context.antaraDataStore.edit { preferences ->
            preferences.remove(PreferencesKeys.AUTHENTICATED)
            preferences.remove(PreferencesKeys.USER_NAME)
            preferences.remove(PreferencesKeys.USER_EMAIL)
            preferences.remove(PreferencesKeys.USER_TOKEN)
        }
    }

    override suspend fun rememberEmail(email: String?) {
        context.antaraDataStore.edit { preferences ->
            if (email.isNullOrBlank()) {
                preferences.remove(PreferencesKeys.REMEMBERED_EMAIL)
            } else {
                preferences[PreferencesKeys.REMEMBERED_EMAIL] = email.trim()
            }
        }
    }
}
