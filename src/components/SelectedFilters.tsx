'use client';

type SelectedFilter = {
  id: string;
  label: string;
  onRemove: () => void;
};

type SelectedFiltersProps = {
  filters: SelectedFilter[];
  onReset: () => void;
};

export function SelectedFilters({ filters, onReset }: SelectedFiltersProps) {
  if (!filters.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-black/70 bg-white px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <p className="text-sm font-semibold">Обрані фільтри:</p>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={filter.onRemove}
                className="inline-flex items-center gap-2 rounded-full border border-black/70 bg-[#D9DDF2] px-3 py-1.5 text-sm transition hover:bg-[#c8c8c8]"
              >
                <span>{filter.label}</span>
                <span className="text-base leading-none" aria-hidden="true">
                  ×
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="shrink-0 rounded-md border border-[#1B224B] bg-white px-4 py-1.5 text-sm transition hover:bg-gray-50"
        >
          Скинути фільтри
        </button>
      </div>
    </div>
  );
}
