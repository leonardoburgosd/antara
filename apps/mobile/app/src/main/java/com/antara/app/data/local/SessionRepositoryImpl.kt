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
 * Sesión persistida en DataStore.
 *
 * Nota: mientras no exista backend real, no se guarda token; solo el usuario demo.
 * Cuando exista contrato de autenticación, el token irá al almacén cifrado (architecture.md).
 */
class SessionRepositoryImpl(
    private val context: Context,
) : SessionRepository {

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
                            ),
                        )
                    }
                },
        )
    }

    override suspend fun signIn(name: String, email: String) {
        context.antaraDataStore.edit { preferences ->
            preferences[PreferencesKeys.AUTHENTICATED] = true
            preferences[PreferencesKeys.USER_NAME] = name
            preferences[PreferencesKeys.USER_EMAIL] = email
        }
    }

    override suspend fun signOut() {
        context.antaraDataStore.edit { preferences ->
            preferences.remove(PreferencesKeys.AUTHENTICATED)
            preferences.remove(PreferencesKeys.USER_NAME)
            preferences.remove(PreferencesKeys.USER_EMAIL)
        }
    }
}
