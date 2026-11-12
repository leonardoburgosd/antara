import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { ApiError } from "../services/api/apiClient";
import {
  addTrackToPlaylist,
  fetchPlaylists,
  type PlaylistResumenDto,
} from "../services/api/playlistsService";
import { useServers } from "../stores/servers";
import { useSession } from "../stores/session";

type AddToPlaylistDialogProps = {
  /** Canción que se va a añadir (`PistaId` del backend). */
  track: { id: string; title: string };
  onClose: () => void;
};

/**
 * Modal "Añadir a playlist": lista las playlists del usuario y enlaza la
 * canción elegida con `POST /api/playlist/{id}/pistas`.
 *
 * El backend responde con la lista actualizada de canciones; aquí solo
 * confirmamos el nombre de la playlist y cerramos.
 */
export function AddToPlaylistDialog({ track, onClose }: AddToPlaylistDialogProps) {
  const { token } = useSession();
  const { activeServer } = useServers();
  const [playlists, setPlaylists] = useState<PlaylistResumenDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedName, setAddedName] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!activeServer || !token) {
      setPlaylists(null);
      setLoading(false);
      setError("Configura un servidor e inicia sesión para ver tus playlists.");
      return;
    }

    const controller = new AbortController();
    let mounted = true;

    setLoading(true);
    setError(null);

    fetchPlaylists(activeServer.address, token, controller.signal)
      .then((data) => {
        if (mounted) setPlaylists(data);
      })
      .catch((cause: unknown) => {
        if (!mounted) return;
        setPlaylists(null);
        setError(messageFor(cause));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [activeServer, token, reloadKey]);

  // Escape cierra el modal, como el resto de diálogos del producto.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Tras confirmar, el modal se cierra solo para no dejar pasos a medias.
  useEffect(() => {
    if (!addedName) return;
    const timer = window.setTimeout(onClose, 1200);
    return () => window.clearTimeout(timer);
  }, [addedName, onClose]);

  const add = async (playlist: PlaylistResumenDto) => {
    if (!activeServer || !token || addingId) return;

    setAddingId(playlist.id);
    setError(null);

    try {
      await addTrackToPlaylist(activeServer.address, token, playlist.id, track.id);
      setAddedName(playlist.nombre);
    } catch (cause) {
      setError(messageFor(cause));
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-playlist-title"
        className="flex max-h-[80vh] w-full max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 id="add-to-playlist-title" className="text-h3 font-semibold text-text-primary">
              Añadir a playlist
            </h2>
            <p className="mt-1 truncate text-body-sm text-text-secondary">{track.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid size-9 shrink-0 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
          {loading ? (
            <p className="px-3 py-6 text-center text-body-sm text-text-secondary">
              Cargando playlists…
            </p>
          ) : null}

          {!loading && playlists !== null && playlists.length === 0 ? (
            <p className="px-3 py-6 text-center text-body-sm text-text-secondary">
              Todavía no tienes playlists creadas.
            </p>
          ) : null}

          {!loading && playlists
            ? playlists.map((playlist) => {
                const isAdding = addingId === playlist.id;
                const isAdded = addedName === playlist.nombre;

                return (
                  <button
                    key={playlist.id}
                    type="button"
                    onClick={() => void add(playlist)}
                    disabled={Boolean(addingId)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary-subtle text-primary">
                      <Icon
                        name={isAdded ? "check" : isAdding ? "hourglass_top" : "playlist_play"}
                        size={20}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body font-medium text-text-primary">
                        {playlist.nombre}
                      </span>
                      <span className="block truncate text-caption text-text-secondary">
                        {playlist.totalPistas === 1
                          ? "1 canción"
                          : `${playlist.totalPistas} canciones`}
                      </span>
                    </span>
                  </button>
                );
              })
            : null}
        </div>

        {addedName ? (
          <p
            role="status"
            className="flex items-center gap-2 border-t border-border px-5 py-3 text-body-sm text-success"
          >
            <Icon name="check_circle" size={18} />
            Añadida a «{addedName}»
          </p>
        ) : null}

        {error ? (
          <div className="flex flex-col gap-2 border-t border-border px-5 py-3">
            <p role="alert" className="text-body-sm text-error">
              {error}
            </p>
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="self-start rounded-md bg-primary px-3 py-1.5 text-button text-on-primary transition-colors duration-150 hover:bg-primary-hover"
            >
              Reintentar
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Traduce los errores del cliente HTTP a mensajes legibles en el modal. */
function messageFor(cause: unknown): string {
  if (!(cause instanceof ApiError)) {
    return "No se pudo añadir la canción. Inténtalo de nuevo.";
  }

  switch (cause.kind) {
    case "forbidden":
      return "No tienes permisos para editar esa playlist.";
    case "notFound":
      return "Esa playlist o la canción ya no existe.";
    case "unauthorized":
      return "Tu sesión caducó. Vuelve a iniciar sesión.";
    case "network":
      return "No se pudo conectar con el servidor. Revisa la dirección y tu red.";
    case "unavailable":
      return "El servidor no está disponible ahora mismo.";
    case "validation":
      return cause.message;
    case "parsing":
      return "Respuesta inesperada del servidor.";
    case "server":
      return "Error del servidor. Inténtalo más tarde.";
  }
}
