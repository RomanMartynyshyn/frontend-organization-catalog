import { fetchOrganizationById } from '@/lib/catalog-api/client';
import { mapOrganizationToCompany } from '@/lib/catalog-api/mapToCompany';
import type { Company } from '@/types/company';

export async function getCompanyById(id: string): Promise<Company | null> {
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return null;
  }

  const organization = await fetchOrganizationById(numericId);

  if (!organization) {
    return null;
  }

  return mapOrganizationToCompany(organization);
}
