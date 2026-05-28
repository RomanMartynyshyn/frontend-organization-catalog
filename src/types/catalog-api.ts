export type CatalogCategory = {
  id: number;
  name: string;
};

export type CatalogOrganizationCategory = {
  id: number;
  name: string;
};

export type CatalogOrganizationStatus = 'approved' | string;

export type CatalogOrganization = {
  id: number;
  name: string;
  description: string;
  websiteUrl: string;
  status: CatalogOrganizationStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  rejectionReason: string | null;
  categories: CatalogOrganizationCategory[];
};

export type CreateOrganizationPayload = {
  name: string;
  description: string;
  websiteUrl: string;
  categoryIds: number[];
};
