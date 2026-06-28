import type { CatalogAdminUnit } from '@/types/catalog-api';

export function getActiveAdminUnitNames(
  adminUnits: CatalogAdminUnit[],
  selectedAdminUnitIds: number[],
): string[] | undefined {
  if (!selectedAdminUnitIds.length) {
    return undefined;
  }

  return adminUnits
    .filter((unit) => selectedAdminUnitIds.includes(unit.adminUnitId))
    .map((unit) => unit.name);
}
