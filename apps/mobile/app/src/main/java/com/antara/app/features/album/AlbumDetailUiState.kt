package com.antara.app.features.album

/** Pista reproducible del detalle de un álbum. */
data class AlbumTrackUiModel(
    val id: String,
    val title: String,
    val artist: String,
    val durationSeconds: Int,
    /** Duración legible según el backend ("3:48"). */
    val durationLabel: String,
    /** URL del stream en el backend (`GET /api/pista/{id}`). */
    val uri: String?,
)

/** Estado de la lista de pistas de un álbum. */
data class AlbumDetailUiState(
    val isLoading: Boolean = false,
    val tracks: List<AlbumTrackUiModel> = emptyList(),
    val loaded: Boolean = false,
    val errorRes: Int? = null,
)
