export type NominatimAddress = {
  road?: string;
  pedestrian?: string;
  footway?: string;
  house_number?: string;
  city?: string;
  town?: string;
  village?: string;
};

export type NominatimSearchResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
};

export type GeocodeSuggestion = {
  id: string;
  label: string;
  street: string;
  latitude: number;
  longitude: number;
};
