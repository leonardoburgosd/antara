import { useState } from "react";
import { NAV_ITEMS } from "./app/navigation";
import { BottomNav } from "./components/BottomNav";
import { Icon } from "./components/Icon";
import { PlayerBar } from "./components/PlayerBar";
import { Sidebar } from "./components/Sidebar";
import { LoginScreen } from "./features/auth/LoginScreen";
import { AlbumDetailScreen } from "./features/album/AlbumDetailScreen";
import { HomeScreen } from "./features/home/HomeScreen";
import { LibraryScreen } from "./features/library/LibraryScreen";
import { ServersScreen } from "./features/servers/ServersScreen";
import { UploadsScreen } from "./features/uploads/UploadsScreen";
import { PlaylistDetailScreen } from "./features/playlist/PlaylistDetailScreen";
import type { AlbumDto } from "./services/api/albumsService";
import type { PlaylistResumenDto } from "./services/api/playlistsService";
import { PlayerProvider, usePlayer } from "./stores/player";
import { ServersProvider, useServers } from "./stores/servers";
import { SessionProvider, useSession } from "./stores/session";
import { UploadsProvider } from "./stores/uploads";
import type { NavId } from "./types/library";

const EXTRA_TITLES: Partial<Record<NavId, string>> = {
  uploads: "Mis archivos",
  server: "Servidores",
};

function PlaceholderScreen({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
      <Icon name="auto_awesome" size={40} className="text-text-disabled" />
      <h1 className="text-h2 font-semibold text-text-primary">{title}</h1>
      <p className="text-body-sm text-text-secondary">Próximamente</p>
    </div>
  );
}

function AppShell() {
  const [tab, setTab] = useState<NavId>("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [album, setAlbum] = useState<{ album: AlbumDto; coverColor: string } | null>(null);
  const [playlist, setPlaylist] = useState<{
    playlist: PlaylistResumenDto;
    coverColor: string;
    autoPlay: boolean;
  } | null>(null);
  const { user } = useSession();
  const { currentTrack } = usePlayer();
  const activeLabel = NAV_ITEMS.find((item) => item.id === tab)?.label ?? EXTRA_TITLES[tab] ?? "";

  const select = (id: NavId) => {
    setTab(id);
    setAlbum(null);
    setPlaylist(null);
    setDrawerOpen(false);
  };

  return (
    <div className="flex h-dvh flex-col bg-background text-text-primary">
      <div className="flex min-h-0 flex-1">
        {/* Sidebar en `lg+` (responsive-design.md) */}
        <div className="hidden h-full min-h-0 lg:block">
          <Sidebar active={tab} onSelect={select} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Ventanas pequeñas: cabecera mínima; el drawer aparece en `md`–`lg` */}
          <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:hidden">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-on-primary">
              <Icon name="music_note" size={20} />
            </span>
            <span className="text-h3 font-semibold">Antara</span>
          </header>

          <header className="hidden items-center gap-3 border-b border-border px-4 py-3 md:flex lg:hidden">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menú"
              className="grid size-10 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
            >
              <Icon name="menu" size={22} />
            </button>
            <span className="text-h3 font-semibold">Antara</span>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto">
            {playlist ? (
              <PlaylistDetailScreen
                playlist={playlist.playlist}
                coverColor={playlist.coverColor}
                autoPlay={playlist.autoPlay}
                onBack={() => setPlaylist(null)}
              />
            ) : album ? (
              <AlbumDetailScreen
                album={album.album}
                coverColor={album.coverColor}
                onBack={() => setAlbum(null)}
              />
            ) : tab === "home" ? (
              <HomeScreen
                userName={user?.name ?? "Alex"}
                onOpenServers={() => setTab("server")}
                onOpenAlbum={(selected, coverColor) => {
                  setPlaylist(null);
                  setAlbum({ album: selected, coverColor });
                }}
                onOpenPlaylist={(selected, coverColor, autoPlay) => {
                  setAlbum(null);
                  setPlaylist({ playlist: selected, coverColor, autoPlay });
                }}
              />
            ) : tab === "library" ? (
              <LibraryScreen />
            ) : tab === "uploads" ? (
              <UploadsScreen />
            ) : tab === "server" ? (
              <ServersScreen
                firstRun={false}
                onBack={() => setTab("home")}
                onContinue={() => setTab("home")}
              />
            ) : (
              <PlaceholderScreen title={activeLabel} />
            )}
          </main>
        </div>
      </div>

      {currentTrack ? <PlayerBar /> : null}

      <BottomNav active={tab} onSelect={select} />

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-overlay"
          />
          <div className="relative z-10 flex shadow-xl">
            <Sidebar active={tab} onSelect={select} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Sin sesión se muestra el login (misma regla que Android: login primero). */
function Root() {
  const { user } = useSession();
  const { activeServer } = useServers();
  const [serversOpen, setServersOpen] = useState(false);

  if (!user) {
    return serversOpen ? (
      <ServersScreen
        firstRun={false}
        onBack={() => setServersOpen(false)}
        onContinue={() => setServersOpen(false)}
      />
    ) : (
      <LoginScreen onOpenServers={() => setServersOpen(true)} />
    );
  }

  // Tras iniciar sesión sin servidor, la configuración es obligatoria (como Android).
  if (!activeServer || serversOpen) {
    return (
      <ServersScreen
        firstRun={!activeServer}
        onBack={() => setServersOpen(false)}
        onContinue={() => setServersOpen(false)}
      />
    );
  }

  return <AppShell />;
}

function App() {
  return (
    <SessionProvider>
      <ServersProvider>
        <UploadsProvider>
          <PlayerProvider>
            <Root />
          </PlayerProvider>
        </UploadsProvider>
      </ServersProvider>
    </SessionProvider>
  );
}

export default App;
