import type { CatalogAdminUnit } from '@/types/catalog-api';
import type { NominatimAddress } from '@/lib/nominatim/types';

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function stripAdminUnitSuffix(name: string): string {
  return name
    .replace(/\s+район$/iu, '')
    .replace(/\s+(?:міська|селищна|сільська)\s+громада$/iu, '')
    .trim();
}

function namesMatch(candidate: string, adminUnitName: string): boolean {
  const normalizedCandidate = normalizeName(candidate);
  const normalizedAdminUnit = normalizeName(adminUnitName);

  if (normalizedCandidate === normalizedAdminUnit) {
    return true;
  }

  return (
    normalizeName(stripAdminUnitSuffix(candidate)) ===
    normalizeName(stripAdminUnitSuffix(adminUnitName))
  );
}

function findAdminUnitId(
  units: readonly CatalogAdminUnit[],
  candidates: Array<string | undefined>,
): number | null {
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();

    if (!trimmed) {
      continue;
    }

    const match = units.find((unit) => namesMatch(trimmed, unit.name));

    if (match) {
      return match.adminUnitId;
    }
  }

  return null;
}

export function resolveAdminUnitIdsFromAddress(
  address: NominatimAddress | undefined,
  districts: readonly CatalogAdminUnit[],
  communities: readonly CatalogAdminUnit[],
): {
  districtAdminUnitId: number | null;
  communityAdminUnitId: number | null;
} {
  const districtAdminUnitId = findAdminUnitId(districts, [
    address?.borough,
    address?.city_district,
    address?.suburb?.includes('район') ? address.suburb : undefined,
  ]);

  const communityAdminUnitId = findAdminUnitId(communities, [
    address?.municipality,
  ]);

  return {
    districtAdminUnitId,
    communityAdminUnitId,
  };
}

export function resolveLocationAdminUnitId(location: {
  districtAdminUnitId: number | null;
  communityAdminUnitId: number | null;
}): number | undefined {
  const adminUnitId =
    location.districtAdminUnitId ?? location.communityAdminUnitId ?? undefined;

  return adminUnitId ?? undefined;
}
