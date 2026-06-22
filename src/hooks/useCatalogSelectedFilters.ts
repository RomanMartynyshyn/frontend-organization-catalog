'use client';

import { useMemo } from 'react';

import type { CatalogFiltersQuery } from '@/lib/catalogSearchParams';
import type { CatalogCategory, CatalogDistrict } from '@/types/catalog-api';

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
  selectedDistrictIds: number[];
  search: string;
  categories: CatalogCategory[];
  districts: CatalogDistrict[];
  setCatalogFilters: SetCatalogFilters;
  handleCategorySelect: (id: string | null) => void;
  handleSelectedDistrictsChange: (districtIds: number[]) => void;
};

export function useCatalogSelectedFilters({
  activeCategoryId,
  selectedDistrictIds,
  search,
  categories,
  districts,
  setCatalogFilters,
  handleCategorySelect,
  handleSelectedDistrictsChange,
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

    districts
      .filter((district) => selectedDistrictIds.includes(district.districtId))
      .forEach((district) => {
        filters.push({
          id: district.districtId.toString(),
          label: district.name,
          onRemove: () =>
            handleSelectedDistrictsChange(
              selectedDistrictIds.filter((item) => item !== district.districtId),
            ),
        });
      });

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
    districts,
    handleCategorySelect,
    handleSelectedDistrictsChange,
    search,
    selectedDistrictIds,
    setCatalogFilters,
  ]);

  const resetFilters = () => {
    void setCatalogFilters({
      categoryId: null,
      districtIds: [],
      search: '',
    });
  };

  return { selectedFilters, resetFilters };
}
