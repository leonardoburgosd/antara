package com.antara.app.features.home.ui

import androidx.compose.ui.graphics.Color

/** Tipo de contenido filtrado por los tags de Home. */
enum class HomeTag { Music, Audiobooks }

/**
 * Modelo de contenido mostrado en Home (mock; sin backend todavía).
 * `coverColor` representa el color dominante de la portada (hoy un placeholder de color;
 * con backend real será una URL de imagen cargada con un cargador de imágenes).
 */
data class HomeMediaItem(
    val id: String,
    val title: String,
    val subtitle: String,
    val coverColor: Color,
)

/**
 * Celda del grid de Home. Puede ser Liked Songs, una playlist real o el placeholder "Crear playlist".
 */
sealed interface GridTile {
    val id: String

    /** Celda "Liked Songs" / "A favoritos" (siempre presente, primera del grid). */
    data class Liked(
        override val id: String = "liked",
        val label: String,
    ) : GridTile

    /** Playlist o colección real del usuario. */
    data class Playlist(
        override val id: String,
        val title: String,
        val coverColor: Color,
    ) : GridTile

    /** Placeholder "Crear playlist" para espacios vacíos del grid. */
    data class CreatePlaylist(
        override val id: String,
    ) : GridTile
}

/**
 * Contenido de Home para una etiqueta (tag) seleccionada.
 * Si las listas están vacías: el grid se rellena con "Crear playlist" y las secciones
 * de sugeridos se ocultan (ver [HomeScreen]).
 */
data class HomeContent(
    val tiles: List<GridTile>,
    val suggested: List<HomeMediaItem>,
)

// -----------------------------------------------------------------------------
// Datos de ejemplo (mock). Sustituir por datos reales cuando exista backend.
// La paleta de portadas vive en DetailData.kt (compartida con los detalles).
// -----------------------------------------------------------------------------

/** Playlists de ejemplo (Música). */
private val mockPlaylists = listOf(
    "Favoritos 2024" to 0,
    "Workout Mix" to 1,
    "Lo-Fi Chill" to 2,
    "Éxitos Latidos" to 3,
    "Ruta de Viaje" to 4,
)

/** Colecciones de audiolibros de ejemplo (Audiolibros). */
private val mockAudiobookCollections = listOf(
    "Misterio Clásico" to 1,
    "Historia Universal" to 2,
    "Ciencia Ficción" to 3,
    "Desarrollo Personal" to 4,
    "Crimen y Misterio" to 5,
)

/** Audiolibros sugeridos de ejemplo (Audiolibros). */
private val mockSuggestedAudiobooks = listOf(
    "El secreto de la mansión" to "A. R. Blackwood",
    "Breve historia del tiempo" to "C. Nakamura",
    "El código interno" to "S. Petrov",
    "Sombras en la niebla" to "M. Castillo",
    "El arte de la estrategia" to "L. Fernández",
    "Crónicas del espacio" to "K. O'Neill",
)

/**
 * Construye el contenido de Home para la etiqueta dada.
 * Reglas:
 * - El grid empieza siempre por Liked Songs / A favoritos.
 * - Se añaden hasta 5 playlists/colecciones; los espacios vacíos hasta 6 se rellenan con "Crear playlist".
 * - Las secciones de sugeridos se ocultan si la lista está vacía.
 */
fun buildHomeContent(tag: HomeTag): HomeContent = when (tag) {
    HomeTag.Music -> {
        val playlistTiles: List<GridTile> = mockPlaylists.mapIndexed { index, (title, colorIndex) ->
            GridTile.Playlist(
                id = "playlist-$index",
                title = title,
                coverColor = mockCoverPalette[colorIndex % mockCoverPalette.size],
            )
        }
        HomeContent(
            tiles = buildTiles(
                first = GridTile.Liked(label = "Canciones que te gustan"),
                items = playlistTiles,
            ),
            suggested = suggestedAlbums,
        )
    }
    HomeTag.Audiobooks -> {
        val collectionTiles: List<GridTile> = mockAudiobookCollections.mapIndexed { index, (title, colorIndex) ->
            GridTile.Playlist(
                id = "audiobook-collection-$index",
                title = title,
                coverColor = mockCoverPalette[colorIndex % mockCoverPalette.size],
            )
        }
        HomeContent(
            tiles = buildTiles(
                first = GridTile.Liked(label = "A favoritos"),
                items = collectionTiles,
            ),
            suggested = mockSuggestedAudiobooks.mapIndexed { index, (title, author) ->
                HomeMediaItem(
                    id = "audiobook-$index",
                    title = title,
                    subtitle = author,
                    coverColor = mockCoverPalette[index % mockCoverPalette.size],
                )
            },
        )
    }
}

/**
 * Combina la celda inicial (Liked Songs) con las playlists y rellena los espacios
 * vacíos hasta 6 con "Crear playlist" (2 columnas × 3 filas).
 */
private fun buildTiles(first: GridTile, items: List<GridTile>): List<GridTile> {
    val totalSlots = 6
    val createPlaceholders = (items.size + 1 until totalSlots).map { index ->
        GridTile.CreatePlaylist(id = "create-playlist-$index")
    }
    return buildList {
        add(first)
        addAll(items)
        addAll(createPlaceholders)
    }
}
