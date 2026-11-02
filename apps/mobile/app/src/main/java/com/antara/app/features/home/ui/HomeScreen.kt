package com.antara.app.features.home.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
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
import java.util.Calendar

/**
 * Home de Antara siguiendo la referencia: saludo + acciones, titular, filtros,
 * carrusel "Curado y en tendencia" y lista de playlists diarias.
 */
@Composable
fun HomeScreen(
    userName: String,
    playerState: PlayerUiState,
    onOpenServers: () -> Unit,
    onOpenLikedSongs: () -> Unit,
    onPlayIndex: (Int) -> Unit,
    bottomContentPadding: Dp = 0.dp,
    modifier: Modifier = Modifier,
) {
    var selectedFilterIndex by rememberSaveable { mutableIntStateOf(HomeFilter.All.ordinal) }
    val selectedFilter = HomeFilter.entries[selectedFilterIndex]
    val content = remember(selectedFilter) { buildHomeContent(selectedFilter) }

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
                items = content.featured,
                onPlay = { onPlayIndex(0) },
                onOpen = { onOpenLikedSongs() },
            )
        }
        item(key = "playlists-header") {
            Spacer(Modifier.height(AntaraTheme.spacing.xl))
            HomeSectionHeader(
                title = content.playlistsTitle,
                onSeeAll = onOpenLikedSongs,
            )
        }
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

@Composable
private fun filterLabel(filter: HomeFilter): String = stringResource(
    when (filter) {
        HomeFilter.All -> R.string.home_filter_all
        HomeFilter.NewReleases -> R.string.home_filter_new
        HomeFilter.Trending -> R.string.home_filter_trending
        HomeFilter.TopSongs -> R.string.home_filter_top
    },
)
