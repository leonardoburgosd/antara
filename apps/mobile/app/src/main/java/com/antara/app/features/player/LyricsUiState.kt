package com.antara.app.features.player

/**
 * Estado de la letra sincronizada de la pista que está sonando.
 *
 * `notAvailable` representa una consulta terminada sin letra (404 del backend);
 * `errorRes` solo se usa para fallos reales de red o del servidor.
 */
data class LyricsUiState(
    val trackId: String? = null,
    val isLoading: Boolean = false,
    val lines: List<LyricLine> = emptyList(),
    val notAvailable: Boolean = false,
    val errorRes: Int? = null,
) {
    val hasLyrics: Boolean get() = lines.isNotEmpty()
}
