import type { CatalogSearchQuery } from '@/lib/catalogSearchParams';
import { getChunkPagination } from '@/lib/catalog-api/organizationsPagination';
import type { PaginatedOrganizations } from '@/types/catalog-api';

function buildOrganizationsParams(
  query: CatalogSearchQuery,
  pagination: { limit: number; offset: number },
): URLSearchParams {
  const params = new URLSearchParams({
    limit: String(pagination.limit),
    offset: String(pagination.offset),
  });

  if (query.categoryId !== null) {
    params.set('categoryId', query.categoryId);
  }

  for (const districtId of query.districtIds) {
    params.append('districtId', String(districtId));
  }

  const normalizedSearch = query.search.trim();

  if (normalizedSearch) {
    params.set('search', normalizedSearch);
  }

  return params;
}

async function requestOrganizations(
  params: URLSearchParams,
): Promise<PaginatedOrganizations> {
  const response = await fetch(`/api/organizations?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }

  return (await response.json()) as PaginatedOrganizations;
}

export async function fetchOrganizationsChunk(
  query: CatalogSearchQuery,
  page = query.page,
): Promise<PaginatedOrganizations> {
  const { limit, offset } = getChunkPagination(page);

  return requestOrganizations(
    buildOrganizationsParams(query, {
      limit,
      offset,
    }),
  );
}

