package com.antara.app.data.local

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import com.antara.app.domain.model.SavedServers
import com.antara.app.domain.model.ServerConfig
import com.antara.app.domain.repository.ServerRepository
import java.io.IOException
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map

/**
 * Persistencia local de servidores en DataStore.
 * El formato es una lista de direcciones normalizadas separadas por saltos de línea.
 */
class ServerRepositoryImpl(
    private val context: Context,
) : ServerRepository {

    override val servers: Flow<SavedServers> = context.antaraDataStore.data
        .catch { error ->
            if (error is IOException) emit(emptyPreferences()) else throw error
        }
        .map { preferences ->
            val list = preferences[PreferencesKeys.SERVERS]
                .orEmpty()
                .lineSequence()
                .map(String::trim)
                .filter(String::isNotEmpty)
                .distinct()
                .toList()
            val activeAddress = preferences[PreferencesKeys.ACTIVE_SERVER]
                ?.takeIf { it.isNotBlank() && it in list }
            SavedServers(
                servers = list.map { address ->
                    ServerConfig(address = address, isActive = address == activeAddress)
                },
                active = activeAddress?.let { ServerConfig(address = it, isActive = true) },
            )
        }

    override suspend fun add(address: String): Result<Unit> = runCatching {
        context.antaraDataStore.edit { preferences ->
            val list = parse(preferences[PreferencesKeys.SERVERS])
            val updated = if (list.any { it.equals(address, ignoreCase = true) }) list else list + address
            preferences[PreferencesKeys.SERVERS] = updated.joinToString(separator = "\n")
            if (preferences[PreferencesKeys.ACTIVE_SERVER].isNullOrBlank()) {
                preferences[PreferencesKeys.ACTIVE_SERVER] = address
            }
        }
    }

    override suspend fun remove(address: String) {
        context.antaraDataStore.edit { preferences ->
            val list = parse(preferences[PreferencesKeys.SERVERS])
            val updated = list.filterNot { it.equals(address, ignoreCase = true) }
            preferences[PreferencesKeys.SERVERS] = updated.joinToString(separator = "\n")

            val active = preferences[PreferencesKeys.ACTIVE_SERVER]
            if (active.equals(address, ignoreCase = true)) {
                if (updated.isEmpty()) {
                    preferences.remove(PreferencesKeys.ACTIVE_SERVER)
                } else {
                    preferences[PreferencesKeys.ACTIVE_SERVER] = updated.first()
                }
            }
        }
    }

    override suspend fun setActive(address: String) {
        context.antaraDataStore.edit { preferences ->
            val list = parse(preferences[PreferencesKeys.SERVERS])
            if (list.any { it.equals(address, ignoreCase = true) }) {
                preferences[PreferencesKeys.ACTIVE_SERVER] = address
            }
        }
    }

    private fun parse(raw: String?): List<String> = raw
        .orEmpty()
        .lineSequence()
        .map(String::trim)
        .filter(String::isNotEmpty)
        .distinct()
        .toList()
}
