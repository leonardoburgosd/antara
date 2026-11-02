import { useState } from "react";
import { FeaturedCard } from "../../components/FeaturedCard";
import { FilterChips } from "../../components/FilterChips";
import { Icon } from "../../components/Icon";
import { MediaRow } from "../../components/MediaRow";
import { SectionHeader } from "../../components/SectionHeader";
import { usePlayer } from "../../stores/player";
import type { HomeFilter } from "../../types/library";
import { buildHomeContent, HOME_FILTERS } from "./homeContent";

function greetingForHour(hour: number): string {
  if (hour >= 6 && hour <= 12) return "Buenos días";
  if (hour >= 13 && hour <= 19) return "Buenas tardes";
  return "Buenas noches";
}

/**
 * Home: saludo + acciones, titular, filtros, carrusel "Curado y en tendencia"
 * y lista de playlists diarias (misma jerarquía que Mobile).
 */
export function HomeScreen({ userName }: { userName: string }) {
  const { state, currentTrack, playQueue, togglePlayPause } = usePlayer();
  const [filter, setFilter] = useState<HomeFilter>("all");
  const content = buildHomeContent(filter);

  const playFrom = (trackIndex: number) => {
    const track = content.tracks[trackIndex];
    if (currentTrack && track && currentTrack.id === track.id) {
      togglePlayPause();
      return;
    }
    playQueue(content.tracks, trackIndex);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-2 sm:px-6">
      <header className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-body font-semibold text-on-primary">
          {userName.trim().charAt(0).toUpperCase() || "A"}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-caption text-text-secondary">{greetingForHour(new Date().getHours())}</p>
          <p className="truncate text-body font-semibold text-text-primary">{userName}</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative grid size-10 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
          >
            <Icon name="notifications" size={22} />
            <span aria-hidden="true" className="absolute right-2.5 top-2.5 size-2 rounded-full bg-accent" />
          </button>
          <button
            type="button"
            aria-label="Favoritos"
            className="grid size-10 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
          >
            <Icon name="favorite_border" size={22} />
          </button>
          <button
            type="button"
            aria-label="Configurar servidores"
            className="grid size-10 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
          >
            <Icon name="dns" size={22} />
          </button>
        </div>
      </header>

      <h1 className="mt-6 text-h1 font-bold text-text-primary md:text-display">
        Tu música, en cualquier momento
      </h1>

      <div className="mt-5">
        <FilterChips
          options={HOME_FILTERS}
          selectedId={filter}
          onSelect={(id) => setFilter(id as HomeFilter)}
        />
      </div>

      <section className="mt-8" aria-label={content.curatedTitle}>
        <SectionHeader title={content.curatedTitle} actionLabel="Ver todo" onAction={() => undefined} />
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {content.featured.map((item) => (
            <FeaturedCard
              key={item.id}
              item={item}
              onPlay={() => playQueue(content.tracks, 0)}
              onOpen={() => undefined}
            />
          ))}
        </div>
      </section>

      <section className="mt-8" aria-label={content.playlistsTitle}>
        <SectionHeader title={content.playlistsTitle} actionLabel="Ver todo" onAction={() => undefined} />
        <div className="mt-2 flex flex-col">
          {content.playlists.map((playlist) => {
            const isCurrent = content.tracks[playlist.trackIndex]?.id === currentTrack?.id;

            return (
              <MediaRow
                key={playlist.id}
                title={playlist.title}
                subtitle={`De ${playlist.artist} • ${playlist.trackCount} canciones`}
                coverColor={playlist.coverColor}
                isCurrent={isCurrent}
                isPlaying={state.isPlaying}
                onPlay={() => playFrom(playlist.trackIndex)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
