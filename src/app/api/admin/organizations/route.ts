import { NextRequest, NextResponse } from 'next/server';

import { fetchOrganizations } from '@/lib/catalog-api/client';
import type { CatalogOrganization, CatalogOrganizationStatus } from '@/types/catalog-api';

export const dynamic = 'force-dynamic';

const ADMIN_STATUSES: CatalogOrganizationStatus[] = [
  'pending',
  'approved',
  'rejected',
  'archived',
];

const ADMIN_SCAN_PAGE_SIZE = 15;
const ADMIN_SCAN_MAX_ITEMS = 300;

function parsePositiveInt(
  value: string | null,
  fallback: number,
): number | null {
  if (value === null || value === '') {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

async function fetchOrganizationsByNameSearch(
  status: CatalogOrganizationStatus,
  search: string,
  offset: number,
  limit: number,
) {
  const normalizedSearch = search.toLowerCase();
  const matched: CatalogOrganization[] = [];
  let scanOffset = 0;

  while (scanOffset < ADMIN_SCAN_MAX_ITEMS) {
    const batch = await fetchOrganizations({
      status,
      limit: ADMIN_SCAN_PAGE_SIZE,
      offset: scanOffset,
    });

    matched.push(
      ...batch.items.filter((organization) =>
        organization.name.toLowerCase().includes(normalizedSearch),
      ),
    );

    if (!batch.hasMore) {
      break;
    }

    scanOffset += ADMIN_SCAN_PAGE_SIZE;
  }

  return {
    items: matched.slice(offset, offset + limit),
    hasMore: matched.length > offset + limit,
  };
}

export async function GET(request: NextRequest) {
  const statusParam = request.nextUrl.searchParams.get('status') ?? 'pending';
  const limitParam = request.nextUrl.searchParams.get('limit');
  const offsetParam = request.nextUrl.searchParams.get('offset');
  const searchParam = request.nextUrl.searchParams.get('search')?.trim() ?? '';

  if (!ADMIN_STATUSES.includes(statusParam)) {
    return NextResponse.json(
      { message: 'Invalid status' },
      { status: 400 },
    );
  }

  const limit = parsePositiveInt(limitParam, 15);
  const offset = parsePositiveInt(offsetParam, 0);

  if (limit === null || offset === null || limit < 1 || limit > 15) {
    return NextResponse.json(
      { message: 'Invalid limit or offset' },
      { status: 400 },
    );
  }

  try {
    const result = searchParam
      ? await fetchOrganizationsByNameSearch(statusParam, searchParam, offset, limit)
      : await fetchOrganizations({
          status: statusParam,
          limit,
          offset,
        });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET /api/admin/organizations]', error);
    return NextResponse.json(
      { message: 'Failed to fetch organizations' },
      { status: 502 },
    );
  }
}
