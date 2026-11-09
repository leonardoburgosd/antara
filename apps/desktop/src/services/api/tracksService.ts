import { formatTime } from "../../utils/formatTime";
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
  /** Duración en minutos con decimales, calculada por el backend. */
  duracionMinutos?: number;
  /** Duración legible que ya formatea el backend ("3:48", "1:02:05"). */
  duracion?: string;
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

/**
 * Etiqueta de duración de una pista para listas y colas.
 *
 * El backend ya expone `duracion` formateada ("3:48"); si una respuesta antigua
 * no la trae, se deriva de `duracionSegundos` con el mismo formato del reproductor.
 */
export function trackDurationLabel(
  pista: Pick<TrackDto, "duracion" | "duracionSegundos">,
): string {
  const formateada = pista.duracion?.trim();
  if (formateada) return formateada;

  return pista.duracionSegundos > 0 ? formatTime(pista.duracionSegundos) : "";
}
