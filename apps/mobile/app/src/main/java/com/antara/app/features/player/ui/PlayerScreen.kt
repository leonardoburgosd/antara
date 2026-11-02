package com.antara.app.features.player.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.QueueMusic
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.KeyboardArrowDown
import androidx.compose.material.icons.outlined.MusicNote
import androidx.compose.material.icons.outlined.Repeat
import androidx.compose.material.icons.outlined.RepeatOne
import androidx.compose.material.icons.outlined.Shuffle
import androidx.compose.material.icons.outlined.SkipNext
import androidx.compose.material.icons.outlined.SkipPrevious
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.compositeOver
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.antara.app.R
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.components.AntaraCircleIcon
import com.antara.app.player.PlayerUiState
import com.antara.app.player.RepeatMode

/**
 * Pantalla completa del reproductor (referencia derecha): portada circular,
 * título/artista, letra, progreso y controles de reproducción.
 */
@Composable
fun PlayerScreen(
    state: PlayerUiState,
    onBack: () -> Unit,
    onTogglePlayPause: () -> Unit,
    onNext: () -> Unit,
    onPrevious: () -> Unit,
    onSeek: (Long) -> Unit,
    onToggleShuffle: () -> Unit,
    onCycleRepeat: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        state.coverColor.copy(alpha = 0.55f)
                            .compositeOver(AntaraTheme.colorScheme.background),
                        AntaraTheme.colorScheme.background,
                    ),
                ),
            ),
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .padding(horizontal = AntaraTheme.spacing.xl),
        ) {
            PlayerTopBar(
                onBack = onBack,
                onNotificationsClick = { },
                onFavoritesClick = { },
            )
            Spacer(Modifier.height(AntaraTheme.spacing.sm))
            BoxWithConstraints(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentAlignment = Alignment.Center,
            ) {
                val coverSize = minOf(maxWidth * 0.78f, 320.dp)
                Box(
                    modifier = Modifier
                        .size(coverSize)
                        .clip(CircleShape)
                        .background(
                            Brush.radialGradient(
                                colors = listOf(
                                    state.coverColor,
                                    AntaraTheme.extendedColors.surfaceElevated,
                                ),
                            ),
                        ),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        imageVector = Icons.Outlined.MusicNote,
                        contentDescription = null,
                        tint = AntaraTheme.colorScheme.onPrimary.copy(alpha = 0.85f),
                        modifier = Modifier.size(76.dp),
                    )
                }
            }
            Text(
                text = state.title.orEmpty(),
                style = AntaraTheme.typography.displaySmall,
                color = AntaraTheme.colorScheme.onBackground,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth(),
            )
            Text(
                text = state.artist.orEmpty(),
                style = AntaraTheme.typography.titleMedium,
                color = AntaraTheme.extendedColors.textSecondary,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(Modifier.height(AntaraTheme.spacing.md))
            LyricsBlock()
            Spacer(Modifier.height(AntaraTheme.spacing.lg))
            PlayerProgress(
                state = state,
                onSeek = onSeek,
            )
            Spacer(Modifier.height(AntaraTheme.spacing.md))
            PlayerControls(
                state = state,
                onTogglePlayPause = onTogglePlayPause,
                onNext = onNext,
                onPrevious = onPrevious,
                onToggleShuffle = onToggleShuffle,
                onCycleRepeat = onCycleRepeat,
            )
            if (state.errorMessage != null) {
                Text(
                    text = state.errorMessage,
                    style = AntaraTheme.typography.bodySmall,
                    color = AntaraTheme.colorScheme.error,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = AntaraTheme.spacing.sm),
                )
            }
            Spacer(Modifier.height(AntaraTheme.spacing.md))
        }
    }
}

@Composable
private fun PlayerTopBar(
    onBack: () -> Unit,
    onNotificationsClick: () -> Unit,
    onFavoritesClick: () -> Unit,
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(56.dp),
    ) {
        AntaraCircleIcon(
            icon = Icons.Outlined.KeyboardArrowDown,
            contentDescription = stringResource(R.string.detail_back),
            onClick = onBack,
            modifier = Modifier.align(Alignment.CenterStart),
            background = AntaraTheme.extendedColors.surfaceElevated,
        )
        Text(
            text = stringResource(R.string.player_now_playing),
            style = AntaraTheme.typography.labelLarge,
            color = AntaraTheme.colorScheme.onBackground,
            modifier = Modifier
                .align(Alignment.Center)
                .clip(CircleShape)
                .background(AntaraTheme.extendedColors.surfaceElevated)
                .padding(horizontal = AntaraTheme.spacing.lg, vertical = AntaraTheme.spacing.sm),
        )
        Row(
            modifier = Modifier.align(Alignment.CenterEnd),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            AntaraCircleIcon(
                icon = Icons.Outlined.FavoriteBorder,
                contentDescription = stringResource(R.string.home_favorites),
                onClick = onFavoritesClick,
                background = Color.Transparent,
            )
            AntaraCircleIcon(
                icon = Icons.AutoMirrored.Outlined.QueueMusic,
                contentDescription = stringResource(R.string.player_open),
                onClick = onNotificationsClick,
                background = Color.Transparent,
            )
        }
    }
}

