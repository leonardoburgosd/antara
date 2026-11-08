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
 * Resuelve la URL para reproducir una pista: siempre pasa por el endpoint de
 * streaming `GET /api/pista/{id}` (PistaController.ObtenerPistaAsync), que
 * devuelve el contenido con `Accept-Ranges` para permitir seek. `url` no es una
 * ruta pública del servidor, así que no sirve como fuente de audio.
 *
 * Solo el contenido que pertenece a un álbum es reproducible: una pista sin
 * `albumId` no tiene fuente y la cola la descarta.
 */
export function resolveTrackStreamUrl(
  baseUrl: string,
  pista: Pick<TrackDto, "id" | "albumId">,
): string | undefined {
  if (!pista.albumId?.trim()) return undefined;
  return buildUrl(baseUrl, ENDPOINTS.trackStream(pista.id));
}
