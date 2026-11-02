package com.antara.app.player

import androidx.compose.ui.graphics.Color
import com.antara.app.core.designsystem.color.AntaraDarkTokens

/** Pista reproducible enviada desde la UI al reproductor. */
data class PlayableTrack(
    val id: String,
    val title: String,
    val artist: String,
    val coverColor: Color,
)

/** Modos de repetición expuestos a la UI (independientes de las constantes de Media3). */
enum class RepeatMode { Off, All, One }

/** Estado de reproducción derivado de la MediaSession (fuente única, ADR-011). */
data class PlayerUiState(
    val isConnected: Boolean = false,
    val isPlaying: Boolean = false,
    val currentId: String? = null,
    val title: String? = null,
    val artist: String? = null,
    val coverColor: Color = AntaraDarkTokens.Primary,
    val positionMs: Long = 0L,
    val durationMs: Long = 0L,
    val hasNext: Boolean = false,
    val hasPrevious: Boolean = false,
    val shuffleEnabled: Boolean = false,
    val repeatMode: RepeatMode = RepeatMode.Off,
    val queueSize: Int = 0,
    val errorMessage: String? = null,
) {
    /** Indica si hay una pista cargada (para mostrar mini player / pantalla completa). */
    val hasTrack: Boolean get() = !title.isNullOrBlank()
}
