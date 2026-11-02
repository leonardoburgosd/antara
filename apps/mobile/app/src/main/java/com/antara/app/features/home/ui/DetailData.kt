package com.antara.app.features.home.ui

import androidx.compose.ui.graphics.Color
import com.antara.app.core.designsystem.color.AntaraDarkTokens
import com.antara.app.navigation.Routes

/** Paleta de portadas de ejemplo; solo colores derivados de tokens (design system). */
internal val mockCoverPalette = listOf(
    AntaraDarkTokens.Primary,
    AntaraDarkTokens.Accent,
    AntaraDarkTokens.AccentWarm,
    AntaraDarkTokens.Info,
    AntaraDarkTokens.Success,
    AntaraDarkTokens.Error,
)

/** Canción de la lista de detalle (mock). */
data class SongItem(
    val id: String,
    val title: String,
    val artist: String,
    val coverColor: Color,
)

/** Contenido del detalle: "Mi música" o un álbum. */
sealed interface DetailContent {
    val title: String
    val subtitle: String?
    val songs: List<SongItem>

    data class Liked(
        override val title: String = "Mi música",
        override val subtitle: String? = null,
        override val songs: List<SongItem>,
    ) : DetailContent

    data class Album(
        override val title: String,
        val artist: String,
        override val subtitle: String = "De $artist",
        override val songs: List<SongItem>,
    ) : DetailContent
}

/** Nº de canciones que te gustan (para las filas de Home). */
val likedSongsCount: Int
    get() = likedSongSpecs.size

// -----------------------------------------------------------------------------
// Datos de ejemplo (mock). Sustituir por datos reales cuando exista backend.
// -----------------------------------------------------------------------------

private data class AlbumSpec(
    val id: String,
    val title: String,
    val artist: String,
    val year: Int,
    val colorIndex: Int,
    val tracks: List<String>,
)

private data class LikedSongSpec(
    val id: String,
    val title: String,
    val artist: String,
    val colorIndex: Int,
)

private val albumSpecs = listOf(
    AlbumSpec(
        "midnight-reverie", "Midnight Reverie", "Luna Vale", 2024, 0,
        listOf("Reverie", "Sombras y Neón", "Insomnio", "Última Luz"),
    ),
    AlbumSpec(
        "sol-de-invierno", "Sol de Invierno", "Los Cometas", 2024, 1,
        listOf("Sol de Invierno", "Días Cortos", "Abrigo", "Nieve"),
    ),
    AlbumSpec(
        "electro-nights", "Electro Nights", "DJ Prism", 2024, 2,
        listOf("Electro Nights", "Bajo Profundo", "Láser", "After Hours"),
    ),
    AlbumSpec(
        "acustico-en-vivo", "Acústico en Vivo", "Marina Ríos", 2023, 3,
        listOf("Acústico", "Vuelo", "Cerca del Cielo", "Encore"),
    ),
    AlbumSpec(
        "rutas-antiguas", "Rutas Antiguas", "Trío Cóndor", 2023, 4,
        listOf("Rutas Antiguas", "Piedra y Sol", "Cerro", "Viento Sur"),
    ),
    AlbumSpec(
        "neon-dreams", "Neon Dreams", "Luna Vale", 2023, 5,
        listOf("Ciudad de Neón", "Días Eléctricos", "Espejo", "Amanecer Digital"),
    ),
    AlbumSpec(
        "glass-hours", "Glass Hours", "Luna Vale", 2021, 3,
        listOf("Cristal", "Horas Perdidas", "Reflejos"),
    ),
    AlbumSpec(
        "caminos", "Caminos", "Los Cometas", 2021, 4,
        listOf("Caminos", "Polvo y Asfalto", "Desvío"),
    ),
    AlbumSpec(
        "frecuencia", "Frecuencia", "DJ Prism", 2022, 0,
        listOf("Frecuencia", "Onda", "Ruido Blanco"),
    ),
    AlbumSpec(
        "marea", "Marea", "Marina Ríos", 2021, 2,
        listOf("Marea", "Orilla", "Corriente"),
    ),
    AlbumSpec(
        "altiplano", "Altiplano", "Trío Cóndor", 2020, 5,
        listOf("Altiplano", "Soroche", "Horizonte"),
    ),
)

private val likedSongSpecs = listOf(
    LikedSongSpec("liked-1", "Latido Nocturno", "Luna Vale", 0),
    LikedSongSpec("liked-2", "Corriente Viva", "DJ Prism", 2),
    LikedSongSpec("liked-3", "Marea Alta", "Marina Ríos", 3),
    LikedSongSpec("liked-4", "Sol Abierto", "Los Cometas", 1),
    LikedSongSpec("liked-5", "Sendero", "Trío Cóndor", 4),
    LikedSongSpec("liked-6", "Ciudad de Neón", "Luna Vale", 5),
    LikedSongSpec("liked-7", "Pulso", "DJ Prism", 0),
    LikedSongSpec("liked-8", "Vidrio Roto", "The Static Hearts", 1),
)

/** Resuelve el contenido de un detalle a partir de su ruta. */
fun detailContentFor(route: String): DetailContent? = when {
    route == Routes.LIKED -> DetailContent.Liked(
        songs = likedSongSpecs.map { it.toSong() },
    )
    route.startsWith(Routes.ALBUM_PREFIX) -> {
        val id = route.removePrefix(Routes.ALBUM_PREFIX)
        albumSpecs.find { it.id == id }?.toDetailContent()
    }
    else -> null
}

private fun LikedSongSpec.toSong() = SongItem(
    id = id,
    title = title,
    artist = artist,
    coverColor = mockCoverPalette[colorIndex],
)

private fun AlbumSpec.toDetailContent(): DetailContent.Album {
    val color = mockCoverPalette[colorIndex]
    return DetailContent.Album(
        title = title,
        artist = artist,
        songs = tracks.mapIndexed { index, trackTitle ->
            SongItem(id = "$id-$index", title = trackTitle, artist = artist, coverColor = color)
        },
    )
}
