/** Contratos de la biblioteca musical (los DTOs del backend llegarán en `services/api`). */

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  /** Color de portada tomado de un token del design system. */
  coverColor: string;
  /** Duración en segundos. */
  duration: number;
  /** URL reproducible: stream de la pista en el backend o blob de un archivo local. */
  src?: string;
};

export type Playlist = {
  id: string;
  title: string;
  artist: string;
  coverColor: string;
  trackCount: number;
  /** Índice de la pista de la cola que representa la playlist. */
  trackIndex: number;
};

export type FeaturedItem = {
  id: string;
  title: string;
  subtitle: string;
  /** Utilidad Tailwind de un token de color (p. ej. `bg-primary`). */
  background: string;
  darkText: boolean;
};

export type HomeFilter = "all" | "new" | "trending" | "top";

export type RepeatMode = "off" | "all" | "one";

export type PlayerState = {
  queue: Track[];
  index: number;
  isPlaying: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  /** Posición en segundos. */
  position: number;
  /** Volumen 0–100, independiente de los controles de transporte. */
  volume: number;
};

/** Destinos de la navegación: principal, archivos subidos y configuración de servidores. */
export type NavId = "home" | "search" | "library" | "uploads" | "profile" | "server";

export type SessionUser = {
  name: string;
  email: string;
};
