import type {
  CatalogOrganizationStatus,
  PaginatedOrganizations,
  UpdateOrganizationStatusPayload,
} from '@/types/catalog-api';

const ADMIN_ORGANIZATIONS_PAGE_SIZE = 15;

type FetchAdminOrganizationsParams = {
  status?: CatalogOrganizationStatus;
  offset?: number;
  limit?: number;
  search?: string;
};

export async function fetchAdminOrganizationsPage(
  params: FetchAdminOrganizationsParams = {},
): Promise<PaginatedOrganizations> {
  const searchParams = new URLSearchParams({
    limit: String(params.limit ?? ADMIN_ORGANIZATIONS_PAGE_SIZE),
    offset: String(params.offset ?? 0),
  });

  if (params.status) {
    searchParams.set('status', params.status);
  }

  const normalizedSearch = params.search?.trim();

  if (normalizedSearch) {
    searchParams.set('search', normalizedSearch);
  }

  const response = await fetch(`/api/admin/organizations?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch admin organizations');
  }

  return (await response.json()) as PaginatedOrganizations;
}

export async function updateAdminOrganizationStatus(
  id: number,
  payload: UpdateOrganizationStatusPayload,
): Promise<void> {
  const response = await fetch(`/api/admin/organizations/${id}/status`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update organization status');
  }
}

export const adminOrganizationStatusLabels = {
  pending: 'Очікують модерації',
  approved: 'Активні',
  rejected: 'Відхилені',
  archived: 'Архів',
} as const;

export type AdminOrganizationStatusTab = keyof typeof adminOrganizationStatusLabels;
