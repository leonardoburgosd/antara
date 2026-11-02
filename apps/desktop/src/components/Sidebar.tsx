import { LIBRARY_LINKS, NAV_ITEMS, SIDEBAR_PLAYLISTS } from "../app/navigation";
import { useSession } from "../stores/session";
import type { NavId } from "../types/library";
import { Icon } from "./Icon";

type SidebarProps = {
  active: NavId;
  onSelect: (id: NavId) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="px-3 pb-2 text-overline font-semibold uppercase tracking-[0.08em] text-text-secondary">
      {children}
    </p>
  );
}

function initials(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

/**
 * Sidebar de Desktop: 240px expandida / 72px contraída (responsive-design.md).
 * Cabecera de marca, navegación principal con pastilla activa rellena
 * (`primary-subtle` con texto `primary`), biblioteca y playlists como enlaces de
 * texto, bloque de sesión y acción "Nueva playlist" al pie.
 */
export function Sidebar({ active, onSelect, collapsed, onToggleCollapsed }: SidebarProps) {
  const { user, signIn, signOut } = useSession();

  return (
    <nav
      aria-label="Navegación principal"
      className={`flex shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 ${
        collapsed ? "w-[72px]" : "w-60"
      }`}
    >
      <div className={`flex items-center gap-2 px-5 pb-4 pt-5 ${collapsed ? "justify-center px-0" : ""}`}>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
          <Icon name="music_note" size={20} />
        </span>
        {collapsed ? null : <span className="truncate text-h3 font-semibold text-text-primary">Antara</span>}
      </div>

      <div className={`min-h-0 flex-1 overflow-y-auto pb-4 ${collapsed ? "px-2" : "px-3"}`}>
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === active;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.label}
                  title={collapsed ? item.label : undefined}
                  className={`flex h-10 w-full items-center gap-3 rounded-lg text-body transition-colors duration-150 ${
                    collapsed ? "justify-center px-0" : "px-3"
                  } ${
                    isActive
                      ? "bg-primary-subtle font-semibold text-primary"
                      : "font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                  }`}
                >
                  <Icon name={item.icon} filled={isActive} size={22} />
                  {collapsed ? <span className="sr-only">{item.label}</span> : <span className="truncate">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>

        {collapsed ? null : (
          <>
            <div className="mt-6">
              <SectionLabel>Tu biblioteca</SectionLabel>
              <ul className="flex flex-col gap-0.5">
                {LIBRARY_LINKS.map((link) => {
                  const target = link.target ?? "library";
                  const isActive = link.target !== undefined && active === link.target;

                  return (
                    <li key={link.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(target)}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex h-9 w-full items-center rounded-md px-3 text-left text-body transition-colors duration-150 ${
                          isActive
                            ? "bg-primary-subtle font-semibold text-primary"
                            : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                        }`}
                      >
                        <span className="truncate">{link.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-6">
              <SectionLabel>Playlists</SectionLabel>
              <ul className="flex flex-col gap-0.5">
                {SIDEBAR_PLAYLISTS.map((playlist) => (
                  <li key={playlist.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(playlist.target ?? "library")}
                      className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-left text-body text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
                    >
                      <span className="truncate">{playlist.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      <div className={`border-t border-border py-3 ${collapsed ? "px-2" : "px-3"}`}>
        {collapsed ? (
          <div className="mb-2 flex justify-center">
            <span
              title={user ? `${user.name} · ${user.email}` : "Sin sesión"}
              className="grid size-9 place-items-center rounded-full bg-primary-subtle text-body-sm font-semibold uppercase text-primary"
            >
              {user ? initials(user.name) : "?"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-1 pb-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-subtle text-body-sm font-semibold uppercase text-primary">
              {user ? initials(user.name) : "?"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-body-sm font-medium text-text-primary">
                {user ? user.name : "Sin sesión"}
              </p>
              <p className="truncate text-caption text-text-secondary">
                {user ? user.email : "Inicia sesión para continuar"}
              </p>
            </div>
          </div>
        )}

        <ul className="flex flex-col gap-0.5">
          <li>
            <button
              type="button"
              onClick={() => onSelect("server")}
              aria-current={active === "server" ? "page" : undefined}
              aria-label="Configurar servidores"
              title={collapsed ? "Configurar servidores" : undefined}
              className={`flex h-9 w-full items-center gap-2.5 rounded-md text-body transition-colors duration-150 ${
                collapsed ? "justify-center px-0" : "px-3 text-left"
              } ${
                active === "server"
                  ? "bg-primary-subtle font-semibold text-primary"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }`}
            >
              <Icon name="dns" size={20} />
              {collapsed ? null : <span className="truncate">Configurar servidores</span>}
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => (user ? signOut() : signIn("alex@antara.app"))}
              aria-label={user ? "Cerrar sesión" : "Iniciar sesión"}
              title={collapsed ? (user ? "Cerrar sesión" : "Iniciar sesión") : undefined}
              className={`flex h-9 w-full items-center gap-2.5 rounded-md text-body text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary ${
                collapsed ? "justify-center px-0" : "px-3 text-left"
              }`}
            >
              <Icon name={user ? "logout" : "login"} size={20} />
              {collapsed ? null : <span className="truncate">{user ? "Cerrar sesión" : "Iniciar sesión"}</span>}
            </button>
          </li>
        </ul>

        <button
          type="button"
          aria-label="Nueva playlist"
          title={collapsed ? "Nueva playlist" : undefined}
          className={`mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-primary text-button text-on-primary transition-colors duration-150 hover:bg-primary-hover ${
            collapsed ? "px-0" : ""
          }`}
        >
          <Icon name="add" size={18} />
          {collapsed ? null : <span className="truncate">Nueva playlist</span>}
        </button>

        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
          title={collapsed ? "Expandir menú" : undefined}
          className={`mt-2 flex h-9 w-full items-center gap-2 rounded-md text-body-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
        >
          <Icon name={collapsed ? "chevron_right" : "chevron_left"} size={20} />
          {collapsed ? null : <span className="truncate">Contraer menú</span>}
        </button>
      </div>
    </nav>
  );
}
