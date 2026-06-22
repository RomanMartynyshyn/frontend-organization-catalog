import { getActiveDistrictNames } from '@/lib/catalog-api/activeDistrictNames';
import { fetchOrganizationsChunk } from '@/lib/catalog-api/fetchOrganizationsPage';
import { mapOrganizationToCompany } from '@/lib/catalog-api/mapToCompany';
import { toCompanyListItems } from '@/lib/companies/companyListItems';
import {
  serializeCatalogFilters,
  type CatalogFiltersQuery,
} from '@/lib/catalogSearchParams';
import type { CatalogDistrict } from '@/types/catalog-api';
import type { CompanyListItem } from '@/types/company';

export type OrganizationsInfinitePage = {
  organizations: CompanyListItem[];
  hasMore: boolean;
};

export const organizationsQueryKeys = {
  all: ['organizations'] as const,
  list: (filters: CatalogFiltersQuery) =>
    [
      ...organizationsQueryKeys.all,
      'list',
      serializeCatalogFilters(filters),
    ] as const,
};

export async function fetchOrganizationsInfinitePage(
  filters: CatalogFiltersQuery,
  page: number,
  districts: CatalogDistrict[],
): Promise<OrganizationsInfinitePage> {
  const activeDistrictNames = getActiveDistrictNames(
    districts,
    filters.districtIds,
  );
  const { items, hasMore } = await fetchOrganizationsChunk(
    { ...filters, page },
    page,
  );

  return {
    organizations: toCompanyListItems(
      items.map((item) =>
        mapOrganizationToCompany(item, { activeDistrictNames }),
      ),
      page,
    ),
    hasMore,
  };
}
