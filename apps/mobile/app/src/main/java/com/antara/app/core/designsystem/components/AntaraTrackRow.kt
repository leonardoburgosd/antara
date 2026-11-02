package com.antara.app.core.designsystem.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.outlined.GraphicEq
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.antara.app.R
import com.antara.app.core.designsystem.AntaraTheme

/**
 * Fila de canción del design system (64dp): portada 48dp, título/artista y acción play/pausa.
 * El estado "reproduciendo" usa `primary` + ecualizador `accent`.
 */
@Composable
fun AntaraTrackRow(
    title: String,
    subtitle: String,
    coverColor: Color,
    onPlay: () -> Unit,
    modifier: Modifier = Modifier,
    isCurrent: Boolean = false,
    isPlaying: Boolean = false,
    onRowClick: () -> Unit = onPlay,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .heightIn(min = 64.dp)
            .clickable(onClick = onRowClick)
            .padding(horizontal = AntaraTheme.spacing.lg, vertical = AntaraTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .clip(MaterialTheme.shapes.medium)
                .background(coverColor),
        )
        Spacer(Modifier.width(AntaraTheme.spacing.md))
        Column(modifier = Modifier.weight(1f)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = title,
                    style = AntaraTheme.typography.titleSmall,
                    color = if (isCurrent) {
                        AntaraTheme.colorScheme.primary
                    } else {
                        AntaraTheme.colorScheme.onSurface
                    },
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f, fill = false),
                )
                if (isCurrent && isPlaying) {
                    Spacer(Modifier.width(AntaraTheme.spacing.xs))
                    Icon(
                        imageVector = Icons.Outlined.GraphicEq,
                        contentDescription = null,
                        tint = AntaraTheme.extendedColors.accent,
                        modifier = Modifier.size(16.dp),
                    )
                }
            }
            Text(
                text = subtitle,
                style = AntaraTheme.typography.bodySmall,
                color = AntaraTheme.extendedColors.textSecondary,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        IconButton(
            onClick = onPlay,
            modifier = Modifier.size(48.dp),
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .background(AntaraTheme.extendedColors.surfaceElevated, CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    imageVector = if (isCurrent && isPlaying) Icons.Filled.Pause else Icons.Filled.PlayArrow,
                    contentDescription = stringResource(
                        if (isCurrent && isPlaying) R.string.player_pause else R.string.play,
                    ),
                    tint = AntaraTheme.colorScheme.primary,
                    modifier = Modifier.size(24.dp),
                )
            }
        }
    }
}
