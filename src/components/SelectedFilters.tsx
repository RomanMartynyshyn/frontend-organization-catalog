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
    <div className="rounded-2xl border border-black bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm font-medium">Обрані фільтри:</p>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={filter.onRemove}
                className="inline-flex items-center gap-2 rounded-full border border-black px-3 py-1 text-sm transition hover:bg-gray-50"
              >
                <span>{filter.label}</span>
                <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="shrink-0 text-sm underline transition hover:opacity-70"
        >
          Скинути фільтри
        </button>
      </div>
    </div>
  );
}
