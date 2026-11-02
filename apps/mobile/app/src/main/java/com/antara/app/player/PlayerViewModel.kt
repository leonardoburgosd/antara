package com.antara.app.player

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import kotlinx.coroutines.flow.StateFlow

/** Expone el estado del reproductor y delega las acciones al [PlayerConnection]. */
class PlayerViewModel(
    private val connection: PlayerConnection,
) : ViewModel() {

    val uiState: StateFlow<PlayerUiState> = connection.uiState

    fun playQueue(tracks: List<PlayableTrack>, startIndex: Int) {
        connection.playQueue(tracks, startIndex)
    }

    fun togglePlayPause() = connection.togglePlayPause()

    fun next() = connection.next()

    fun previous() = connection.previous()

    fun seekTo(positionMs: Long) = connection.seekTo(positionMs)

    fun toggleShuffle() = connection.toggleShuffle()

    fun cycleRepeat() = connection.cycleRepeat()

    companion object {
        fun factory(connection: PlayerConnection) = viewModelFactory {
            initializer { PlayerViewModel(connection) }
        }
    }
}
