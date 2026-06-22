'use client';

import { CategoriesBar } from '@/components/CategoriesBar';
import { CatalogBrowseSection } from '@/components/catalog/CatalogBrowseSection';
import HeroSection from '@/components/HeroSection';
import { SelectedFilters } from '@/components/SelectedFilters';
import { useCatalogOrganizations } from '@/hooks/useCatalogOrganizations';
import { useCatalogSelectedFilters } from '@/hooks/useCatalogSelectedFilters';
import type { CatalogFiltersQuery } from '@/lib/catalogSearchParams';
import type { CatalogCategory, CatalogDistrict } from '@/types/catalog-api';
import type { CompanyListItem } from '@/types/company';

type CatalogHomeClientProps = {
  initialFilters: CatalogFiltersQuery;
  initialOrganizations: CompanyListItem[];
  initialHasMore: boolean;
  categories: CatalogCategory[];
  districts: CatalogDistrict[];
};

export function CatalogHomeClient({
  initialFilters,
  initialOrganizations,
  initialHasMore,
  categories,
  districts,
}: CatalogHomeClientProps) {
  const {
    activeCategoryId,
    selectedDistrictIds,
    search,
    organizations,
    hasMore,
    isLoading,
    isLoadingMore,
    setCatalogFilters,
    handleCategorySelect,
    handleSelectedDistrictsChange,
    handleLoadMore,
    filtersKey,
  } = useCatalogOrganizations({
    initialFilters,
    initialOrganizations,
    initialHasMore,
    districts,
  });

  const { selectedFilters, resetFilters } = useCatalogSelectedFilters({
    activeCategoryId,
    selectedDistrictIds,
    search,
    categories,
    districts,
    setCatalogFilters,
    handleCategorySelect,
    handleSelectedDistrictsChange,
  });

  return (
    <div className="space-y-8">
      <HeroSection />

      <CategoriesBar
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelect={handleCategorySelect}
      />

      <SelectedFilters filters={selectedFilters} onReset={resetFilters} />

      <CatalogBrowseSection
        districts={districts}
        selectedDistrictIds={selectedDistrictIds}
        onSelectedDistrictsChange={handleSelectedDistrictsChange}
        organizations={organizations}
        isLoading={isLoading}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={handleLoadMore}
        filtersKey={filtersKey}
      />
    </div>
  );
}
