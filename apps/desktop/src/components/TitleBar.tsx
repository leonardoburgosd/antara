import { useCallback, useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Icon } from "./Icon";

/**
 * La API de ventana solo existe dentro del webview de Tauri; al abrir el front en
 * un navegador (`vite` a secas) no hay ventana nativa que controlar.
 */
const desktopWindow =
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window ? getCurrentWindow() : null;

type WindowButtonProps = {
  label: string;
  icon: string;
  onClick: () => void;
  danger?: boolean;
};

function WindowButton({ label, icon, onClick, danger = false }: WindowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-8 w-11 place-items-center rounded-md text-text-secondary transition-colors duration-150 ${
        danger
          ? "hover:bg-error hover:text-on-primary active:bg-error/80"
          : "hover:bg-surface-hover hover:text-text-primary active:bg-surface-hover/70"
      }`}
    >
      <Icon name={icon} size={16} />
    </button>
  );
}

/**
 * Barra de ventana propia: la ventana de escritorio va sin decoración del sistema,
 * así que aquí viven el arrastre (`data-tauri-drag-region="deep"`, que además
 * maximiza con doble clic en Windows/Linux) y los tres controles nativos.
 */
export function TitleBar() {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (!desktopWindow) return;

    let unlisten: (() => void) | undefined;
    let active = true;

    const sync = () => {
      desktopWindow
        .isMaximized()
        .then((value) => {
          if (active) setMaximized(value);
        })
        .catch(() => undefined);
    };

    sync();
    desktopWindow
      .onResized(sync)
      .then((stop) => {
        unlisten = stop;
      })
      .catch(() => undefined);

    return () => {
      active = false;
      unlisten?.();
    };
  }, []);

  const minimize = useCallback(() => {
    void desktopWindow?.minimize();
  }, []);

  const toggleMaximize = useCallback(() => {
    if (!desktopWindow) return;
    void desktopWindow.toggleMaximize().then(() => desktopWindow.isMaximized().then(setMaximized));
  }, []);

  const close = useCallback(() => {
    void desktopWindow?.close();
  }, []);

  return (
    <header className="flex h-10 shrink-0 select-none items-center border-b border-border bg-surface pl-5">
      <div data-tauri-drag-region="deep" className="flex min-w-0 flex-1 items-center gap-2.5 py-2">
        <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary text-on-primary">
          <Icon name="music_note" size={15} />
        </span>
        <span className="truncate text-body-sm font-semibold tracking-wide text-text-primary">Antara</span>
      </div>

      <div className="flex items-center gap-0.5 pr-1.5">
        <WindowButton label="Minimizar" icon="remove" onClick={minimize} />
        <WindowButton
          label={maximized ? "Restaurar" : "Maximizar"}
          icon={maximized ? "filter_none" : "crop_square"}
          onClick={toggleMaximize}
        />
        <WindowButton label="Cerrar" icon="close" onClick={close} danger />
      </div>
    </header>
  );
}
