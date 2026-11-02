package com.antara.app.data.local

import android.content.Context
import android.net.Uri
import android.provider.OpenableColumns
import androidx.datastore.preferences.core.edit
import com.antara.app.domain.model.LocalAudio
import com.antara.app.domain.repository.LocalAudioRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn

/**
 * Guarda los URIs de audio elegidos con el selector del sistema (SAF) en DataStore.
 * El nombre visible se resuelve con `OpenableColumns.DISPLAY_NAME`.
 */
class LocalAudioRepositoryImpl(context: Context) : LocalAudioRepository {

    private val applicationContext = context.applicationContext
    private val resolver = applicationContext.contentResolver
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override val files: StateFlow<List<LocalAudio>> = applicationContext.antaraDataStore.data
        .map { preferences -> decode(preferences[PreferencesKeys.LOCAL_AUDIO]) }
        .stateIn(scope, SharingStarted.Eagerly, emptyList())

    override suspend fun add(uris: List<String>) {
        if (uris.isEmpty()) return

        val current = files.value
        val known = current.mapTo(mutableSetOf()) { it.uri }
        val added = uris.filterNot(known::contains).map { uri ->
            LocalAudio(uri = uri, title = displayName(uri))
        }
        if (added.isEmpty()) return

        applicationContext.antaraDataStore.edit { preferences ->
            preferences[PreferencesKeys.LOCAL_AUDIO] = encode(current + added)
        }
    }

    override suspend fun remove(uri: String) {
        val remaining = files.value.filterNot { it.uri == uri }
        applicationContext.antaraDataStore.edit { preferences ->
            preferences[PreferencesKeys.LOCAL_AUDIO] = encode(remaining)
        }
    }

    private fun displayName(uri: String): String {
        val parsed = Uri.parse(uri)
        val name = runCatching {
            resolver.query(parsed, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null)?.use { cursor ->
                if (cursor.moveToFirst()) cursor.getString(0) else null
            }
        }.getOrNull()

        return name?.substringBeforeLast('.')?.takeIf { it.isNotBlank() }
            ?: parsed.lastPathSegment?.substringAfterLast('/')?.takeIf { it.isNotBlank() }
            ?: FALLBACK_TITLE
    }

    private fun encode(items: List<LocalAudio>): String =
        items.joinToString(separator = "\n") { "${it.uri}\t${it.title}" }

    private fun decode(raw: String?): List<LocalAudio> = raw.orEmpty()
        .lineSequence()
        .filter { it.isNotBlank() }
        .mapNotNull { line ->
            val separator = line.indexOf('\t')
            if (separator <= 0) {
                null
            } else {
                LocalAudio(uri = line.substring(0, separator), title = line.substring(separator + 1))
            }
        }
        .toList()

    private companion object {
        const val FALLBACK_TITLE = "Audio local"
    }
}
