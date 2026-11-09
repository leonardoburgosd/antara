import { useEffect, useState } from "react";
import { Icon } from "../../components/Icon";
import { MediaRow } from "../../components/MediaRow";
import { ApiError } from "../../services/api/apiClient";
import { albumYear, type AlbumDto } from "../../services/api/albumsService";
import {
  fetchAlbumTracks,
  resolveTrackStreamUrl,
  trackDurationLabel,
  type TrackDto,
} from "../../services/api/tracksService";
import { usePlayer } from "../../stores/player";
import { useServers } from "../../stores/servers";
import { formatTime } from "../../utils/formatTime";
import type { Track } from "../../types/library";

/**
 * Detalle de un álbum: cabecera con portada y datos del álbum, y lista de
 * pistas cargada con `GET /api/pista/todos/album/{AlbumId}` (ADR-016).
 *
 * La reproducción usa `GET /api/pista/{id}` (PistaController.ObtenerPistaAsync),
 * que entrega el contenido de cada pista del álbum con soporte de Range.
 *
 * Se llega desde las filas de álbum de "Playlists diarias" en Home.
 */
export function AlbumDetailScreen({
  album,
  coverColor,
  onBack,
}: {
  album: AlbumDto;
  coverColor: string;
  onBack: () => void;
}) {
  const { state, currentTrack, playQueue, togglePlayPause } = usePlayer();
  const { activeServer } = useServers();

  const [tracks, setTracks] = useState<Track[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const albumTitle = album.nombre?.trim() || "Álbum sin nombre";
  const albumArtist = album.artista?.trim() || "Artista desconocido";

  useEffect(() => {
    if (!activeServer) {
      setTracks(null);
      setError("Configura un servidor para ver las canciones del álbum.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let mounted = true;

    setLoading(true);
    setError(null);

    fetchAlbumTracks(activeServer.address, album.id, controller.signal)
      .then((data) => {
        if (mounted) setTracks(toQueue(data, album, coverColor, activeServer.address));
      })
      .catch((cause: unknown) => {
        if (!mounted) return;
        setTracks(null);
        setError(messageForTracks(cause));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [activeServer, album, coverColor, reloadKey]);

  const queue = tracks ?? [];
  const hasTracks = queue.length > 0;
  const totalSeconds = queue.reduce((total, track) => total + Math.max(0, track.duration), 0);
  const albumMeta = [
    albumYear(album),
    hasTracks ? `${queue.length} canciones` : "",
    totalSeconds > 0 ? formatTime(totalSeconds) : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const showSkeleton = loading || (tracks === null && !error);

  const playFrom = (index: number) => {
    const track = queue[index];
    if (currentTrack && track && currentTrack.id === track.id) {
      togglePlayPause();
      return;
    }
    playQueue(queue, index);
  };

  return (
    <div className="flex min-h-full w-full flex-col px-4 pb-10 pt-2 sm:px-6">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="grid size-10 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
        >
          <Icon name="arrow_back" size={22} />
        </button>
        <p className="text-caption text-text-secondary">Álbum</p>
      </div>

      <section className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div
          className={`size-40 shrink-0 rounded-xl ${coverColor}`}
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <p className="text-caption uppercase tracking-wide text-text-secondary">Álbum</p>
          <h1 className="mt-1 break-words text-h1 font-bold text-text-primary md:text-display">
            {albumTitle}
          </h1>
          <p className="mt-2 text-body-sm text-text-secondary">{albumArtist}</p>
          {albumMeta ? (
            <p className="mt-1 text-caption tabular-nums text-text-secondary">{albumMeta}</p>
          ) : null}
          {album.descripcion?.trim() ? (
            <p className="mt-2 max-w-2xl text-body-sm text-text-secondary">
              {album.descripcion.trim()}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => playFrom(0)}
            disabled={!hasTracks}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-button text-on-primary transition-colors duration-150 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="play_arrow" size={20} filled />
            Reproducir
          </button>
        </div>
      </section>

      <section className="mt-8 flex min-h-0 flex-1 flex-col" aria-label="Canciones del álbum">
        <h2 className="px-3 text-h3 font-semibold text-text-primary">Canciones</h2>

        {showSkeleton ? (
          <div
            className="mt-2 grid gap-x-6 gap-y-1 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
            aria-hidden="true"
          >
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className="flex min-h-16 items-center gap-3 px-3">
                <div className="size-12 shrink-0 animate-pulse rounded-md bg-surface-elevated" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-surface-elevated" />
                  <div className="h-2.5 w-1/2 animate-pulse rounded bg-surface-elevated" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="mt-3 flex flex-col items-start gap-3 rounded-lg border border-border bg-surface p-4">
            <p role="alert" className="text-body-sm text-error">
              {error}
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

        {!showSkeleton && !error && tracks !== null && !hasTracks ? (
          <p className="mt-3 px-3 text-body-sm text-text-secondary">
            Este álbum todavía no tiene canciones.
          </p>
        ) : null}

        {!showSkeleton && !error && hasTracks ? (
          <div className="mt-2 grid gap-x-6 gap-y-1 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
            {queue.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;

              return (
                <MediaRow
                  key={track.id}
                  title={track.title}
                  subtitle={track.artist}
                  coverColor={track.coverColor}
                  isCurrent={isCurrent}
                  isPlaying={state.isPlaying}
                  onPlay={() => playFrom(index)}
                  durationLabel={track.durationLabel}
                />
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}

/**
 * Convierte las pistas del backend en la cola del reproductor.
 *
 * Solo se encola el contenido que pertenece a un álbum (`albumId` presente):
 * su audio se pide al endpoint de streaming por id de pista.
 */
function toQueue(
  pistas: TrackDto[],
  album: AlbumDto,
  coverColor: string,
  baseUrl: string,
): Track[] {
  return pistas
    .filter((pista) => Boolean(pista.albumId?.trim()))
    .map((pista) => ({
      id: pista.id,
      title: pista.nombre?.trim() || "Pista sin nombre",
      artist: pista.interprete?.trim() || album.artista?.trim() || "Artista desconocido",
      album: album.nombre?.trim() || "Álbum sin nombre",
      coverColor,
      duration: pista.duracionSegundos > 0 ? pista.duracionSegundos : 0,
      durationLabel: trackDurationLabel(pista),
      src: resolveTrackStreamUrl(baseUrl, pista),
    }));
}

/** Traduce los errores del cliente HTTP al mensaje de la lista de pistas. */
function messageForTracks(cause: unknown): string {
  if (!(cause instanceof ApiError)) {
    return "No se pudieron cargar las canciones. Inténtalo de nuevo.";
  }

  switch (cause.kind) {
    case "forbidden":
      return "Tu cuenta no tiene permisos para ver las canciones de este álbum.";
    case "unauthorized":
      return "Tu sesión expiró. Vuelve a iniciar sesión.";
    case "notFound":
      return "No se encontró el álbum en el servidor.";
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
  }
}
