import { Icon } from "./Icon";

type MediaRowProps = {
  title: string;
  subtitle: string;
  /** Utilidad Tailwind de un token de color para la portada. */
  coverColor: string;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlay: () => void;
};

/**
 * Fila de canción/playlist del design system: 64px, portada 48px,
 * estado reproduciendo con `primary` + ecualizador `accent`.
 */
export function MediaRow({ title, subtitle, coverColor, isCurrent, isPlaying, onPlay }: MediaRowProps) {
  return (
    <div className="flex h-16 items-center gap-3 rounded-md px-3 transition-colors duration-150 hover:bg-surface-hover">
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

      <button
        type="button"
        onClick={onPlay}
        aria-label={isCurrent && isPlaying ? "Pausar" : "Reproducir"}
        className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-elevated text-primary transition-colors duration-150 hover:bg-surface"
      >
        <Icon name={isCurrent && isPlaying ? "pause" : "play_arrow"} size={22} filled />
      </button>
    </div>
  );
}
