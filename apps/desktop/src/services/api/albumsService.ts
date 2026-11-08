import { ApiError, apiRequest } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * Contrato real de `GET /api/album/todos`
 * (AntaraSoft.Api/Controllers/AlbumController.cs → ObtenerTodosAlbumesAsync).
 *
 * Devuelve la lista completa de álbumes del panel y exige `Authorization: Bearer`
 * con rol `admin`/`administrador` (403 si la cuenta no lo tiene).
 */
export type AlbumDto = {
  id: string;
  nombre: string;
  descripcion: string | null;
  estaPublicado: boolean;
  fechaPublicacion: string;
  portadaUrl: string | null;
  usuarioId: string;
  estaActivo: boolean;
  artista: string | null;
  fuenteMetadatos: string | null;
  idExternoMetadatos: string | null;
};

/**
 * Carga los álbumes usando la URL base configurada por el usuario y la ruta
 * relativa del catálogo de endpoints.
 */
export async function fetchAlbums(
  baseUrl: string,
  token: string,
  signal?: AbortSignal,
): Promise<AlbumDto[]> {
  const data = await apiRequest<AlbumDto[]>({
    baseUrl,
    path: ENDPOINTS.albums,
    method: "GET",
    token,
    signal,
  });

  if (!Array.isArray(data)) {
    throw new ApiError("parsing", "La respuesta de álbumes no tiene el formato esperado.");
  }

  return data;
}
