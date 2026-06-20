import type { CatalogLocation, CatalogOrganization } from '@/types/catalog-api';
import { resolveOrganizationDistricts } from '@/lib/catalog-api/inferDistrict';
import type { Company, CompanyStatus } from '@/types/company';

function mapOrganizationStatus(status: string): CompanyStatus {
  switch (status) {
    case 'approved':
      return 'active';
    case 'rejected':
      return 'blocked';
    case 'archived':
      return 'inactive';
    case 'pending':
      return 'pending';
    default:
      return 'pending';
  }
}

function stripWebsiteProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

function formatLocation(location: CatalogLocation): string {
  const street = location.street?.trim();
  const cityLine = [location.city, location.region].filter(Boolean).join(', ');
  const withPostCode = location.postCode
    ? `${cityLine} ${location.postCode}`.trim()
    : cityLine;

  return [street, withPostCode].filter(Boolean).join(', ');
}

function formatCategories(categories: CatalogOrganization['categories']): string {
  return categories.map((category) => category.name).join(', ');
}

export function mapOrganizationToCompany(org: CatalogOrganization): Company {
  const website = org.websiteUrl ? stripWebsiteProtocol(org.websiteUrl) : '';
  const social = org.sociaLinks ?? {};
  const addresses = org.locations.map(formatLocation);
  const primaryCategory = org.categories[0];
  const regions = resolveOrganizationDistricts(org.locations);
  const workingHours = org.workingHours?.trim();
  const streetAddress = org.locations[0]?.street?.trim() ?? '';

  return {
    id: org.id,
    slug: String(org.id),
    name: org.name,
    edrpou: '',
    shortDescription: org.description ?? '',
    rating: 0,
    category: formatCategories(org.categories),
    categoryId: primaryCategory?.id ?? null,
    primaryCategoryName: primaryCategory?.name ?? '',
    status: mapOrganizationStatus(org.status),
    workingHours: workingHours || undefined,
    regions,
    primaryAddress: addresses[0] ?? '',
    streetAddress: streetAddress || addresses[0]?.split(',')[0]?.trim() || '',
    addresses,
    contacts: {
      website,
      phone: org.contacts?.phone?.trim() ?? '',
      email: org.contacts?.email?.trim() ?? '',
      instagram: social.instagram?.trim() ?? '',
      facebook: social.facebook?.trim() ?? '',
      telegram: social.telegram?.trim() ?? '',
    },
  };
}
