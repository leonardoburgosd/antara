import { useEffect, useState } from "react";
import { FeaturedCard } from "../../components/FeaturedCard";
import { FilterChips } from "../../components/FilterChips";
import { Icon } from "../../components/Icon";
import { MediaRow } from "../../components/MediaRow";
import { SectionHeader } from "../../components/SectionHeader";
import { ApiError } from "../../services/api/apiClient";
import { fetchAlbums } from "../../services/api/albumsService";
import type { AlbumDto } from "../../services/api/albumsService";
import { fetchPlaylists } from "../../services/api/playlistsService";
import type { PlaylistResumenDto } from "../../services/api/playlistsService";
import { usePlayer } from "../../stores/player";
import { useServers } from "../../stores/servers";
import { useSession } from "../../stores/session";
import type { FeaturedItem, HomeFilter } from "../../types/library";
import { buildHomeContent, HOME_FILTERS } from "./homeContent";

function greetingForHour(hour: number): string {
  if (hour >= 6 && hour <= 12) return "Buenos días";
  if (hour >= 13 && hour <= 19) return "Buenas tardes";
  return "Buenas noches";
}

/** Fila de la sección de playlists/álbumes. `trackIndex` negativo = no reproducible. */
type HomeRow = {
  id: string;
  title: string;
  subtitle: string;
  coverColor: string;
  trackIndex: number;
  /** Presente solo en filas de álbum: abre su lista de reproducción. */
  album?: AlbumDto;
};

/** Tokens del design system usados como portada de los álbumes (sin imágenes por ahora). */
const ALBUM_COVERS = [
  "bg-primary",
  "bg-accent-warm",
  "bg-info",
  "bg-accent",
  "bg-success",
  "bg-error",
];

/** Estilos de las tarjetas destacadas por posición (misma paleta que el mock). */
const FEATURED_STYLES = [
  { background: "bg-primary", darkText: false },
  { background: "bg-accent-warm", darkText: true },
  { background: "bg-accent", darkText: true },
  { background: "bg-info", darkText: true },
];

/**
 * Home: saludo + acciones, titular, filtros, carrusel "Curado y en tendencia"
 * y lista de playlists diarias (misma jerarquía que Mobile).
 *
 * En "Playlists diarias" la lista se alimenta de `GET /api/album/todos`
 * (ADR-016); el resto de filtros siguen usando contenido mock.
 */
