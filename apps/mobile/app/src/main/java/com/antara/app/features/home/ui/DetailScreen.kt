package com.antara.app.features.home.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.antara.app.R
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.spacing.AntaraSpacing

/**
 * Pantalla de detalle de "Canciones que te gustan" o de un álbum, con la forma de la
 * referencia: imagen grande + título, botón play (morado), menú "Música"/"Álbumes",
 * fila "Canciones que te gustan" y lista de canciones con menú de 3 puntos por canción.
 * Sin Follow, monthly listeners, 3 puntos de cabecera ni Clips/Events/Merch.
 */
@Composable
fun DetailScreen(
    route: String,
    onBack: () -> Unit,
    onOpenLikedSongs: () -> Unit,
    onOpenAlbum: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val content = remember(route) { detailContentFor(route) } ?: return

    var selectedTabIndex by rememberSaveable { mutableIntStateOf(0) }
    var optionsSong by remember { mutableStateOf<SongItem?>(null) }
    // La pestaña "Álbumes" solo aplica a álbumes; Liked Songs siempre muestra "Música".
    val activeTabIndex = if (content.isAlbum) selectedTabIndex else 0

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(AntaraTheme.colorScheme.background),
    ) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = AntaraSpacing.xl),
        ) {
            item(key = "hero") { DetailHero(content) }
            item(key = "play") { PlayRow() }
            if (content.isAlbum) {
                item(key = "tabs") {
                    DetailTabs(
                        selectedIndex = selectedTabIndex,
                        onSelect = { selectedTabIndex = it },
                    )
                }
            }
            when (activeTabIndex) {
                0 -> {
                    item(key = "liked-row") {
                        LikedSongsRow(
                            songCount = likedSongsCount,
                            onClick = onOpenLikedSongs,
                        )
                    }
                    item(key = "songs-header") {
                        SectionHeader(stringResource(R.string.section_songs))
                    }
                    itemsIndexed(content.songs, key = { _, song -> song.id }) { index, song ->
                        SongRow(
                            number = index + 1,
                            song = song,
                            onOptionsClick = { optionsSong = song },
                        )
                    }
                }
                else -> {
                    val otherAlbums = (content as DetailContent.Album).otherAlbums
                    if (otherAlbums.isEmpty()) {
                        item(key = "albums-empty") { EmptyAlbums() }
                    } else {
                        items(otherAlbums.chunked(2), key = { pair -> pair.first().id }) { pair ->
                            AlbumGridRow(pair = pair, onClick = onOpenAlbum)
                        }
                    }
                }
            }
        }
        DetailBackButton(onClick = onBack)
    }

    optionsSong?.let { song ->
        SongOptionsSheet(song = song, onDismiss = { optionsSong = null })
    }
}

/** Imagen grande (portada/gradiente) con título (y artista si es álbum) al pie. */
@Composable
private fun DetailHero(content: DetailContent) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(340.dp),
    ) {
        // Portada: con backend se sustituirá por AsyncImage.
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(content.heroColor),
        )
        // Fundido hacia el fondo para legibilidad del título.
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color.Transparent, AntaraTheme.colorScheme.background),
                    ),
                ),
        )
        if (!content.isAlbum) {
            Icon(
                imageVector = Icons.Filled.Favorite,
                contentDescription = null,
                tint = AntaraTheme.colorScheme.onPrimary,
                modifier = Modifier
                    .align(Alignment.Center)
                    .size(72.dp),
            )
        }
        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(horizontal = AntaraSpacing.lg, vertical = AntaraSpacing.lg),
        ) {
            Text(
                text = content.title,
                style = AntaraTheme.typography.displaySmall,
                color = AntaraTheme.colorScheme.onBackground,
            )
            content.subtitle?.let { subtitle ->
                Text(
                    text = subtitle,
                    style = AntaraTheme.typography.titleMedium,
                    color = AntaraTheme.colorScheme.onBackground,
                )
            }
        }
    }
}

/** Fila con el botón play (círculo morado `primary`) alineado a la derecha. */
@Composable
private fun PlayRow() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = AntaraSpacing.lg, vertical = AntaraSpacing.sm),
        horizontalArrangement = Arrangement.End,
    ) {
        Box(
            modifier = Modifier
                .size(56.dp)
                .clip(CircleShape)
                .background(AntaraTheme.colorScheme.primary)
                .clickable { /* Sin reproductor todavía (mock). */ },
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = Icons.Filled.PlayArrow,
                contentDescription = stringResource(R.string.play),
                tint = AntaraTheme.colorScheme.onPrimary,
                modifier = Modifier.size(28.dp),
            )
        }
    }
}

/** Menú de pestañas: "Música" y "Álbumes" (otros álbumes del artista). */
@Composable
private fun DetailTabs(
    selectedIndex: Int,
    onSelect: (Int) -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = AntaraSpacing.lg, vertical = AntaraSpacing.sm),
        horizontalArrangement = Arrangement.spacedBy(AntaraSpacing.xl),
    ) {
        DetailTabItem(
            label = stringResource(R.string.tab_music),
            selected = selectedIndex == 0,
            onClick = { onSelect(0) },
        )
        DetailTabItem(
            label = stringResource(R.string.tab_albums),
            selected = selectedIndex == 1,
            onClick = { onSelect(1) },
        )
    }
}

@Composable
private fun DetailTabItem(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
) {
    Column(
        modifier = Modifier
            // Ancho mínimo = texto, para que el subrayado abarque solo la etiqueta
            // y la segunda pestaña quepa en la fila.
            .width(IntrinsicSize.Min)
            .clip(MaterialTheme.shapes.small)
            .clickable(onClick = onClick)
            .padding(bottom = AntaraSpacing.xs),
    ) {
        Text(
            text = label,
            style = AntaraTheme.typography.labelLarge,
            color = if (selected) {
                AntaraTheme.colorScheme.onBackground
            } else {
                AntaraTheme.extendedColors.textSecondary
            },
        )
        Spacer(Modifier.height(AntaraSpacing.xs))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(3.dp)
                .background(if (selected) AntaraTheme.colorScheme.primary else Color.Transparent),
        )
    }
}

/** Botón volver (flecha en círculo) fijo arriba a la izquierda sobre la imagen. */
@Composable
private fun BoxScope.DetailBackButton(onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .align(Alignment.TopStart)
            .statusBarsPadding()
            .padding(start = AntaraSpacing.sm, top = AntaraSpacing.xs)
            .size(48.dp)
            .clip(CircleShape)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(CircleShape)
                .background(AntaraTheme.colorScheme.surface),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = Icons.Filled.ArrowBack,
                contentDescription = stringResource(R.string.detail_back),
                tint = AntaraTheme.colorScheme.onSurface,
                modifier = Modifier.size(24.dp),
            )
        }
    }
}
