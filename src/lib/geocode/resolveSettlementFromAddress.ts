import type { NominatimAddress } from '@/lib/nominatim/types';

export function resolveSettlementFromAddress(
  address: NominatimAddress | undefined,
): string | null {
  if (!address) {
    return null;
  }

  const candidates = [address.city, address.town, address.village]
    .map((value) => value?.trim())
    .filter(Boolean);

  return candidates[0] ?? null;
}
