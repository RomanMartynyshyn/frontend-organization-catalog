import { CatalogHomeClient } from '@/app/(catalog)/CatalogHomeClient';
import { getActiveDistrictNames } from '@/lib/catalog-api/activeDistrictNames';
import { fetchCategories, fetchDistricts } from '@/lib/catalog-api/client';
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

  const [districts, categories] = await Promise.all([
    fetchDistricts(),
    fetchCategories(),
  ]);

  const activeDistrictNames = getActiveDistrictNames(
    districts,
    initialFilters.districtIds,
  );

  const { organizations, hasMore } = await getCompanies({
    categoryId,
    districtIds: initialFilters.districtIds,
    search: initialFilters.search.trim() || undefined,
    activeDistrictNames,
  });

  return (
    <CatalogHomeClient
      initialFilters={initialFilters}
      initialOrganizations={organizations}
      initialHasMore={hasMore}
      categories={categories}
      districts={districts}
    />
  );
}
