import { NAV_ITEMS } from "../app/navigation";
import type { NavId } from "../types/library";
import { Icon } from "./Icon";

type BottomNavProps = {
  active: NavId;
  onSelect: (id: NavId) => void;
};

/**
 * Bottom Navigation de Web en ventanas pequeñas (`< md`): misma identidad que Mobile
 * (pill de 68px, círculo seleccionado de 56px, fondo translúcido con desenfoque).
 */
export function BottomNav({ active, onSelect }: BottomNavProps) {
  return (
    <nav aria-label="Navegación principal" className="px-3 pb-[env(safe-area-inset-bottom)] pt-1 md:hidden">
      <div className="mx-auto flex h-[68px] w-full max-w-md items-center rounded-full border border-border/60 bg-surface-glass px-2 shadow-lg backdrop-blur-md">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === active;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className="grid flex-1 place-items-center"
            >
              <span
                className={`grid place-items-center rounded-full transition-[width,height,background-color] duration-200 ${
                  isActive ? "size-14 bg-nav-indicator" : "size-11 bg-transparent"
                }`}
              >
                <Icon
                  name={item.icon}
                  size={isActive ? 26 : 24}
                  filled={isActive}
                  className={isActive ? "text-background" : "text-text-secondary"}
                />
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
