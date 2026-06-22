'use client';

import { useEffect, useState } from 'react';
import {CatalogDistrict} from "@/types/catalog-api";

type FiltersPanelProps = {
  districts: readonly CatalogDistrict[];
  selectedDistrictIds: Number[];
  onSelectedDistrictsChange: (districtIds: Number[]) => void;
};

export function FiltersPanel({
  districts,
  selectedDistrictIds,
  onSelectedDistrictsChange,
}: FiltersPanelProps) {
  const [isDistrictOpen, setIsDistrictOpen] = useState(true);
  const [pendingDistricts, setPendingDistricts] =
    useState<Number[]>(selectedDistrictIds);

  useEffect(() => {
    setTimeout(() => {
      setPendingDistricts(selectedDistrictIds);
    }, 0);
  }, [selectedDistrictIds]);

  const toggleDistrict = (district: CatalogDistrict) => {
    const districtId = district.districtId
    setPendingDistricts((current) =>
      current.includes(districtId)
        ? current.filter((item) => item !== districtId)
        : [...current, districtId],
    );
  };

  const handleApply = () => {
    onSelectedDistrictsChange(pendingDistricts);
  };

  return (
    <aside className="flex w-full shrink-0 flex-col lg:h-full lg:w-[240px]">
      <h2 className="mb-4 shrink-0 text-lg font-bold text-black">Фільтри</h2>

      <div className="flex min-h-0 flex-1 flex-col rounded-2xl bg-[#d9d9d9] p-4">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="pb-4">
            <button
              type="button"
              onClick={() => setIsDistrictOpen((open) => !open)}
              className="flex w-full items-center justify-between text-sm font-bold text-black"
            >
              Район
              <svg
                className={`h-4 w-4 shrink-0 transition ${isDistrictOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isDistrictOpen ? (
              <div className="mt-3 space-y-2.5">
                {districts.length ? (
                  districts.map((district) => (
                    <label
                      key={district.districtId}
                      className="flex cursor-pointer items-center gap-2.5 text-sm text-black"
                    >
                      <input
                        type="checkbox"
                        checked={pendingDistricts.includes(district.districtId)}
                        onChange={() => toggleDistrict(district)}
                        className="h-4 w-4 shrink-0 rounded-sm border border-black accent-black"
                      />
                      <span>{district.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-700">Райони зараз недоступні</p>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="mt-4 w-full shrink-0 rounded-md bg-black px-4 py-2.5 text-sm text-white transition hover:opacity-80"
        >
          Застосувати
        </button>
      </div>
    </aside>
  );
}
