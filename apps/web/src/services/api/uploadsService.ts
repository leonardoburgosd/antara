import { ApiError, apiRequest } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * Contratos reales de subida desde el panel:
 * - `GET /api/pista/subir/rutas` → PistaController.ObtenerRutasDeSubidaAsync
 * - `POST /api/pista/subir` (multipart) → PistaController.SubirPistaAsync
 * - `POST /api/pista/subir/url` → PistaController.SubirDesdeUrlAsync
 *
 * Los tres exigen `Authorization: Bearer` con tipo `admin`/`administrador`
 * (403 por ahora; la restricción se liberará más adelante).
 */

/** Ruta de audio registrada en el servidor, con su estado actual. */
export type RutaSubidaDto = {
  id: string;
  nombre: string;
  rutaDestino: string;
  disponible: boolean;
  escribible: boolean;
  esPredeterminada: boolean;
};

/** Pista registrada tras subir el archivo. */
export type SubidaPistaDto = {
  pistaId: string;
  nombre: string;
  interprete: string | null;
  album: string | null;
  conMetadatos: boolean;
  archivo: string;
  rutaDestino: string;
  rutaId: string;
  rutaNombre: string;
  mensaje: string;
};

/** Subir el archivo puede tardar: el audio viaja completo al servidor. */
const UPLOAD_TIMEOUT_MS = 120_000;
/** Descargar de YouTube + importar la pista tarda más que una consulta normal. */
const URL_UPLOAD_TIMEOUT_MS = 180_000;

/** Rutas activas donde el panel puede guardar audio. */
export async function fetchUploadRoutes(
  baseUrl: string,
  token: string,
  signal?: AbortSignal,
): Promise<RutaSubidaDto[]> {
  const data = await apiRequest<RutaSubidaDto[]>({
    baseUrl,
    path: ENDPOINTS.uploadRoutes,
    method: "GET",
    token,
    signal,
  });

  if (!Array.isArray(data)) {
    throw new ApiError("parsing", "La respuesta de rutas no tiene el formato esperado.");
  }

  return data;
}

export type SubidaArchivoInput = {
  rutaId?: string | null;
  subcarpeta?: string;
  archivo: File;
};

/**
 * Sube un archivo de audio al servidor. El destino lo decide el backend a partir
 * de la ruta registrada: nunca se envía una ruta física libre.
 */
export async function uploadTrackFile(
  baseUrl: string,
  token: string,
  input: SubidaArchivoInput,
): Promise<SubidaPistaDto> {
  const formData = new FormData();
  if (input.rutaId) formData.append("rutaId", input.rutaId);

  const subcarpeta = input.subcarpeta?.trim();
  if (subcarpeta) formData.append("subcarpeta", subcarpeta);

  formData.append("archivo", input.archivo, input.archivo.name);

  const dto = await apiRequest<SubidaPistaDto | undefined>({
    baseUrl,
    path: ENDPOINTS.uploadTrack,
    method: "POST",
    formData,
    token,
    timeoutMs: UPLOAD_TIMEOUT_MS,
  });

  return assertSubida(dto);
}

export type SubidaUrlInput = {
  rutaId?: string | null;
  subcarpeta?: string;
  url: string;
};

/** Descarga el audio de un enlace de YouTube y lo registra en la biblioteca. */
export async function uploadTrackFromUrl(
  baseUrl: string,
  token: string,
  input: SubidaUrlInput,
): Promise<SubidaPistaDto> {
  const dto = await apiRequest<SubidaPistaDto | undefined>({
    baseUrl,
    path: ENDPOINTS.uploadFromUrl,
    method: "POST",
    body: {
      rutaId: input.rutaId ?? null,
      subcarpeta: input.subcarpeta?.trim() || null,
      url: input.url.trim(),
    },
    token,
    timeoutMs: URL_UPLOAD_TIMEOUT_MS,
  });

  return assertSubida(dto);
}

function assertSubida(dto: SubidaPistaDto | undefined): SubidaPistaDto {
  if (!dto || typeof dto !== "object" || typeof dto.nombre !== "string") {
    throw new ApiError("parsing", "La respuesta de la subida no tiene el formato esperado.");
  }

  return dto;
}
