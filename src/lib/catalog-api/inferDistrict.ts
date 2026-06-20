import { KRYVYI_RIH_DISTRICTS, type KryvyiRihDistrict } from '@/lib/constants/districts';
import type { CatalogLocation } from '@/types/catalog-api';

type DistrictBounds = {
  district: KryvyiRihDistrict;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

const DISTRICT_BOUNDS: DistrictBounds[] = [
  {
    district: 'Тернівський',
    minLat: 47.94,
    maxLat: 48.15,
    minLng: 33.05,
    maxLng: 33.32,
  },
  {
    district: 'Інгулецький',
    minLat: 47.55,
    maxLat: 47.87,
    minLng: 33.05,
    maxLng: 33.45,
  },
  {
    district: 'Довгинцівський',
    minLat: 47.87,
    maxLat: 47.96,
    minLng: 33.05,
    maxLng: 33.34,
  },
  {
    district: 'Саксаганський',
    minLat: 47.94,
    maxLat: 48.15,
    minLng: 33.44,
    maxLng: 33.58,
  },
  {
    district: 'Покровський',
    minLat: 47.88,
    maxLat: 47.96,
    minLng: 33.44,
    maxLng: 33.52,
  },
  {
    district: 'Металургійний',
    minLat: 47.89,
    maxLat: 47.93,
    minLng: 33.4,
    maxLng: 33.44,
  },
  {
    district: 'Центрально-Міський',
    minLat: 47.88,
    maxLat: 47.94,
    minLng: 33.32,
    maxLng: 33.42,
  },
];

function parseCoordinate(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function inferDistrictFromCoordinates(
  latitude: number,
  longitude: number,
): KryvyiRihDistrict | null {
  for (const bounds of DISTRICT_BOUNDS) {
    if (
      latitude >= bounds.minLat &&
      latitude <= bounds.maxLat &&
      longitude >= bounds.minLng &&
      longitude <= bounds.maxLng
    ) {
      return bounds.district;
    }
  }

  return null;
}

function inferDistrictFromText(value: string | null | undefined): KryvyiRihDistrict | null {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  return (
    KRYVYI_RIH_DISTRICTS.find((district) =>
      normalized.includes(district.toLowerCase()),
    ) ?? null
  );
}

export function resolveLocationDistrict(
  location: CatalogLocation,
): KryvyiRihDistrict | null {
  const districtFromApi = location.district?.trim();

  if (districtFromApi && KRYVYI_RIH_DISTRICTS.includes(districtFromApi as KryvyiRihDistrict)) {
    return districtFromApi as KryvyiRihDistrict;
  }

  const latitude = parseCoordinate(location.latitude);
  const longitude = parseCoordinate(location.longitude);

  if (latitude !== null && longitude !== null) {
    const inferred = inferDistrictFromCoordinates(latitude, longitude);

    if (inferred) {
      return inferred;
    }
  }

  return (
    inferDistrictFromText(location.street) ??
    inferDistrictFromText(location.city) ??
    null
  );
}

export function resolveOrganizationDistricts(
  locations: CatalogLocation[],
): KryvyiRihDistrict[] {
  return [
    ...new Set(
      locations
        .map(resolveLocationDistrict)
        .filter((district): district is KryvyiRihDistrict => Boolean(district)),
    ),
  ];
}

export function matchesSelectedDistricts(
  organizationDistricts: string[],
  selectedDistricts: string[],
): boolean {
  if (!selectedDistricts.length) {
    return true;
  }

  if (!organizationDistricts.length) {
    return false;
  }

  return organizationDistricts.some((district) =>
    selectedDistricts.includes(district),
  );
}
