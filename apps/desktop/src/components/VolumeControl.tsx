import { useState } from "react";
import { usePlayer } from "../stores/player";
import { Icon } from "./Icon";

/**
 * Control de volumen de la barra del reproductor: se dibuja pegado a la
 * izquierda del botón de cola, en la zona derecha de `PlayerBar`, y escribe el
 * volumen en el store del reproductor (dueño único, ADR-011).
 *
 * El icono alterna silencio y restaura el último volumen audible.
 */
export function VolumeControl() {
  const { state, setVolume } = usePlayer();
  const [lastAudibleVolume, setLastAudibleVolume] = useState(70);
  const isMuted = state.volume === 0;

  const applyVolume = (value: number) => {
    if (value > 0) setLastAudibleVolume(value);
    setVolume(value);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => applyVolume(isMuted ? lastAudibleVolume : 0)}
        aria-label={isMuted ? "Activar sonido" : "Silenciar"}
        aria-pressed={isMuted}
        className="grid size-9 shrink-0 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
      >
        <Icon name={isMuted ? "volume_off" : "volume_up"} size={20} />
      </button>

      <input
        type="range"
        min={0}
        max={100}
        value={state.volume}
        onChange={(event) => applyVolume(Number(event.target.value))}
        aria-label="Volumen"
        aria-valuetext={`${state.volume} %`}
        className="h-1 w-16 cursor-pointer accent-accent lg:w-24"
      />

      <span className="hidden w-8 text-caption tabular-nums text-text-secondary lg:block">
        {state.volume}%
      </span>
    </div>
  );
}
