import { NextResponse } from 'next/server';

import { fetchDistricts } from '@/lib/catalog-api/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const districts = await fetchDistricts();
    return NextResponse.json(districts);
  } catch (error) {
    console.error('[GET /api/districts]', error);
    return NextResponse.json(
      { message: 'Failed to fetch districts' },
      { status: 502 },
    );
  }
}
