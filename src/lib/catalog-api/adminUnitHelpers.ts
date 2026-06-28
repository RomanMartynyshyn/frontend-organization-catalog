import type { CatalogAdminUnit } from '@/types/catalog-api';

export function mergeCatalogAdminUnits(
  ...lists: readonly CatalogAdminUnit[][]
): CatalogAdminUnit[] {
  const merged = new Map<number, CatalogAdminUnit>();

  for (const list of lists) {
    for (const unit of list) {
      merged.set(unit.adminUnitId, unit);
    }
  }

  return [...merged.values()];
}

export function isAdminUnitInList(
  adminUnitId: number | null,
  units: readonly CatalogAdminUnit[],
): boolean {
  if (adminUnitId === null) {
    return false;
  }

  return units.some((unit) => unit.adminUnitId === adminUnitId);
}

export function getAdminUnitSelectValue(
  adminUnitId: number | null,
  units: readonly CatalogAdminUnit[],
): string {
  return isAdminUnitInList(adminUnitId, units) ? String(adminUnitId) : '';
}

export function formatAdminUnitShortName(unit: CatalogAdminUnit): string {
  if (unit.type === 'district') {
    return unit.name.replace(/\s+район$/iu, '');
  }

  if (unit.type === 'community') {
    return unit.name.replace(/\s+(?:міська|селищна|сільська)\s+громада$/iu, '');
  }

  return unit.name;
}
