package com.antara.app.features.player

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.antara.app.R
import com.antara.app.core.network.ApiError
import com.antara.app.data.remote.LyricsApi
import com.antara.app.domain.model.SessionState
import com.antara.app.domain.repository.ServerRepository
import com.antara.app.domain.repository.SessionRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

/**
 * Carga la letra sincronizada de la pista que se está reproduciendo.
 *
 * La consulta solo se lanza cuando la vista de letra está visible: `AppRoot`
 * llama a [load] únicamente con el reproductor abierto y limpia el estado al
 * cerrarlo, de modo que el endpoint no se consume en segundo plano.
 */
class LyricsViewModel(
    private val lyricsApi: LyricsApi,
    private val sessionRepository: SessionRepository,
    private val serverRepository: ServerRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(LyricsUiState())
    val uiState: StateFlow<LyricsUiState> = _uiState.asStateFlow()

    private var job: Job? = null

    /** Carga la letra de [trackId]; no repite la consulta si ya está resuelta. */
    fun load(trackId: String) {
        val current = _uiState.value
        if (current.trackId == trackId &&
            (current.isLoading || current.hasLyrics || current.notAvailable)
        ) {
            return
        }

        job?.cancel()
        _uiState.value = LyricsUiState(trackId = trackId, isLoading = true)

        job = viewModelScope.launch {
            // Igual que el resto de ViewModels: espera al primer estado estable.
            val session = sessionRepository.session.first { it !is SessionState.Loading }
            val token = (session as? SessionState.SignedIn)?.session?.token
            val server = serverRepository.servers.first().active

            if (token.isNullOrBlank()) {
                fail(trackId, R.string.home_albums_session)
                return@launch
            }
            if (server == null) {
                fail(trackId, R.string.home_albums_no_server)
                return@launch
            }

            try {
                val lrc = lyricsApi.synchronized(server.address, token, trackId)
                if (_uiState.value.trackId != trackId) return@launch

                val lines = lrc?.let(LrcParser::parse).orEmpty()
                _uiState.value = LyricsUiState(
                    trackId = trackId,
                    lines = lines,
                    notAvailable = lines.isEmpty(),
                )
            } catch (error: ApiError) {
                fail(trackId, error.toMessageRes())
            } catch (_: Exception) {
                fail(trackId, R.string.player_lyrics_error)
            }
        }
    }

    /** Limpia el estado cuando el reproductor ya no está visible. */
    fun clear() {
        job?.cancel()
        job = null
        _uiState.value = LyricsUiState()
    }

    /** Limpia el estado al cerrar sesión. */
    fun reset() = clear()

    private fun fail(trackId: String, messageRes: Int) {
        if (_uiState.value.trackId != trackId) return
        _uiState.value = LyricsUiState(trackId = trackId, errorRes = messageRes)
    }

    private fun ApiError.toMessageRes(): Int = when (this) {
        ApiError.Network -> R.string.player_lyrics_network
        ApiError.Unauthorized -> R.string.home_albums_session
        ApiError.Forbidden -> R.string.home_albums_forbidden
        else -> R.string.player_lyrics_error
    }

    companion object {
        fun factory(
            lyricsApi: LyricsApi,
            sessionRepository: SessionRepository,
            serverRepository: ServerRepository,
        ) = viewModelFactory {
            initializer { LyricsViewModel(lyricsApi, sessionRepository, serverRepository) }
        }
    }
}
