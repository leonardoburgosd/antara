import type { FeaturedItem } from "../types/library";
import { Icon } from "./Icon";

type FeaturedCardProps = {
  item: FeaturedItem;
  onPlay: () => void;
  onOpen: () => void;
};

/** Tarjeta destacada del carrusel "Curado y en tendencia" (172px de alto, radio xl). */
export function FeaturedCard({ item, onPlay, onOpen }: FeaturedCardProps) {
  const contentColor = item.darkText ? "text-background" : "text-on-primary";

  return (
    <article
      className={`relative flex h-[172px] w-[280px] shrink-0 flex-col rounded-xl p-4 sm:w-[320px] ${item.background}`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Abrir ${item.title}`}
        className="absolute inset-0 rounded-xl"
      />

      <h3 className={`relative text-h3 font-semibold ${contentColor}`}>{item.title}</h3>
      <p className={`relative mt-1 line-clamp-2 text-body-sm ${contentColor}`}>{item.subtitle}</p>

      <div className="relative mt-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onPlay}
          aria-label="Reproducir"
          className="grid size-11 place-items-center rounded-full bg-background text-primary transition-transform duration-150 active:scale-95"
        >
          <Icon name="play_arrow" size={24} filled />
        </button>
        <button
          type="button"
          aria-label="Favorito"
          className={`grid size-9 place-items-center rounded-full transition-colors duration-150 hover:bg-black/10 ${contentColor}`}
        >
          <Icon name="favorite_border" size={20} />
        </button>
        <button
          type="button"
          aria-label="Aleatorio"
          className={`grid size-9 place-items-center rounded-full transition-colors duration-150 hover:bg-black/10 ${contentColor}`}
        >
          <Icon name="shuffle" size={20} />
        </button>
        <button
          type="button"
          aria-label="Más opciones"
          className={`grid size-9 place-items-center rounded-full transition-colors duration-150 hover:bg-black/10 ${contentColor}`}
        >
          <Icon name="more_horiz" size={20} />
        </button>
      </div>
    </article>
  );
}
