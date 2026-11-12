package com.antara.app.features.home.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.antara.app.R
import com.antara.app.core.image.resolveCoverUrl
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.color.AntaraDarkTokens
import com.antara.app.core.designsystem.components.AntaraFilterChips
import com.antara.app.core.designsystem.components.AntaraTrackRow
import com.antara.app.data.remote.dto.AlbumDto
import com.antara.app.data.remote.dto.PlaylistDto
import com.antara.app.features.home.HomeAlbumsUiState
import com.antara.app.features.home.HomePlaylistsUiState
import com.antara.app.player.PlayerUiState
import java.util.Calendar

/** Portadas de álbum mientras no se cargan imágenes (tokens del design system). */
private val ALBUM_COVERS = listOf(
    AntaraDarkTokens.Primary,
    AntaraDarkTokens.AccentWarm,
    AntaraDarkTokens.Info,
    AntaraDarkTokens.Accent,
    AntaraDarkTokens.Success,
    AntaraDarkTokens.Error,
)

/** Colores de las tarjetas destacadas por posición (misma paleta que el mock). */
private val FEATURED_STYLES = listOf(
    AntaraDarkTokens.Primary to false,
    AntaraDarkTokens.AccentWarm to true,
    AntaraDarkTokens.Accent to true,
    AntaraDarkTokens.Info to true,
)

/**
 * Home de Antara siguiendo la referencia: saludo + acciones, titular, filtros,
 * carrusel "Curado y en tendencia" y lista de playlists diarias.
 *
 * En "Playlists diarias" la lista se alimenta de `GET /api/album/todos`
 * (ADR-016); el resto de filtros siguen usando contenido mock.
 */
