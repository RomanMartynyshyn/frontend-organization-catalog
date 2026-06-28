import { CatalogHomeClient } from '@/app/(catalog)/CatalogHomeClient';
import { getActiveAdminUnitNames } from '@/lib/catalog-api/activeDistrictNames';
import { mergeCatalogAdminUnits } from '@/lib/catalog-api/adminUnitHelpers';
import {
  fetchCategories,
  fetchCommunityAdminUnits,
  fetchDistrictAdminUnits,
} from '@/lib/catalog-api/client';
import { getCompanies } from '@/lib/companies/getCompanies';
import { type CatalogFiltersQuery } from '@/lib/catalogSearchParams';
import { catalogSearchParsers } from '@/lib/catalogSearchParsers.server';
import { catalogSearchUrlKeys } from '@/lib/catalogSearchUrlKeys';
import { createLoader } from 'nuqs/server';

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const loadCatalogSearchParams = createLoader(catalogSearchParsers, {
  urlKeys: catalogSearchUrlKeys,
});

function parseCategoryId(categoryId: CatalogFiltersQuery['categoryId']): number | undefined {
  if (!categoryId) {
    return undefined;
  }

  const parsedCategoryId = Number(categoryId);

  if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
    return undefined;
  }

  return parsedCategoryId;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const initialFilters = await loadCatalogSearchParams(searchParams);
  const categoryId = parseCategoryId(initialFilters.categoryId);

  const [districts, communities, categories] = await Promise.all([
    fetchDistrictAdminUnits(),
    fetchCommunityAdminUnits(),
    fetchCategories(),
  ]);

  const adminUnits = mergeCatalogAdminUnits(districts, communities);

  const activeAdminUnitNames = getActiveAdminUnitNames(
    adminUnits,
    initialFilters.adminUnitIds,
  );

  const { organizations, hasMore } = await getCompanies({
    categoryId,
    adminUnitIds: initialFilters.adminUnitIds,
    search: initialFilters.search.trim() || undefined,
    activeAdminUnitNames,
  });

  return (
    <CatalogHomeClient
      initialFilters={initialFilters}
      initialOrganizations={organizations}
      initialHasMore={hasMore}
      categories={categories}
      districts={districts}
      communities={communities}
    />
  );
}
