import { fetchOrganizations } from '@/lib/catalog-api/client';
import { mapOrganizationToCompany } from '@/lib/catalog-api/mapToCompany';
import type { FetchOrganizationsParams } from '@/types/catalog-api';
import type { Company } from '@/types/company';

export type CompaniesPage = {
  organizations: Company[];
  hasMore: boolean;
};

export async function getCompanies(
  params: FetchOrganizationsParams = {},
): Promise<CompaniesPage> {
  const { items, hasMore } = await fetchOrganizations(params);

  return {
    organizations: items.map(mapOrganizationToCompany),
    hasMore,
  };
}
