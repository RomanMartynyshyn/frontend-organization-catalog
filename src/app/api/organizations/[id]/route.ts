import { NextResponse } from 'next/server';

import { fetchOrganizationById } from '@/lib/catalog-api/client';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id: idParam } = await context.params;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return NextResponse.json({ message: 'Invalid organization id' }, { status: 400 });
  }

  try {
    const organization = await fetchOrganizationById(id);

    if (!organization) {
      return NextResponse.json(
        { message: 'Organization not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error('[GET /api/organizations/[id]]', error);
    return NextResponse.json(
      { message: 'Failed to fetch organization' },
      { status: 502 },
    );
  }
}
