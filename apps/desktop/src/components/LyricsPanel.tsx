import { useEffect, useRef } from "react";
import { useSynchronizedLyrics } from "../hooks/useSynchronizedLyrics";
import { usePlayer } from "../stores/player";
import { activeLyricIndex } from "../utils/lrc";
import { Icon } from "./Icon";

type LyricsPanelProps = {
  open: boolean;
  onToggle: () => void;
};

/**
 * Botón de letra (a la izquierda del volumen) y vista de letra a pantalla
 * completa por encima del reproductor. Primero intenta la versión sincronizada
 * (LRCLIB) y, si la canción solo tiene letra plana, la muestra sin resaltado.
 *
 * La consulta al endpoint solo se ejecuta mientras la vista está abierta
 * (`enabled`), nunca en segundo plano.
 */
export function LyricsPanel({ open, onToggle }: LyricsPanelProps) {
  const { currentTrack, state } = usePlayer();
  const lyrics = useSynchronizedLyrics(currentTrack?.id, open, currentTrack?.lyrics);
  const activeIndex = activeLyricIndex(lyrics.lines, state.position);
  const listRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  // Escape cierra la vista, igual que el resto de overlays del producto.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onToggle();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onToggle]);

  // Mantiene la línea activa centrada mientras avanza la canción.
  useEffect(() => {
    if (!open || activeIndex < 0) return;

    const line = lineRefs.current[activeIndex];
    const list = listRef.current;
    if (!line || !list) return;

    list.scrollTo({
      top: line.offsetTop - list.clientHeight / 2 + line.offsetHeight / 2,
      behavior: "smooth",
    });
  }, [open, activeIndex]);

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-label="Letra"
        aria-pressed={open}
        className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-150 hover:bg-surface-hover ${
          open ? "text-primary" : "text-text-secondary hover:text-text-primary"
        }`}
      >
        <Icon name="lyrics" size={20} />
      </button>

      {open ? (
        <section
          aria-label="Letra de la canción"
          className="fixed inset-0 z-50 flex flex-col bg-background"
        >
          <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-8">
            <div className="min-w-0">
              <p className="text-overline font-semibold uppercase tracking-[0.08em] text-text-secondary">
                Letra
              </p>
              <p className="mt-1 truncate text-h3 font-semibold text-text-primary">
                {currentTrack?.title ?? "Sin canción"}
              </p>
              <p className="truncate text-body-sm text-text-secondary">{currentTrack?.artist}</p>
            </div>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Cerrar letra"
              className="grid size-10 shrink-0 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
            >
              <Icon name="close" size={22} />
            </button>
          </header>

          <div
            ref={listRef}
            className="relative min-h-0 flex-1 overflow-y-auto px-6 py-10 sm:px-10"
            aria-live="polite"
          >
            <div className="mx-auto flex w-full max-w-[760px] flex-col">
              {lyrics.status === "loading" ? (
                <p className="text-body-sm text-text-secondary">Cargando letra…</p>
              ) : null}
              {lyrics.status === "idle" ? (
                <p className="text-body-sm text-text-secondary">
                  Reproduce una canción del servidor para ver su letra.
                </p>
              ) : null}
              {lyrics.status === "unavailable" ? (
                <p className="text-body-sm text-text-secondary">Esta canción no tiene letra.</p>
              ) : null}
              {lyrics.status === "error" ? (
                <p className="text-body-sm text-error">No se pudo cargar la letra.</p>
              ) : null}

              {lyrics.status === "ready" && lyrics.lines.length > 0 ? (
                <div className="flex flex-col gap-4 pb-24 md:gap-5">
                  {lyrics.lines.map((line, index) => (
                    <p
                      key={`${line.timeMs}-${index}`}
                      ref={(element) => {
                        lineRefs.current[index] = element;
                      }}
                      className={`text-h2 font-semibold leading-snug transition-colors duration-200 md:text-h1 ${
                        index === activeIndex
                          ? "text-text-primary"
                          : "text-text-secondary opacity-60"
                      }`}
                    >
                      {line.text}
                    </p>
                  ))}
                </div>
              ) : null}

              {lyrics.status === "ready" && lyrics.lines.length === 0 && lyrics.plain ? (
                <div className="flex flex-col gap-6 pb-24">
                  <p className="text-overline font-semibold uppercase tracking-[0.08em] text-text-secondary">
                    Letra sin sincronizar
                  </p>
                  {lyrics.plain.split(/\n{2,}/).map((stanza, index) => (
                    <p
                      key={index}
                      className="whitespace-pre-line text-h3 font-medium leading-relaxed text-text-secondary md:text-h2"
                    >
                      {stanza.trim()}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
