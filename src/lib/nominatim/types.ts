export type NominatimAddress = {
  road?: string;
  pedestrian?: string;
  footway?: string;
  house_number?: string;
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  borough?: string;
  city_district?: string;
  municipality?: string;
  district?: string;
  postcode?: string;
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
  postCode?: string | null;
  districtAdminUnitId?: number | null;
  communityAdminUnitId?: number | null;
};
