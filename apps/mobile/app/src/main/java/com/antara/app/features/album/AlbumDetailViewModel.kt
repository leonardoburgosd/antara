package com.antara.app.features.album

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.antara.app.R
import com.antara.app.core.network.ApiClient
import com.antara.app.core.network.ApiError
import com.antara.app.core.network.Endpoints
import com.antara.app.data.remote.AlbumApi
import com.antara.app.domain.repository.ServerRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

/**
 * ViewModel del detalle de un álbum.
 *
 * Carga las pistas con `GET /api/pista/todos/album/{AlbumId}` y arma la fuente
 * de audio de cada una con el endpoint de streaming `GET /api/pista/{id}`
 * (PistaController.ObtenerPistaAsync), que soporta Range para el seek.
 */
class AlbumDetailViewModel(
    private val albumApi: AlbumApi,
    private val serverRepository: ServerRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(AlbumDetailUiState())
    val uiState: StateFlow<AlbumDetailUiState> = _uiState.asStateFlow()

    private var albumId: String? = null

    /** Carga las pistas del álbum; no repite la consulta si ya están cargadas. */
    fun load(albumId: String) {
        if (this.albumId == albumId && (_uiState.value.loaded || _uiState.value.isLoading)) return

        this.albumId = albumId
        fetch(albumId)
    }

    /** Reintenta la carga del álbum abierto. */
    fun retry() {
        val current = albumId ?: return
        fetch(current)
    }

    /** Limpia el estado al cerrar sesión para no reutilizar pistas de otra cuenta. */
    fun reset() {
        albumId = null
        _uiState.value = AlbumDetailUiState()
    }

    private fun fetch(id: String) {
        _uiState.value = AlbumDetailUiState(isLoading = true)

        viewModelScope.launch {
            val server = serverRepository.servers.first().active
            if (server == null) {
                if (id == albumId) fail(R.string.home_albums_no_server)
                return@launch
            }

            try {
                val pistas = albumApi.pistas(baseUrl = server.address, albumId = id)
                if (id != albumId) return@launch

                // Solo el contenido que pertenece a un álbum es reproducible.
                val tracks = pistas
                    .filter { it.albumId.isNotBlank() }
                    .map { pista ->
                        AlbumTrackUiModel(
                            id = pista.id,
                            title = pista.nombre.ifBlank { pista.id },
                            artist = pista.interprete.orEmpty(),
                            durationSeconds = pista.duracionSegundos,
                            durationLabel = pista.durationLabel,
                            uri = ApiClient.buildUrl(server.address, Endpoints.trackStream(pista.id)),
                        )
                    }

                _uiState.value = AlbumDetailUiState(tracks = tracks, loaded = true)
            } catch (error: ApiError) {
                if (id == albumId) fail(error.toMessageRes())
            } catch (_: Exception) {
                if (id == albumId) fail(R.string.album_tracks_error)
            }
        }
    }

    private fun fail(messageRes: Int) {
        _uiState.value = _uiState.value.copy(isLoading = false, errorRes = messageRes)
    }

    private fun ApiError.toMessageRes(): Int = when (this) {
        ApiError.Network -> R.string.album_tracks_network
        ApiError.Unauthorized -> R.string.home_albums_session
        ApiError.Forbidden -> R.string.home_albums_forbidden
        else -> R.string.album_tracks_error
    }

    companion object {
        fun factory(
            albumApi: AlbumApi,
            serverRepository: ServerRepository,
        ) = viewModelFactory {
            initializer { AlbumDetailViewModel(albumApi, serverRepository) }
        }
    }
}
