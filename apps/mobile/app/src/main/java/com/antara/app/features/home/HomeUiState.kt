package com.antara.app.features.home

import com.antara.app.data.remote.dto.AlbumDto

/** Estado de la sección "Playlists diarias" de Home (álbumes del backend). */
data class HomeAlbumsUiState(
    val isLoading: Boolean = false,
    val albums: List<AlbumDto> = emptyList(),
    val loaded: Boolean = false,
    val errorRes: Int? = null,
)
