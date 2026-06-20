import { fetchOrganizations } from '@/lib/catalog-api/client';
import { mapOrganizationToCompany } from '@/lib/catalog-api/mapToCompany';
import type { Company } from '@/types/company';

export type CompaniesPage = {
  organizations: Company[];
  hasMore: boolean;
};

export async function getCompanies(
  categoryId?: number,
): Promise<CompaniesPage> {
  const { items, hasMore } = await fetchOrganizations({ categoryId });

  return {
    organizations: items.map(mapOrganizationToCompany),
    hasMore,
  };
}