@Composable
fun HomeScreen(
    userName: String,
    playerState: PlayerUiState,
    albumsState: HomeAlbumsUiState,
    playlistsState: HomePlaylistsUiState,
    onLoadAlbums: () -> Unit,
    onRetryAlbums: () -> Unit,
    onLoadPlaylists: () -> Unit,
    onRetryPlaylists: () -> Unit,
    onOpenServers: () -> Unit,
    onOpenLikedSongs: () -> Unit,
    onOpenAlbum: (AlbumDto, Color) -> Unit,
    onOpenPlaylist: (PlaylistDto, Color) -> Unit,
    onPlayIndex: (Int) -> Unit,
    coverBaseUrl: String? = null,
    bottomContentPadding: Dp = 0.dp,
    modifier: Modifier = Modifier,
) {
    val context = LocalContext.current
    var selectedFilterIndex by rememberSaveable { mutableIntStateOf(HomeFilter.All.ordinal) }
    val selectedFilter = HomeFilter.entries[selectedFilterIndex]
    val content = remember(selectedFilter) { buildHomeContent(selectedFilter) }

    // "Curado y en tendencia" usa las playlists del backend; sin ellas queda el mock.
    val featuredPlaylists = if (selectedFilter == HomeFilter.All) {
        playlistsState.playlists.take(2)
    } else {
        emptyList()
    }

    val featuredItems = if (featuredPlaylists.isEmpty()) {
        content.featured
    } else {
        featuredPlaylists.mapIndexed { index, playlist ->
            val style = FEATURED_STYLES[index % FEATURED_STYLES.size]
            FeaturedItem(
                id = playlist.id,
                title = playlist.nombre.ifBlank { playlist.id },
                subtitle = playlist.descripcion
                    ?: context.getString(
                        R.string.playlist_summary,
                        playlist.totalPistas,
                        playlist.totalArtistas,
                    ),
                background = style.first,
                darkText = style.second,
            )
        }
    }

    val featuredPlaylistsById = featuredPlaylists.associateBy { it.id }

    LaunchedEffect(Unit) {
        onLoadAlbums()
        onLoadPlaylists()
    }

    val greeting = stringResource(
        when (Calendar.getInstance().get(Calendar.HOUR_OF_DAY)) {
            in 6..12 -> R.string.greeting_morning
            in 13..19 -> R.string.greeting_afternoon
            else -> R.string.greeting_night
        },
    )

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(
            top = AntaraTheme.spacing.xs,
            bottom = AntaraTheme.spacing.xl + bottomContentPadding,
        ),
    ) {
        item(key = "header") {
            HomeHeader(
                greeting = greeting,
                userName = userName,
                onNotificationsClick = { },
                onFavoritesClick = onOpenLikedSongs,
                onServersClick = onOpenServers,
            )
        }
        item(key = "headline") {
            Spacer(Modifier.height(AntaraTheme.spacing.sm))
            HomeHeadline()
            Spacer(Modifier.height(AntaraTheme.spacing.lg))
        }
        item(key = "filters") {
            Box(modifier = Modifier.padding(horizontal = AntaraTheme.spacing.lg)) {
                AntaraFilterChips(
                    labels = HomeFilter.entries.map { filterLabel(it) },
                    selectedIndex = selectedFilterIndex,
                    onSelect = { selectedFilterIndex = it },
                )
            }
        }
        item(key = "curated-header") {
            Spacer(Modifier.height(AntaraTheme.spacing.xl))
            HomeSectionHeader(
                title = content.curatedTitle,
                onSeeAll = onOpenLikedSongs,
            )
        }
        item(key = "featured") {
            Spacer(Modifier.height(AntaraTheme.spacing.sm))
            FeaturedCarousel(
                items = featuredItems,
                onPlay = { item ->
                    val playlist = featuredPlaylistsById[item.id]
                    if (playlist != null) {
                        onOpenPlaylist(playlist, item.background)
                    } else {
                        onPlayIndex(0)
                    }
                },
                onOpen = { item ->
                    val playlist = featuredPlaylistsById[item.id]
                    if (playlist != null) onOpenPlaylist(playlist, item.background) else onOpenLikedSongs()
                },
            )
        }
        if (selectedFilter == HomeFilter.All && playlistsState.errorRes != null) {
            item(key = "featured-retry") {
                TextButton(onClick = onRetryPlaylists) {
                    Text(text = stringResource(R.string.home_albums_retry))
                }
            }
        }
        item(key = "playlists-header") {
            Spacer(Modifier.height(AntaraTheme.spacing.xl))
            HomeSectionHeader(
                title = content.playlistsTitle,
                onSeeAll = onOpenLikedSongs,
            )
        }

        if (selectedFilter == HomeFilter.All) {
            val albumsError = albumsState.errorRes

            when {
                albumsState.isLoading || (!albumsState.loaded && albumsError == null) ->
                    item(key = "albums-loading") { AlbumsLoading() }

                albumsError != null -> item(key = "albums-error") {
                    AlbumsError(messageRes = albumsError, onRetry = onRetryAlbums)
                }

                albumsState.albums.isEmpty() -> item(key = "albums-empty") { AlbumsEmpty() }

                else -> itemsIndexed(
                    items = albumsState.albums,
                    key = { _, album -> album.id },
                ) { index, album ->
                    val coverColor = ALBUM_COVERS[index % ALBUM_COVERS.size]
                    AntaraTrackRow(
                        title = album.nombre,
                        subtitle = album.descripcion
                            ?: album.artista?.let { stringResource(R.string.home_album_artist, it) }
                            ?: stringResource(R.string.home_album_generic),
                        coverColor = coverColor,
                        coverUrl = resolveCoverUrl(album.portadaUrl, coverBaseUrl),
                        onPlay = null,
                        onRowClick = { onOpenAlbum(album, coverColor) },
                    )
                }
            }
        } else {
            itemsIndexed(content.playlists, key = { _, item -> item.id }) { _, item ->
                AntaraTrackRow(
                    title = item.title,
                    subtitle = stringResource(
                        R.string.home_playlist_subtitle,
                        item.artist,
                        item.trackCount,
                    ),
                    coverColor = item.coverColor,
                    isCurrent = playerState.currentId == item.id,
                    isPlaying = playerState.isPlaying,
                    onPlay = { onPlayIndex(item.songIndex) },
                )
            }
        }
    }
}

@Composable
private fun AlbumsLoading() {
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
private fun AlbumsError(messageRes: Int, onRetry: () -> Unit) {
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
private fun AlbumsEmpty() {
    Text(
        text = stringResource(R.string.home_albums_empty),
        style = AntaraTheme.typography.bodySmall,
        color = AntaraTheme.extendedColors.textSecondary,
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = AntaraTheme.spacing.lg, vertical = AntaraTheme.spacing.md),
    )
}

@Composable
private fun filterLabel(filter: HomeFilter): String = stringResource(
    when (filter) {
        HomeFilter.All -> R.string.home_filter_all
        HomeFilter.NewReleases -> R.string.home_filter_new
        HomeFilter.Trending -> R.string.home_filter_trending
        HomeFilter.TopSongs -> R.string.home_filter_top
    },
)
