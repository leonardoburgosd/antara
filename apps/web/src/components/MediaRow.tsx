import { Icon } from "./Icon";

type MediaRowProps = {
  title: string;
  subtitle: string;
  /** Utilidad Tailwind de un token de color para la portada. */
  coverColor: string;
  isCurrent: boolean;
  isPlaying: boolean;
  /** Si se omite, la fila no muestra acción de reproducción (p. ej. álbumes sin pistas). */
  onPlay?: () => void;
  /** Si se omite, la fila no es navegable (p. ej. pistas de una lista). */
  onOpen?: () => void;
  /** Duración ya formateada por el backend ("3:48"); se oculta si está vacía. */
  durationLabel?: string;
};

/**
 * Fila de canción/playlist del design system: 64px, portada 48px,
 * estado reproduciendo con `primary` + ecualizador `accent`.
 *
 * La zona de portada + texto puede ser navegable con `onOpen`; la acción de
 * reproducción vive en un botón aparte para no anidar botones.
 */
export function MediaRow({
  title,
  subtitle,
  coverColor,
  isCurrent,
  isPlaying,
  onPlay,
  onOpen,
  durationLabel,
}: MediaRowProps) {
  const body = (
    <>
      <div className={`size-12 shrink-0 rounded-md ${coverColor}`} aria-hidden="true" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p
            className={`truncate text-body font-semibold ${
              isCurrent ? "text-primary" : "text-text-primary"
            }`}
          >
            {title}
          </p>
          {isCurrent && isPlaying ? (
            <Icon name="graphic_eq" size={16} className="text-accent" label="Reproduciendo" />
          ) : null}
        </div>
        <p className="truncate text-body-sm text-text-secondary">{subtitle}</p>
      </div>
    </>
  );

  return (
    <div className="flex min-h-16 items-center gap-1 rounded-md pr-3 transition-colors duration-150 hover:bg-surface-hover">
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-3 py-2 text-left"
        >
          {body}
        </button>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2">{body}</div>
      )}

      {durationLabel ? (
        <span className="shrink-0 pl-2 text-caption tabular-nums text-text-secondary">
          {durationLabel}
        </span>
      ) : null}

      {onPlay ? (
        <button
          type="button"
          onClick={onPlay}
          aria-label={isCurrent && isPlaying ? "Pausar" : "Reproducir"}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-elevated text-primary transition-colors duration-150 hover:bg-surface"
        >
          <Icon name={isCurrent && isPlaying ? "pause" : "play_arrow"} size={22} filled />
        </button>
      ) : onOpen ? (
        <Icon name="chevron_right" size={22} className="shrink-0 text-text-secondary" />
      ) : null}
    </div>
  );
}
