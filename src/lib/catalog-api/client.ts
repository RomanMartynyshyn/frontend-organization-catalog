import type {
  CatalogCategory,
  CatalogOrganization,
} from '@/types/catalog-api';

const API_URL = process.env.API_URL!.replace(/\/$/, '');

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

export async function fetchCategories(): Promise<CatalogCategory[]> {
  const { data } = await catalogFetch<CatalogCategory[]>('/api/categories');
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
