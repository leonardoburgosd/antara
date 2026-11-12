import { useState } from "react";

type CoverArtProps = {
  /** Portada ya resuelta; si falta o falla se deja el color del design system. */
  src?: string;
  /** Utilidad Tailwind de un token de color usada como respaldo. */
  coverColor: string;
  /** Tamaño y forma de la portada (`size-12 rounded-md`, `size-40 rounded-xl`…). */
  className: string;
  /** Solo cuando la portada aporta información; sin ella es decorativa. */
  alt?: string;
};

/**
 * Portada de álbum: imagen real sobre el bloque de color del design system.
 * El color queda debajo, así que mientras carga o si la URL falla nunca se ve
 * un hueco vacío.
 */
export function CoverArt({ src, coverColor, className, alt }: CoverArtProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <div className={`relative shrink-0 overflow-hidden ${coverColor} ${className}`}>
      {showImage ? (
        <img
          src={src}
          alt={alt ?? ""}
          aria-hidden={alt ? undefined : true}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : null}
    </div>
  );
}
