/**
 * Motor de audio para archivos locales: fase 1 de `PlaybackEngine` (ADR-003).
 * Envuelve un `HTMLAudioElement` y avisa posición y fin de pista; la UI nunca
 * crea elementos de audio por su cuenta (estado con dueño único, ADR-011).
 */

export type LocalAudioEngine = {
  load: (src: string) => void;
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  /** Volumen del elemento de audio, de 0 a 1. */
  setVolume: (level: number) => void;
  dispose: () => void;
};

type EngineHandlers = {
  onPosition: (seconds: number) => void;
  onEnded: () => void;
};

export function createLocalAudioEngine(handlers: EngineHandlers): LocalAudioEngine {
  const audio = new Audio();
  audio.preload = "auto";

  audio.addEventListener("timeupdate", () => handlers.onPosition(audio.currentTime));
  audio.addEventListener("ended", () => handlers.onEnded());

  return {
    load(src) {
      audio.src = src;
    },
    play() {
      // El navegador puede rechazar la reproducción sin gesto del usuario.
      void audio.play().catch(() => undefined);
    },
    pause() {
      audio.pause();
    },
    seek(seconds) {
      if (Number.isFinite(seconds)) audio.currentTime = seconds;
    },
    setVolume(level) {
      if (Number.isFinite(level)) audio.volume = Math.min(1, Math.max(0, level));
    },
    dispose() {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    },
  };
}
