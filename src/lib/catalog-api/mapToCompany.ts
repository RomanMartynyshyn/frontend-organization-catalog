import type { CatalogLocation, CatalogOrganization } from '@/types/catalog-api';
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

function collectDistricts(locations: CatalogLocation[]): string[] {
  const districts = new Set<string>();

  for (const location of locations) {
    const district = location.district?.trim();

    if (district) {
      districts.add(district);
    }
  }

  return [...districts];
}

export type MapOrganizationOptions = {
  activeDistrictNames?: string[];
};

function pickDisplayLocation(
  locations: CatalogLocation[],
  activeDistrictNames?: string[],
): CatalogLocation | undefined {
  if (!locations.length) {
    return undefined;
  }

  if (activeDistrictNames?.length) {
    const activeDistricts = new Set(
      activeDistrictNames.map((name) => name.trim()).filter(Boolean),
    );
    const matchingLocation = locations.find(
      (location) =>
        location.district?.trim() &&
        activeDistricts.has(location.district.trim()),
    );

    if (matchingLocation) {
      return matchingLocation;
    }
  }

  return locations[0];
}

export function mapOrganizationToCompany(
  org: CatalogOrganization,
  options?: MapOrganizationOptions,
): Company {
  const website = org.websiteUrl ? stripWebsiteProtocol(org.websiteUrl) : '';
  const social = org.sociaLinks ?? {};
  const addresses = org.locations.map(formatLocation);
  const primaryCategory = org.categories[0];
  const displayLocation = pickDisplayLocation(
    org.locations,
    options?.activeDistrictNames,
  );
  const regions = collectDistricts(
    options?.activeDistrictNames?.length && displayLocation
      ? [displayLocation]
      : org.locations,
  );
  const workingHours = org.workingHours?.trim();
  const formattedDisplayAddress = displayLocation
    ? formatLocation(displayLocation)
    : '';
  const streetAddress = displayLocation?.street?.trim() ?? '';

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
    primaryAddress: formattedDisplayAddress || addresses[0] || '',
    streetAddress:
      streetAddress ||
      formattedDisplayAddress.split(',')[0]?.trim() ||
      addresses[0]?.split(',')[0]?.trim() ||
      '',
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
