import { NextRequest, NextResponse } from 'next/server';

import {
  CatalogApiError,
  createOrganization,
  fetchOrganizations,
} from '@/lib/catalog-api/client';
import { ORGANIZATIONS_PAGE_SIZE } from '@/lib/constants';
import type {
  ApiFieldError,
  CatalogLocationInput,
  CreateOrganizationPayload,
} from '@/types/catalog-api';

export const dynamic = 'force-dynamic';

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

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateLocations(
  locations: CatalogLocationInput[] | undefined,
): { locations: CatalogLocationInput[] | null; errors: ApiFieldError[] } {
  const errors: ApiFieldError[] = [];

  if (!Array.isArray(locations) || locations.length < 1) {
    return {
      locations: null,
      errors: [
        {
          field: 'locations',
          message: 'Потрібна хоча б одна адреса',
        },
      ],
    };
  }

  const validated: CatalogLocationInput[] = [];

  locations.forEach((location, index) => {
    const prefix = `locations.${index}`;
    const street = location.street?.trim();
    const city = location.city?.trim();
    const region = location.region?.trim();
    const postCode = location.postCode?.trim();
    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);
    const districtId =
      location.districtId !== undefined ? Number(location.districtId) : undefined;

    if (!city) {
      errors.push({
        field: `${prefix}.city`,
        message: 'Місто є обов\'язковим',
      });
    } else if (city.length > 50) {
      errors.push({
        field: `${prefix}.city`,
        message: 'Місто не може перевищувати 50 символів',
      });
    }

    if (!region) {
      errors.push({
        field: `${prefix}.region`,
        message: 'Область є обов\'язковою',
      });
    } else if (region.length > 50) {
      errors.push({
        field: `${prefix}.region`,
        message: 'Область не може перевищувати 50 символів',
      });
    }

    if (street && street.length > 50) {
      errors.push({
        field: `${prefix}.street`,
        message: 'Адреса не може перевищувати 50 символів',
      });
    }

    if (postCode && postCode.length !== 5) {
      errors.push({
        field: `${prefix}.postCode`,
        message: 'Індекс має містити 5 цифр',
      });
    }

    if (
      Number.isNaN(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      errors.push({
        field: `${prefix}.latitude`,
        message: 'Широта має бути числом від -90 до 90',
      });
    }

    if (
      Number.isNaN(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      errors.push({
        field: `${prefix}.longitude`,
        message: 'Довгота має бути числом від -180 до 180',
      });
    }

    if (
      districtId !== undefined &&
      (!Number.isInteger(districtId) || districtId <= 0)
    ) {
      errors.push({
        field: `${prefix}.districtId`,
        message: 'Невірний район',
      });
    }

    if (
      city &&
      region &&
      !Number.isNaN(latitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      !Number.isNaN(longitude) &&
      longitude >= -180 &&
      longitude <= 180 &&
      (!postCode || postCode.length === 5)
    ) {
      validated.push({
        ...(street ? { street } : {}),
        city,
        region,
        ...(postCode ? { postCode } : {}),
        latitude,
        longitude,
        ...(districtId ? { districtId } : {}),
      });
    }
  });

  if (errors.length > 0) {
    return { locations: null, errors };
  }

  return { locations: validated, errors: [] };
}

export async function GET(request: NextRequest) {
  const categoryIdParam = request.nextUrl.searchParams.get('categoryId');
  const districtParams = request.nextUrl.searchParams.getAll('districtId');
  const limitParam = request.nextUrl.searchParams.get('limit');
  const offsetParam = request.nextUrl.searchParams.get('offset');
  const searchParam = request.nextUrl.searchParams.get('search')?.trim();

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
      search: searchParam || undefined,
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
    const errors: ApiFieldError[] = [];
    const name = payload.name?.trim();
    const description = payload.description?.trim() ?? '';
    const websiteUrl = payload.websiteUrl?.trim() ?? '';
    const workingHours = payload.workingHours?.trim() ?? '';
    const categoryIds = payload.categoryIds;

    if (!name || name.length < 2 || name.length > 255) {
      errors.push({
        field: 'name',
        message: 'Назва має містити від 2 до 255 символів',
      });
    }

    if (description.length > 1000) {
      errors.push({
        field: 'description',
        message: 'Опис не може перевищувати 1000 символів',
      });
    }

    if (websiteUrl !== '' && !isValidHttpsUrl(websiteUrl)) {
      errors.push({
        field: 'websiteUrl',
        message: 'Сайт має бути коректним HTTPS-посиланням',
      });
    }

    if (workingHours.length > 100) {
      errors.push({
        field: 'workingHours',
        message: 'Графік роботи не може перевищувати 100 символів',
      });
    }

    if (!Array.isArray(categoryIds) || categoryIds.length < 1 || categoryIds.length > 5) {
      errors.push({
        field: 'categoryIds',
        message: 'Оберіть від 1 до 5 категорій',
      });
    } else if (
      categoryIds.some(
        (categoryId) => !Number.isInteger(categoryId) || categoryId <= 0,
      )
    ) {
      errors.push({
        field: 'categoryIds',
        message: 'Кожна категорія має бути коректним ідентифікатором',
      });
    }

    const email = payload.contacts?.email?.trim() ?? '';

    if (email && !isValidEmail(email)) {
      errors.push({
        field: 'contacts.email',
        message: 'Введіть коректну email-адресу',
      });
    }

    const instagram = payload.socialLinks?.instagram?.trim() ?? '';

    if (instagram && !isValidHttpsUrl(instagram)) {
      errors.push({
        field: 'socialLinks.instagram',
        message: 'Instagram має бути коректним HTTPS-посиланням',
      });
    }

    const facebook = payload.socialLinks?.facebook?.trim() ?? '';

    if (facebook && !isValidHttpsUrl(facebook)) {
      errors.push({
        field: 'socialLinks.facebook',
        message: 'Facebook має бути коректним HTTPS-посиланням',
      });
    }

    const { locations, errors: locationErrors } = validateLocations(payload.locations);
    errors.push(...locationErrors);

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const organisation = await createOrganization({
      name: name!,
      description: description || undefined,
      websiteUrl: websiteUrl || undefined,
      workingHours: workingHours || undefined,
      contacts:
        email || payload.contacts?.phoneNumbers?.length
          ? {
              ...(email ? { email } : {}),
              ...(payload.contacts?.phoneNumbers?.length
                ? { phoneNumbers: payload.contacts.phoneNumbers }
                : {}),
            }
          : undefined,
      socialLinks:
        instagram || facebook || payload.socialLinks?.telegram
          ? {
              ...(instagram ? { instagram } : {}),
              ...(facebook ? { facebook } : {}),
              ...(payload.socialLinks?.telegram
                ? { telegram: payload.socialLinks.telegram }
                : {}),
            }
          : undefined,
      categoryIds: categoryIds!,
      locations: locations!,
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
