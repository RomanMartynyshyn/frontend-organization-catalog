export type CatalogFiltersQuery = {
  categoryId: string | null;
  adminUnitIds: number[];
  search: string;
};

export type CatalogSearchQuery = CatalogFiltersQuery & {
  page: number;
};

export function serializeCatalogFilters(query: CatalogFiltersQuery): string {
  return JSON.stringify({
    categoryId: query.categoryId,
    adminUnitIds: query.adminUnitIds,
    search: query.search.trim(),
  });
}
