package com.antara.app.features.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.antara.app.R
import com.antara.app.core.network.ApiError
import com.antara.app.data.remote.AlbumApi
import com.antara.app.data.remote.PlaylistApi
import com.antara.app.domain.model.SessionState
import com.antara.app.domain.repository.ServerRepository
import com.antara.app.domain.repository.SessionRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/**
 * ViewModel de Home.
 *
 * Fase actual: la sección "Playlists diarias" carga `GET /api/album/todos`
 * contra el servidor configurado (ADR-016). El resto de secciones sigue con
 * contenido mock hasta integrar sus endpoints.
 */
class HomeViewModel(
    private val albumApi: AlbumApi,
    private val playlistApi: PlaylistApi,
    private val sessionRepository: SessionRepository,
    private val serverRepository: ServerRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeAlbumsUiState())
    val uiState: StateFlow<HomeAlbumsUiState> = _uiState.asStateFlow()

    private val _playlistsState = MutableStateFlow(HomePlaylistsUiState())
    val playlistsState: StateFlow<HomePlaylistsUiState> = _playlistsState.asStateFlow()

    /** Carga los álbumes una vez; `force` reintenta tras un error. */
    fun loadAlbums(force: Boolean = false) {
        val current = _uiState.value
        if (current.isLoading) return
        if (current.loaded && !force) return

        _uiState.update { it.copy(isLoading = true, errorRes = null) }

        viewModelScope.launch {
            val session = sessionRepository.session.first()
            val token = (session as? SessionState.SignedIn)?.session?.token
            val server = serverRepository.servers.first().active

            if (token.isNullOrBlank()) {
                fail(R.string.home_albums_session)
                return@launch
            }
            if (server == null) {
                fail(R.string.home_albums_no_server)
                return@launch
            }

            try {
                val albums = albumApi.todos(baseUrl = server.address, token = token)
                _uiState.value = HomeAlbumsUiState(
                    isLoading = false,
                    albums = albums,
                    loaded = true,
                )
            } catch (error: ApiError) {
                fail(error.toMessageRes())
            } catch (_: Exception) {
                fail(R.string.home_albums_error)
            }
        }
    }

    /** Carga las playlists destacadas; `force` reintenta tras un error. */
    fun loadPlaylists(force: Boolean = false) {
        val current = _playlistsState.value
        if (current.isLoading) return
        if (current.loaded && !force) return

        _playlistsState.update { it.copy(isLoading = true, errorRes = null) }

        viewModelScope.launch {
            val session = sessionRepository.session.first()
            val token = (session as? SessionState.SignedIn)?.session?.token
            val server = serverRepository.servers.first().active

            if (token.isNullOrBlank()) {
                failPlaylists(R.string.home_albums_session)
                return@launch
            }
            if (server == null) {
                failPlaylists(R.string.home_albums_no_server)
                return@launch
            }

            try {
                val playlists = playlistApi.todos(baseUrl = server.address, token = token)
                _playlistsState.value = HomePlaylistsUiState(
                    isLoading = false,
                    playlists = playlists,
                    loaded = true,
                )
            } catch (error: ApiError) {
                failPlaylists(error.toMessageRes())
            } catch (_: Exception) {
                failPlaylists(R.string.home_albums_error)
            }
        }
    }

    private fun fail(messageRes: Int) {
        _uiState.update { it.copy(isLoading = false, errorRes = messageRes) }
    }

    private fun failPlaylists(messageRes: Int) {
        _playlistsState.update { it.copy(isLoading = false, errorRes = messageRes) }
    }

    /** Limpia el estado al cerrar sesión para no reutilizar contenido de otra cuenta. */
    fun reset() {
        _uiState.value = HomeAlbumsUiState()
        _playlistsState.value = HomePlaylistsUiState()
    }

    private fun ApiError.toMessageRes(): Int = when (this) {
        ApiError.Forbidden -> R.string.home_albums_forbidden
        ApiError.Unauthorized -> R.string.home_albums_session
        ApiError.Network -> R.string.home_albums_network
        ApiError.Validation,
        ApiError.NotFound,
        ApiError.Unavailable,
        ApiError.Server,
        ApiError.Parsing,
        -> R.string.home_albums_error
    }

    companion object {
        fun factory(
            albumApi: AlbumApi,
            playlistApi: PlaylistApi,
            sessionRepository: SessionRepository,
            serverRepository: ServerRepository,
        ) = viewModelFactory {
            initializer { HomeViewModel(albumApi, playlistApi, sessionRepository, serverRepository) }
        }
    }
}
