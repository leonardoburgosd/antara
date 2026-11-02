package com.antara.app.features.home.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.spacing.AntaraSpacing

/**
 * Celda del grid de Home (2 por fila): miniatura cuadrada 48dp + título.
 * Liked/A favoritos usa un degradado primario→accent; "Crear playlist" muestra un "+".
 */
@Composable
fun GridTileView(
    tile: GridTile,
    onClick: () -> Unit = {},
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(MaterialTheme.shapes.medium)
            .background(AntaraTheme.extendedColors.surfaceElevated)
            .clickable(onClick = onClick)
            .padding(AntaraSpacing.xs),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        TileThumbnail(tile)
        Spacer(Modifier.width(AntaraSpacing.sm))
        Text(
            text = tileTitle(tile),
            style = AntaraTheme.typography.labelLarge,
            color = AntaraTheme.colorScheme.onSurface,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.weight(1f),
        )
    }
}

@Composable
private fun TileThumbnail(tile: GridTile) {
    val shape = AntaraTheme.shapes.small // radius sm (tokens)
    when (tile) {
        is GridTile.Liked -> Box(
            modifier = Modifier
                .size(48.dp)
                .clip(shape)
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
                modifier = Modifier.size(24.dp),
            )
        }
        is GridTile.Playlist -> Box(
            modifier = Modifier
                .size(48.dp)
                .clip(shape)
                .background(tile.coverColor),
        )
        is GridTile.CreatePlaylist -> Box(
            modifier = Modifier
                .size(48.dp)
                .clip(shape)
                .background(AntaraTheme.colorScheme.surfaceVariant),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = Icons.Filled.Add,
                contentDescription = null,
                tint = AntaraTheme.colorScheme.primary,
                modifier = Modifier.size(24.dp),
            )
        }
    }
}

private fun tileTitle(tile: GridTile): String = when (tile) {
    is GridTile.Liked -> tile.label
    is GridTile.Playlist -> tile.title
    is GridTile.CreatePlaylist -> "Crear playlist"
}

/**
 * Carrusel horizontal de sugeridos: muestra 2 portadas completas + 1/8 de la tercera.
 * Solo la imagen de la portada (cuadrada, sin texto). Con datos reales la portada será
 * una imagen cargada; hoy es un placeholder de color dominante.
 */
@Composable
fun SuggestedCarousel(
    items: List<HomeMediaItem>,
    contentDescriptionPrefix: String,
) {
    val configuration = LocalConfiguration.current
    val screenWidth = configuration.screenWidthDp.dp
    // Ancho disponible = pantalla - padding horizontal del grid (lg a cada lado).
    val available = screenWidth - AntaraSpacing.lg * 2
    val gap = AntaraSpacing.md
    // 2 portadas + gap + 1/8 de la tercera caben en `available`:
    // itemSize * 2 + gap * 2 + itemSize / 8 = available  →  itemSize = (available - 2*gap) / 2.125
    val itemSize = (available - gap * 2) / 2.125f

    LazyRow(
        horizontalArrangement = Arrangement.spacedBy(gap),
        modifier = Modifier.fillMaxWidth(),
    ) {
        items(items, key = { it.id }) { item ->
            // Portada: solo la imagen (sin texto). Con backend se sustituirá por AsyncImage(item.imageUrl).
            Box(
                modifier = Modifier
                    .size(itemSize)
                    .clip(MaterialTheme.shapes.medium)
                    .background(item.coverColor)
                    .semantics { contentDescription = "$contentDescriptionPrefix: ${item.title}" },
            )
        }
    }
}
