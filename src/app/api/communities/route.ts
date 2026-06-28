import { NextResponse } from 'next/server';

import { fetchCommunityAdminUnits } from '@/lib/catalog-api/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const communities = await fetchCommunityAdminUnits();
    return NextResponse.json(communities);
  } catch (error) {
    console.error('[GET /api/communities]', error);
    return NextResponse.json(
      { message: 'Failed to fetch communities' },
      { status: 502 },
    );
  }
}
