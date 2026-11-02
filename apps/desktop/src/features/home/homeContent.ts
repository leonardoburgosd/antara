import { playlistsFromTracks, LIKED_TRACKS } from "../../data/library";
import type { FeaturedItem, HomeFilter, Playlist, Track } from "../../types/library";

/** Contenido de Home por filtro (equivalente a `buildHomeContent` de Android). */

export const HOME_FILTERS: Array<{ id: HomeFilter; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "new", label: "Novedades" },
  { id: "trending", label: "Tendencias" },
  { id: "top", label: "Top canciones" },
];

export type HomeContent = {
  curatedTitle: string;
  featured: FeaturedItem[];
  playlistsTitle: string;
  playlists: Playlist[];
  tracks: Track[];
};

const DISCOVER: FeaturedItem = {
  id: "discover-weekly",
  title: "Descubre semanal",
  subtitle: "Lo mejor de tu semana, elegido para ti",
  background: "bg-primary",
  darkText: false,
};

const NEW_RELEASES: FeaturedItem = {
  id: "new-releases",
  title: "Nuevos lanzamientos",
  subtitle: "Lo último de tus artistas favoritos",
  background: "bg-accent-warm",
  darkText: true,
};

const TRENDING: FeaturedItem = {
  id: "trending",
  title: "Tendencias ahora",
  subtitle: "Lo que todos están escuchando",
  background: "bg-accent",
  darkText: true,
};

const TOP_50: FeaturedItem = {
  id: "top-50",
  title: "Top 50 global",
  subtitle: "Las canciones más reproducidas",
  background: "bg-info",
  darkText: true,
};

const PLAYLISTS = playlistsFromTracks(LIKED_TRACKS);

export function buildHomeContent(filter: HomeFilter): HomeContent {
  switch (filter) {
    case "new":
      return {
        curatedTitle: "Novedades para ti",
        featured: [NEW_RELEASES, DISCOVER],
        playlistsTitle: "Lanzamientos recientes",
        playlists: [...PLAYLISTS].reverse().slice(0, 6),
        tracks: LIKED_TRACKS,
      };

    case "trending":
      return {
        curatedTitle: "Tendencias ahora",
        featured: [TRENDING, TOP_50],
        playlistsTitle: "En tendencia",
        playlists: PLAYLISTS.slice(1, 7),
        tracks: LIKED_TRACKS,
      };

    case "top":
      return {
        curatedTitle: "Top canciones",
        featured: [TOP_50, TRENDING],
        playlistsTitle: "Las más escuchadas",
        playlists: PLAYLISTS.slice(0, 5),
        tracks: LIKED_TRACKS,
      };

    case "all":
    default:
      return {
        curatedTitle: "Curado y en tendencia",
        featured: [DISCOVER, NEW_RELEASES],
        playlistsTitle: "Playlists diarias",
        playlists: PLAYLISTS,
        tracks: LIKED_TRACKS,
      };
  }
}
