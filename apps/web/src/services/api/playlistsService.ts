import { ApiError, apiRequest } from "./apiClient";
import { ENDPOINTS } from "./endpoints";
import type { TrackDto } from "./tracksService";

/**
 * Contratos reales de playlists:
 * - `GET /api/playlist/todos` → PlaylistController.ObtenerTodasAsync (admin).
 * - `GET /api/pista/todos/playlist/{PlaylistId}` →
 *   PistaController.ObtenerTodosPistasDePlaylistAsync (pública).
 *
 * Una playlist reúne canciones de distintos artistas: cada pista trae su propio
 * `interprete` y su `albumId`, a diferencia de un álbum.
 */
export type PlaylistResumenDto = {
  id: string;
  nombre: string;
  descripcion: string | null;
  portadaUrl: string | null;
  usuarioId: string;
  usuarioNombre: string | null;
  estaActivo: boolean;
  totalPistas: number;
  totalArtistas: number;
  /** Nombres de los artistas presentes, separados por coma. */
  artistas: string | null;
};

/** Playlists con su resumen; el backend exige rol admin como en los álbumes. */
export async function fetchPlaylists(
  baseUrl: string,
  token: string,
  signal?: AbortSignal,
): Promise<PlaylistResumenDto[]> {
  const data = await apiRequest<PlaylistResumenDto[]>({
    baseUrl,
    path: ENDPOINTS.playlists,
    method: "GET",
    token,
    signal,
  });

  if (!Array.isArray(data)) {
    throw new ApiError("parsing", "La respuesta de playlists no tiene el formato esperado.");
  }

  return data;
}

/** Canciones de una playlist, sin importar de qué artista provengan. */
export async function fetchPlaylistTracks(
  baseUrl: string,
  playlistId: string,
  signal?: AbortSignal,
): Promise<TrackDto[]> {
  const data = await apiRequest<TrackDto[]>({
    baseUrl,
    path: ENDPOINTS.playlistTracks(playlistId),
    method: "GET",
    signal,
  });

  if (!Array.isArray(data)) {
    throw new ApiError("parsing", "La respuesta de pistas no tiene el formato esperado.");
  }

  return data;
}

/**
 * Enlaza una pista con la playlist (`POST /api/playlist/{id}/pistas`).
 *
 * El backend comprueba que la playlist y la canción existan y responde con la
 * lista actualizada de canciones de la playlist. Requiere sesión iniciada.
 */
export async function addTrackToPlaylist(
  baseUrl: string,
  token: string,
  playlistId: string,
  trackId: string,
): Promise<void> {
  await apiRequest<unknown>({
    baseUrl,
    path: ENDPOINTS.addPlaylistTrack(playlistId),
    method: "POST",
    token,
    body: { pistaId: trackId },
  });
}
