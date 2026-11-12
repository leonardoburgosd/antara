/**
 * Catálogo central de rutas del backend.
 *
 * Regla de integración (ADR-016): aquí solo viven rutas relativas. La URL base
 * la configura el usuario en la pantalla de servidores y el `apiClient` compone
 * `baseUrl + path` en cada consulta. Nunca se escribe un host en estas rutas.
 *
 * Fuente: `docs/api.md` del repositorio `antara.backend`. Los controladores son
 * la referencia definitiva: cuando un endpoint nuevo aparezca en un controlador,
 * se añade aquí antes de usarlo desde un servicio.
 */
export const ENDPOINTS = {
  // Sistema (SistemaController)
  /** GET → estado del servicio, sin token (healthcheck de Docker). */
  health: "/api/sistema/health",
  /** GET → unidades del host visibles para la API; requiere Bearer admin. */
  hostUnits: "/api/sistema/unidades-host",
  /** GET → { existe } indicando si ya hay un administrador registrado. */
  firstAdminStatus: "/api/sistema/crear-primer-admin",
  /** POST { email, password, nombre, … } → crea el primer admin si no existe ninguno. */
  createFirstAdmin: "/api/sistema/crea-primero-admin",

  // Autenticación y usuarios (UsuarioController)
  /** POST { email, password } → usuario + token. */
  login: "/api/usuario/login",
  /** GET → lista de usuarios; requiere Bearer admin. */
  users: "/api/usuario/todos",
  /** POST → crea un usuario; requiere Bearer admin. */
  createUser: "/api/usuario",
  /** PUT → actualiza un usuario (datos, rol, estado, contraseña); admin. */
  updateUser: (userId: string) => `/api/usuario/${encodeURIComponent(userId)}`,
  /** DELETE → elimina un usuario; admin. */
  deleteUser: (userId: string) => `/api/usuario/${encodeURIComponent(userId)}`,
  /** GET → datos del usuario autenticado. */
  profile: "/api/usuario/perfil",
  /** PUT → actualiza el perfil propio. */
  updateProfile: "/api/usuario/perfil",
  /** POST { passwordActual, passwordNueva } → cambia la contraseña propia. */
  changePassword: "/api/usuario/perfil/password",

  // Álbumes (AlbumController)
  /** GET → lista de álbumes; requiere Bearer admin. */
  albums: "/api/album/todos",
  /** GET → álbumes de un usuario (sin token). */
  albumsByUser: (userId: string) => `/api/album/todos/${encodeURIComponent(userId)}`,
  /** GET → un álbum por id (sin token). */
  album: (albumId: string) => `/api/album/${encodeURIComponent(albumId)}`,
  /** POST → crea un álbum; admin. */
  createAlbum: "/api/album",
  /** PUT → edita un álbum; admin. */
  updateAlbum: (albumId: string) => `/api/album/${encodeURIComponent(albumId)}`,
  /** PUT → alterna publicado/borrador; admin. */
  publishAlbum: (albumId: string) => `/api/album/${encodeURIComponent(albumId)}/publicar`,
  /** DELETE → elimina un álbum; admin. */
  deleteAlbum: (albumId: string) => `/api/album/${encodeURIComponent(albumId)}`,

  // Pistas (PistaController)
  /** GET → biblioteca de pistas; requiere Bearer admin. */
  tracks: "/api/pista/todos",
  /** GET → pistas del álbum. */
  albumTracks: (albumId: string) => `/api/pista/todos/album/${encodeURIComponent(albumId)}`,
  /** GET → canciones de la playlist mezclando artistas. */
  playlistTracks: (playlistId: string) =>
    `/api/pista/todos/playlist/${encodeURIComponent(playlistId)}`,
  /**
   * GET → contenido de audio de la pista. Sirve el archivo con `Accept-Ranges`,
   * por lo que el motor de reproducción puede hacer seek.
   */
  trackStream: (trackId: string) => `/api/pista/${encodeURIComponent(trackId)}`,
  /** PUT → suma una reproducción a la pista. */
  registerPlay: (trackId: string) => `/reproducir/${encodeURIComponent(trackId)}`,
  /** GET → rutas de audio activas para elegir destino de subida; admin. */
  uploadRoutes: "/api/pista/subir/rutas",
  /** POST multipart (archivo, rutaId?, subcarpeta?) → sube un audio; admin. */
  uploadTrack: "/api/pista/subir",
  /** POST { rutaId?, subcarpeta?, url } → descarga audio de YouTube; admin. */
  uploadFromUrl: "/api/pista/subir/url",
  /** GET → proveedores de metadatos habilitados; admin. */
  metadataProviders: "/api/pista/metadatos/proveedores",
  /** GET ?cadena=&proveedor= → coincidencias de metadatos; admin. */
  metadataSearch: (cadena: string, proveedor = "todos") =>
    `/api/pista/metadatos/buscar?cadena=${encodeURIComponent(cadena)}&proveedor=${encodeURIComponent(proveedor)}`,
  /** POST { idExterno, proveedor } → aplica los metadatos a la pista; admin. */
  trackMetadata: (trackId: string) => `/api/pista/${encodeURIComponent(trackId)}/metadatos`,
  /** GET → letra sincronizada (LRC); 404 si no existe versión sincronizada. */
  synchronizedLyrics: (trackId: string) =>
    `/api/pista/${encodeURIComponent(trackId)}/letra-sincronizada`,

  // Mis pistas (MisPistasController)
  /** GET → pistas propias; un admin ve la biblioteca completa. */
  myTracks: "/api/mis-pistas",
  /**
   * GET → detalle de una pista con su `letra` plana. Dueño o admin, así que es
   * la fuente de la letra cuando el listado del álbum la entrega en null.
   */
  myTrack: (trackId: string) => `/api/mis-pistas/${encodeURIComponent(trackId)}`,
  /** GET → letra LRC de una pista propia (dueño/admin). */
  myTrackSynchronizedLyrics: (trackId: string) =>
    `/api/mis-pistas/${encodeURIComponent(trackId)}/letra-sincronizada`,

  // Playlists (PlaylistController)
  /** GET → playlists con nº de canciones y artistas; requiere Bearer admin. */
  playlists: "/api/playlist/todos",
  /** GET → playlists de un usuario. */
  playlistsByUser: (userId: string) => `/api/playlist/todos/${encodeURIComponent(userId)}`,
  /** GET → una playlist por id. */
  playlist: (playlistId: string) => `/api/playlist/${encodeURIComponent(playlistId)}`,
  /**
   * POST multipart (Nombre, Descripcion?, UsuarioId?, PortadaUrl?, imagenDePortada?)
   * → crea la playlist y responde 201 con el DTO. Cualquier usuario autenticado;
   * solo un admin puede crear para otro `UsuarioId`.
   */
  createPlaylist: "/api/playlist",
  /** PUT multipart → edita nombre, descripción o portada. */
  updatePlaylist: (playlistId: string) => `/api/playlist/${encodeURIComponent(playlistId)}`,
  /** DELETE → elimina la playlist. */
  deletePlaylist: (playlistId: string) => `/api/playlist/${encodeURIComponent(playlistId)}`,
  /** GET → pistas de la playlist (`PlaylistController.ObtenerPistasAsync`). */
  playlistItems: (playlistId: string) => `/api/playlist/${encodeURIComponent(playlistId)}/pistas`,
  /** POST { pistaId } → agrega una pista a la playlist. */
  addPlaylistTrack: (playlistId: string) => `/api/playlist/${encodeURIComponent(playlistId)}/pistas`,
  /** DELETE → quita la pista de la playlist. */
  removePlaylistTrack: (playlistId: string, trackId: string) =>
    `/api/playlist/${encodeURIComponent(playlistId)}/pistas/${encodeURIComponent(trackId)}`,

  // Rutas de audio (RutaAudioController)
  /** GET → rutas de almacenamiento configuradas; admin. */
  audioRoutes: "/api/rutas-audio",
  /** POST → crea una ruta de audio; admin. */
  createAudioRoute: "/api/rutas-audio",
  /** PUT → actualiza una ruta; admin. */
  updateAudioRoute: (routeId: string) => `/api/rutas-audio/${encodeURIComponent(routeId)}`,
  /** DELETE → elimina una ruta; admin. */
  deleteAudioRoute: (routeId: string) => `/api/rutas-audio/${encodeURIComponent(routeId)}`,
  /** GET → comprueba que la ruta es accesible; admin. */
  testAudioRoute: (routeId: string) => `/api/rutas-audio/${encodeURIComponent(routeId)}/probar`,

  // Dashboard y escaneo (DashboardController, EscaneoAudioController)
  /** GET → métricas del panel; admin. */
  dashboard: "/api/dashboard",
  /** POST → inicia un escaneo de la biblioteca; admin. */
  startScan: "/api/escaneo-audio",
  /** GET → estado del escaneo en curso; admin. */
  currentScan: "/api/escaneo-audio/actual",
  /** GET → estado de un escaneo por id; admin. */
  scan: (scanId: string) => `/api/escaneo-audio/${encodeURIComponent(scanId)}`,
  /** DELETE → cancela un escaneo; admin. */
  cancelScan: (scanId: string) => `/api/escaneo-audio/${encodeURIComponent(scanId)}/cancelar`,
} as const;
