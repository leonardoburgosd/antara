package com.antara.app.features.home

import com.antara.app.data.remote.dto.AlbumDto
import com.antara.app.data.remote.dto.PlaylistDto

/** Estado de la sección "Playlists diarias" de Home (álbumes del backend). */
data class HomeAlbumsUiState(
    val isLoading: Boolean = false,
    val albums: List<AlbumDto> = emptyList(),
    val loaded: Boolean = false,
    val errorRes: Int? = null,
)

/** Estado de las playlists destacadas de "Curado y en tendencia". */
data class HomePlaylistsUiState(
    val isLoading: Boolean = false,
    val playlists: List<PlaylistDto> = emptyList(),
    val loaded: Boolean = false,
    val errorRes: Int? = null,
)
