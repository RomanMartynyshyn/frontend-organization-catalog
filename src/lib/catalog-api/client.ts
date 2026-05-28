import type {
  CatalogCategory,
  CatalogOrganization, CreateOrganizationPayload,
} from '@/types/catalog-api';

const API_URL = process.env.API_URL || 'http://3458052.levelhst.web.hosting-test.net';

export class CatalogApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = 'CatalogApiError';
  }
}

async function catalogFetch<T>(path: string): Promise<{ data: T; status: number }> {
  const url = `${API_URL}${path}`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (response.status === 404) {
    return { data: null as T, status: 404 };
  }

  if (!response.ok) {
    throw new Error(
      `Catalog API request failed: ${response.status} ${response.statusText} (${url})`,
    );
  }

  const data = (await response.json()) as T;
  return { data, status: response.status };
}

async function catalogPost<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<{ data: TResponse; status: number }> {
  const url = `${API_URL}${path}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const responseText = await response.text();
  const data = responseText ? (JSON.parse(responseText) as TResponse) : (null as TResponse);

  if (!response.ok) {
    throw new CatalogApiError(
      `Catalog API request failed: ${response.status} ${response.statusText} (${url})`,
      response.status,
      data,
    );
  }

  return { data, status: response.status };
}

export async function fetchCategories(): Promise<CatalogCategory[]> {
  const { data } = await catalogFetch<CatalogCategory[]>('/api/categories');
  return data;
}

export async function createOrganization(
  payload: CreateOrganizationPayload,
): Promise<CatalogOrganization> {
  const { data } = await catalogPost<CatalogOrganization, CreateOrganizationPayload>(
    '/api/organizations',
    payload,
  );

  return data;
}

export async function fetchOrganizations(
  categoryId?: number,
): Promise<CatalogOrganization[]> {
  const query =
    categoryId !== undefined ? `?category_id=${encodeURIComponent(categoryId)}` : '';
  const { data } = await catalogFetch<CatalogOrganization[]>(
    `/api/organizations${query}`,
  );
  return data;
}

export async function fetchOrganizationById(
  id: number,
): Promise<CatalogOrganization | null> {
  const { data, status } = await catalogFetch<CatalogOrganization | null>(
    `/api/organizations/${id}`,
  );

  if (status === 404) {
    return null;
  }

  return data;
}
