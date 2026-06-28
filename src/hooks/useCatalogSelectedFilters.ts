'use client';

import { useMemo } from 'react';

import type { CatalogFiltersQuery } from '@/lib/catalogSearchParams';
import { formatAdminUnitShortName } from '@/lib/catalog-api/adminUnitHelpers';
import type { CatalogAdminUnit, CatalogCategory } from '@/types/catalog-api';

type SelectedFilter = {
  id: string;
  label: string;
  onRemove: () => void;
};

type SetCatalogFilters = (
  values:
    | Partial<CatalogFiltersQuery>
    | null
    | ((previous: CatalogFiltersQuery) => Partial<CatalogFiltersQuery> | null),
) => Promise<URLSearchParams>;

type UseCatalogSelectedFiltersParams = {
  activeCategoryId: string | null;
  selectedAdminUnitIds: number[];
  search: string;
  categories: CatalogCategory[];
  districts: CatalogAdminUnit[];
  communities: CatalogAdminUnit[];
  setCatalogFilters: SetCatalogFilters;
  handleCategorySelect: (id: string | null) => void;
  handleSelectedAdminUnitsChange: (adminUnitIds: number[]) => void;
};

function buildAdminUnitFilterChips(
  units: CatalogAdminUnit[],
  prefix: string,
  selectedAdminUnitIds: number[],
  handleSelectedAdminUnitsChange: (adminUnitIds: number[]) => void,
): SelectedFilter[] {
  return units
    .filter((unit) => selectedAdminUnitIds.includes(unit.adminUnitId))
    .map((unit) => ({
      id: `${prefix}-${unit.adminUnitId}`,
      label: formatAdminUnitShortName(unit),
      onRemove: () =>
        handleSelectedAdminUnitsChange(
          selectedAdminUnitIds.filter((item) => item !== unit.adminUnitId),
        ),
    }));
}

export function useCatalogSelectedFilters({
  activeCategoryId,
  selectedAdminUnitIds,
  search,
  categories,
  districts,
  communities,
  setCatalogFilters,
  handleCategorySelect,
  handleSelectedAdminUnitsChange,
}: UseCatalogSelectedFiltersParams) {
  const activeCategoryName = useMemo(() => {
    if (!activeCategoryId) {
      return null;
    }

    return categories.find(
      (category) => String(category.id) === activeCategoryId,
    )?.name;
  }, [activeCategoryId, categories]);

  const selectedFilters = useMemo(() => {
    const filters: SelectedFilter[] = [];

    if (activeCategoryName) {
      filters.push({
        id: `category-${activeCategoryId}`,
        label: activeCategoryName,
        onRemove: () => handleCategorySelect(null),
      });
    }

    filters.push(
      ...buildAdminUnitFilterChips(
        districts,
        'district',
        selectedAdminUnitIds,
        handleSelectedAdminUnitsChange,
      ),
      ...buildAdminUnitFilterChips(
        communities,
        'community',
        selectedAdminUnitIds,
        handleSelectedAdminUnitsChange,
      ),
    );

    const normalizedSearch = search.trim();

    if (normalizedSearch) {
      filters.push({
        id: 'search',
        label: normalizedSearch,
        onRemove: () => {
          void setCatalogFilters({ search: '' });
        },
      });
    }

    return filters;
  }, [
    activeCategoryId,
    activeCategoryName,
    communities,
    districts,
    handleCategorySelect,
    handleSelectedAdminUnitsChange,
    search,
    selectedAdminUnitIds,
    setCatalogFilters,
  ]);

  const resetFilters = () => {
    void setCatalogFilters({
      categoryId: null,
      adminUnitIds: [],
      search: '',
    });
  };

  return { selectedFilters, resetFilters };
}
