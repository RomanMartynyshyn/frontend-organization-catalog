import { CatalogHomeClient } from '@/app/(catalog)/CatalogHomeClient';
import {
  type CatalogSearchQuery,
} from '@/lib/catalogSearchParams';
import { catalogSearchParsers } from '@/lib/catalogSearchParsers.server';
import { catalogSearchUrlKeys } from '@/lib/catalogSearchUrlKeys';
import { fetchCategories } from '@/lib/catalog-api/client';
import { getCompanies } from '@/lib/companies/getCompanies';
import { ORGANIZATIONS_PAGE_SIZE } from '@/lib/constants';
import { createLoader } from 'nuqs/server';

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const loadCatalogSearchParams = createLoader(catalogSearchParsers, {
  urlKeys: catalogSearchUrlKeys,
});

function parseCategoryId(categoryId: CatalogSearchQuery['categoryId']): number | undefined {
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
  const initialQuery = await loadCatalogSearchParams(searchParams);
  const categoryId = parseCategoryId(initialQuery.categoryId);
  const limit = Math.max(initialQuery.page, 1) * ORGANIZATIONS_PAGE_SIZE;
  const [{ organizations, hasMore }, categories] = await Promise.all([
    getCompanies({
      categoryId,
      districtIds: initialQuery.districtIds,
      limit,
    }),
    fetchCategories(),
  ]);

  return (
    <CatalogHomeClient
      initialQuery={initialQuery}
      initialOrganizations={organizations}
      initialHasMore={hasMore}
      categories={categories}
    />
  );
}
