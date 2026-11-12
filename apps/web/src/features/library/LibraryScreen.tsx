import { useEffect, useRef, useState } from "react";
import { ApiError } from "../../services/api/apiClient";
import { fetchPlaylists, type PlaylistResumenDto } from "../../services/api/playlistsService";
import { CoverArt } from "../../components/CoverArt";
import { Icon } from "../../components/Icon";
import { MediaRow } from "../../components/MediaRow";
import { usePlayer } from "../../stores/player";
import { useServers } from "../../stores/servers";
import { useSession } from "../../stores/session";
import { useUploads } from "../../stores/uploads";
import type { Track } from "../../types/library";
import { coverUrlFor } from "../../utils/coverUrl";
import { formatTime } from "../../utils/formatTime";

/**
 * "Tu biblioteca": audios del dispositivo que el usuario añade con el selector
 * del sistema. Igual que en Mobile, los archivos no se copian: se enlazan
 * desde su ubicación original mientras dure la sesión.
 *
 * Debajo de los archivos se listan las playlists que el usuario creó en el
 * servidor, para tener a mano todo lo suyo en una sola pantalla.
 */
export function LibraryScreen() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { tracks, addFiles, remove } = useUploads();
  const { state, currentTrack, playQueue, togglePlayPause } = usePlayer();
  const { token } = useSession();
  const { activeServer } = useServers();

  const [playlists, setPlaylists] = useState<PlaylistResumenDto[] | null>(null);
  const [playlistsLoading, setPlaylistsLoading] = useState(true);
  const [playlistsError, setPlaylistsError] = useState<string | null>(null);
  const [playlistsReloadKey, setPlaylistsReloadKey] = useState(0);

  useEffect(() => {
    if (!activeServer || !token) {
      setPlaylists(null);
      setPlaylistsLoading(false);
      setPlaylistsError("Inicia sesión y elige un servidor para ver tus playlists.");
      return;
    }

    const controller = new AbortController();
    let mounted = true;

    setPlaylistsLoading(true);
    setPlaylistsError(null);

    fetchPlaylists(activeServer.address, token, controller.signal)
      .then((data) => {
        if (mounted) setPlaylists(data);
      })
      .catch((cause: unknown) => {
        if (!mounted) return;
        setPlaylists(null);
        setPlaylistsError(playlistsErrorMessage(cause));
      })
      .finally(() => {
        if (mounted) setPlaylistsLoading(false);
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [activeServer, token, playlistsReloadKey]);

  const playFrom = (index: number) => {
    const track = tracks[index];
    if (!track) return;

    if (currentTrack?.id === track.id) {
      togglePlayPause();
      return;
    }

    playQueue(tracks, index);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col px-4 pb-10 pt-6 sm:px-6">
      <p className="text-h3 font-semibold text-text-primary">Tu biblioteca</p>

      <h1 className="mt-6 text-h1 font-bold text-text-primary">Mis archivos</h1>
      <p className="mt-2 max-w-2xl text-body-sm text-text-secondary">
        Añade audios de tu dispositivo y escúchalos aquí. Los archivos no se copian: se enlazan
        desde su ubicación original.
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-button text-on-primary transition-colors duration-150 hover:bg-primary-hover"
      >
        <Icon name="upload_file" size={20} />
        Subir audio
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        multiple
        aria-label="Seleccionar archivos de audio"
        className="sr-only"
        onChange={(event) => {
          addFiles(event.target.files);
          // Permite volver a elegir el mismo archivo.
          event.target.value = "";
        }}
      />

      {tracks.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
          <Icon name="folder_open" size={40} className="text-text-disabled" />
          <p className="text-body font-semibold text-text-primary">Aún no hay archivos</p>
          <p className="max-w-sm text-body-sm text-text-secondary">
            Toca Subir audio y elige archivos MP3, WAV, OGG, M4A, FLAC u OPUS.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-0.5">
          {tracks.map((track: Track, index: number) => {
            const isCurrent = currentTrack?.id === track.id;

            return (
              <div key={track.id} className="flex items-center gap-1">
                <div className="min-w-0 flex-1">
                  <MediaRow
                    title={track.title}
                    subtitle={
                      track.duration > 0
                        ? `Archivo local • ${formatTime(track.duration)}`
                        : "Archivo local"
                    }
                    coverColor={track.coverColor}
                    isCurrent={isCurrent}
                    isPlaying={state.isPlaying}
                    onPlay={() => playFrom(index)}
                    onOpen={() => playFrom(index)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(track.id)}
                  aria-label={`Quitar ${track.title}`}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-error"
                >
                  <Icon name="delete" size={20} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <section className="mt-10 border-t border-border pt-8">
        <h2 className="text-h2 font-semibold text-text-primary">Mis playlists</h2>
        <p className="mt-2 max-w-2xl text-body-sm text-text-secondary">
          Las playlists que has creado en tu servidor.
        </p>

        {playlistsLoading ? (
          <p className="mt-6 text-body-sm text-text-secondary">Cargando playlists…</p>
        ) : null}

        {!playlistsLoading && playlistsError ? (
          <div className="mt-6 flex flex-col gap-2">
            <p role="alert" className="text-body-sm text-error">
              {playlistsError}
            </p>
            <button
              type="button"
              onClick={() => setPlaylistsReloadKey((value) => value + 1)}
              className="self-start rounded-md bg-primary px-3 py-1.5 text-button text-on-primary transition-colors duration-150 hover:bg-primary-hover"
            >
              Reintentar
            </button>
          </div>
        ) : null}

        {!playlistsLoading && !playlistsError && playlists !== null && playlists.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-lg bg-surface px-6 py-10 text-center">
            <Icon name="playlist_play" size={40} className="text-text-disabled" />
            <p className="text-body font-semibold text-text-primary">Todavía no tienes playlists</p>
            <p className="max-w-sm text-body-sm text-text-secondary">
              Cuando crees una playlist aparecerá aquí con sus canciones.
            </p>
          </div>
        ) : null}

        {playlists && playlists.length > 0 ? (
          <ul className="mt-6 flex flex-col gap-0.5">
            {playlists.map((playlist) => (
              <li key={playlist.id} className="flex min-h-16 items-center gap-3 px-3 py-2">
                {coverUrlFor(playlist.portadaUrl, activeServer?.address) ? (
                  <CoverArt
                    coverColor="bg-surface-elevated"
                    src={coverUrlFor(playlist.portadaUrl, activeServer?.address)}
                    className="size-12 rounded-md"
                  />
                ) : (
                  <div className="grid size-12 shrink-0 place-items-center rounded-md bg-surface-elevated text-text-secondary">
                    <Icon name="playlist_play" size={22} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-semibold text-text-primary">
                    {playlist.nombre}
                  </p>
                  <p className="truncate text-body-sm text-text-secondary">
                    {playlistSubtitle(playlist)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}

/** "12 canciones · Sia, Queen": resumen que ya calcula el backend. */
function playlistSubtitle(playlist: PlaylistResumenDto): string {
  const count =
    playlist.totalPistas === 1 ? "1 canción" : `${playlist.totalPistas} canciones`;
  const artists = playlist.artistas?.trim();
  return artists ? `${count} · ${artists}` : count;
}

/** Mensajes legibles para el listado de playlists de la biblioteca. */
function playlistsErrorMessage(cause: unknown): string {
  if (!(cause instanceof ApiError)) {
    return "No se pudieron cargar tus playlists.";
  }

  switch (cause.kind) {
    case "forbidden":
      return "Tu cuenta no tiene permisos para ver las playlists del servidor.";
    case "unauthorized":
      return "Tu sesión caducó. Vuelve a iniciar sesión.";
    case "network":
      return "No se pudo conectar con el servidor. Revisa la dirección y tu red.";
    case "unavailable":
      return "El servidor no está disponible ahora mismo.";
    case "notFound":
      return "El servidor no expone el listado de playlists.";
    case "validation":
      return cause.message;
    case "parsing":
      return "Respuesta inesperada del servidor.";
    case "server":
      return "Error del servidor al cargar las playlists. Inténtalo más tarde.";
  }
}
