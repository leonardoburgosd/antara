import { usePlayer } from "../stores/player";
import { formatTime } from "../utils/formatTime";
import { Icon } from "./Icon";

/** Barra inferior persistente del reproductor (80px en Desktop/Web). */
export function PlayerBar() {
  const { state, currentTrack, togglePlayPause, next, previous, seek, toggleShuffle, cycleRepeat } =
    usePlayer();

  if (!currentTrack) return null;

  const repeatIcon = state.repeat === "one" ? "repeat_one" : "repeat";

  return (
    <section
      aria-label="Reproductor"
      className="shrink-0 border-t border-border bg-surface"
    >
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-3 px-4 md:h-20 md:gap-4">
        {/* Pista actual */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className={`size-11 shrink-0 rounded-md md:size-14 ${currentTrack.coverColor}`} aria-hidden="true" />
          <div className="min-w-0">
            <p className="truncate text-body font-semibold text-text-primary">{currentTrack.title}</p>
            <p className="truncate text-caption text-text-secondary">{currentTrack.artist}</p>
          </div>
          <button
            type="button"
            aria-label="Favorito"
            className="hidden size-10 shrink-0 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary sm:grid"
          >
            <Icon name="favorite_border" size={20} />
          </button>
        </div>

        {/* Controles y progreso */}
        <div className="flex min-w-0 flex-[1.4] flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleShuffle}
              aria-label="Aleatorio"
              aria-pressed={state.shuffle}
              className={`hidden size-9 place-items-center rounded-full transition-colors duration-150 hover:bg-surface-hover sm:grid ${
                state.shuffle ? "text-primary" : "text-text-secondary"
              }`}
            >
              <Icon name="shuffle" size={20} />
            </button>

            <button
              type="button"
              onClick={previous}
              aria-label="Anterior"
              className="grid size-9 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
            >
              <Icon name="skip_previous" size={22} filled />
            </button>

            <button
              type="button"
              onClick={togglePlayPause}
              aria-label={state.isPlaying ? "Pausar" : "Reproducir"}
              className="mx-1 grid size-10 place-items-center rounded-full bg-primary text-on-primary transition-colors duration-150 hover:bg-primary-hover active:bg-primary-pressed"
            >
              <Icon name={state.isPlaying ? "pause" : "play_arrow"} size={22} filled />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Siguiente"
              className="grid size-9 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
            >
              <Icon name="skip_next" size={22} filled />
            </button>

            <button
              type="button"
              onClick={cycleRepeat}
              aria-label="Repetir"
              aria-pressed={state.repeat !== "off"}
              className={`relative hidden size-9 place-items-center rounded-full transition-colors duration-150 hover:bg-surface-hover sm:grid ${
                state.repeat === "off" ? "text-text-secondary" : "text-primary"
              }`}
            >
              <Icon name={repeatIcon} size={20} />
              {state.repeat === "one" ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 right-1 grid size-3.5 place-items-center rounded-full bg-primary text-[9px] font-bold leading-none text-on-primary"
                >
                  1
                </span>
              ) : null}
            </button>
          </div>

          <div className="hidden w-full max-w-md items-center gap-2 md:flex">
            <span className="w-9 text-right text-caption tabular-nums text-text-secondary">
              {formatTime(state.position)}
            </span>
            <input
              type="range"
              min={0}
              max={currentTrack.duration}
              value={state.position}
              onChange={(event) => seek(Number(event.target.value))}
              aria-label="Progreso de la pista"
              className="h-1 w-full cursor-pointer accent-accent"
            />
            <span className="w-9 text-caption tabular-nums text-text-secondary">
              {formatTime(currentTrack.duration)}
            </span>
          </div>
        </div>

        {/* Volumen y cola */}
        <div className="hidden flex-1 items-center justify-end gap-2 md:flex">
          <Icon name="volume_up" size={20} className="text-text-secondary" />
          <input
            type="range"
            min={0}
            max={100}
            defaultValue={70}
            aria-label="Volumen"
            className="h-1 w-24 cursor-pointer accent-accent"
          />
          <button
            type="button"
            aria-label="Cola de reproducción"
            className="grid size-10 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
          >
            <Icon name="queue_music" size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
