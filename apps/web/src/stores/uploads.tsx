import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Track } from "../types/library";

/**
 * Archivos de audio que sube el usuario desde su equipo.
 * Se reproducen con object URLs: viven mientras dure la sesión de la app.
 */

const COVER_TOKENS = ["bg-primary", "bg-accent", "bg-accent-warm", "bg-info", "bg-success", "bg-error"];
const AUDIO_EXTENSION = /\.(mp3|wav|ogg|oga|m4a|aac|flac|opus|webm)$/i;

type UploadsContextValue = {
  tracks: Track[];
  addFiles: (files: FileList | File[] | null) => void;
  remove: (id: string) => void;
};

const UploadsContext = createContext<UploadsContextValue | null>(null);

/** Lee la duración real del archivo para que la barra de progreso tenga el máximo correcto. */
async function readDuration(src: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = "metadata";

    const finish = (value: number) => {
      audio.removeAttribute("src");
      resolve(value);
    };

    audio.addEventListener(
      "loadedmetadata",
      () => finish(Number.isFinite(audio.duration) ? Math.round(audio.duration) : 0),
      { once: true },
    );
    audio.addEventListener("error", () => finish(0), { once: true });
    audio.src = src;
  });
}

function titleFromFile(file: File): string {
  return file.name.replace(/\.[^.]+$/, "") || file.name;
}

function isAudioFile(file: File): boolean {
  return file.type.startsWith("audio/") || AUDIO_EXTENSION.test(file.name);
}

export function UploadsProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const counter = useRef(0);

  const addFiles = useCallback((files: FileList | File[] | null) => {
    const audioFiles = Array.from(files ?? []).filter(isAudioFile);
    if (audioFiles.length === 0) return;

    const added = audioFiles.map((file) => {
      counter.current += 1;
      const id = `local-${Date.now()}-${counter.current}`;

      return {
        id,
        title: titleFromFile(file),
        artist: "Archivo local",
        album: "Mis archivos",
        coverColor: COVER_TOKENS[counter.current % COVER_TOKENS.length],
        duration: 0,
        src: URL.createObjectURL(file),
      } satisfies Track;
    });

    setTracks((current) => [...current, ...added]);

    added.forEach((track) => {
      if (!track.src) return;

      void readDuration(track.src).then((duration) => {
        if (duration <= 0) return;
        setTracks((current) =>
          current.map((item) => (item.id === track.id ? { ...item, duration } : item)),
        );
      });
    });
  }, []);

  const remove = useCallback((id: string) => {
    setTracks((current) => {
      const target = current.find((track) => track.id === id);
      if (target?.src) URL.revokeObjectURL(target.src);
      return current.filter((track) => track.id !== id);
    });
  }, []);

  const value = useMemo(() => ({ tracks, addFiles, remove }), [tracks, addFiles, remove]);

  return <UploadsContext.Provider value={value}>{children}</UploadsContext.Provider>;
}

export function useUploads(): UploadsContextValue {
  const context = useContext(UploadsContext);

  if (!context) {
    throw new Error("useUploads debe usarse dentro de <UploadsProvider>");
  }

  return context;
}
