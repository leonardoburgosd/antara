package com.antara.app.navigation

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.LibraryMusic
import androidx.compose.material.icons.outlined.MusicNote
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.antara.app.AppContainer
import com.antara.app.R
import com.antara.app.core.image.resolveCoverUrl
import com.antara.app.core.designsystem.AntaraTheme
import com.antara.app.core.designsystem.components.AntaraMiniPlayer
import com.antara.app.core.designsystem.color.AntaraDarkTokens
import com.antara.app.domain.model.LocalAudio
import com.antara.app.domain.model.SavedServers
import com.antara.app.domain.repository.LocalAudioRepository
import com.antara.app.features.library.ui.LibraryScreen
import com.antara.app.domain.model.SessionState
import com.antara.app.domain.model.UserSession
import com.antara.app.data.remote.dto.AlbumDto
import com.antara.app.data.remote.dto.PlaylistDto
import com.antara.app.features.album.AlbumDetailUiState
import com.antara.app.features.album.AlbumDetailViewModel
import com.antara.app.features.album.ui.AlbumDetailScreen
import com.antara.app.features.auth.ui.AuthScreen
import com.antara.app.features.home.HomeAlbumsUiState
import com.antara.app.features.home.HomePlaylistsUiState
import com.antara.app.features.home.HomeViewModel
import com.antara.app.features.playlist.PlaylistDetailUiState
import com.antara.app.features.playlist.PlaylistDetailViewModel
import com.antara.app.features.playlist.ui.PlaylistDetailScreen
import com.antara.app.features.home.ui.DetailScreen
import com.antara.app.features.home.ui.HomeScreen
import com.antara.app.features.home.ui.SongItem
import com.antara.app.features.home.ui.detailContentFor
import com.antara.app.features.player.ui.PlayerScreen
import com.antara.app.features.player.LyricsViewModel
import com.antara.app.features.profile.ui.ProfileScreen
import com.antara.app.features.servers.ui.ServersScreen
import com.antara.app.player.PlayableTrack
import com.antara.app.player.PlayerUiState
import com.antara.app.player.PlayerViewModel
import java.util.UUID
import kotlinx.coroutines.launch

/**
 * Raíz de la app: decide entre splash, autenticación, configuración inicial de servidores
 * y el contenido principal. Extiende la navegación por estado de ADR-013.
 */
