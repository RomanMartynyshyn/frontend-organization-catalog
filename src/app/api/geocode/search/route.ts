import { NextRequest, NextResponse } from 'next/server';

import { searchKryvyiRihAddresses } from '@/lib/nominatim/client';
import { NOMINATIM_MIN_QUERY_LENGTH } from '@/lib/nominatim/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (query.length < NOMINATIM_MIN_QUERY_LENGTH) {
    return NextResponse.json([]);
  }

  try {
    const suggestions = await searchKryvyiRihAddresses(query);
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('[GET /api/geocode/search]', error);
    return NextResponse.json(
      { message: 'Failed to search addresses' },
      { status: 502 },
    );
  }
}
