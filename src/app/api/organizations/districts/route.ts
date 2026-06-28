import { NextResponse } from 'next/server';

import { fetchDistrictAdminUnits } from '@/lib/catalog-api/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const adminUnits = await fetchDistrictAdminUnits();
    return NextResponse.json(adminUnits);
  } catch (error) {
    console.error('[GET /api/organizations/districts]', error);
    return NextResponse.json(
      { message: 'Failed to fetch admin units' },
      { status: 502 },
    );
  }
}
