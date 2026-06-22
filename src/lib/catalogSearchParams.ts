export type CatalogSearchQuery = {
  categoryId: string | null;
  districtIds: number[];
  page: number;
};

export function serializeCatalogSearchQuery(query: CatalogSearchQuery): string {
  return JSON.stringify({
    categoryId: query.categoryId,
    districtIds: query.districtIds,
    page: query.page,
  });
}
