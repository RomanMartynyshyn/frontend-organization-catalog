import type { CatalogDistrict } from '@/types/catalog-api';

export function getActiveDistrictNames(
  districts: CatalogDistrict[],
  selectedDistrictIds: number[],
): string[] | undefined {
  if (!selectedDistrictIds.length) {
    return undefined;
  }

  return districts
    .filter((district) => selectedDistrictIds.includes(district.districtId))
    .map((district) => district.name);
}
