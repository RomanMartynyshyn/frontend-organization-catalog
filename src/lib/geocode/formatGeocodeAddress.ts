import type { NominatimAddress } from '@/lib/nominatim/types';

function stripAdminSuffix(name: string): string {
  return name
    .replace(/\s+район$/iu, '')
    .replace(/\s+(?:міська|селищна|сільська)\s+громада$/iu, '')
    .trim();
}

export function buildGeocodeStreetLine(
  address: NominatimAddress | undefined,
  fallback: string,
): string {
  const poi = address?.shop?.trim() || address?.amenity?.trim() || '';

  const road =
    address?.road?.trim() ||
    address?.pedestrian?.trim() ||
    address?.footway?.trim() ||
    '';

  const houseNumber = address?.house_number?.trim() || '';
  const extra =
    address?.building?.trim() ||
    address?.residential?.trim() ||
    address?.quarter?.trim() ||
    '';

  let streetPart = '';

  if (road && houseNumber) {
    streetPart = `${road}, ${houseNumber}`;
  } else if (road && extra) {
    streetPart = `${road}, ${extra}`;
  } else if (road) {
    streetPart = road;
  } else if (extra) {
    streetPart = extra;
  }

  if (poi && streetPart) {
    return `${poi}, ${streetPart}`;
  }

  if (poi) {
    return poi;
  }

  if (streetPart) {
    return streetPart;
  }

  return fallback;
}

export function buildGeocodeLabel(address: NominatimAddress | undefined): string {
  if (!address) {
    return '';
  }

  const parts: string[] = [];

  const suburb = address.suburb?.trim();

  if (suburb && !/район$/iu.test(suburb)) {
    parts.push(suburb);
  }

  const borough = address.borough?.trim();

  if (borough) {
    parts.push(stripAdminSuffix(borough));
  }

  const city =
    address.city?.trim() || address.town?.trim() || address.village?.trim();

  if (city) {
    parts.push(city);
  }

  const postCode = address.postcode?.trim();

  if (postCode) {
    parts.push(postCode);
  }

  return parts.join(', ');
}
