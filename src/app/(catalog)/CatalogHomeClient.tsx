'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryStates } from 'nuqs';

import { CategoriesBar } from '@/components/CategoriesBar';
import { FiltersPanel } from '@/components/FiltersPanel';
import HeroSection from '@/components/HeroSection';
import { OrganizationsList } from '@/components/OrganizationsList';
import { SelectedFilters } from '@/components/SelectedFilters';
import { useCatalogSearch } from '@/contexts/CatalogSearchContext';
import {
  serializeCatalogSearchQuery,
  type CatalogSearchQuery,
} from '@/lib/catalogSearchParams';
import { catalogSearchParsers } from '@/lib/catalogSearchParsers';
import { catalogSearchUrlKeys } from '@/lib/catalogSearchUrlKeys';
import { mapOrganizationToCompany } from '@/lib/catalog-api/mapToCompany';
import { ORGANIZATIONS_PAGE_SIZE } from '@/lib/constants';
import type {CatalogCategory, CatalogDistrict, PaginatedOrganizations} from '@/types/catalog-api';
import type { Company } from '@/types/company';

type CatalogHomeClientProps = {
  initialQuery: CatalogSearchQuery;
  initialOrganizations: Company[];
  initialHasMore: boolean;
  categories: CatalogCategory[];
};

type OrganizationQuery = CatalogSearchQuery;

async function fetchOrganizationsPage(
  query: OrganizationQuery,
): Promise<PaginatedOrganizations> {
  const params = new URLSearchParams({
    limit: String(Math.max(query.page, 1) * ORGANIZATIONS_PAGE_SIZE),
    offset: '0',
  });

  if (query.categoryId !== null) {
    params.set('categoryId', query.categoryId);
  }

  for (const districtId of query.districtIds) {
    params.append('districtId', String(districtId));
  }

  const response = await fetch(`/api/organizations?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }

  return (await response.json()) as PaginatedOrganizations;
}

async function fetchDistrictOptions(): Promise<CatalogDistrict[]> {
  const response = await fetch('/api/districts');

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as unknown;

  if (!Array.isArray(data)) {
    return [];
  }

  return data;
}

export function CatalogHomeClient({
  initialQuery,
  initialOrganizations,
  initialHasMore,
  categories,
}: CatalogHomeClientProps) {
  const { search, setSearch } = useCatalogSearch();
  const [
    { categoryId: activeCategoryId, districtIds: selectedDistrictIds, page },
    setCatalogFilters,
  ] = useQueryStates(catalogSearchParsers, {
    urlKeys: catalogSearchUrlKeys,
  });
  const [organizations, setOrganizations] = useState<Company[]>(initialOrganizations);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [districtOptions, setDistrictOptions] = useState<CatalogDistrict[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const previousQueryKeyRef = useRef(serializeCatalogSearchQuery(initialQuery));
  const previousPageRef = useRef(initialQuery.page);

  useEffect(() => {
    void fetchDistrictOptions().then(setDistrictOptions);
  }, []);

  const currentQuery = useMemo<OrganizationQuery>(
    () => ({
      categoryId: activeCategoryId,
      districtIds: selectedDistrictIds,
      page,
    }),
    [activeCategoryId, page, selectedDistrictIds],
  );

  const currentQueryKey = useMemo(
    () => serializeCatalogSearchQuery(currentQuery),
    [currentQuery],
  );

  const loadOrganizations = useCallback(
    async (query: OrganizationQuery) => {
      const { items, hasMore: nextHasMore } = await fetchOrganizationsPage(query);
      const mapped = items.map(mapOrganizationToCompany);

      setOrganizations(mapped);
      setHasMore(nextHasMore);
    },
    [],
  );

  useEffect(() => {
    if (previousQueryKeyRef.current === currentQueryKey) {
      return;
    }

    const previousPage = previousPageRef.current;

    previousQueryKeyRef.current = currentQueryKey;
    previousPageRef.current = currentQuery.page;
    let isActive = true;

    const isPaginationUpdate = currentQuery.page > previousPage;

    if (isPaginationUpdate) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    void loadOrganizations(currentQuery)
      .catch((error) => {
        if (!isActive) {
          return;
        }

        console.error(error);
        setOrganizations([]);
        setHasMore(false);
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [currentQuery, currentQueryKey, loadOrganizations]);

  const handleSelectedDistrictsChange = useCallback(
    (districtIds: number[]) => {
      setIsLoading(true);

      void setCatalogFilters({ districtIds, page: 1 });
    },
    [setCatalogFilters],
  );

  const handleCategorySelect = useCallback(
    (id: string | null) => {
      setIsLoading(true);

      void setCatalogFilters({ categoryId: id, page: 1 });
    },
    [setCatalogFilters],
  );

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);

    void setCatalogFilters((currentFilters) => ({
      page: currentFilters.page + 1,
    }));
  }, [hasMore, isLoadingMore, setCatalogFilters]);

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

    districtOptions
      .filter(district => selectedDistrictIds.includes(district.districtId))
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
    selectedDistrictIds,
    setSearch,
    districtOptions
  ]);

  const resetFilters = () => {
    setSearch('');

    if (activeCategoryId !== null || selectedDistrictIds.length > 0) {
      setIsLoading(true);
    }

    void setCatalogFilters({
      categoryId: null,
      districtIds: [],
      page: 1,
    });
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
          selectedDistrictIds={selectedDistrictIds}
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
