package com.antara.app.features.playlist.ui

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
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.components.AntaraPrimaryButton
import com.antara.app.core.designsystem.components.AntaraTrackRow
import com.antara.app.features.home.ui.DetailTopBar
import com.antara.app.features.playlist.PlaylistDetailUiState
import com.antara.app.player.PlayerUiState

/**
 * Detalle de una playlist: cabecera con portada, artistas y recuento, y lista de
 * canciones cargada con `GET /api/pista/todos/playlist/{PlaylistId}`.
 *
 * A diferencia de un álbum, la lista mezcla artistas y cada fila muestra el
 * intérprete de su propia pista.
 */
@Composable
fun PlaylistDetailScreen(
    playlistTitle: String,
    playlistArtists: String,
    playlistDescription: String?,
    totalTracks: Int,
    totalArtists: Int,
    coverColor: Color,
    state: PlaylistDetailUiState,
    playerState: PlayerUiState,
    onBack: () -> Unit,
    onRetry: () -> Unit,
    onPlayTrack: (Int) -> Unit,
    bottomContentPadding: Dp = 0.dp,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(AntaraTheme.colorScheme.background),
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            DetailTopBar(
                title = playlistTitle,
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
                    PlaylistHeader(
                        title = playlistTitle,
                        artists = playlistArtists,
                        description = playlistDescription,
                        totalTracks = if (state.tracks.isNotEmpty()) state.tracks.size else totalTracks,
                        totalArtists = totalArtists,
                        coverColor = coverColor,
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
                    state.isLoading -> item(key = "loading") { PlaylistTracksLoading() }

                    state.errorRes != null -> item(key = "error") {
                        PlaylistTracksError(messageRes = state.errorRes, onRetry = onRetry)
                    }

                    state.tracks.isEmpty() -> item(key = "empty") { PlaylistTracksEmpty() }

                    else -> itemsIndexed(
                        items = state.tracks,
                        key = { _, track -> track.id },
                    ) { index, track ->
                        AntaraTrackRow(
                            title = track.title,
                            subtitle = track.artist.ifBlank { playlistArtists },
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
private fun PlaylistHeader(
    title: String,
    artists: String,
    description: String?,
    totalTracks: Int,
    totalArtists: Int,
    coverColor: Color,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = AntaraTheme.spacing.lg),
    ) {
        Box(
            modifier = Modifier
                .size(128.dp)
                .clip(MaterialTheme.shapes.extraLarge)
                .background(coverColor),
        )
        Spacer(Modifier.width(AntaraTheme.spacing.md))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = stringResource(R.string.playlist_label),
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
                text = artists.ifBlank { stringResource(R.string.playlist_various_artists) },
                style = AntaraTheme.typography.bodySmall,
                color = AntaraTheme.extendedColors.textSecondary,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Spacer(Modifier.height(AntaraTheme.spacing.xs))
            Text(
                text = stringResource(R.string.playlist_summary, totalTracks, totalArtists),
                style = AntaraTheme.typography.bodySmall,
                color = AntaraTheme.extendedColors.textSecondary,
            )
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
private fun PlaylistTracksLoading() {
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
private fun PlaylistTracksError(messageRes: Int, onRetry: () -> Unit) {
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

@Composable
private fun PlaylistTracksEmpty() {
    Text(
        text = stringResource(R.string.playlist_tracks_empty),
        style = AntaraTheme.typography.bodySmall,
        color = AntaraTheme.extendedColors.textSecondary,
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = AntaraTheme.spacing.lg, vertical = AntaraTheme.spacing.md),
    )
}