export function HomeScreen({
  userName,
  onOpenServers,
  onOpenAlbum,
  onOpenPlaylist,
}: {
  userName: string;
  onOpenServers: () => void;
  /** Abre el detalle del álbum con su lista de reproducción. */
  onOpenAlbum: (album: AlbumDto, coverColor: string) => void;
  /** Abre una playlist destacada; `autoPlay` arranca su primera canción. */
  onOpenPlaylist: (playlist: PlaylistResumenDto, coverColor: string, autoPlay: boolean) => void;
}) {
  const { state, currentTrack, playQueue, togglePlayPause } = usePlayer();
  const { token } = useSession();
  const { activeServer } = useServers();
  const [filter, setFilter] = useState<HomeFilter>("all");
  const content = buildHomeContent(filter);

  const isDaily = filter === "all";
  const [albums, setAlbums] = useState<AlbumDto[] | null>(null);
  const [albumsLoading, setAlbumsLoading] = useState(false);
  const [albumsError, setAlbumsError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistResumenDto[] | null>(null);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!isDaily) return;

    if (!activeServer || !token) {
      setAlbums(null);
      setAlbumsError("Configura un servidor e inicia sesión para ver los álbumes.");
      setAlbumsLoading(false);
      setPlaylists(null);
      setPlaylistsLoading(false);
      return;
    }

    const controller = new AbortController();
    let mounted = true;

    setAlbumsLoading(true);
    setAlbumsError(null);
    setPlaylistsLoading(true);

    // "Curado y en tendencia" usa playlists reales; si falla, quedan las del mock.
    fetchPlaylists(activeServer.address, token, controller.signal)
      .then((data) => {
        if (mounted) setPlaylists(data);
      })
      .catch(() => {
        if (mounted) setPlaylists(null);
      })
      .finally(() => {
        if (mounted) setPlaylistsLoading(false);
      });

    fetchAlbums(activeServer.address, token, controller.signal)
      .then((data) => {
        if (mounted) setAlbums(data);
      })
      .catch((cause: unknown) => {
        if (!mounted) return;
        setAlbums(null);
        setAlbumsError(messageForAlbums(cause));
      })
      .finally(() => {
        if (mounted) setAlbumsLoading(false);
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [isDaily, activeServer, token, reloadKey]);

  const playFrom = (trackIndex: number) => {
    const track = content.tracks[trackIndex];
    if (currentTrack && track && currentTrack.id === track.id) {
      togglePlayPause();
      return;
    }
    playQueue(content.tracks, trackIndex);
  };

  const mockRows: HomeRow[] = content.playlists.map((playlist) => ({
    id: playlist.id,
    title: playlist.title,
    subtitle: `De ${playlist.artist} • ${playlist.trackCount} canciones`,
    coverColor: playlist.coverColor,
    trackIndex: playlist.trackIndex,
  }));

  const albumRows: HomeRow[] = (albums ?? []).map((album, index) => ({
    id: album.id,
    title: album.nombre?.trim() || "Álbum sin nombre",
    subtitle: album.descripcion?.trim() || album.artista?.trim() || "Álbum",
    coverColor: ALBUM_COVERS[index % ALBUM_COVERS.length] ?? "bg-primary",
    trackIndex: -1,
    album,
  }));

  const rows = isDaily ? albumRows : mockRows;
  const albumsPending = isDaily && albums === null && !albumsError;
  const showSkeleton = isDaily && (albumsLoading || albumsPending);

  // Tarjetas destacadas con playlists del backend (primera fila de Home).
  const destacadas: Array<{ item: FeaturedItem; playlist: PlaylistResumenDto }> = isDaily
    ? (playlists ?? []).slice(0, 2).map((playlist, index) => {
        const estilo = FEATURED_STYLES[index % FEATURED_STYLES.length] ?? FEATURED_STYLES[0];
        return {
          item: {
            id: playlist.id,
            title: playlist.nombre?.trim() || "Playlist sin nombre",
            subtitle:
              playlist.descripcion?.trim() ||
              `${playlist.totalPistas} canciones · ${playlist.totalArtistas} artistas`,
            background: estilo.background,
            darkText: estilo.darkText,
          },
          playlist,
        };
      })
    : [];
  const showEmpty =
    isDaily && albums !== null && !albumsLoading && !albumsError && rows.length === 0;

  return (
    <div className="flex min-h-full w-full flex-col px-4 pb-10 pt-2 sm:px-6">
      <header className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-body font-semibold text-on-primary">
          {userName.trim().charAt(0).toUpperCase() || "A"}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-caption text-text-secondary">{greetingForHour(new Date().getHours())}</p>
          <p className="truncate text-body font-semibold text-text-primary">{userName}</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative grid size-10 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
          >
            <Icon name="notifications" size={22} />
            <span aria-hidden="true" className="absolute right-2.5 top-2.5 size-2 rounded-full bg-accent" />
          </button>
          <button
            type="button"
            aria-label="Favoritos"
            className="grid size-10 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
          >
            <Icon name="favorite_border" size={22} />
          </button>
          <button
            type="button"
            aria-label="Configurar servidores"
            onClick={onOpenServers}
            className="grid size-10 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
          >
            <Icon name="dns" size={22} />
          </button>
        </div>
      </header>

      <h1 className="mt-6 text-h1 font-bold text-text-primary md:text-display">
        Tu música, en cualquier momento
      </h1>

      <div className="mt-5">
        <FilterChips
          options={HOME_FILTERS}
          selectedId={filter}
          onSelect={(id) => setFilter(id as HomeFilter)}
        />
      </div>

      <section className="mt-8 flex min-h-0 flex-1 flex-col" aria-label={content.curatedTitle}>
        <SectionHeader title={content.curatedTitle} actionLabel="Ver todo" onAction={() => undefined} />

        {isDaily && playlistsLoading && destacadas.length === 0 ? (
          <div
            className="mt-3 grid min-h-[172px] flex-1 gap-3 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
            aria-hidden="true"
          >
            {[0, 1].map((index) => (
              <div key={index} className="min-h-[172px] animate-pulse rounded-xl bg-surface-elevated" />
            ))}
          </div>
        ) : destacadas.length > 0 ? (
          <div className="mt-3 grid min-h-[172px] flex-1 gap-3 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {destacadas.map(({ item, playlist }) => (
              <FeaturedCard
                key={item.id}
                item={item}
                onPlay={() => onOpenPlaylist(playlist, item.background, true)}
                onOpen={() => onOpenPlaylist(playlist, item.background, false)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-3 grid min-h-[172px] flex-1 gap-3 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {content.featured.map((item) => (
              <FeaturedCard
                key={item.id}
                item={item}
                onPlay={() => playQueue(content.tracks, 0)}
                onOpen={() => undefined}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 flex min-h-0 flex-1 flex-col" aria-label={content.playlistsTitle}>
        <SectionHeader title={content.playlistsTitle} actionLabel="Ver todo" onAction={() => undefined} />

        {showSkeleton ? (
          <div className="mt-2 grid min-h-0 flex-1 auto-rows-fr gap-x-6 gap-y-1 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="flex h-full min-h-16 items-center gap-3 px-3" aria-hidden="true">
                <div className="size-12 shrink-0 animate-pulse rounded-md bg-surface-elevated" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-surface-elevated" />
                  <div className="h-2.5 w-1/2 animate-pulse rounded bg-surface-elevated" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {isDaily && albumsError ? (
          <div className="mt-3 flex flex-col items-start gap-3 rounded-lg border border-border bg-surface p-4">
            <p role="alert" className="text-body-sm text-error">
              {albumsError}
            </p>
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="rounded-md bg-primary px-3 py-2 text-button text-on-primary transition-colors duration-150 hover:bg-primary-hover"
            >
              Reintentar
            </button>
          </div>
        ) : null}

        {showEmpty ? (
          <p className="mt-3 px-3 text-body-sm text-text-secondary">
            Aún no hay álbumes registrados en el servidor.
          </p>
        ) : null}

        {!isDaily || (!showSkeleton && !albumsError) ? (
          <div className="mt-2 grid min-h-0 flex-1 auto-rows-fr gap-x-6 gap-y-1 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
            {rows.map((row) => {
              const isCurrent =
                row.trackIndex >= 0 && content.tracks[row.trackIndex]?.id === currentTrack?.id;
              const album = row.album;

              return (
                <MediaRow
                  key={row.id}
                  title={row.title}
                  subtitle={row.subtitle}
                  coverColor={row.coverColor}
                  isCurrent={isCurrent}
                  isPlaying={state.isPlaying}
                  onPlay={row.trackIndex >= 0 ? () => playFrom(row.trackIndex) : undefined}
                  onOpen={album ? () => onOpenAlbum(album, row.coverColor) : undefined}
                />
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}

/** Traduce los errores del cliente HTTP al mensaje de la sección de álbumes. */
function messageForAlbums(cause: unknown): string {
  if (!(cause instanceof ApiError)) {
    return "No se pudieron cargar los álbumes. Inténtalo de nuevo.";
  }

  switch (cause.kind) {
    case "forbidden":
      return "Tu cuenta no tiene permisos para ver los álbumes.";
    case "unauthorized":
      return "Tu sesión expiró. Vuelve a iniciar sesión.";
    case "network":
      return "No se pudo conectar con el servidor. Revisa la dirección y tu red.";
    case "unavailable":
      return "El servidor no está disponible.";
    case "validation":
      return cause.message;
    case "parsing":
      return "Respuesta inesperada del servidor.";
    case "server":
      return "Error del servidor. Inténtalo más tarde.";
    case "notFound":
      return "No se encontró el recurso de álbumes.";
  }
}
