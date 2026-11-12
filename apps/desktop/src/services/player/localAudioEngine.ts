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
  /**
   * El elemento arrancó o se pausó por fuera del estado del reproductor: teclas
   * multimedia del teclado, controles del sistema o pestaña en segundo plano.
   */
  onPlayStateChange: (playing: boolean) => void;
};

export function createLocalAudioEngine(handlers: EngineHandlers): LocalAudioEngine {
  const audio = new Audio();
  audio.preload = "auto";

  // Al cambiar de pista el motor se destruye y su `pause()` no debe notificar:
  // apagaría la reproducción de la pista nueva.
  let disposed = false;

  audio.addEventListener("timeupdate", () => handlers.onPosition(audio.currentTime));
  audio.addEventListener("ended", () => handlers.onEnded());
  audio.addEventListener("play", () => {
    if (!disposed) handlers.onPlayStateChange(true);
  });
  audio.addEventListener("pause", () => {
    if (!disposed) handlers.onPlayStateChange(false);
  });

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
      disposed = true;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    },
  };
}
