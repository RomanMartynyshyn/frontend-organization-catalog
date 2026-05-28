import { NextRequest, NextResponse } from 'next/server';

import {
  CatalogApiError,
  createOrganization,
  fetchOrganizations,
} from '@/lib/catalog-api/client';
import type { CreateOrganizationPayload } from '@/types/catalog-api';

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

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Partial<CreateOrganizationPayload>;
    const name = payload.name?.trim();
    const description = payload.description?.trim() ?? '';
    const websiteUrl = payload.websiteUrl?.trim() ?? '';
    const categoryIds = payload.categoryIds;

    if (!name || name.length < 2 || name.length > 255) {
      return NextResponse.json(
        { message: 'Name must contain between 2 and 255 characters' },
        { status: 400 },
      );
    }

    if (description.length > 1000) {
      return NextResponse.json(
        { message: 'Description must not exceed 1000 characters' },
        { status: 400 },
      );
    }

    if (websiteUrl !== '') {
      let parsedWebsiteUrl: URL;

      try {
        parsedWebsiteUrl = new URL(websiteUrl);
      } catch {
        return NextResponse.json(
          { message: 'Website URL must be a valid https:// URL' },
          { status: 400 },
        );
      }

      if (parsedWebsiteUrl.protocol !== 'https:') {
        return NextResponse.json(
          { message: 'Website URL must be a valid https:// URL' },
          { status: 400 },
        );
      }
    }

    if (!Array.isArray(categoryIds) || categoryIds.length < 1 || categoryIds.length > 5) {
      return NextResponse.json(
        { message: 'Category IDs must contain between 1 and 5 items' },
        { status: 400 },
      );
    }

    if (
      categoryIds.some(
        (categoryId) => !Number.isInteger(categoryId) || categoryId <= 0,
      )
    ) {
      return NextResponse.json(
        { message: 'Each category ID must be a positive integer' },
        { status: 400 },
      );
    }

    const organisation = await createOrganization({
      name,
      description,
      websiteUrl,
      categoryIds,
    });

    return NextResponse.json(organisation, { status: 201 });
  } catch (error) {
    console.error('[POST /api/organizations]', error);

    if (error instanceof CatalogApiError && error.status === 400) {
      return NextResponse.json(
        error.data ?? { message: 'Validation failed' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: 'Failed to create organization' },
      { status: 500 },
    );
  }
}
