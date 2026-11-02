type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="truncate text-h2 font-semibold text-text-primary">{title}</h2>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 rounded-full px-2 py-1 text-body font-medium text-primary transition-colors duration-150 hover:text-primary-hover"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
