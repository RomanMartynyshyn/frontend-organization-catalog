import type { GeocodeSuggestion } from '@/lib/nominatim/types';

export async function fetchStreetSuggestions(
  query: string,
): Promise<GeocodeSuggestion[]> {
  const searchParams = new URLSearchParams({ q: query });
  const response = await fetch(`/api/geocode/search?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch address suggestions');
  }

  return (await response.json()) as GeocodeSuggestion[];
}
