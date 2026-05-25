import { fetchOrganizations } from '@/lib/catalog-api/client';
import { mapOrganizationToCompany } from '@/lib/catalog-api/mapToCompany';
import type { Company } from '@/types/company';

export async function getCompanies(categoryId?: number): Promise<Company[]> {
  const organizations = await fetchOrganizations(categoryId);
  return organizations.map(mapOrganizationToCompany);
}
