export type CatalogCategory = {
  id: number;
  name: string;
};

export type CatalogAdminUnit = {
  adminUnitId: number;
  parentId: number;
  type: string | null;
  name: string;
};

export type CatalogOrganizationCategory = {
  id: number;
  name: string;
};

export type CatalogOrganizationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'archived'
  | string;

export type CatalogOrganizationContacts = {
  phone?: string | null;
  email?: string | null;
  phone_numbers?: string[];
};

export type CatalogSocialLinks = {
  instagram?: string | null;
  facebook?: string | null;
  telegram?: string | null;
};

export type CatalogLocation = {
  id: number;
  street: string | null;
  city: string;
  region: string;
  postCode: string | null;
  latitude: number | string;
  longitude: number | string;
  adminUnit?: string | null;
};

export type CatalogLocationInput = {
  street?: string;
  city: string;
  region: string;
  postCode?: string;
  latitude: number | string;
  longitude: number | string;
  adminUnitId?: number;
};

export type CreateOrganizationContacts = {
  email?: string;
  phoneNumbers?: string[];
};

export type CreateOrganizationSocialLinks = {
  facebook?: string;
  instagram?: string;
  telegram?: string;
};

export type CatalogOrganization = {
  id: number;
  name: string;
  description: string | null;
  websiteUrl: string | null;
  contacts: CatalogOrganizationContacts | null;
  socialLinks?: CatalogSocialLinks | null;
  sociaLinks?: CatalogSocialLinks | null;
  workingHours: string | null;
  status: CatalogOrganizationStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  rejectionReason: string | null;
  categories: CatalogOrganizationCategory[];
  locations: CatalogLocation[];
};

export type FetchOrganizationsParams = {
  categoryId?: number;
  adminUnitIds?: number[];
  limit?: number;
  offset?: number;
  search?: string;
  status?: CatalogOrganizationStatus;
};

export type UpdateOrganizationStatusPayload = {
  status: 'approved' | 'rejected' | 'archived';
  rejectionReason?: string | null;
};

export type PaginatedOrganizations = {
  items: CatalogOrganization[];
  hasMore: boolean;
};

export type CreateOrganizationPayload = {
  name: string;
  description?: string;
  websiteUrl?: string;
  workingHours?: string;
  contacts?: CreateOrganizationContacts;
  socialLinks?: CreateOrganizationSocialLinks;
  categoryIds: number[];
  locations?: CatalogLocationInput[];
};

export type ApiFieldError = {
  field: string;
  message: string;
};

export type ApiErrorResponse = {
  errors: ApiFieldError[];
};
