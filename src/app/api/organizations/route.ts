import { NextRequest, NextResponse } from 'next/server';

import {
  CatalogApiError,
  createOrganization,
  fetchOrganizations,
} from '@/lib/catalog-api/client';
import { ORGANIZATIONS_PAGE_SIZE } from '@/lib/constants';
import type {
  CatalogLocationInput,
  CreateOrganizationPayload,
} from '@/types/catalog-api';

export const dynamic = 'force-dynamic';

function validateLocations(
  locations: CatalogLocationInput[] | undefined,
): CatalogLocationInput[] | null {
  if (!Array.isArray(locations) || locations.length < 1) {
    return null;
  }

  const validated: CatalogLocationInput[] = [];

  for (const location of locations) {
    const street = location.street?.trim();
    const city = location.city?.trim();
    const region = location.region?.trim();
    const postCode = location.postCode?.trim();
    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);

    if (!street || !city || !region || !postCode || postCode.length !== 5) {
      return null;
    }

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return null;
    }

    validated.push({
      street,
      city,
      region,
      postCode,
      latitude,
      longitude,
    });
  }

  return validated;
}

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
  const categoryIdParam = request.nextUrl.searchParams.get('categoryId');
  const districtParams = request.nextUrl.searchParams.getAll('districtId');
  const limitParam = request.nextUrl.searchParams.get('limit');
  const offsetParam = request.nextUrl.searchParams.get('offset');

  let categoryId: number | undefined;

  if (categoryIdParam !== null && categoryIdParam !== '') {
    categoryId = Number(categoryIdParam);

    if (Number.isNaN(categoryId)) {
      return NextResponse.json(
        { message: 'Invalid categoryId' },
        { status: 400 },
      );
    }
  }

  const districtIds = districtParams.map(Number);

  const limit = parsePositiveInt(limitParam, ORGANIZATIONS_PAGE_SIZE);
  const offset = parsePositiveInt(offsetParam, 0);

  if (limit === null || offset === null || limit < 1) {
    return NextResponse.json(
      { message: 'Invalid limit or offset' },
      { status: 400 },
    );
  }

  try {
    const result = await fetchOrganizations({
      categoryId,
      districtIds: districtIds,
      limit,
      offset,
    });
    return NextResponse.json(result);
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

    const locations = validateLocations(payload.locations);
    if (!locations) {
      return NextResponse.json(
        {
          errors: [
            {
              field: 'locations',
              message: 'At least one complete location is required',
            },
          ],
        },
        { status: 400 },
      );
    }

    const organisation = await createOrganization({
      name,
      description,
      websiteUrl,
      categoryIds,
      locations,
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
