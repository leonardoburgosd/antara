import { useRef } from "react";
import { Icon } from "../../components/Icon";
import { MediaRow } from "../../components/MediaRow";
import { usePlayer } from "../../stores/player";
import { useUploads } from "../../stores/uploads";
import type { Track } from "../../types/library";
import { formatTime } from "../../utils/formatTime";

/**
 * "Mis archivos": sube audios del equipo y reprodúcelos con el motor local.
 * Los archivos no se suben a ningún servidor: viven como object URLs de la sesión.
 */
export function UploadsScreen() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { tracks, addFiles, remove } = useUploads();
  const { state, currentTrack, playQueue, togglePlayPause } = usePlayer();

  const playFrom = (index: number) => {
    const track = tracks[index];
    if (!track) return;

    if (currentTrack?.id === track.id) {
      togglePlayPause();
      return;
    }

    playQueue(tracks, index);
  };

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 pb-10 pt-6 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-h2 font-semibold text-text-primary">Mis archivos</h1>
          <p className="mt-1 max-w-md text-body-sm text-text-secondary">
            Reproduce audios de tu dispositivo. Los archivos se quedan en esta sesión y no se suben
            a ningún servidor.
          </p>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-11 items-center gap-2 rounded-md bg-primary px-4 text-button text-on-primary transition-colors duration-150 hover:bg-primary-hover"
        >
          <Icon name="upload_file" size={20} />
          Subir audio
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          multiple
          aria-label="Seleccionar archivos de audio"
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files);
            // Permite volver a elegir el mismo archivo.
            event.target.value = "";
          }}
        />
      </header>

      {tracks.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong px-6 py-12 text-center">
          <Icon name="folder_open" size={40} className="text-text-disabled" />
          <p className="text-body font-semibold text-text-primary">Aún no hay archivos</p>
          <p className="max-w-sm text-body-sm text-text-secondary">
            Sube audios en MP3, WAV, OGG, M4A, FLAC u OPUS para escucharlos aquí.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-0.5">
          {tracks.map((track: Track, index: number) => {
            const isCurrent = currentTrack?.id === track.id;

            return (
              <div key={track.id} className="flex items-center gap-1">
                <div className="min-w-0 flex-1">
                  <MediaRow
                    title={track.title}
                    subtitle={
                      track.duration > 0
                        ? `Archivo local • ${formatTime(track.duration)}`
                        : "Archivo local"
                    }
                    coverColor={track.coverColor}
                    isCurrent={isCurrent}
                    isPlaying={state.isPlaying}
                    onPlay={() => playFrom(index)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(track.id)}
                  aria-label={`Quitar ${track.title}`}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-error"
                >
                  <Icon name="delete" size={20} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
