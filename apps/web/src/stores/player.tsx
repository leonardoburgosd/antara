import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { createLocalAudioEngine, type LocalAudioEngine } from "../services/player/localAudioEngine";
import type { PlayerState, RepeatMode, Track } from "../types/library";

/**
 * Estado del reproductor: único dueño del estado de reproducción (ADR-011).
 * Las pistas con `src` (stream del backend o archivos subidos) se reproducen con
 * el motor local
 * (`HTMLAudioElement`, fase 1 de ADR-003); las de muestra avanzan con temporizador
 * hasta que exista el motor completo.
 */

type PlayerAction =
  | { type: "playQueue"; tracks: Track[]; index: number }
  | { type: "toggle" }
  | { type: "setPlaying"; playing: boolean }
  | { type: "next" }
  | { type: "previous" }
  | { type: "seek"; position: number }
  | { type: "setVolume"; volume: number }
  | { type: "syncPosition"; position: number }
  | { type: "toggleShuffle" }
  | { type: "cycleRepeat" }
  | { type: "tick" };

const INITIAL_STATE: PlayerState = {
  queue: [],
  index: -1,
  isPlaying: false,
  shuffle: false,
  repeat: "off",
  position: 0,
  volume: 70,
};

const NEXT_REPEAT: Record<RepeatMode, RepeatMode> = {
  off: "all",
  all: "one",
  one: "off",
};

function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function reducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case "playQueue":
      return {
        ...state,
        queue: action.tracks,
        index: action.index,
        isPlaying: true,
        position: 0,
      };

    case "toggle":
      return state.index < 0 ? state : { ...state, isPlaying: !state.isPlaying };

    // El elemento de audio manda cuando lo controla el sistema: si ya coincide
    // se devuelve el mismo objeto para no encadenar renders.
    case "setPlaying":
      return state.isPlaying === action.playing
        ? state
        : { ...state, isPlaying: action.playing };

    case "next": {
      if (state.queue.length === 0) return state;
      if (state.repeat === "one") return { ...state, position: 0, isPlaying: true };

      const isLast = state.index >= state.queue.length - 1;
      if (isLast && state.repeat !== "all") {
        return { ...state, isPlaying: false, position: 0 };
      }

      return {
        ...state,
        index: isLast ? 0 : state.index + 1,
        position: 0,
        isPlaying: true,
      };
    }

    case "previous": {
      if (state.queue.length === 0) return state;
      // Reinicia la pista actual si ya avanzó, como en el resto de reproductores.
      if (state.position > 3) return { ...state, position: 0 };

      const previousIndex = state.index <= 0 ? state.queue.length - 1 : state.index - 1;
      return { ...state, index: previousIndex, position: 0, isPlaying: true };
    }

    case "seek":
      return { ...state, position: action.position };

    case "setVolume":
      return { ...state, volume: clampVolume(action.volume) };

    case "syncPosition":
      return { ...state, position: action.position };

    case "toggleShuffle":
      return { ...state, shuffle: !state.shuffle };

    case "cycleRepeat":
      return { ...state, repeat: NEXT_REPEAT[state.repeat] };

    case "tick": {
      const track = state.queue[state.index];
      if (!state.isPlaying || !track) return state;

      const position = state.position + 1;
      if (position < track.duration) return { ...state, position };

      return reducer(state, { type: "next" });
    }

    default:
      return state;
  }
}

type PlayerContextValue = {
  state: PlayerState;
  currentTrack: Track | null;
  playQueue: (tracks: Track[], index: number) => void;
  togglePlayPause: () => void;
  next: () => void;
  previous: () => void;
  seek: (position: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const engineRef = useRef<LocalAudioEngine | null>(null);
  const currentSrc = state.queue[state.index]?.src ?? null;

  // Motor de audio solo para pistas locales; se recrea al cambiar de archivo.
  useEffect(() => {
    if (!currentSrc) {
      engineRef.current?.dispose();
      engineRef.current = null;
      return;
    }

    const engine = createLocalAudioEngine({
      onPosition: (seconds) => dispatch({ type: "syncPosition", position: Math.floor(seconds) }),
      onEnded: () => dispatch({ type: "next" }),
      onPlayStateChange: (playing) => dispatch({ type: "setPlaying", playing }),
    });

    engineRef.current = engine;
    engine.load(currentSrc);

    return () => {
      engine.dispose();
      if (engineRef.current === engine) engineRef.current = null;
    };
  }, [currentSrc]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (state.isPlaying) engine.play();
    else engine.pause();
  }, [state.isPlaying, currentSrc]);

  // El volumen vive en el estado del reproductor y se aplica al motor aunque se
  // recree al cambiar de pista (control independiente de la barra de transporte).
  useEffect(() => {
    engineRef.current?.setVolume(state.volume / 100);
  }, [state.volume, currentSrc]);

  // Temporizador de muestra: solo cuando la pista no tiene archivo real.
  useEffect(() => {
    if (!state.isPlaying || currentSrc) return;

    const timer = window.setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => window.clearInterval(timer);
  }, [state.isPlaying, currentSrc]);

  const value = useMemo<PlayerContextValue>(() => {
    const currentTrack = state.queue[state.index] ?? null;

    return {
      state,
      currentTrack,
      playQueue: (tracks, index) => dispatch({ type: "playQueue", tracks, index }),
      togglePlayPause: () => dispatch({ type: "toggle" }),
      next: () => dispatch({ type: "next" }),
      previous: () => dispatch({ type: "previous" }),
      seek: (position) => {
        engineRef.current?.seek(position);
        dispatch({ type: "seek", position });
      },
      setVolume: (volume) => dispatch({ type: "setVolume", volume }),
      toggleShuffle: () => dispatch({ type: "toggleShuffle" }),
      cycleRepeat: () => dispatch({ type: "cycleRepeat" }),
    };
  }, [state]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer(): PlayerContextValue {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer debe usarse dentro de <PlayerProvider>");
  }
  return context;
}
