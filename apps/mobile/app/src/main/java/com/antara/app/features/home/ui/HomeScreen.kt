package com.antara.app.features.home.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import com.antara.app.R
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.spacing.AntaraSpacing
import java.util.Calendar

/**
 * Pantalla de Home: saludo por hora + tuerca, tags filtro (Música/Audiolibros),
 * grid de 2 columnas (Liked Songs + playlists / crear playlist) y carruseles de sugeridos.
 * Los tags cambian TODO el contenido de abajo (un grupo visible a la vez).
 */
@Composable
fun HomeScreen(
    modifier: Modifier = Modifier,
    onOpenLikedSongs: () -> Unit = {},
    onOpenAlbum: (String) -> Unit = {},
    onSettingsClick: () -> Unit = {},
) {
    // Estado de UI de la pantalla (filtro); sobrevive a rotación (rememberSaveable).
    var selectedTagIndex by rememberSaveable { mutableIntStateOf(HomeTag.Music.ordinal) }
    val selectedTag = HomeTag.entries[selectedTagIndex]
    // Contenido derivado del tag seleccionado.
    val content = remember(selectedTag) { buildHomeContent(selectedTag) }
    // La navegación a detalle solo aplica al contenido de Música.
    val isMusic = selectedTag == HomeTag.Music

    LazyVerticalGrid(
        columns = GridCells.Fixed(2),
        contentPadding = PaddingValues(
            start = AntaraSpacing.lg,
            end = AntaraSpacing.lg,
            top = AntaraSpacing.sm,
            bottom = AntaraSpacing.xl,
        ),
        horizontalArrangement = Arrangement.spacedBy(AntaraSpacing.sm),
        verticalArrangement = Arrangement.spacedBy(AntaraSpacing.sm),
        modifier = modifier.fillMaxSize(),
    ) {
        // Cabecera: saludo a la izquierda, tuerca a la derecha (ancho completo).
        item(span = { GridItemSpan(maxLineSpan) }) {
            GreetingHeader(onSettingsClick = onSettingsClick)
        }
        // Tags filtro (ancho completo).
        item(span = { GridItemSpan(maxLineSpan) }) {
            FilterTags(
                selected = selectedTag,
                onSelect = { selectedTagIndex = it.ordinal },
            )
        }
        // Grid: Liked Songs + playlists (o "Crear playlist" en espacios vacíos).
        items(content.tiles, key = { it.id }) { tile ->
            GridTileView(
                tile = tile,
                onClick = {
                    if (isMusic && tile is GridTile.Liked) onOpenLikedSongs()
                },
            )
        }
        // Carrusel de sugeridos: se oculta si la lista está vacía.
        if (content.suggested.isNotEmpty()) {
            item(span = { GridItemSpan(maxLineSpan) }) {
                SuggestedCarousel(
                    items = content.suggested,
                    contentDescriptionPrefix = stringResource(
                        if (selectedTag == HomeTag.Music) {
                            R.string.suggested_albums
                        } else {
                            R.string.suggested_audiobooks
                        },
                    ),
                    onItemClick = { item ->
                        if (isMusic) onOpenAlbum(item.id)
                    },
                )
            }
        }
    }
}

/** Cabecera: saludo simple según la hora + icono de tuerca a la derecha. */
@Composable
private fun GreetingHeader(onSettingsClick: () -> Unit) {
    // remember: la hora se calcula una vez por composición (no side-effect en el cuerpo).
    val greeting = remember {
        when (Calendar.getInstance().get(Calendar.HOUR_OF_DAY)) {
            in 6..12 -> "Buenos días"
            in 13..19 -> "Buenas tardes"
            else -> "Buenas noches"
        }
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = AntaraSpacing.sm),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text = greeting,
            style = AntaraTheme.typography.headlineMedium,
            color = AntaraTheme.colorScheme.onBackground,
        )
        IconButton(onClick = onSettingsClick) {
            Icon(
                imageVector = Icons.Filled.Settings,
                contentDescription = stringResource(R.string.settings),
                tint = AntaraTheme.colorScheme.onBackground,
            )
        }
    }
}

/** Tags "Música" / "Audiolibros": al cambiarlos se filtra todo el contenido inferior. */
@Composable
private fun FilterTags(
    selected: HomeTag,
    onSelect: (HomeTag) -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = AntaraSpacing.xs),
        horizontalArrangement = Arrangement.spacedBy(AntaraSpacing.sm),
    ) {
        HomeTag.entries.forEach { tag ->
            val isSelected = tag == selected
            Text(
                text = when (tag) {
                    HomeTag.Music -> stringResource(R.string.tag_music)
                    HomeTag.Audiobooks -> stringResource(R.string.tag_audiobooks)
                },
                style = AntaraTheme.typography.labelLarge,
                color = if (isSelected) {
                    AntaraTheme.colorScheme.onPrimary
                } else {
                    AntaraTheme.extendedColors.textSecondary
                },
                modifier = Modifier
                    .clip(RoundedCornerShape(50)) // pill shape (radio full)
                    .background(
                        if (isSelected) {
                            AntaraTheme.colorScheme.primary
                        } else {
                            AntaraTheme.extendedColors.surfaceElevated
                        },
                    )
                    .clickable { onSelect(tag) }
                    .padding(horizontal = AntaraSpacing.lg, vertical = AntaraSpacing.sm),
            )
        }
    }
}