@Composable
private fun LyricsBlock() {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = stringResource(R.string.player_lyrics_line_1),
            style = AntaraTheme.typography.bodyMedium,
            color = AntaraTheme.extendedColors.textSecondary,
            textAlign = TextAlign.Center,
        )
        Text(
            text = stringResource(R.string.player_lyrics_line_2),
            style = AntaraTheme.typography.bodyMedium,
            color = AntaraTheme.extendedColors.textSecondary,
            textAlign = TextAlign.Center,
        )
        Text(
            text = stringResource(R.string.player_lyrics_line_3),
            style = AntaraTheme.typography.bodyMedium,
            color = AntaraTheme.extendedColors.textDisabled,
            textAlign = TextAlign.Center,
        )
    }
}

@Composable
private fun PlayerProgress(
    state: PlayerUiState,
    onSeek: (Long) -> Unit,
) {
    var dragPosition by remember(state.currentId) { mutableStateOf<Float?>(null) }
    val duration = state.durationMs.coerceAtLeast(1L)
    val displayedPosition = dragPosition ?: state.positionMs.toFloat().coerceIn(0f, duration.toFloat())

    Column {
        Slider(
            value = displayedPosition,
            onValueChange = { dragPosition = it },
            onValueChangeFinished = {
                dragPosition?.let { onSeek(it.toLong()) }
                dragPosition = null
            },
            valueRange = 0f..duration.toFloat(),
            colors = SliderDefaults.colors(
                thumbColor = AntaraTheme.colorScheme.primary,
                activeTrackColor = AntaraTheme.colorScheme.primary,
                inactiveTrackColor = AntaraTheme.extendedColors.border,
            ),
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(
                text = formatTime(displayedPosition.toLong()),
                style = AntaraTheme.typography.labelMedium,
                color = AntaraTheme.extendedColors.textSecondary,
            )
            Text(
                text = formatTime(state.durationMs),
                style = AntaraTheme.typography.labelMedium,
                color = AntaraTheme.extendedColors.textSecondary,
            )
        }
    }
}

@Composable
private fun PlayerControls(
    state: PlayerUiState,
    onTogglePlayPause: () -> Unit,
    onNext: () -> Unit,
    onPrevious: () -> Unit,
    onToggleShuffle: () -> Unit,
    onCycleRepeat: () -> Unit,
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        IconButton(onClick = onToggleShuffle) {
            Icon(
                imageVector = Icons.Outlined.Shuffle,
                contentDescription = stringResource(R.string.player_shuffle),
                tint = if (state.shuffleEnabled) {
                    AntaraTheme.colorScheme.primary
                } else {
                    AntaraTheme.extendedColors.textSecondary
                },
            )
        }
        IconButton(onClick = onPrevious, enabled = state.hasPrevious) {
            Icon(
                imageVector = Icons.Outlined.SkipPrevious,
                contentDescription = stringResource(R.string.player_previous),
                tint = if (state.hasPrevious) {
                    AntaraTheme.colorScheme.onBackground
                } else {
                    AntaraTheme.extendedColors.textDisabled
                },
                modifier = Modifier.size(32.dp),
            )
        }
        Box(
            modifier = Modifier
                .size(68.dp)
                .clip(CircleShape)
                .background(AntaraTheme.colorScheme.primary),
            contentAlignment = Alignment.Center,
        ) {
            IconButton(onClick = onTogglePlayPause) {
                Icon(
                    imageVector = if (state.isPlaying) Icons.Filled.Pause else Icons.Filled.PlayArrow,
                    contentDescription = stringResource(
                        if (state.isPlaying) R.string.player_pause else R.string.player_play,
                    ),
                    tint = AntaraTheme.colorScheme.onPrimary,
                    modifier = Modifier.size(34.dp),
                )
            }
        }
        IconButton(onClick = onNext, enabled = state.hasNext) {
            Icon(
                imageVector = Icons.Outlined.SkipNext,
                contentDescription = stringResource(R.string.player_next),
                tint = if (state.hasNext) {
                    AntaraTheme.colorScheme.onBackground
                } else {
                    AntaraTheme.extendedColors.textDisabled
                },
                modifier = Modifier.size(32.dp),
            )
        }
        IconButton(onClick = onCycleRepeat) {
            Icon(
                imageVector = if (state.repeatMode == RepeatMode.One) {
                    Icons.Outlined.RepeatOne
                } else {
                    Icons.Outlined.Repeat
                },
                contentDescription = stringResource(R.string.player_repeat),
                tint = if (state.repeatMode == RepeatMode.Off) {
                    AntaraTheme.extendedColors.textSecondary
                } else {
                    AntaraTheme.colorScheme.primary
                },
            )
        }
    }
}

private fun formatTime(millis: Long): String {
    if (millis <= 0L) return "0:00"
    val totalSeconds = millis / 1000
    val minutes = totalSeconds / 60
    val seconds = totalSeconds % 60
    return "%d:%02d".format(minutes, seconds)
}
