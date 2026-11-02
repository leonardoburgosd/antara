import type { NavId } from "../types/library";

export type NavItem = {
  id: NavId;
  label: string;
  /** Nombre de ligadura de Material Symbols. */
  icon: string;
};

/** Destinos de navegación: misma paridad que la Bottom Navigation de Mobile. */
export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Inicio", icon: "home" },
  { id: "search", label: "Búsqueda", icon: "search" },
  { id: "library", label: "Tu biblioteca", icon: "library_music" },
  { id: "profile", label: "Perfil", icon: "person" },
];

export type SidebarLink = {
  id: string;
  label: string;
  /** Destino de navegación; si se omite se abre la biblioteca. */
  target?: NavId;
};

/** Enlaces de texto de la biblioteca en la sidebar (sin iconos). */
export const LIBRARY_LINKS: SidebarLink[] = [
  { id: "library-files", label: "Mis archivos", target: "uploads" },
  { id: "library-made-for-you", label: "Hecho para ti" },
  { id: "library-recent", label: "Reproducido recientemente" },
  { id: "library-liked", label: "Canciones que te gustan" },
  { id: "library-albums", label: "Álbumes" },
  { id: "library-artists", label: "Artistas" },
  { id: "library-podcasts", label: "Podcasts" },
];

/** Playlists del usuario mostradas como enlaces de texto en la sidebar. */
export const SIDEBAR_PLAYLISTS: SidebarLink[] = [
  { id: "playlist-on-repeat", label: "En repetición" },
  { id: "playlist-discovery", label: "Descubrimiento" },
  { id: "playlist-night", label: "Noche larga" },
  { id: "playlist-focus", label: "Enfoque total" },
];
