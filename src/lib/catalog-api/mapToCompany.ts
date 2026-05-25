import type { CatalogOrganization } from '@/types/catalog-api';
import type { Company, CompanyStatus } from '@/types/company';

function mapOrganizationStatus(status: string): CompanyStatus {
  if (status === 'approved') {
    return 'active';
  }

  return 'pending';
}

export function mapOrganizationToCompany(org: CatalogOrganization): Company {
  const website = org.websiteUrl?.replace(/^https?:\/\//, '') ?? '';

  return {
    id: org.id,
    slug: String(org.id),
    name: org.name,
    edrpou: '',
    shortDescription: org.description,
    rating: 0,
    category: org.categories[0]?.name ?? '',
    status: mapOrganizationStatus(org.status),
    addresses: [],
    contacts: {
      website,
      phone: '',
      email: '',
      instagram: '',
      facebook: '',
      telegram: '',
    },
  };
}
