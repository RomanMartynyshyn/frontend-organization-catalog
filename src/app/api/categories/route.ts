import { NextResponse } from 'next/server';

import { fetchCategories } from '@/lib/catalog-api/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await fetchCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('[GET /api/categories]', error);
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 502 },
    );
  }
}
