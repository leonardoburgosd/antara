import type { SessionUser } from "../../types/library";
import { ApiError, apiRequest } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * Contrato real de `POST /api/usuario/login`
 * (AntaraSoft.Api/Controllers/UsuarioController.cs → LoginAsync).
 *
 * Respuesta 200: usuario + `token` (el backend lo serializa en minúsculas).
 * Códigos: 404 credenciales incorrectas, 401 correo inválido, 503 sin
 * administrador registrado, 5xx error interno.
 */
export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  id: string;
  email: string;
  nombre: string;
  fechaNacimiento: string;
  genero: string;
  fechaRegistro: string;
  pais: string | null;
  tipo: string;
  fotoPerfil: string | null;
  token: string;
};

export type LoginResult = {
  user: SessionUser;
  token: string;
  tipo: string;
};

/**
 * Inicia sesión contra el servidor configurado.
 * `baseUrl` es la dirección introducida por el usuario; la ruta se añade desde
 * el catálogo de endpoints.
 */
export async function login(
  baseUrl: string,
  email: string,
  password: string,
): Promise<LoginResult> {
  const request: LoginRequestDto = { email, password };

  const dto = await apiRequest<LoginResponseDto>({
    baseUrl,
    path: ENDPOINTS.login,
    method: "POST",
    body: request,
  });

  if (!dto || typeof dto.token !== "string" || !dto.token) {
    throw new ApiError("parsing", "La respuesta de inicio de sesión no incluye un token.");
  }

  const fallbackName = email.split("@")[0]?.trim() || "Melómano";

  return {
    user: {
      name: dto.nombre?.trim() || fallbackName,
      email: dto.email?.trim() || email,
    },
    token: dto.token,
    tipo: dto.tipo?.trim() || "usuario",
  };
}
