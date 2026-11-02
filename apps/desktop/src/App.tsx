import { useEffect, useState } from "react";
import { NAV_ITEMS } from "./app/navigation";
import { Icon } from "./components/Icon";
import { PlayerBar } from "./components/PlayerBar";
import { Sidebar } from "./components/Sidebar";
import { LoginScreen } from "./features/auth/LoginScreen";
import { HomeScreen } from "./features/home/HomeScreen";
import { UploadsScreen } from "./features/uploads/UploadsScreen";
import { PlayerProvider, usePlayer } from "./stores/player";
import { SessionProvider, useSession } from "./stores/session";
import { UploadsProvider } from "./stores/uploads";
import type { NavId } from "./types/library";

const SIDEBAR_STORAGE_KEY = "antara:desktop:sidebar-collapsed";

const EXTRA_TITLES: Partial<Record<NavId, string>> = {
  uploads: "Mis archivos",
  server: "Servidores",
};

function PlaceholderScreen({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
      <Icon name="auto_awesome" size={40} className="text-text-disabled" />
      <h1 className="text-h2 font-semibold text-text-primary">{title}</h1>
      <p className="text-body-sm text-text-secondary">Próximamente</p>
    </div>
  );
}

function AppShell() {
  const [tab, setTab] = useState<NavId>("home");
  const [collapsed, setCollapsed] = useState(
    () => window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true",
  );
  const { currentTrack } = usePlayer();
  const activeLabel = NAV_ITEMS.find((item) => item.id === tab)?.label ?? EXTRA_TITLES[tab] ?? "";

  // El estado de la sidebar se persiste entre sesiones (respeta `core:window` sin plugins extra).
  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  // Región compacta (< 900px): la sidebar se contrae automáticamente.
  useEffect(() => {
    const query = window.matchMedia("(max-width: 899px)");
    const apply = () => {
      if (query.matches) setCollapsed(true);
    };

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <div className="flex h-dvh flex-col bg-background text-text-primary">
      <div className="flex min-h-0 flex-1">
        <Sidebar
          active={tab}
          onSelect={setTab}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-3 border-b border-border px-6 py-3">
            <div className="relative w-full max-w-sm">
              <Icon
                name="search"
                size={20}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                type="search"
                aria-label="Buscar en Antara"
                placeholder="Buscar canciones, artistas o álbumes"
                className="h-10 w-full rounded-md border border-border-strong bg-surface-elevated pl-10 pr-3 text-body text-text-primary placeholder:text-text-disabled focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="button"
              aria-label="Ajustes"
              className="ml-auto grid size-10 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
            >
              <Icon name="settings" size={22} />
            </button>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto">
            {tab === "home" ? (
              <HomeScreen userName="Alex" />
            ) : tab === "uploads" ? (
              <UploadsScreen />
            ) : (
              <PlaceholderScreen title={activeLabel} />
            )}
          </main>
        </div>
      </div>

      {currentTrack ? <PlayerBar /> : null}
    </div>
  );
}

/** Sin sesión se muestra el login (misma regla que Android: login primero). */
function Root() {
  const { user } = useSession();

  return user ? <AppShell /> : <LoginScreen />;
}

function App() {
  return (
    <SessionProvider>
      <UploadsProvider>
        <PlayerProvider>
          <Root />
        </PlayerProvider>
      </UploadsProvider>
    </SessionProvider>
  );
}

export default App;
