import { ApiError, apiRequest, buildUrl } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * Contrato real de `GET /api/pista/todos/album/{AlbumId}`
 * (AntaraSoft.Api/Controllers/PistaController.cs → ObtenerTodosPistasDeAlbumAsync).
 *
 * El endpoint no exige token; devuelve las pistas del álbum con su URL de audio.
 */
export type TrackDto = {
  id: string;
  nombre: string;
  fechaRegistro: string;
  anoCreacion: number;
  interprete: string | null;
  compositor: string | null;
  productor: string | null;
  reproducciones: number;
  generoId: number;
  url: string | null;
  albumId: string;
  estaActivo: boolean;
  letra: string | null;
  imagenArtista: string | null;
  duracionSegundos: number;
  fuenteMetadatos: string | null;
  idExternoMetadatos: string | null;
};

/**
 * Carga las pistas de un álbum usando la URL base configurada por el usuario
 * y la ruta relativa del catálogo de endpoints.
 */
export async function fetchAlbumTracks(
  baseUrl: string,
  albumId: string,
  signal?: AbortSignal,
): Promise<TrackDto[]> {
  const data = await apiRequest<TrackDto[]>({
    baseUrl,
    path: ENDPOINTS.albumTracks(albumId),
    method: "GET",
    signal,
  });

  if (!Array.isArray(data)) {
    throw new ApiError("parsing", "La respuesta de pistas no tiene el formato esperado.");
  }

  return data;
}

/**
 * Resuelve la URL de audio de una pista: si el backend devuelve una ruta
 * relativa se compone con la URL base; si ya es absoluta se deja tal cual.
 */
export function resolveAudioUrl(baseUrl: string, rawUrl: string | null): string | undefined {
  const value = rawUrl?.trim();
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return buildUrl(baseUrl, value);
}
