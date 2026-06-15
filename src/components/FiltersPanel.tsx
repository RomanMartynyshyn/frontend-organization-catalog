'use client';

import { useEffect, useState } from 'react';

type FiltersPanelProps = {
  regions: string[];
  selectedRegions: string[];
  onSelectedRegionsChange: (regions: string[]) => void;
  onApply: () => void;
};

export function FiltersPanel({
  regions,
  selectedRegions,
  onSelectedRegionsChange,
  onApply,
}: FiltersPanelProps) {
  const [isRegionOpen, setIsRegionOpen] = useState(true);
  const [pendingRegions, setPendingRegions] =
    useState<string[]>(selectedRegions);

  useEffect(() => {
    setPendingRegions(selectedRegions);
  }, [selectedRegions]);

  const toggleRegion = (region: string) => {
    setPendingRegions((current) =>
      current.includes(region)
        ? current.filter((item) => item !== region)
        : [...current, region],
    );
  };

  const handleApply = () => {
    onSelectedRegionsChange(pendingRegions);
    onApply();
  };

  if (!regions.length) {
    return null;
  }

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <h2 className="mb-4 text-lg font-semibold">Фільтри</h2>

      <div className="space-y-4 rounded-2xl border border-black bg-white p-4">
        <div>
          <button
            type="button"
            onClick={() => setIsRegionOpen((open) => !open)}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            Район
            <svg
              className={`h-4 w-4 transition ${isRegionOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {isRegionOpen && (
            <div className="mt-3 space-y-2">
              {regions.map((region) => (
                <label
                  key={region}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={pendingRegions.includes(region)}
                    onChange={() => toggleRegion(region)}
                    className="h-4 w-4 rounded border-black"
                  />
                  <span>{region}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="w-full rounded-md bg-black px-4 py-2.5 text-sm text-white transition hover:opacity-80"
        >
          Застосувати
        </button>
      </div>
    </aside>
  );
}
