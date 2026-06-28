'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { useCallback, useMemo } from 'react';

import { mergeCatalogAdminUnits } from '@/lib/catalog-api/adminUnitHelpers';
import {
  fetchOrganizationsInfinitePage,
  organizationsQueryKeys,
} from '@/lib/catalog-api/organizationsQuery';
import {
  serializeCatalogFilters,
  type CatalogFiltersQuery,
} from '@/lib/catalogSearchParams';
import { catalogSearchParsers } from '@/lib/catalogSearchParsers';
import { catalogSearchUrlKeys } from '@/lib/catalogSearchUrlKeys';
import type { CatalogAdminUnit } from '@/types/catalog-api';
import type { CompanyListItem } from '@/types/company';

const SSR_STALE_TIME_MS = 60_000;

type UseCatalogOrganizationsParams = {
  initialFilters: CatalogFiltersQuery;
  initialOrganizations: CompanyListItem[];
  initialHasMore: boolean;
  districts: CatalogAdminUnit[];
  communities: CatalogAdminUnit[];
};

export function useCatalogOrganizations({
  initialFilters,
  initialOrganizations,
  initialHasMore,
  districts,
  communities,
}: UseCatalogOrganizationsParams) {
  const adminUnits = useMemo(
    () => mergeCatalogAdminUnits(districts, communities),
    [communities, districts],
  );

  const [
    {
      categoryId: activeCategoryId,
      adminUnitIds: selectedAdminUnitIds,
      search,
    },
    setCatalogFilters,
  ] = useQueryStates(catalogSearchParsers, {
    urlKeys: catalogSearchUrlKeys,
  });

  const currentFilters = useMemo<CatalogFiltersQuery>(
    () => ({
      categoryId: activeCategoryId,
      adminUnitIds: selectedAdminUnitIds,
      search,
    }),
    [activeCategoryId, search, selectedAdminUnitIds],
  );

  const currentFiltersKey = useMemo(
    () => serializeCatalogFilters(currentFilters),
    [currentFilters],
  );

  const initialFiltersKey = useMemo(
    () => serializeCatalogFilters(initialFilters),
    [initialFilters],
  );

  const matchesInitialFilters = initialFiltersKey === currentFiltersKey;

  const initialInfiniteData = useMemo(
    () =>
      matchesInitialFilters
        ? {
            pages: [
              {
                organizations: initialOrganizations,
                hasMore: initialHasMore,
              },
            ],
            pageParams: [1],
          }
        : undefined,
    [
      initialHasMore,
      initialOrganizations,
      matchesInitialFilters,
    ],
  );

  const {
    data,
    isPending,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: organizationsQueryKeys.list(currentFilters),
    queryFn: ({ pageParam }) =>
      fetchOrganizationsInfinitePage(currentFilters, pageParam, adminUnits),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
    initialData: initialInfiniteData,
    staleTime: matchesInitialFilters ? SSR_STALE_TIME_MS : 0,
  });

  const organizations = useMemo(
    () => data?.pages.flatMap((page) => page.organizations) ?? [],
    [data],
  );

  const isLoading = isPending || (isFetching && !isFetchingNextPage);
  const isLoadingMore = isFetchingNextPage;

  const handleSelectedAdminUnitsChange = useCallback(
    (adminUnitIds: number[]) => {
      void setCatalogFilters({ adminUnitIds });
    },
    [setCatalogFilters],
  );

  const handleCategorySelect = useCallback(
    (id: string | null) => {
      void setCatalogFilters({ categoryId: id });
    },
    [setCatalogFilters],
  );

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return {
    activeCategoryId,
    selectedAdminUnitIds,
    search,
    organizations,
    hasMore: hasNextPage ?? false,
    isLoading,
    isLoadingMore,
    filtersKey: currentFiltersKey,
    setCatalogFilters,
    handleCategorySelect,
    handleSelectedAdminUnitsChange,
    handleLoadMore,
  };
}