@Composable
fun AppRoot(container: AppContainer) {
    val sessionState by container.sessionRepository.session.collectAsState(initial = SessionState.Loading)
    val savedServers by container.serverRepository.servers.collectAsState(initial = null)

    val playerFactory = remember(container) { PlayerViewModel.factory(container.playerConnection) }
    val playerViewModel: PlayerViewModel = viewModel(factory = playerFactory)
    val playerState by playerViewModel.uiState.collectAsState()

    val lyricsFactory = remember(container) {
        LyricsViewModel.factory(
            lyricsApi = container.lyricsApi,
            sessionRepository = container.sessionRepository,
            serverRepository = container.serverRepository,
        )
    }
    val lyricsViewModel: LyricsViewModel = viewModel(factory = lyricsFactory)
    val lyricsState by lyricsViewModel.uiState.collectAsState()

    val homeFactory = remember(container) {
        HomeViewModel.factory(
            albumApi = container.albumApi,
            playlistApi = container.playlistApi,
            sessionRepository = container.sessionRepository,
            serverRepository = container.serverRepository,
        )
    }
    val homeViewModel: HomeViewModel = viewModel(factory = homeFactory)
    val albumsState by homeViewModel.uiState.collectAsState()
    val playlistsState by homeViewModel.playlistsState.collectAsState()

    val albumFactory = remember(container) {
        AlbumDetailViewModel.factory(
            albumApi = container.albumApi,
            serverRepository = container.serverRepository,
        )
    }
    val albumViewModel: AlbumDetailViewModel = viewModel(factory = albumFactory)
    val albumState by albumViewModel.uiState.collectAsState()

    val playlistFactory = remember(container) {
        PlaylistDetailViewModel.factory(
            playlistApi = container.playlistApi,
            serverRepository = container.serverRepository,
        )
    }
    val playlistViewModel: PlaylistDetailViewModel = viewModel(factory = playlistFactory)
    val playlistState by playlistViewModel.uiState.collectAsState()

    var serversOpen by rememberSaveable { mutableStateOf(false) }
    var playerOpen by rememberSaveable { mutableStateOf(false) }

    val scope = rememberCoroutineScope()

    LaunchedEffect(sessionState) {
        if (sessionState is SessionState.SignedOut) {
            serversOpen = false
            playerOpen = false
            homeViewModel.reset()
            albumViewModel.reset()
            playlistViewModel.reset()
            lyricsViewModel.reset()
        }
    }

    LaunchedEffect(sessionState, savedServers) {
        val servers = savedServers
        if (sessionState is SessionState.SignedIn && servers != null && servers.servers.isEmpty()) {
            serversOpen = true
        }
    }

    BackHandler(enabled = playerOpen) {
        playerOpen = false
    }

    // La letra solo se consulta con el reproductor abierto y para pistas del
    // backend (id GUID); al cerrar la vista se descarta el estado.
    LaunchedEffect(playerOpen, playerState.currentId) {
        val trackId = playerState.currentId
        if (playerOpen && trackId != null && isBackendTrackId(trackId)) {
            lyricsViewModel.load(trackId)
        } else {
            lyricsViewModel.clear()
        }
    }

    when (val state = sessionState) {
        SessionState.Loading -> SplashScreen()

        SessionState.SignedOut -> {
            val servers = savedServers
            if (serversOpen && servers != null) {
                ServersScreen(
                    serverRepository = container.serverRepository,
                    firstRun = false,
                    onBack = { serversOpen = false },
                    onContinue = { serversOpen = false },
                    modifier = Modifier.fillMaxSize(),
                )
            } else {
                AuthScreen(
                    sessionRepository = container.sessionRepository,
                    serverRepository = container.serverRepository,
                    authApi = container.authApi,
                    activeServer = servers?.active,
                    onOpenServers = { serversOpen = true },
                    modifier = Modifier.fillMaxSize(),
                )
            }
        }

        is SessionState.SignedIn -> {
            val servers = savedServers
            when {
                servers == null -> SplashScreen()

                serversOpen || servers.servers.isEmpty() -> ServersScreen(
                    serverRepository = container.serverRepository,
                    firstRun = servers.servers.isEmpty(),
                    onBack = {
                        if (servers.servers.isNotEmpty()) serversOpen = false
                    },
                    onContinue = { serversOpen = false },
                    modifier = Modifier.fillMaxSize(),
                )

                else -> {
                    Box(modifier = Modifier.fillMaxSize()) {
                        MainContent(
                            session = state.session,
                            servers = servers,
                            playerState = playerState,
                            albumsState = albumsState,
                            playlistsState = playlistsState,
                            onLoadAlbums = { homeViewModel.loadAlbums() },
                            onRetryAlbums = { homeViewModel.loadAlbums(force = true) },
                            onLoadPlaylists = { homeViewModel.loadPlaylists() },
                            onRetryPlaylists = { homeViewModel.loadPlaylists(force = true) },
                            albumState = albumState,
                            onLoadAlbumTracks = { albumId -> albumViewModel.load(albumId) },
                            onRetryAlbumTracks = albumViewModel::retry,
                            onPlayAlbum = { tracks, index ->
                                playerViewModel.playQueue(tracks, index)
                                playerOpen = true
                            },
                            playlistState = playlistState,
                            onLoadPlaylistTracks = { playlistId -> playlistViewModel.load(playlistId) },
                            onRetryPlaylistTracks = playlistViewModel::retry,
                            onPlayPlaylist = { tracks, index ->
                                playerViewModel.playQueue(tracks, index)
                                playerOpen = true
                            },
                            onOpenServers = { serversOpen = true },
                            onOpenPlayer = { playerOpen = true },
                            onTogglePlayPause = playerViewModel::togglePlayPause,
                            onSignOut = {
                                scope.launch { container.sessionRepository.signOut() }
                            },
                            localAudioRepository = container.localAudioRepository,
                            onPlayLocal = { files, index ->
                                playerViewModel.playQueue(files.map { it.toPlayableTrack() }, index)
                                playerOpen = true
                            },
                            onPlayQueue = { songs, index ->
                                playerViewModel.playQueue(songs.toPlayableTracks(), index)
                                playerOpen = true
                            },
                            onPlayLikedIndex = { index ->
                                val songs = detailContentFor(Routes.LIKED)?.songs.orEmpty()
                                playerViewModel.playQueue(songs.toPlayableTracks(), index)
                                playerOpen = true
                            },
                        )

                        if (playerOpen && playerState.hasTrack) {
                            PlayerScreen(
                                state = playerState,
                                lyricsState = lyricsState,
                                onBack = { playerOpen = false },
                                onTogglePlayPause = playerViewModel::togglePlayPause,
                                onNext = playerViewModel::next,
                                onPrevious = playerViewModel::previous,
                                onSeek = playerViewModel::seekTo,
                                onToggleShuffle = playerViewModel::toggleShuffle,
                                onCycleRepeat = playerViewModel::cycleRepeat,
                                modifier = Modifier.fillMaxSize(),
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun MainContent(
    session: UserSession,
    servers: SavedServers,
    playerState: PlayerUiState,
    albumsState: HomeAlbumsUiState,
    playlistsState: HomePlaylistsUiState,
    onLoadAlbums: () -> Unit,
    onRetryAlbums: () -> Unit,
    onLoadPlaylists: () -> Unit,
    onRetryPlaylists: () -> Unit,
    albumState: AlbumDetailUiState,
    onLoadAlbumTracks: (String) -> Unit,
    onRetryAlbumTracks: () -> Unit,
    onPlayAlbum: (List<PlayableTrack>, Int) -> Unit,
    playlistState: PlaylistDetailUiState,
    onLoadPlaylistTracks: (String) -> Unit,
    onRetryPlaylistTracks: () -> Unit,
    onPlayPlaylist: (List<PlayableTrack>, Int) -> Unit,
    onOpenServers: () -> Unit,
    onOpenPlayer: () -> Unit,
    onTogglePlayPause: () -> Unit,
    onSignOut: () -> Unit,
    localAudioRepository: LocalAudioRepository,
    onPlayLocal: (List<LocalAudio>, Int) -> Unit,
    onPlayQueue: (List<SongItem>, Int) -> Unit,
    onPlayLikedIndex: (Int) -> Unit,
) {
    var selectedTabIndex by rememberSaveable { mutableIntStateOf(Tab.Home.ordinal) }
    val selectedTab = Tab.entries[selectedTabIndex]
    var detailRoute by rememberSaveable { mutableStateOf("") }
    var selectedAlbum by remember { mutableStateOf<AlbumDto?>(null) }
    var selectedAlbumCover by remember { mutableStateOf<Color>(AntaraDarkTokens.Primary) }
    var selectedPlaylist by remember { mutableStateOf<PlaylistDto?>(null) }
    var selectedPlaylistCover by remember { mutableStateOf<Color>(AntaraDarkTokens.Primary) }
    var bottomBarHeightPx by remember { mutableIntStateOf(0) }
    val bottomBarHeight = with(LocalDensity.current) { bottomBarHeightPx.toDp() }
    val contentBottomPadding = bottomBarHeight + AntaraTheme.spacing.xl

    BackHandler(enabled = detailRoute.isNotEmpty() || selectedAlbum != null || selectedPlaylist != null) {
        detailRoute = ""
        selectedAlbum = null
        selectedPlaylist = null
    }

    Scaffold(
        bottomBar = {
            // La barra flota sobre el contenido: es translúcida y deja ver lo que hay detrás.
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .onSizeChanged { bottomBarHeightPx = it.height },
            ) {
                AntaraMiniPlayer(
                    state = playerState,
                    onOpen = onOpenPlayer,
                    onTogglePlayPause = onTogglePlayPause,
                )
                AntaraBottomNav(
                    selectedTab = selectedTab,
                    onSelect = { tab ->
                        selectedTabIndex = tab.ordinal
                        detailRoute = ""
                    },
                )
            }
        },
        containerColor = Color.Transparent,
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(AntaraTheme.colorScheme.background),
        ) {
            val screenModifier = Modifier
                .fillMaxSize()
                .padding(top = innerPadding.calculateTopPadding())

            when (selectedTab) {
                Tab.Home -> HomeScreen(
                    userName = session.name,
                    playerState = playerState,
                    albumsState = albumsState,
                    playlistsState = playlistsState,
                    onLoadAlbums = onLoadAlbums,
                    onRetryAlbums = onRetryAlbums,
                    onLoadPlaylists = onLoadPlaylists,
                    onRetryPlaylists = onRetryPlaylists,
                    onOpenServers = onOpenServers,
                    onOpenLikedSongs = { detailRoute = Routes.LIKED },
                    coverBaseUrl = servers.active?.address,
                    onOpenAlbum = { album, coverColor ->
                        selectedAlbum = album
                        selectedAlbumCover = coverColor
                        onLoadAlbumTracks(album.id)
                    },
                    onOpenPlaylist = { playlist, coverColor ->
                        selectedPlaylist = playlist
                        selectedPlaylistCover = coverColor
                        onLoadPlaylistTracks(playlist.id)
                    },
                    onPlayIndex = onPlayLikedIndex,
                    bottomContentPadding = contentBottomPadding,
                    modifier = screenModifier,
                )

                Tab.Search -> PlaceholderScreen(
                    title = stringResource(R.string.nav_search),
                    modifier = screenModifier,
                )

                Tab.Library -> LibraryScreen(
                    repository = localAudioRepository,
                    currentId = playerState.currentId,
                    isPlaying = playerState.isPlaying,
                    onPlay = onPlayLocal,
                    bottomContentPadding = contentBottomPadding,
                    modifier = screenModifier,
                )

                Tab.Profile -> ProfileScreen(
                    session = session,
                    activeServer = servers.active,
                    onOpenServers = onOpenServers,
                    onSignOut = onSignOut,
                    bottomContentPadding = contentBottomPadding,
                    modifier = screenModifier,
                )
            }

            if (detailRoute.isNotEmpty()) {
                DetailScreen(
                    route = detailRoute,
                    playerState = playerState,
                    onBack = { detailRoute = "" },
                    onPlayQueue = onPlayQueue,
                    bottomContentPadding = contentBottomPadding,
                    modifier = screenModifier,
                )
            }

            selectedPlaylist?.let { playlist ->
                PlaylistDetailScreen(
                    playlistTitle = playlist.nombre,
                    playlistArtists = playlist.artistas.orEmpty(),
                    playlistDescription = playlist.descripcion,
                    totalTracks = playlist.totalPistas,
                    totalArtists = playlist.totalArtistas,
                    coverColor = selectedPlaylistCover,
                    state = playlistState,
                    playerState = playerState,
                    onBack = { selectedPlaylist = null },
                    onRetry = onRetryPlaylistTracks,
                    onPlayTrack = { index ->
                        val tracks = playlistState.tracks
                        if (tracks.isNotEmpty()) {
                            onPlayPlaylist(
                                tracks.map { track ->
                                    PlayableTrack(
                                        id = track.id,
                                        title = track.title,
                                        artist = track.artist.ifBlank { playlist.artistas.orEmpty() },
                                        coverColor = selectedPlaylistCover,
                                        uri = track.uri,
                                    )
                                },
                                index.coerceIn(0, tracks.lastIndex),
                            )
                        }
                    },
                    bottomContentPadding = contentBottomPadding,
                    modifier = screenModifier,
                )
            }

            selectedAlbum?.let { album ->
                AlbumDetailScreen(
                    albumTitle = album.nombre,
                    albumArtist = album.artista.orEmpty(),
                    albumDescription = album.descripcion,
                    albumDate = album.fechaPublicacion,
                    coverColor = selectedAlbumCover,
                    coverUrl = resolveCoverUrl(album.portadaUrl, servers.active?.address),
                    state = albumState,
                    playerState = playerState,
                    onBack = { selectedAlbum = null },
                    onRetry = onRetryAlbumTracks,
                    onPlayTrack = { index ->
                        val tracks = albumState.tracks
                        if (tracks.isNotEmpty()) {
                            onPlayAlbum(
                                tracks.map { track ->
                                    PlayableTrack(
                                        id = track.id,
                                        title = track.title,
                                        artist = track.artist.ifBlank { album.artista.orEmpty() },
                                        coverColor = selectedAlbumCover,
                                        uri = track.uri,
                                    )
                                },
                                index.coerceIn(0, tracks.lastIndex),
                            )
                        }
                    },
                    bottomContentPadding = contentBottomPadding,
                    modifier = screenModifier,
                )
            }
        }
    }
}

private enum class Tab(
    val labelRes: Int,
    val icon: ImageVector,
) {
    Home(R.string.nav_home, Icons.Outlined.Home),
    Search(R.string.nav_search, Icons.Outlined.Search),
    Library(R.string.nav_library, Icons.Outlined.LibraryMusic),
    Profile(R.string.nav_profile, Icons.Outlined.Person),
}

@Composable
private fun AntaraBottomNav(
    selectedTab: Tab,
    onSelect: (Tab) -> Unit,
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .padding(horizontal = AntaraTheme.spacing.lg, vertical = AntaraTheme.spacing.sm),
        contentAlignment = Alignment.Center,
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(68.dp)
                .shadow(elevation = 18.dp, shape = CircleShape, clip = false)
                .background(AntaraTheme.extendedColors.surfaceGlass, CircleShape)
                .border(
                    width = 1.dp,
                    color = AntaraTheme.extendedColors.border.copy(alpha = 0.6f),
                    shape = CircleShape,
                )
                .padding(horizontal = AntaraTheme.spacing.sm),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Tab.entries.forEach { tab ->
                val isSelected = tab == selectedTab
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight()
                        .selectable(
                            selected = isSelected,
                            role = Role.Tab,
                            onClick = { onSelect(tab) },
                        ),
                    contentAlignment = Alignment.Center,
                ) {
                    Box(
                        modifier = Modifier
                            .size(if (isSelected) 56.dp else 44.dp)
                            .background(
                                color = if (isSelected) {
                                    AntaraTheme.extendedColors.navIndicator
                                } else {
                                    Color.Transparent
                                },
                                shape = CircleShape,
                            ),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(
                            imageVector = tab.icon,
                            contentDescription = stringResource(tab.labelRes),
                            tint = if (isSelected) {
                                AntaraTheme.colorScheme.background
                            } else {
                                AntaraTheme.colorScheme.onSurface
                            },
                            modifier = Modifier.size(if (isSelected) 26.dp else 24.dp),
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun PlaceholderScreen(
    title: String,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center,
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(AntaraTheme.spacing.sm),
        ) {
            Text(
                text = title,
                style = AntaraTheme.typography.headlineMedium,
                color = AntaraTheme.colorScheme.onBackground,
            )
            Text(
                text = stringResource(R.string.placeholder_coming_soon),
                style = AntaraTheme.typography.bodyMedium,
                color = AntaraTheme.extendedColors.textSecondary,
            )
        }
    }
}

@Composable
private fun SplashScreen() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(AntaraTheme.colorScheme.background),
        contentAlignment = Alignment.Center,
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(AntaraTheme.spacing.lg),
        ) {
            Box(
                modifier = Modifier
                    .size(76.dp)
                    .background(AntaraTheme.colorScheme.primary, CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    imageVector = Icons.Outlined.MusicNote,
                    contentDescription = null,
                    tint = AntaraTheme.colorScheme.onPrimary,
                    modifier = Modifier.size(36.dp),
                )
            }
            Text(
                text = stringResource(R.string.app_name),
                style = AntaraTheme.typography.headlineLarge,
                color = AntaraTheme.colorScheme.onBackground,
            )
            CircularProgressIndicator(
                color = AntaraTheme.extendedColors.accent,
                strokeWidth = 2.dp,
                modifier = Modifier.size(24.dp),
            )
        }
    }
}

/** Solo las pistas del backend tienen id GUID; los audios locales no consultan letra. */
private fun isBackendTrackId(id: String): Boolean = runCatching { UUID.fromString(id) }.isSuccess

private fun List<SongItem>.toPlayableTracks(): List<PlayableTrack> = map { song ->
    PlayableTrack(
        id = song.id,
        title = song.title,
        artist = song.artist,
        coverColor = song.coverColor,
    )
}

private fun LocalAudio.toPlayableTrack() = PlayableTrack(
    id = uri,
    title = title,
    artist = "Archivo local",
    coverColor = AntaraDarkTokens.Primary,
    uri = uri,
)
