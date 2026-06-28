import { fetchOrganizations } from '@/lib/catalog-api/client';
import { getChunkPagination } from '@/lib/catalog-api/organizationsPagination';
import { toCompanyListItems } from '@/lib/companies/companyListItems';
import {
  mapOrganizationToCompany,
  type MapOrganizationOptions,
} from '@/lib/catalog-api/mapToCompany';
import type { FetchOrganizationsParams } from '@/types/catalog-api';
import type { CompanyListItem } from '@/types/company';

export type CompaniesPage = {
  organizations: CompanyListItem[];
  hasMore: boolean;
};

export type GetCompaniesParams = FetchOrganizationsParams & MapOrganizationOptions;

export async function getCompanies(
  params: GetCompaniesParams = {},
): Promise<CompaniesPage> {
  const { activeAdminUnitNames, ...fetchParams } = params;
  const { items, hasMore } = await fetchOrganizations(fetchParams);

  return {
    organizations: toCompanyListItems(
      items.map((item) =>
        mapOrganizationToCompany(item, { activeAdminUnitNames }),
      ),
      1,
    ),
    hasMore,
  };
}

export async function getCompaniesUpToPage(
  params: GetCompaniesParams & { page: number },
): Promise<CompaniesPage> {
  const { page, activeAdminUnitNames, ...fetchParams } = params;
  const organizations: CompanyListItem[] = [];
  let hasMore = false;

  for (let pageNumber = 1; pageNumber <= page; pageNumber += 1) {
    const { limit, offset } = getChunkPagination(pageNumber);
    const { items, hasMore: chunkHasMore } = await fetchOrganizations({
      ...fetchParams,
      limit,
      offset,
    });

    organizations.push(
      ...toCompanyListItems(
        items.map((item) =>
          mapOrganizationToCompany(item, { activeAdminUnitNames }),
        ),
        pageNumber,
      ),
    );
    hasMore = chunkHasMore;

    if (!chunkHasMore) {
      break;
    }
  }

  return {
    organizations,
    hasMore,
  };
}
