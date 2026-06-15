'use client';

import { useCallback, useMemo, useState } from 'react';

import { CategoriesBar } from '@/components/CategoriesBar';
import { FiltersPanel } from '@/components/FiltersPanel';
import HeroSection from '@/components/HeroSection';
import { OrganizationsList } from '@/components/OrganizationsList';
import { SelectedFilters } from '@/components/SelectedFilters';
import { useCatalogSearch } from '@/contexts/CatalogSearchContext';
import { mapOrganizationToCompany } from '@/lib/catalog-api/mapToCompany';
import type { CatalogCategory, CatalogOrganization } from '@/types/catalog-api';
import type { Company } from '@/types/company';

type CatalogHomeClientProps = {
  initialOrganizations: Company[];
  categories: CatalogCategory[];
};

function collectRegions(organizations: Company[]): string[] {
  return [
    ...new Set(
      organizations.flatMap((organization) => organization.regions).filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b, 'uk'));
}

export function CatalogHomeClient({
  initialOrganizations,
  categories,
}: CatalogHomeClientProps) {
  const { search, setSearch } = useCatalogSearch();
  const [organizations, setOrganizations] =
    useState<Company[]>(initialOrganizations);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableRegions = useMemo(
    () => collectRegions(initialOrganizations),
    [initialOrganizations],
  );

  const handleCategorySelect = useCallback(
    async (id: string | null) => {
      setActiveCategoryId(id);

      if (id === null) {
        setOrganizations(initialOrganizations);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/organizations?category_id=${encodeURIComponent(id)}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch organizations');
        }

        const data = (await response.json()) as CatalogOrganization[];
        setOrganizations(data.map(mapOrganizationToCompany));
      } catch (error) {
        console.error(error);
        setOrganizations([]);
      } finally {
        setIsLoading(false);
      }
    },
    [initialOrganizations],
  );

  const filteredOrganizations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return organizations.filter((organization) => {
      const matchesSearch =
        !normalizedSearch ||
        organization.name.toLowerCase().includes(normalizedSearch);

      const matchesRegion =
        !selectedRegions.length ||
        organization.regions.some((region) => selectedRegions.includes(region));

      return matchesSearch && matchesRegion;
    });
  }, [organizations, search, selectedRegions]);

  const activeCategoryName = useMemo(() => {
    if (!activeCategoryId) {
      return null;
    }

    return categories.find(
      (category) => String(category.id) === activeCategoryId,
    )?.name;
  }, [activeCategoryId, categories]);

  const selectedFilters = useMemo(() => {
    const filters: Array<{
      id: string;
      label: string;
      onRemove: () => void;
    }> = [];

    if (activeCategoryName) {
      filters.push({
        id: `category-${activeCategoryId}`,
        label: activeCategoryName,
        onRemove: () => handleCategorySelect(null),
      });
    }

    selectedRegions.forEach((region) => {
      filters.push({
        id: `region-${region}`,
        label: region,
        onRemove: () =>
          setSelectedRegions((current) =>
            current.filter((item) => item !== region),
          ),
      });
    });

    const normalizedSearch = search.trim();

    if (normalizedSearch) {
      filters.push({
        id: 'search',
        label: normalizedSearch,
        onRemove: () => setSearch(''),
      });
    }

    return filters;
  }, [
    activeCategoryId,
    activeCategoryName,
    handleCategorySelect,
    search,
    selectedRegions,
    setSearch,
  ]);

  const resetFilters = () => {
    setSearch('');
    setSelectedRegions([]);
    handleCategorySelect(null);
  };

  return (
    <div className="space-y-8">
      <HeroSection />

      <CategoriesBar
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelect={handleCategorySelect}
      />

      <SelectedFilters filters={selectedFilters} onReset={resetFilters} />

      <div className="flex flex-col gap-6 lg:min-h-[480px] lg:h-[min(70vh,720px)] lg:flex-row lg:items-stretch">
        <FiltersPanel
          regions={availableRegions}
          selectedRegions={selectedRegions}
          onSelectedRegionsChange={setSelectedRegions}
        />

        <OrganizationsList
          data={filteredOrganizations}
          isLoading={isLoading}
          alignWithFilters={availableRegions.length > 0}
        />
      </div>
    </div>
  );
}
