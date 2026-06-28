'use client';

import { useEffect, useState } from 'react';

import type { CatalogAdminUnit } from '@/types/catalog-api';

import { formatAdminUnitShortName } from '@/lib/catalog-api/adminUnitHelpers';

type AdminUnitFilterGroupProps = {
  title: string;
  units: readonly CatalogAdminUnit[];
  emptyMessage: string;
  selectedIds: number[];
  onToggle: (adminUnitId: number) => void;
  defaultOpen?: boolean;
};

function AdminUnitFilterGroup({
  title,
  units,
  emptyMessage,
  selectedIds,
  onToggle,
  defaultOpen = true,
}: AdminUnitFilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="pb-4">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between text-sm font-bold text-black"
      >
        {title}
        <svg
          className={`h-4 w-4 shrink-0 transition ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen ? (
        <div className="mt-3 space-y-2.5">
          {units.length ? (
            units.map((unit) => (
              <label
                key={unit.adminUnitId}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-black"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(unit.adminUnitId)}
                  onChange={() => onToggle(unit.adminUnitId)}
                  className="h-4 w-4 shrink-0 rounded-sm border border-black accent-black"
                />
                <span>{formatAdminUnitShortName(unit)}</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-700">{emptyMessage}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

type FiltersPanelProps = {
  districts: readonly CatalogAdminUnit[];
  communities: readonly CatalogAdminUnit[];
  selectedAdminUnitIds: number[];
  onSelectedAdminUnitsChange: (adminUnitIds: number[]) => void;
};

export function FiltersPanel({
  districts,
  communities,
  selectedAdminUnitIds,
  onSelectedAdminUnitsChange,
}: FiltersPanelProps) {
  const [pendingAdminUnitIds, setPendingAdminUnitIds] =
    useState<number[]>(selectedAdminUnitIds);

  useEffect(() => {
    setTimeout(() => {
      setPendingAdminUnitIds(selectedAdminUnitIds);
    }, 0);
  }, [selectedAdminUnitIds]);

  const toggleAdminUnit = (adminUnitId: number) => {
    setPendingAdminUnitIds((current) =>
      current.includes(adminUnitId)
        ? current.filter((item) => item !== adminUnitId)
        : [...current, adminUnitId],
    );
  };

  const handleApply = () => {
    onSelectedAdminUnitsChange(pendingAdminUnitIds);
  };

  return (
    <aside className="flex w-full shrink-0 flex-col lg:h-full lg:w-[240px]">
      <h2 className="mb-4 shrink-0 text-lg font-bold text-black">Фільтри</h2>

      <div className="flex min-h-0 flex-1 flex-col rounded-2xl bg-[#D9DDF2] p-4">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <AdminUnitFilterGroup
            title="Район"
            units={districts}
            emptyMessage="Райони зараз недоступні"
            selectedIds={pendingAdminUnitIds}
            onToggle={toggleAdminUnit}
          />
          <AdminUnitFilterGroup
            title="Громада"
            units={communities}
            emptyMessage="Громади зараз недоступні"
            selectedIds={pendingAdminUnitIds}
            onToggle={toggleAdminUnit}
          />
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="mt-4 w-full shrink-0 rounded-md bg-[#1B224B] px-4 py-2.5 text-sm text-white transition hover:bg-[#283371] focus:bg-[#0D1126] disabled:bg-[#585C74]"
        >
          Застосувати
        </button>
      </div>
    </aside>
  );
}
