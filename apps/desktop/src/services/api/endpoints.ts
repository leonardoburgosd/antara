/**
 * Catálogo central de rutas del backend.
 *
 * Regla de integración (ADR-016): aquí solo viven rutas relativas. La URL base
 * la configura el usuario en la pantalla de servidores y el `apiClient` compone
 * `baseUrl + path` en cada consulta. Nunca se escribe un host en estas rutas.
 */
export const ENDPOINTS = {
  /** POST { email, password } → usuario + token (UsuarioController.LoginAsync). */
  login: "/api/usuario/login",
  /** GET → lista de álbumes; requiere Bearer con rol admin (AlbumController.ObtenerTodosAlbumesAsync). */
  albums: "/api/album/todos",
} as const;
