import { NextRequest, NextResponse } from 'next/server';

import {
  CatalogApiError,
  fetchOrganizations,
  updateOrganizationStatus,
} from '@/lib/catalog-api/client';
import type {
  CatalogOrganizationStatus,
  UpdateOrganizationStatusPayload,
} from '@/types/catalog-api';

export const dynamic = 'force-dynamic';

const ADMIN_STATUSES: CatalogOrganizationStatus[] = [
  'pending',
  'rejected',
  'archived',
];

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

export async function GET(request: NextRequest) {
  const statusParam = request.nextUrl.searchParams.get('status') ?? 'pending';
  const limitParam = request.nextUrl.searchParams.get('limit');
  const offsetParam = request.nextUrl.searchParams.get('offset');

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
    const result = await fetchOrganizations({
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ message: 'Invalid organization id' }, { status: 400 });
  }

  try {
    const payload = (await request.json()) as Partial<UpdateOrganizationStatusPayload>;
    const status = payload.status;

    if (status !== 'approved' && status !== 'rejected' && status !== 'archived') {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    const organization = await updateOrganizationStatus(id, {
      status,
      rejectionReason: payload.rejectionReason ?? null,
    });

    return NextResponse.json(organization);
  } catch (error) {
    console.error('[PUT /api/admin/organizations/:id/status]', error);

    if (error instanceof CatalogApiError) {
      return NextResponse.json(
        error.data ?? { message: 'Failed to update organization status' },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: 'Failed to update organization status' },
      { status: 502 },
    );
  }
}
