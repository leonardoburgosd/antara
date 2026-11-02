package com.antara.app.player

import android.content.ComponentName
import android.content.Context
import android.net.Uri
import android.os.Bundle
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.core.content.ContextCompat
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.Player
import androidx.media3.session.MediaController
import androidx.media3.session.SessionToken
import com.google.common.util.concurrent.ListenableFuture
import com.antara.app.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

/**
 * Conexión de la UI con la MediaSession del [PlaybackService].
 *
 * La UI nunca crea un ExoPlayer: envía comandos y observa el estado del controller
 * (fuente única de reproducción, ADR-011).
 */
class PlayerConnection(
    private val context: Context,
) {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private val _uiState = MutableStateFlow(PlayerUiState())
    val uiState: StateFlow<PlayerUiState> = _uiState.asStateFlow()

    private var controllerFuture: ListenableFuture<MediaController>? = null
    private var controller: MediaController? = null
    private var pollJob: Job? = null
    private var pendingQueue: PendingQueue? = null

    private val listener = object : Player.Listener {
        override fun onEvents(player: Player, events: Player.Events) {
            refresh(player)
        }

        override fun onPlayerError(error: androidx.media3.common.PlaybackException) {
            _uiState.value = _uiState.value.copy(errorMessage = error.message)
        }
    }

    /** Conecta el controller al servicio. Idempotente. */
    fun connect() {
        if (controllerFuture != null) return

        val token = SessionToken(
            context,
            ComponentName(context, PlaybackService::class.java),
        )
        val future = MediaController.Builder(context, token).buildAsync()
        controllerFuture = future
        future.addListener(
            {
                val resolved = runCatching { future.get() }.getOrNull()
                if (resolved == null) {
                    controllerFuture = null
                    return@addListener
                }
                if (controllerFuture !== future) {
                    // Se liberó mientras se resolvía la conexión.
                    MediaController.releaseFuture(future)
                    return@addListener
                }
                attachController(resolved)
            },
            ContextCompat.getMainExecutor(context),
        )
    }

    /** Libera el controller al salir de primer plano; el servicio sigue reproduciendo. */
    fun disconnect() {
        pollJob?.cancel()
        pollJob = null
        controller?.removeListener(listener)
        controller = null
        controllerFuture?.let { MediaController.releaseFuture(it) }
        controllerFuture = null
        _uiState.value = _uiState.value.copy(isConnected = false)
    }

    fun playQueue(tracks: List<PlayableTrack>, startIndex: Int) {
        if (tracks.isEmpty()) return
        val safeIndex = startIndex.coerceIn(0, tracks.lastIndex)
        val current = controller
        if (current == null) {
            pendingQueue = PendingQueue(tracks, safeIndex)
            connect()
            return
        }
        playQueueInternal(current, tracks, safeIndex)
    }

    fun togglePlayPause() {
        val current = controller ?: return
        if (current.isPlaying) current.pause() else current.play()
    }

    fun next() {
        controller?.seekToNextMediaItem()
    }

    fun previous() {
        controller?.seekToPreviousMediaItem()
    }

    fun seekTo(positionMs: Long) {
        controller?.seekTo(positionMs)
    }

    fun toggleShuffle() {
        val current = controller ?: return
        current.shuffleModeEnabled = !current.shuffleModeEnabled
    }

    fun cycleRepeat() {
        val current = controller ?: return
        current.repeatMode = when (current.repeatMode) {
            Player.REPEAT_MODE_OFF -> Player.REPEAT_MODE_ALL
            Player.REPEAT_MODE_ALL -> Player.REPEAT_MODE_ONE
            else -> Player.REPEAT_MODE_OFF
        }
    }

    private fun attachController(resolved: MediaController) {
        controller = resolved
        resolved.addListener(listener)
        refresh(resolved)
        startPolling(resolved)

        pendingQueue?.let { pending ->
            pendingQueue = null
            playQueueInternal(resolved, pending.tracks, pending.index)
        }
    }

    private fun startPolling(current: MediaController) {
        pollJob?.cancel()
        pollJob = scope.launch {
            while (isActive) {
                refresh(current)
                delay(POSITION_POLL_MS)
            }
        }
    }

    private fun playQueueInternal(
        current: MediaController,
        tracks: List<PlayableTrack>,
        startIndex: Int,
    ) {
        val fallbackUri = Uri.parse("android.resource://${context.packageName}/${R.raw.antara_sample}")
        val items = tracks.map { track ->
            val extras = Bundle().apply { putInt(KEY_COVER_COLOR, track.coverColor.toArgb()) }
            MediaItem.Builder()
                .setMediaId(track.id)
                .setUri(track.uri?.let(Uri::parse) ?: fallbackUri)
                .setMediaMetadata(
                    MediaMetadata.Builder()
                        .setTitle(track.title)
                        .setArtist(track.artist)
                        .setExtras(extras)
                        .build(),
                )
                .build()
        }
        current.setMediaItems(items, startIndex, 0L)
        current.prepare()
        current.play()
    }

    private fun refresh(player: Player) {
        val metadata = player.currentMediaItem?.mediaMetadata
        val color = metadata?.extras?.getInt(KEY_COVER_COLOR)?.let(::Color)
            ?: _uiState.value.coverColor
        val duration = player.duration
        _uiState.value = PlayerUiState(
            isConnected = true,
            isPlaying = player.isPlaying,
            currentId = player.currentMediaItem?.mediaId,
            title = metadata?.title?.toString()?.takeIf(String::isNotBlank),
            artist = metadata?.artist?.toString()?.takeIf(String::isNotBlank),
            coverColor = color,
            positionMs = player.currentPosition.coerceAtLeast(0L),
            durationMs = if (duration > 0L && duration != C.TIME_UNSET) duration else 0L,
            hasNext = player.hasNextMediaItem(),
            hasPrevious = player.hasPreviousMediaItem(),
            shuffleEnabled = player.shuffleModeEnabled,
            repeatMode = when (player.repeatMode) {
                Player.REPEAT_MODE_ALL -> RepeatMode.All
                Player.REPEAT_MODE_ONE -> RepeatMode.One
                else -> RepeatMode.Off
            },
            queueSize = player.mediaItemCount,
            errorMessage = _uiState.value.errorMessage,
        )
    }

    private data class PendingQueue(
        val tracks: List<PlayableTrack>,
        val index: Int,
    )

    private companion object {
        const val POSITION_POLL_MS = 500L
        const val KEY_COVER_COLOR = "antara_cover_color"
    }
}
