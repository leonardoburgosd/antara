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
  /** GET → pistas del álbum (PistaController.ObtenerTodosPistasDeAlbumAsync). */
  albumTracks: (albumId: string) => `/api/pista/todos/album/${encodeURIComponent(albumId)}`,
  /**
   * GET → contenido de audio de la pista para reproducirla
   * (PistaController.ObtenerPistaAsync). Sirve el archivo con `Accept-Ranges`,
   * por lo que el motor de reproducción puede hacer seek.
   */
  trackStream: (trackId: string) => `/api/pista/${encodeURIComponent(trackId)}`,
  /** GET → rutas de audio activas para elegir destino (PistaController.ObtenerRutasDeSubidaAsync). */
  uploadRoutes: "/api/pista/subir/rutas",
  /** POST multipart (archivo, rutaId?, subcarpeta?) → PistaController.SubirPistaAsync. */
  uploadTrack: "/api/pista/subir",
  /** POST { rutaId?, subcarpeta?, url } → PistaController.SubirDesdeUrlAsync. */
  uploadFromUrl: "/api/pista/subir/url",
  /** GET → playlists con nº de canciones y artistas; requiere Bearer admin (PlaylistController.ObtenerTodasAsync). */
  playlists: "/api/playlist/todos",
  /** GET → canciones de la playlist mezclando artistas (PistaController.ObtenerTodosPistasDePlaylistAsync). */
  playlistTracks: (playlistId: string) =>
    `/api/pista/todos/playlist/${encodeURIComponent(playlistId)}`,
  /** GET ?cadena=&proveedor= → coincidencias de metadatos (PistaController.BuscarMetadatosAsync). */
  metadataSearch: (cadena: string, proveedor = "todos") =>
    `/api/pista/metadatos/buscar?cadena=${encodeURIComponent(cadena)}&proveedor=${encodeURIComponent(proveedor)}`,
  /** POST { idExterno, proveedor } → aplica los metadatos a la pista (PistaController.ActualizarMetadatosAsync). */
  trackMetadata: (trackId: string) =>
    `/api/pista/${encodeURIComponent(trackId)}/metadatos`,
} as const;
