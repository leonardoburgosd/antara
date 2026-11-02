package com.antara.app.features.home.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.antara.app.R
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.components.AntaraFilterChips
import com.antara.app.core.designsystem.components.AntaraTrackRow
import com.antara.app.player.PlayerUiState

/** Filtros de la lista de detalle. */
private enum class DetailFilter { All, NewReleases, Trending, TopSongs }

/**
 * Detalle de "Mi música" o de un álbum, con la forma de la referencia central:
 * barra superior, chips de filtro y lista de canciones con acción de reproducción.
 */
@Composable
fun DetailScreen(
    route: String,
    playerState: PlayerUiState,
    onBack: () -> Unit,
    onPlayQueue: (List<SongItem>, Int) -> Unit,
    bottomContentPadding: Dp = 0.dp,
    modifier: Modifier = Modifier,
) {
    val content = remember(route) { detailContentFor(route) } ?: return
    var selectedFilterIndex by rememberSaveable { mutableIntStateOf(DetailFilter.All.ordinal) }
    val selectedFilter = DetailFilter.entries[selectedFilterIndex]

    val songs = remember(content, selectedFilter) {
        when (selectedFilter) {
            DetailFilter.All -> content.songs
            DetailFilter.NewReleases -> content.songs.reversed()
            DetailFilter.Trending -> content.songs.sortedBy { it.artist }
            DetailFilter.TopSongs -> content.songs.take(5)
        }
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(AntaraTheme.colorScheme.background),
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            DetailTopBar(
                title = content.title,
                onBack = onBack,
                onNotificationsClick = { },
                onFavoritesClick = { },
            )
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = AntaraTheme.spacing.xxl + bottomContentPadding),
            ) {
                item(key = "filters") {
                    Spacer(Modifier.height(AntaraTheme.spacing.sm))
                    Box(modifier = Modifier.padding(horizontal = AntaraTheme.spacing.lg)) {
                        AntaraFilterChips(
                            labels = DetailFilter.entries.map { filterLabel(it) },
                            selectedIndex = selectedFilterIndex,
                            onSelect = { selectedFilterIndex = it },
                        )
                    }
                    Spacer(Modifier.height(AntaraTheme.spacing.md))
                }
                item(key = "summary") {
                    DetailSummary(count = content.songs.size)
                    Spacer(Modifier.height(AntaraTheme.spacing.sm))
                }
                item(key = "section") {
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
                items(songs, key = { it.id }) { song ->
                    val originalIndex = content.songs.indexOf(song)
                    AntaraTrackRow(
                        title = song.title,
                        subtitle = stringResource(R.string.detail_track_subtitle, song.artist),
                        coverColor = song.coverColor,
                        isCurrent = playerState.currentId == song.id,
                        isPlaying = playerState.isPlaying,
                        onPlay = { onPlayQueue(content.songs, originalIndex) },
                    )
                }
            }
        }
    }
}

@Composable
private fun filterLabel(filter: DetailFilter): String = stringResource(
    when (filter) {
        DetailFilter.All -> R.string.home_filter_all
        DetailFilter.NewReleases -> R.string.home_filter_new
        DetailFilter.Trending -> R.string.home_filter_trending
        DetailFilter.TopSongs -> R.string.home_filter_top
    },
)
