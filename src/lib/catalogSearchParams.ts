export type CatalogFiltersQuery = {
  categoryId: string | null;
  districtIds: number[];
  search: string;
};

export type CatalogSearchQuery = CatalogFiltersQuery & {
  page: number;
};

export function serializeCatalogFilters(query: CatalogFiltersQuery): string {
  return JSON.stringify({
    categoryId: query.categoryId,
    districtIds: query.districtIds,
    search: query.search.trim(),
  });
}
