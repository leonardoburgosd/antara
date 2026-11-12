package com.antara.app.features.album.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.antara.app.R
import com.antara.app.core.image.RemoteCover
import com.antara.app.core.image.resolveCoverUrl
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.components.AntaraPrimaryButton
import com.antara.app.core.designsystem.components.AntaraTrackRow
import com.antara.app.features.album.AlbumDetailUiState
import com.antara.app.features.home.ui.DetailTopBar
import com.antara.app.player.PlayerUiState

/**
 * Detalle de un álbum del backend: cabecera con portada, datos del álbum y
 * acción "Reproducir", y lista de canciones cargada con
 * `GET /api/pista/todos/album/{AlbumId}`.
 *
 * Cada canción se reproduce desde `GET /api/pista/{id}`; solo se listan las
 * pistas que pertenecen a un álbum.
 */
@Composable
fun AlbumDetailScreen(
    albumTitle: String,
    albumArtist: String,
    albumDescription: String?,
    albumDate: String? = null,
    coverColor: Color,
    coverUrl: String? = null,
    state: AlbumDetailUiState,
    playerState: PlayerUiState,
    onBack: () -> Unit,
    onRetry: () -> Unit,
    onPlayTrack: (Int) -> Unit,
    bottomContentPadding: Dp = 0.dp,
    modifier: Modifier = Modifier,
) {
    val totalSeconds = state.tracks.sumOf { it.durationSeconds }
    val albumMeta = listOfNotNull(
        albumYear(albumDate),
        if (state.tracks.isNotEmpty()) {
            stringResource(R.string.detail_song_count, state.tracks.size)
        } else {
            null
        },
        if (totalSeconds > 0) formatAlbumDuration(totalSeconds) else null,
    ).joinToString(separator = " · ")

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(AntaraTheme.colorScheme.background),
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            DetailTopBar(
                title = albumTitle,
                onBack = onBack,
                onNotificationsClick = { },
                onFavoritesClick = { },
            )

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = AntaraTheme.spacing.xxl + bottomContentPadding),
            ) {
                item(key = "summary") {
                    Spacer(Modifier.height(AntaraTheme.spacing.md))
                    AlbumHeader(
                        title = albumTitle,
                        artist = albumArtist,
                        meta = albumMeta,
                        description = albumDescription,
                        coverColor = coverColor,
                        coverUrl = coverUrl,
                    )
                    Spacer(Modifier.height(AntaraTheme.spacing.md))
                    AntaraPrimaryButton(
                        text = stringResource(R.string.play),
                        onClick = { onPlayTrack(0) },
                        enabled = state.tracks.isNotEmpty(),
                        modifier = Modifier.padding(horizontal = AntaraTheme.spacing.lg),
                    )
                    Spacer(Modifier.height(AntaraTheme.spacing.md))
                }

                item(key = "songs-title") {
                    Text(
                        text = stringResource(R.string.section_songs),
                        style = AntaraTheme.typography.titleLarge,
                        color = AntaraTheme.colorScheme.onSurface,
                        modifier = Modifier.padding(
                            horizontal = AntaraTheme.spacing.lg,
                            vertical = AntaraTheme.spacing.sm,
                        ),
                    )
                }

                when {
                    state.isLoading -> item(key = "loading") { AlbumTracksLoading() }

                    state.errorRes != null -> item(key = "error") {
                        AlbumTracksError(messageRes = state.errorRes, onRetry = onRetry)
                    }

                    state.tracks.isEmpty() -> item(key = "empty") { AlbumTracksEmpty() }

                    else -> itemsIndexed(
                        items = state.tracks,
                        key = { _, track -> track.id },
                    ) { index, track ->
                        AntaraTrackRow(
                            title = track.title,
                            subtitle = stringResource(
                                R.string.detail_track_subtitle,
                                track.artist.ifBlank { albumArtist },
                            ),
                            coverColor = coverColor,
                            isCurrent = playerState.currentId == track.id,
                            isPlaying = playerState.isPlaying,
                            durationLabel = track.durationLabel,
                            onPlay = { onPlayTrack(index) },
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun AlbumHeader(
    title: String,
    artist: String,
    meta: String,
    description: String?,
    coverColor: Color,
    coverUrl: String? = null,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = AntaraTheme.spacing.lg),
    ) {
        RemoteCover(
            url = coverUrl,
            fallbackColor = coverColor,
            contentDescription = title,
            modifier = Modifier
                .size(128.dp)
                .clip(MaterialTheme.shapes.extraLarge),
        )
        Spacer(Modifier.width(AntaraTheme.spacing.md))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = stringResource(R.string.album_label),
                style = AntaraTheme.typography.bodySmall,
                color = AntaraTheme.extendedColors.textSecondary,
            )
            Text(
                text = title,
                style = AntaraTheme.typography.headlineSmall,
                color = AntaraTheme.colorScheme.onBackground,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
            )
            Spacer(Modifier.height(AntaraTheme.spacing.xs))
            Text(
                text = artist.ifBlank { stringResource(R.string.home_album_generic) },
                style = AntaraTheme.typography.bodySmall,
                color = AntaraTheme.extendedColors.textSecondary,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            if (meta.isNotBlank()) {
                Spacer(Modifier.height(AntaraTheme.spacing.xs))
                Text(
                    text = meta,
                    style = AntaraTheme.typography.bodySmall,
                    color = AntaraTheme.extendedColors.textSecondary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            if (!description.isNullOrBlank()) {
                Spacer(Modifier.height(AntaraTheme.spacing.xs))
                Text(
                    text = description,
                    style = AntaraTheme.typography.bodySmall,
                    color = AntaraTheme.extendedColors.textSecondary,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
    }
}

@Composable
private fun AlbumTracksLoading() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = AntaraTheme.spacing.xl),
        contentAlignment = Alignment.Center,
    ) {
        CircularProgressIndicator(color = AntaraTheme.colorScheme.primary)
    }
}

@Composable
private fun AlbumTracksError(messageRes: Int, onRetry: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = AntaraTheme.spacing.lg, vertical = AntaraTheme.spacing.md),
    ) {
        Text(
            text = stringResource(messageRes),
            style = AntaraTheme.typography.bodySmall,
            color = AntaraTheme.colorScheme.error,
        )
        TextButton(onClick = onRetry) {
            Text(text = stringResource(R.string.home_albums_retry))
        }
    }
}

/** Año de `fechaPublicacion` (ISO-8601); `null` si no hay una fecha utilizable. */
private fun albumYear(date: String?): String? {
    val year = date?.take(4)?.toIntOrNull() ?: return null
    return if (year in 1900..2999) year.toString() else null
}

/** Duración total del álbum con el mismo formato del reproductor (m:ss / h:mm:ss). */
private fun formatAlbumDuration(seconds: Int): String {
    val hours = seconds / 3600
    val minutes = (seconds % 3600) / 60
    val rest = seconds % 60

    return if (hours > 0) {
        "%d:%02d:%02d".format(hours, minutes, rest)
    } else {
        "%d:%02d".format(minutes, rest)
    }
}

@Composable
private fun AlbumTracksEmpty() {
    Text(
        text = stringResource(R.string.album_tracks_empty),
        style = AntaraTheme.typography.bodySmall,
        color = AntaraTheme.extendedColors.textSecondary,
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = AntaraTheme.spacing.lg, vertical = AntaraTheme.spacing.md),
    )
}
