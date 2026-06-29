import {
  KRYVYI_RIH_CITY,
  KRYVYI_RIH_VIEWBOX,
  NOMINATIM_BASE_URL,
  NOMINATIM_SEARCH_LIMIT,
} from '@/lib/nominatim/constants';
import { enrichGeocodeSuggestions } from '@/lib/geocode/enrichGeocodeSuggestions';
import {
  buildGeocodeLabel,
  buildGeocodeStreetLine,
} from '@/lib/geocode/formatGeocodeAddress';
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

function mapNominatimResult(result: NominatimSearchResult): GeocodeSuggestion | null {
  const latitude = Number(result.lat);
  const longitude = Number(result.lon);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  const fallback =
    result.display_name.split(',')[0]?.trim() || result.display_name;
  const street = buildGeocodeStreetLine(result.address, fallback);
  const label = buildGeocodeLabel(result.address) || result.display_name;

  return {
    id: String(result.place_id),
    label,
    street,
    latitude,
    longitude,
    postCode: result.address?.postcode?.trim() || null,
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

  const suggestions = data
    .map(mapNominatimResult)
    .filter((item): item is GeocodeSuggestion => item !== null);

  return enrichGeocodeSuggestions(suggestions, data);
}
