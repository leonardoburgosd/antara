package com.antara.app.core.designsystem.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.outlined.QueueMusic
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.antara.app.R
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.player.PlayerUiState

/**
 * Mini player flotante (56dp) sobre la navegación inferior.
 * Muestra portada, título/artista y acciones play/pausa + cola.
 */
@Composable
fun AntaraMiniPlayer(
    state: PlayerUiState,
    onOpen: () -> Unit,
    onTogglePlayPause: () -> Unit,
    modifier: Modifier = Modifier,
) {
    if (!state.hasTrack) return

    Surface(
        onClick = onOpen,
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = AntaraTheme.spacing.lg, vertical = AntaraTheme.spacing.sm),
        shape = CircleShape,
        color = AntaraTheme.extendedColors.surfaceElevated,
        contentColor = AntaraTheme.colorScheme.onSurface,
        shadowElevation = 8.dp,
        border = BorderStroke(1.dp, AntaraTheme.extendedColors.border),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = AntaraTheme.spacing.sm, vertical = AntaraTheme.spacing.xs),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(MaterialTheme.shapes.small)
                    .background(state.coverColor),
            )
            Spacer(Modifier.width(AntaraTheme.spacing.sm))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = state.title.orEmpty(),
                    style = AntaraTheme.typography.titleSmall,
                    color = AntaraTheme.colorScheme.onSurface,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                Text(
                    text = state.artist.orEmpty(),
                    style = AntaraTheme.typography.bodySmall,
                    color = AntaraTheme.extendedColors.textSecondary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            IconButton(onClick = onTogglePlayPause, modifier = Modifier.size(44.dp)) {
                Icon(
                    imageVector = if (state.isPlaying) Icons.Filled.Pause else Icons.Filled.PlayArrow,
                    contentDescription = stringResource(
                        if (state.isPlaying) R.string.player_pause else R.string.player_play,
                    ),
                    tint = AntaraTheme.colorScheme.primary,
                    modifier = Modifier.size(26.dp),
                )
            }
            IconButton(onClick = onOpen, modifier = Modifier.size(44.dp)) {
                Icon(
                    imageVector = Icons.Outlined.QueueMusic,
                    contentDescription = stringResource(R.string.player_open),
                    tint = AntaraTheme.extendedColors.textSecondary,
                    modifier = Modifier.size(24.dp),
                )
            }
        }
    }
}
