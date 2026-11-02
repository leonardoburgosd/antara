package com.antara.app.features.home.ui

import androidx.compose.ui.graphics.Color
import com.antara.app.core.designsystem.color.AntaraDarkTokens
import com.antara.app.navigation.Routes

/** Filtros de contenido de Home (chips de la referencia). */
enum class HomeFilter { All, NewReleases, Trending, TopSongs }

/** Tarjeta destacada del carrusel "Curado y en tendencia". */
data class FeaturedItem(
    val id: String,
    val title: String,
    val subtitle: String,
    val background: Color,
    val darkText: Boolean,
    val badge: String? = null,
)

/** Playlist de la sección "Playlists diarias". */
data class PlaylistItem(
    val id: String,
    val title: String,
    val artist: String,
    val coverColor: Color,
    val trackCount: Int,
    val songIndex: Int,
)

/** Contenido completo de Home para un filtro. */
data class HomeContent(
    val curatedTitle: String,
    val featured: List<FeaturedItem>,
    val playlistsTitle: String,
    val playlists: List<PlaylistItem>,
)

/** Construye el contenido mock (se sustituirá por repositorio cuando exista backend). */
fun buildHomeContent(filter: HomeFilter): HomeContent {
    val songs = detailContentFor(Routes.LIKED)?.songs.orEmpty()
    val playlists = songs.mapIndexed { index, song ->
        PlaylistItem(
            id = song.id,
            title = song.title,
            artist = song.artist,
            coverColor = song.coverColor,
            trackCount = songs.size,
            songIndex = index,
        )
    }

    val discover = FeaturedItem(
        id = "discover-weekly",
        title = "Descubre semanal",
        subtitle = "Lo mejor de tu semana, elegido para ti",
        background = AntaraDarkTokens.Primary,
        darkText = false,
    )
    val newReleases = FeaturedItem(
        id = "new-releases",
        title = "Nuevos lanzamientos",
        subtitle = "Lo último de tus artistas favoritos",
        background = AntaraDarkTokens.AccentWarm,
        darkText = true,
    )
    val trending = FeaturedItem(
        id = "trending",
        title = "Tendencias ahora",
        subtitle = "Lo que todos están escuchando",
        background = AntaraDarkTokens.Accent,
        darkText = true,
    )
    val top = FeaturedItem(
        id = "top-50",
        title = "Top 50 global",
        subtitle = "Las canciones más reproducidas",
        background = AntaraDarkTokens.Info,
        darkText = true,
    )

    return when (filter) {
        HomeFilter.All -> HomeContent(
            curatedTitle = "Curado y en tendencia",
            featured = listOf(discover, newReleases),
            playlistsTitle = "Playlists diarias",
            playlists = playlists,
        )
        HomeFilter.NewReleases -> HomeContent(
            curatedTitle = "Novedades para ti",
            featured = listOf(newReleases, discover),
            playlistsTitle = "Lanzamientos recientes",
            playlists = playlists.reversed().take(6),
        )
        HomeFilter.Trending -> HomeContent(
            curatedTitle = "Tendencias ahora",
            featured = listOf(trending, top),
            playlistsTitle = "En tendencia",
            playlists = playlists.drop(1).take(6),
        )
        HomeFilter.TopSongs -> HomeContent(
            curatedTitle = "Top canciones",
            featured = listOf(top, trending),
            playlistsTitle = "Las más escuchadas",
            playlists = playlists.take(5),
        )
    }
}
