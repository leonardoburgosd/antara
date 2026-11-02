type IconProps = {
  /** Nombre de ligadura de Material Symbols (p. ej. `play_arrow`). */
  name: string;
  /** Tamaño en px; 24 por defecto según el design system. */
  size?: number;
  /** Variante rellena (`FILL 1`) para estados activos. */
  filled?: boolean;
  /** Etiqueta accesible; si se omite, el icono es decorativo. */
  label?: string;
  className?: string;
};

export function Icon({ name, size = 24, filled = false, label, className = "" }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined shrink-0 ${className}`}
      style={{
        fontSize: `${size}px`,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {name}
    </span>
  );
}
