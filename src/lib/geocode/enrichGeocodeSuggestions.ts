import { resolveAdminUnitIdsFromAddress } from '@/lib/geocode/matchAdminUnits';
import { fetchAdminUnits } from '@/lib/catalog-api/client';
import type { GeocodeSuggestion } from '@/lib/nominatim/types';
import type { NominatimSearchResult } from '@/lib/nominatim/types';

export async function enrichGeocodeSuggestions(
  suggestions: GeocodeSuggestion[],
  nominatimResults: NominatimSearchResult[],
): Promise<GeocodeSuggestion[]> {
  if (suggestions.length === 0) {
    return suggestions;
  }

  const adminUnits = await fetchAdminUnits();
  const districts = adminUnits.filter((unit) => unit.type === 'district');
  const communities = adminUnits.filter((unit) => unit.type === 'community');

  const addressByPlaceId = new Map(
    nominatimResults.map((result) => [String(result.place_id), result.address]),
  );

  return suggestions.map((suggestion) => {
    const { districtAdminUnitId, communityAdminUnitId } =
      resolveAdminUnitIdsFromAddress(
        addressByPlaceId.get(suggestion.id),
        districts,
        communities,
      );

    return {
      ...suggestion,
      districtAdminUnitId,
      communityAdminUnitId,
    };
  });
}
