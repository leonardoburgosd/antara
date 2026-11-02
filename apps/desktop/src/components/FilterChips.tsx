type FilterChipsProps = {
  options: Array<{ id: string; label: string }>;
  selectedId: string;
  onSelect: (id: string) => void;
};

/** Chips de filtro: seleccionado `primary`/`on-primary`, inactivo `surface-elevated`/`text-secondary`. */
export function FilterChips({ options, selectedId, onSelect }: FilterChipsProps) {
  return (
    <div role="radiogroup" className="flex gap-2 overflow-x-auto pb-1">
      {options.map((option) => {
        const isSelected = option.id === selectedId;

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(option.id)}
            className={`h-10 shrink-0 rounded-full px-4 text-body font-medium transition-colors duration-150 ${
              isSelected
                ? "bg-primary text-on-primary"
                : "bg-surface-elevated text-text-secondary hover:text-text-primary"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
