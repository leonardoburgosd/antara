package com.antara.app.features.playlist

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.antara.app.R
import com.antara.app.core.network.ApiClient
import com.antara.app.core.network.ApiError
import com.antara.app.core.network.Endpoints
import com.antara.app.data.remote.PlaylistApi
import com.antara.app.domain.repository.ServerRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

/**
 * ViewModel del detalle de una playlist.
 *
 * Carga las canciones con `GET /api/pista/todos/playlist/{PlaylistId}` y arma la
 * fuente de audio de cada una con `GET /api/pista/{id}`. A diferencia de un
 * álbum, la lista mezcla artistas: se conserva el intérprete de cada pista.
 */
class PlaylistDetailViewModel(
    private val playlistApi: PlaylistApi,
    private val serverRepository: ServerRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(PlaylistDetailUiState())
    val uiState: StateFlow<PlaylistDetailUiState> = _uiState.asStateFlow()

    private var playlistId: String? = null

    /** Carga las canciones; no repite la consulta si ya están cargadas. */
    fun load(playlistId: String) {
        if (this.playlistId == playlistId && (_uiState.value.loaded || _uiState.value.isLoading)) return

        this.playlistId = playlistId
        fetch(playlistId)
    }

    fun retry() {
        val current = playlistId ?: return
        fetch(current)
    }

    /** Limpia el estado al cerrar sesión para no reutilizar canciones de otra cuenta. */
    fun reset() {
        playlistId = null
        _uiState.value = PlaylistDetailUiState()
    }

    private fun fetch(id: String) {
        _uiState.value = PlaylistDetailUiState(isLoading = true)

        viewModelScope.launch {
            val server = serverRepository.servers.first().active
            if (server == null) {
                if (id == playlistId) fail(R.string.home_albums_no_server)
                return@launch
            }

            try {
                val pistas = playlistApi.pistas(baseUrl = server.address, playlistId = id)
                if (id != playlistId) return@launch

                // Solo el contenido que pertenece a un álbum es reproducible.
                val tracks = pistas
                    .filter { it.albumId.isNotBlank() }
                    .map { pista ->
                        PlaylistTrackUiModel(
                            id = pista.id,
                            title = pista.nombre.ifBlank { pista.id },
                            artist = pista.interprete.orEmpty(),
                            durationSeconds = pista.duracionSegundos,
                            uri = ApiClient.buildUrl(server.address, Endpoints.trackStream(pista.id)),
                        )
                    }

                _uiState.value = PlaylistDetailUiState(tracks = tracks, loaded = true)
            } catch (error: ApiError) {
                if (id == playlistId) fail(error.toMessageRes())
            } catch (_: Exception) {
                if (id == playlistId) fail(R.string.playlist_tracks_error)
            }
        }
    }

    private fun fail(messageRes: Int) {
        _uiState.value = _uiState.value.copy(isLoading = false, errorRes = messageRes)
    }

    private fun ApiError.toMessageRes(): Int = when (this) {
        ApiError.Network -> R.string.playlist_tracks_network
        ApiError.Unauthorized -> R.string.home_albums_session
        ApiError.Forbidden -> R.string.home_albums_forbidden
        else -> R.string.playlist_tracks_error
    }

    companion object {
        fun factory(
            playlistApi: PlaylistApi,
            serverRepository: ServerRepository,
        ) = viewModelFactory {
            initializer { PlaylistDetailViewModel(playlistApi, serverRepository) }
        }
    }
}
