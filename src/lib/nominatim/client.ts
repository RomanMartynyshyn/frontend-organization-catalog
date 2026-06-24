import {
  KRYVYI_RIH_CITY,
  KRYVYI_RIH_VIEWBOX,
  NOMINATIM_BASE_URL,
  NOMINATIM_SEARCH_LIMIT,
} from '@/lib/nominatim/constants';
import type {
  GeocodeSuggestion,
  NominatimSearchResult,
} from '@/lib/nominatim/types';
import { APP_NAME, SERVER_URL } from '@/lib/constants';

let lastRequestAt = 0;

async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const delay = Math.max(0, 1000 - (now - lastRequestAt));

  if (delay > 0) {
    await new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  lastRequestAt = Date.now();
}

function getUserAgent(): string {
  const configured = process.env.NOMINATIM_USER_AGENT?.trim();

  if (configured) {
    return configured;
  }

  return `${APP_NAME}/1.0 (${SERVER_URL})`;
}

function buildStreetLine(address: NominatimSearchResult['address'], fallback: string): string {
  const road =
    address?.road?.trim() ||
    address?.pedestrian?.trim() ||
    address?.footway?.trim() ||
    '';

  const houseNumber = address?.house_number?.trim() || '';

  if (road && houseNumber) {
    return `${road}, ${houseNumber}`;
  }

  if (road) {
    return road;
  }

  return fallback;
}

function mapNominatimResult(result: NominatimSearchResult): GeocodeSuggestion | null {
  const latitude = Number(result.lat);
  const longitude = Number(result.lon);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  const street = buildStreetLine(
    result.address,
    result.display_name.split(',')[0]?.trim() || result.display_name,
  );

  return {
    id: String(result.place_id),
    label: result.display_name,
    street,
    latitude,
    longitude,
  };
}

export async function searchKryvyiRihAddresses(
  query: string,
): Promise<GeocodeSuggestion[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  await waitForRateLimit();

  const searchParams = new URLSearchParams({
    q: `${normalizedQuery}, ${KRYVYI_RIH_CITY}`,
    format: 'jsonv2',
    addressdetails: '1',
    limit: String(NOMINATIM_SEARCH_LIMIT),
    countrycodes: 'ua',
    viewbox: KRYVYI_RIH_VIEWBOX,
    bounded: '1',
  });

  const response = await fetch(`${NOMINATIM_BASE_URL}/search?${searchParams.toString()}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': getUserAgent(),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Nominatim request failed: ${response.status}`);
  }

  const data = (await response.json()) as NominatimSearchResult[];

  return data
    .map(mapNominatimResult)
    .filter((item): item is GeocodeSuggestion => item !== null);
}
