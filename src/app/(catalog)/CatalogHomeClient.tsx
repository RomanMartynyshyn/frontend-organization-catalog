'use client';

import { CategoriesBar } from '@/components/CategoriesBar';
import { CatalogBrowseSection } from '@/components/catalog/CatalogBrowseSection';
import HeroSection from '@/components/HeroSection';
import { SelectedFilters } from '@/components/SelectedFilters';
import { useCatalogOrganizations } from '@/hooks/useCatalogOrganizations';
import { useCatalogSelectedFilters } from '@/hooks/useCatalogSelectedFilters';
import type { CatalogFiltersQuery } from '@/lib/catalogSearchParams';
import type { CatalogAdminUnit, CatalogCategory } from '@/types/catalog-api';
import type { CompanyListItem } from '@/types/company';

type CatalogHomeClientProps = {
  initialFilters: CatalogFiltersQuery;
  initialOrganizations: CompanyListItem[];
  initialHasMore: boolean;
  categories: CatalogCategory[];
  districts: CatalogAdminUnit[];
  communities: CatalogAdminUnit[];
};

export function CatalogHomeClient({
  initialFilters,
  initialOrganizations,
  initialHasMore,
  categories,
  districts,
  communities,
}: CatalogHomeClientProps) {
  const {
    activeCategoryId,
    selectedAdminUnitIds,
    search,
    organizations,
    hasMore,
    isLoading,
    isLoadingMore,
    setCatalogFilters,
    handleCategorySelect,
    handleSelectedAdminUnitsChange,
    handleLoadMore,
    filtersKey,
  } = useCatalogOrganizations({
    initialFilters,
    initialOrganizations,
    initialHasMore,
    districts,
    communities,
  });

  const { selectedFilters, resetFilters } = useCatalogSelectedFilters({
    activeCategoryId,
    selectedAdminUnitIds,
    search,
    categories,
    districts,
    communities,
    setCatalogFilters,
    handleCategorySelect,
    handleSelectedAdminUnitsChange,
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
        communities={communities}
        selectedAdminUnitIds={selectedAdminUnitIds}
        onSelectedAdminUnitsChange={handleSelectedAdminUnitsChange}
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
