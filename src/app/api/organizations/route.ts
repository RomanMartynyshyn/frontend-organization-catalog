import { NextRequest, NextResponse } from 'next/server';

import { fetchOrganizations } from '@/lib/catalog-api/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const categoryIdParam = request.nextUrl.searchParams.get('category_id');

  let categoryId: number | undefined;

  if (categoryIdParam !== null && categoryIdParam !== '') {
    categoryId = Number(categoryIdParam);

    if (Number.isNaN(categoryId)) {
      return NextResponse.json(
        { message: 'Invalid category_id' },
        { status: 400 },
      );
    }
  }

  try {
    const organizations = await fetchOrganizations(categoryId);
    return NextResponse.json(organizations);
  } catch (error) {
    console.error('[GET /api/organizations]', error);
    return NextResponse.json(
      { message: 'Failed to fetch organizations' },
      { status: 502 },
    );
  }
}
