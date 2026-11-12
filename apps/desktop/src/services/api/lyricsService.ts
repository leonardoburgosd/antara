import { ApiError, apiRequest } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

type SynchronizedLyricsResponse = {
  letraSincronizada?: unknown;
};

type TrackLyricsResponse = {
  letra?: unknown;
};

/**
 * `GET /api/pista/{id}/letra-sincronizada`
 * (AntaraSoft.Api/Controllers/PistaController.cs → ObtenerLetraSincronizadaAsync).
 *
 * Devuelve el LRC que usa el reproductor para resaltar la línea activa o
 * `null` cuando la canción no tiene una versión sincronizada (404). La letra
 * sale del proveedor LRCLIB y exige que artista, título, álbum y duración
 * (±2 s) coincidan con la firma registrada.
 */
export async function fetchSynchronizedLyrics(
  baseUrl: string,
  token: string,
  trackId: string,
  signal?: AbortSignal,
): Promise<string | null> {
  try {
    const data = await apiRequest<SynchronizedLyricsResponse>({
      baseUrl,
      path: ENDPOINTS.synchronizedLyrics(trackId),
      method: "GET",
      token,
      signal,
    });

    const lrc = data?.letraSincronizada;
    return typeof lrc === "string" && lrc.trim() ? lrc : null;
  } catch (error) {
    if (error instanceof ApiError && error.kind === "notFound") return null;
    throw error;
  }
}

/**
 * `GET /api/mis-pistas/{id}` (MisPistasController → ObtenerMiPistaAsync).
 *
 * Devuelve el detalle de una pista propia con su `letra` plana. Es el respaldo
 * cuando no hay LRC: el listado de pistas de un álbum entrega `letra` en null,
 * así que la letra del catálogo solo está accesible por esta ruta (dueño o
 * admin). Si la cuenta no puede ver esa pista, se devuelve `null`.
 */
export async function fetchPlainLyrics(
  baseUrl: string,
  token: string,
  trackId: string,
  signal?: AbortSignal,
): Promise<string | null> {
  try {
    const data = await apiRequest<TrackLyricsResponse>({
      baseUrl,
      path: ENDPOINTS.myTrack(trackId),
      method: "GET",
      token,
      signal,
    });

    const letra = data?.letra;
    return typeof letra === "string" && letra.trim() ? letra.trim() : null;
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.kind === "notFound" || error.kind === "forbidden" || error.kind === "unauthorized")
    ) {
      return null;
    }
    throw error;
  }
}
