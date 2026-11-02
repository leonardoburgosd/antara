import type { Playlist, Track } from "../types/library";

/**
 * Datos de ejemplo mientras no exista backend (mismo contenido que la app Android).
 * Las portadas son utilidades de tokens del design system, nunca colores literales.
 */

type LikedSpec = {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: number;
};

const LIKED_SPECS: LikedSpec[] = [
  { id: "liked-1", title: "Latido Nocturno", artist: "Luna Vale", album: "Midnight Reverie", cover: "bg-primary", duration: 214 },
  { id: "liked-2", title: "Corriente Viva", artist: "DJ Prism", album: "Frecuencia", cover: "bg-accent-warm", duration: 198 },
  { id: "liked-3", title: "Marea Alta", artist: "Marina Ríos", album: "Marea", cover: "bg-info", duration: 246 },
  { id: "liked-4", title: "Sol Abierto", artist: "Los Cometas", album: "Sol de Invierno", cover: "bg-accent", duration: 232 },
  { id: "liked-5", title: "Sendero", artist: "Trío Cóndor", album: "Rutas Antiguas", cover: "bg-success", duration: 187 },
  { id: "liked-6", title: "Ciudad de Neón", artist: "Luna Vale", album: "Neon Dreams", cover: "bg-error", duration: 205 },
  { id: "liked-7", title: "Pulso", artist: "DJ Prism", album: "Frecuencia", cover: "bg-primary", duration: 221 },
  { id: "liked-8", title: "Vidrio Roto", artist: "The Static Hearts", album: "Vidrio Roto", cover: "bg-accent", duration: 193 },
];

export const LIKED_TRACKS: Track[] = LIKED_SPECS.map((spec) => ({
  id: spec.id,
  title: spec.title,
  artist: spec.artist,
  album: spec.album,
  coverColor: spec.cover,
  duration: spec.duration,
}));

/** Proyecta la cola como playlists diarias (equivalente a `buildHomeContent` de Android). */
export function playlistsFromTracks(tracks: Track[]): Playlist[] {
  return tracks.map((track, index) => ({
    id: track.id,
    title: track.title,
    artist: track.artist,
    coverColor: track.coverColor,
    trackCount: tracks.length,
    trackIndex: index,
  }));
}
