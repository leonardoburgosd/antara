package com.antara.app.features.home.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.MoreHoriz
import androidx.compose.material.icons.outlined.Shuffle
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.antara.app.R
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.components.AntaraHeaderActions
import com.antara.app.core.designsystem.components.AntaraSectionHeader

/** Cabecera de Home: avatar, saludo + nombre y acciones (badge, favoritos, servidores). */
@Composable
fun HomeHeader(
    greeting: String,
    userName: String,
    onNotificationsClick: () -> Unit,
    onFavoritesClick: () -> Unit,
    onServersClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = AntaraTheme.spacing.lg, vertical = AntaraTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .size(42.dp)
                .clip(CircleShape)
                .background(AntaraTheme.colorScheme.primary),
            contentAlignment = Alignment.Center,
        ) {
            Text(
                text = userName.trim().firstOrNull()?.uppercase() ?: "A",
                style = AntaraTheme.typography.titleMedium,
                color = AntaraTheme.colorScheme.onPrimary,
            )
        }
        Spacer(Modifier.width(AntaraTheme.spacing.md))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = greeting,
                style = AntaraTheme.typography.bodySmall,
                color = AntaraTheme.extendedColors.textSecondary,
            )
            Text(
                text = userName,
                style = AntaraTheme.typography.titleSmall,
                color = AntaraTheme.colorScheme.onBackground,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        AntaraHeaderActions(
            onNotificationsClick = onNotificationsClick,
            onFavoritesClick = onFavoritesClick,
            onServersClick = onServersClick,
            notificationsDescription = stringResource(R.string.home_notifications),
            favoritesDescription = stringResource(R.string.home_favorites),
            serversDescription = stringResource(R.string.servers_open),
        )
    }
}

/** Titular grande de Home ("Tu música, en cualquier momento"). */
@Composable
fun HomeHeadline() {
    Text(
        text = stringResource(R.string.home_headline),
        style = AntaraTheme.typography.displaySmall,
        color = AntaraTheme.colorScheme.onBackground,
        modifier = Modifier.padding(horizontal = AntaraTheme.spacing.lg),
    )
}

/** Cabecera de sección con "Ver todo". */
@Composable
fun HomeSectionHeader(
    title: String,
    onSeeAll: () -> Unit,
) {
    AntaraSectionHeader(
        title = title,
        actionText = stringResource(R.string.home_see_all),
        onAction = onSeeAll,
        modifier = Modifier.padding(horizontal = AntaraTheme.spacing.lg),
    )
}

/** Carrusel de tarjetas destacadas (2 visibles parcialmente, como la referencia). */
@Composable
fun FeaturedCarousel(
    items: List<FeaturedItem>,
    onPlay: (FeaturedItem) -> Unit,
    onOpen: (FeaturedItem) -> Unit,
) {
    val screenWidth = LocalConfiguration.current.screenWidthDp.dp
    val cardWidth = (screenWidth * 0.82f).coerceAtMost(340.dp)
    val listState = rememberLazyListState()

    // Al cambiar de filtro el contenido se reordena: vuelve al inicio del carrusel.
    LaunchedEffect(items) {
        listState.scrollToItem(0)
    }

    LazyRow(
        state = listState,
        contentPadding = PaddingValues(horizontal = AntaraTheme.spacing.lg),
        horizontalArrangement = Arrangement.spacedBy(AntaraTheme.spacing.md),
    ) {
        items(items, key = { it.id }) { item ->
            FeaturedCard(
                item = item,
                width = cardWidth,
                onPlay = { onPlay(item) },
                onOpen = { onOpen(item) },
            )
        }
    }
}

@Composable
private fun FeaturedCard(
    item: FeaturedItem,
    width: androidx.compose.ui.unit.Dp,
    onPlay: () -> Unit,
    onOpen: () -> Unit,
) {
    val contentColor = if (item.darkText) {
        AntaraTheme.colorScheme.background
    } else {
        AntaraTheme.colorScheme.onPrimary
    }

    Column(
        modifier = Modifier
            .width(width)
            .height(172.dp)
            .clip(MaterialTheme.shapes.extraLarge)
            .background(item.background)
            .clickable(onClick = onOpen)
            .padding(AntaraTheme.spacing.lg),
    ) {
        Text(
            text = item.title,
            style = AntaraTheme.typography.headlineSmall,
            color = contentColor,
        )
        Spacer(Modifier.height(AntaraTheme.spacing.xs))
        Text(
            text = item.subtitle,
            style = AntaraTheme.typography.bodySmall,
            color = contentColor,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
        )
        Spacer(Modifier.weight(1f))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(AntaraTheme.colorScheme.background)
                    .clickable(onClick = onPlay),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    imageVector = Icons.Filled.PlayArrow,
                    contentDescription = stringResource(R.string.play),
                    tint = AntaraTheme.colorScheme.primary,
                    modifier = Modifier.size(24.dp),
                )
            }
            Spacer(Modifier.width(AntaraTheme.spacing.sm))
            IconButton(onClick = onOpen) {
                Icon(
                    imageVector = Icons.Outlined.FavoriteBorder,
                    contentDescription = stringResource(R.string.home_favorites),
                    tint = contentColor,
                )
            }
            IconButton(onClick = onOpen) {
                Icon(
                    imageVector = Icons.Outlined.Shuffle,
                    contentDescription = stringResource(R.string.player_shuffle),
                    tint = contentColor,
                )
            }
            IconButton(onClick = onOpen) {
                Icon(
                    imageVector = Icons.Outlined.MoreHoriz,
                    contentDescription = stringResource(R.string.song_options),
                    tint = contentColor,
                )
            }
        }
    }
}
