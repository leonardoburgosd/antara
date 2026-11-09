package com.antara.app.features.playlist

/** Canción reproducible de una playlist (cada una con su propio intérprete). */
data class PlaylistTrackUiModel(
    val id: String,
    val title: String,
    val artist: String,
    val durationSeconds: Int,
    /** Duración legible según el backend ("3:48"). */
    val durationLabel: String,
    /** URL del stream en el backend (`GET /api/pista/{id}`). */
    val uri: String?,
)

/** Estado de la lista de canciones de una playlist. */
data class PlaylistDetailUiState(
    val isLoading: Boolean = false,
    val tracks: List<PlaylistTrackUiModel> = emptyList(),
    val loaded: Boolean = false,
    val errorRes: Int? = null,
)
