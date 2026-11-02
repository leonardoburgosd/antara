package com.antara.app.features.home.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.antara.app.R
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.spacing.AntaraSpacing

/**
 * Fila "Canciones que te gustan" (mini portada con degradado + corazón, título y contador)
 * con chevron, tal como en la referencia.
 */
@Composable
fun LikedSongsRow(
    songCount: Int,
    onClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = AntaraSpacing.lg, vertical = AntaraSpacing.sm),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .clip(MaterialTheme.shapes.medium)
                .background(
                    Brush.linearGradient(
                        colors = listOf(
                            AntaraTheme.colorScheme.primary,
                            AntaraTheme.extendedColors.accent,
                        ),
                    ),
                ),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = Icons.Filled.Favorite,
                contentDescription = null,
                tint = AntaraTheme.colorScheme.onPrimary,
                modifier = Modifier.size(20.dp),
            )
        }
        Spacer(Modifier.width(AntaraSpacing.md))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = stringResource(R.string.liked_songs),
                style = AntaraTheme.typography.titleSmall,
                color = AntaraTheme.colorScheme.onSurface,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Text(
                text = stringResource(R.string.liked_row_subtitle, songCount),
                style = AntaraTheme.typography.bodySmall,
                color = AntaraTheme.extendedColors.textSecondary,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        Icon(
            imageVector = Icons.Filled.KeyboardArrowRight,
            contentDescription = null,
            tint = AntaraTheme.extendedColors.textSecondary,
            modifier = Modifier.size(24.dp),
        )
    }
}

/** Cabecera de sección ("Canciones"). */
@Composable
fun SectionHeader(title: String) {
    Text(
        text = title,
        style = AntaraTheme.typography.titleLarge,
        color = AntaraTheme.colorScheme.onSurface,
        modifier = Modifier.padding(
            start = AntaraSpacing.lg,
            end = AntaraSpacing.lg,
            top = AntaraSpacing.md,
            bottom = AntaraSpacing.xs,
        ),
    )
}

/** Fila de canción: número, portada 40dp, título/artista y menú de 3 puntos. */
@Composable
fun SongRow(
    number: Int,
    song: SongItem,
    onOptionsClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = AntaraSpacing.lg, vertical = AntaraSpacing.xs),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text = number.toString(),
            style = AntaraTheme.typography.labelLarge,
            color = AntaraTheme.extendedColors.textSecondary,
            modifier = Modifier.width(24.dp),
            textAlign = TextAlign.Center,
        )
        Spacer(Modifier.width(AntaraSpacing.md))
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(MaterialTheme.shapes.small)
                .background(song.coverColor),
        )
        Spacer(Modifier.width(AntaraSpacing.md))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = song.title,
                style = AntaraTheme.typography.titleSmall,
                color = AntaraTheme.colorScheme.onSurface,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Text(
                text = song.artist,
                style = AntaraTheme.typography.bodySmall,
                color = AntaraTheme.extendedColors.textSecondary,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        Icon(
            imageVector = Icons.Filled.MoreVert,
            contentDescription = stringResource(R.string.song_options),
            tint = AntaraTheme.extendedColors.textSecondary,
            modifier = Modifier
                .clip(CircleShape)
                .clickable(onClick = onOptionsClick)
                .padding(AntaraSpacing.xs)
                .size(24.dp),
        )
    }
}

/** Fila de 2 columnas de la pestaña "Álbumes" (otros álbumes del artista). */
@Composable
fun AlbumGridRow(
    pair: List<AlbumBrief>,
    onClick: (String) -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = AntaraSpacing.lg, vertical = AntaraSpacing.sm),
        horizontalArrangement = Arrangement.spacedBy(AntaraSpacing.md),
    ) {
        pair.forEach { album ->
            Column(modifier = Modifier.weight(1f)) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(1f)
                        .clip(MaterialTheme.shapes.medium)
                        .background(album.coverColor)
                        .clickable { onClick(album.id) },
                )
                Spacer(Modifier.height(AntaraSpacing.sm))
                Text(
                    text = album.title,
                    style = AntaraTheme.typography.labelLarge,
                    color = AntaraTheme.colorScheme.onSurface,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                Text(
                    text = album.year.toString(),
                    style = AntaraTheme.typography.bodySmall,
                    color = AntaraTheme.extendedColors.textSecondary,
                )
            }
        }
        if (pair.size == 1) {
            Spacer(Modifier.weight(1f))
        }
    }
}

/** Estado vacío de la pestaña "Álbumes". */
@Composable
fun EmptyAlbums() {
    Text(
        text = stringResource(R.string.albums_empty),
        style = AntaraTheme.typography.bodyMedium,
        color = AntaraTheme.extendedColors.textSecondary,
        modifier = Modifier.padding(AntaraSpacing.lg),
    )
}

/** Hoja de opciones de cada canción (menú de 3 puntos). */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SongOptionsSheet(
    song: SongItem,
    onDismiss: () -> Unit,
) {
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = AntaraTheme.extendedColors.surfaceElevated,
        shape = MaterialTheme.shapes.extraLarge,
    ) {
        Column(modifier = Modifier.padding(bottom = AntaraSpacing.xl)) {
            Text(
                text = song.title,
                style = AntaraTheme.typography.titleMedium,
                color = AntaraTheme.colorScheme.onSurface,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(
                    horizontal = AntaraSpacing.lg,
                    vertical = AntaraSpacing.sm,
                ),
            )
            listOf(
                R.string.sheet_add_queue,
                R.string.sheet_view_artist,
                R.string.sheet_view_album,
                R.string.sheet_share,
            ).forEach { labelRes ->
                Text(
                    text = stringResource(labelRes),
                    style = AntaraTheme.typography.bodyLarge,
                    color = AntaraTheme.colorScheme.onSurface,
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable(onClick = onDismiss)
                        .padding(horizontal = AntaraSpacing.lg, vertical = AntaraSpacing.md),
                )
            }
        }
    }
}
