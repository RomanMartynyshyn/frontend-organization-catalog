'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { CategoriesBar } from '@/components/CategoriesBar';
import { FiltersPanel } from '@/components/FiltersPanel';
import HeroSection from '@/components/HeroSection';
import { OrganizationsList } from '@/components/OrganizationsList';
import { SelectedFilters } from '@/components/SelectedFilters';
import { useCatalogSearch } from '@/contexts/CatalogSearchContext';
import { mapOrganizationToCompany } from '@/lib/catalog-api/mapToCompany';
import { ORGANIZATIONS_PAGE_SIZE } from '@/lib/constants';
import type { CatalogCategory, PaginatedOrganizations } from '@/types/catalog-api';
import type { Company } from '@/types/company';

type CatalogHomeClientProps = {
  initialOrganizations: Company[];
  initialHasMore: boolean;
  categories: CatalogCategory[];
};

type OrganizationQuery = {
  categoryId: string | null;
  districts: string[];
};

async function fetchOrganizationsPage(
  offset: number,
  query: OrganizationQuery,
): Promise<PaginatedOrganizations> {
  const params = new URLSearchParams({
    limit: String(ORGANIZATIONS_PAGE_SIZE),
    offset: String(offset),
  });

  if (query.categoryId !== null) {
    params.set('category_id', query.categoryId);
  }

  for (const district of query.districts) {
    params.append('district', district);
  }

  const response = await fetch(`/api/organizations?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }

  return (await response.json()) as PaginatedOrganizations;
}

async function fetchDistrictOptions(): Promise<string[]> {
  const response = await fetch('/api/organizations/districts');

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as unknown;

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item): item is string => Boolean(item));
}

export function CatalogHomeClient({
  initialOrganizations,
  initialHasMore,
  categories,
}: CatalogHomeClientProps) {
  const { search, setSearch } = useCatalogSearch();
  const [organizations, setOrganizations] =
    useState<Company[]>(initialOrganizations);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextOffset, setNextOffset] = useState(initialOrganizations.length);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    void fetchDistrictOptions().then(setDistrictOptions);
  }, []);

  const buildQuery = useCallback(
    (overrides?: Partial<OrganizationQuery>): OrganizationQuery => ({
      categoryId: activeCategoryId,
      districts: selectedDistricts,
      ...overrides,
    }),
    [activeCategoryId, selectedDistricts],
  );

  const loadOrganizations = useCallback(
    async (query: OrganizationQuery, offset = 0, append = false) => {
      const { items, hasMore: nextHasMore } = await fetchOrganizationsPage(
        offset,
        query,
      );
      const mapped = items.map(mapOrganizationToCompany);

      setOrganizations((current) => (append ? [...current, ...mapped] : mapped));
      setHasMore(nextHasMore);
      setNextOffset(offset + items.length);
    },
    [],
  );

  const handleSelectedDistrictsChange = useCallback(
    async (districts: string[]) => {
      setSelectedDistricts(districts);
      setIsLoading(true);

      try {
        await loadOrganizations(buildQuery({ districts }), 0, false);
      } catch (error) {
        console.error(error);
        setOrganizations([]);
        setHasMore(false);
        setNextOffset(0);
      } finally {
        setIsLoading(false);
      }
    },
    [buildQuery, loadOrganizations],
  );

  const handleCategorySelect = useCallback(
    async (id: string | null) => {
      setActiveCategoryId(id);
      setIsLoading(true);

      try {
        await loadOrganizations(buildQuery({ categoryId: id }), 0, false);
      } catch (error) {
        console.error(error);
        setOrganizations([]);
        setHasMore(false);
        setNextOffset(0);
      } finally {
        setIsLoading(false);
      }
    },
    [buildQuery, loadOrganizations],
  );

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      await loadOrganizations(buildQuery(), nextOffset, true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [buildQuery, hasMore, isLoadingMore, loadOrganizations, nextOffset]);

  const filteredOrganizations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return organizations;
    }

    return organizations.filter((organization) =>
      organization.name.toLowerCase().includes(normalizedSearch),
    );
  }, [organizations, search]);

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

    selectedDistricts.forEach((district) => {
      filters.push({
        id: `district-${district}`,
        label: district,
        onRemove: () =>
          handleSelectedDistrictsChange(
            selectedDistricts.filter((item) => item !== district),
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
    handleSelectedDistrictsChange,
    search,
    selectedDistricts,
    setSearch,
  ]);

  const resetFilters = () => {
    setSearch('');
    setSelectedDistricts([]);
    setActiveCategoryId(null);
    setOrganizations(initialOrganizations);
    setHasMore(initialHasMore);
    setNextOffset(initialOrganizations.length);
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
          districts={districtOptions}
          selectedDistricts={selectedDistricts}
          onSelectedDistrictsChange={handleSelectedDistrictsChange}
        />

        <OrganizationsList
          data={filteredOrganizations}
          isLoading={isLoading}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          alignWithFilters
        />
      </div>
    </div>
  );
}
