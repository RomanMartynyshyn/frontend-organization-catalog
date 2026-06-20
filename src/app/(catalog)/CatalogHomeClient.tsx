'use client';

import { useCallback, useMemo, useState } from 'react';

import { CategoriesBar } from '@/components/CategoriesBar';
import { FiltersPanel } from '@/components/FiltersPanel';
import HeroSection from '@/components/HeroSection';
import { OrganizationsList } from '@/components/OrganizationsList';
import { SelectedFilters } from '@/components/SelectedFilters';
import { useCatalogSearch } from '@/contexts/CatalogSearchContext';
import { mapOrganizationToCompany } from '@/lib/catalog-api/mapToCompany';
import { matchesSelectedDistricts } from '@/lib/catalog-api/inferDistrict';
import { ORGANIZATIONS_PAGE_SIZE } from '@/lib/constants';
import { KRYVYI_RIH_DISTRICTS } from '@/lib/constants/districts';
import type {
  CatalogCategory,
  CatalogOrganization,
  PaginatedOrganizations,
} from '@/types/catalog-api';
import type { Company } from '@/types/company';

type CatalogHomeClientProps = {
  initialOrganizations: Company[];
  initialHasMore: boolean;
  categories: CatalogCategory[];
};

function dedupeCompanies(items: Company[]): Company[] {
  const itemsById = new Map<number, Company>();

  for (const item of items) {
    itemsById.set(item.id, item);
  }

  return [...itemsById.values()];
}

function appendOrganizations(current: Company[], next: Company[]): Company[] {
  if (!next.length) {
    return current;
  }

  const existingIds = new Set(current.map((organization) => organization.id));
  const uniqueNext = next.filter((organization) => !existingIds.has(organization.id));

  return uniqueNext.length ? [...current, ...uniqueNext] : current;
}

async function fetchOrganizationsPage(
  offset: number,
  categoryId: string | null,
): Promise<PaginatedOrganizations> {
  const params = new URLSearchParams({
    limit: String(ORGANIZATIONS_PAGE_SIZE),
    offset: String(offset),
  });

  if (categoryId !== null) {
    params.set('category_id', categoryId);
  }

  const response = await fetch(`/api/organizations?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }

  return (await response.json()) as PaginatedOrganizations;
}

async function fetchAllOrganizations(
  categoryId: string | null,
): Promise<Company[]> {
  const itemsById = new Map<number, CatalogOrganization>();
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const { items, hasMore: nextHasMore } = await fetchOrganizationsPage(
      offset,
      categoryId,
    );

    if (!items.length) {
      break;
    }

    let addedCount = 0;

    for (const item of items) {
      if (!itemsById.has(item.id)) {
        itemsById.set(item.id, item);
        addedCount += 1;
      }
    }

    offset += items.length;
    hasMore = nextHasMore && addedCount > 0;
  }

  return [...itemsById.values()].map(mapOrganizationToCompany);
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
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const isDistrictFilterActive = selectedDistricts.length > 0;

  const restorePaginatedOrganizations = useCallback(
    async (categoryId: string | null) => {
      if (categoryId === null) {
        setOrganizations(initialOrganizations);
        setHasMore(initialHasMore);
        return;
      }

      const { items, hasMore: nextHasMore } = await fetchOrganizationsPage(
        0,
        categoryId,
      );
      setOrganizations(items.map(mapOrganizationToCompany));
      setHasMore(nextHasMore);
    },
    [initialHasMore, initialOrganizations],
  );

  const handleSelectedDistrictsChange = useCallback(
    async (districts: string[]) => {
      const wasDistrictFilterActive = selectedDistricts.length > 0;
      const isDistrictFilterActiveNext = districts.length > 0;

      setSelectedDistricts(districts);

      if (wasDistrictFilterActive === isDistrictFilterActiveNext) {
        return;
      }

      setIsLoading(true);

      try {
        if (isDistrictFilterActiveNext) {
          const allOrganizations = await fetchAllOrganizations(activeCategoryId);
          setOrganizations(allOrganizations);
          setHasMore(false);
          return;
        }

        await restorePaginatedOrganizations(activeCategoryId);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [activeCategoryId, restorePaginatedOrganizations, selectedDistricts.length],
  );

  const handleCategorySelect = useCallback(
    async (id: string | null) => {
      setActiveCategoryId(id);
      setIsLoading(true);

      try {
        if (selectedDistricts.length > 0) {
          const allOrganizations = await fetchAllOrganizations(id);
          setOrganizations(allOrganizations);
          setHasMore(false);
          return;
        }

        await restorePaginatedOrganizations(id);
      } catch (error) {
        console.error(error);
        setOrganizations([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [restorePaginatedOrganizations, selectedDistricts.length],
  );

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || isDistrictFilterActive) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const { items, hasMore: nextHasMore } = await fetchOrganizationsPage(
        organizations.length,
        activeCategoryId,
      );

      setOrganizations((current) =>
        appendOrganizations(current, items.map(mapOrganizationToCompany)),
      );
      setHasMore(nextHasMore);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    activeCategoryId,
    hasMore,
    isDistrictFilterActive,
    isLoadingMore,
    organizations.length,
  ]);

  const filteredOrganizations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = organizations.filter((organization) => {
      const matchesSearch =
        !normalizedSearch ||
        organization.name.toLowerCase().includes(normalizedSearch);

      return (
        matchesSearch &&
        matchesSelectedDistricts(organization.regions, selectedDistricts)
      );
    });

    return dedupeCompanies(filtered);
  }, [organizations, search, selectedDistricts]);

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
          districts={KRYVYI_RIH_DISTRICTS}
          selectedDistricts={selectedDistricts}
          onSelectedDistrictsChange={handleSelectedDistrictsChange}
        />

        <OrganizationsList
          data={filteredOrganizations}
          isLoading={isLoading}
          hasMore={!isDistrictFilterActive && hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          alignWithFilters
        />
      </div>
    </div>
  );
}
