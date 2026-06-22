import { ORGANIZATIONS_PAGE_SIZE } from '@/lib/constants';
import type { PaginatedOrganizations } from '@/types/catalog-api';

type FetchOrganizationsChunk = (
  page: number,
) => Promise<PaginatedOrganizations>;

export async function fetchPaginatedOrganizationsUpToPage(
  fetchChunk: FetchOrganizationsChunk,
  targetPage: number,
): Promise<PaginatedOrganizations> {
  const pages = Math.max(targetPage, 1);
  const items: PaginatedOrganizations['items'] = [];
  let hasMore = false;

  for (let page = 1; page <= pages; page += 1) {
    const chunk = await fetchChunk(page);
    items.push(...chunk.items);
    hasMore = chunk.hasMore;

    if (!chunk.hasMore) {
      break;
    }
  }

  return { items, hasMore };
}

export function getChunkPagination(page: number) {
  const pageNumber = Math.max(page, 1);

  return {
    limit: ORGANIZATIONS_PAGE_SIZE,
    offset: (pageNumber - 1) * ORGANIZATIONS_PAGE_SIZE,
    page: pageNumber,
  };
}
