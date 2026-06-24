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

function normalizePhones(
  contacts: CatalogOrganization['contacts'],
): string[] {
  if (!contacts) {
    return [];
  }

  const fromArray =
    contacts.phone_numbers
      ?.map((phone) => phone.trim())
      .filter(Boolean) ?? [];

  if (fromArray.length > 0) {
    return [...new Set(fromArray)];
  }

  const singlePhone = contacts.phone?.trim();

  return singlePhone ? [singlePhone] : [];
}

function normalizeSocialUrl(value: string | null | undefined): string {
  const trimmed = value?.trim();

  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function mapOrganizationToCompany(
  org: CatalogOrganization,
  options?: MapOrganizationOptions,
): Company {
  const website = org.websiteUrl ? stripWebsiteProtocol(org.websiteUrl) : '';
  const social = org.socialLinks ?? org.sociaLinks ?? {};
  const addresses = org.locations.map(formatLocation);
  const locations = org.locations.map((location) => ({
    id: location.id,
    address: formatLocation(location),
    street: location.street?.trim() || formatLocation(location),
    district: location.district?.trim() ?? null,
  }));
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
  const phones = normalizePhones(org.contacts);
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
    locations,
    contacts: {
      website,
      phone: phones[0] ?? '',
      phones,
      email: org.contacts?.email?.trim() ?? '',
      instagram: normalizeSocialUrl(social.instagram),
      facebook: normalizeSocialUrl(social.facebook),
      telegram: normalizeSocialUrl(social.telegram),
    },
  };
}
