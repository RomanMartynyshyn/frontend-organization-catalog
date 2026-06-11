export type CatalogCategory = {
  id: number;
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
};

/** Backend field name is `sociaLinks` (maps to social_links in DB). */
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
};

export type CatalogLocationInput = {
  street: string;
  city: string;
  region: string;
  postCode: string;
  latitude: number | string;
  longitude: number | string;
};

export type CatalogOrganization = {
  id: number;
  name: string;
  description: string | null;
  websiteUrl: string | null;
  contacts: CatalogOrganizationContacts | null;
  sociaLinks: CatalogSocialLinks | null;
  workingHours: string | null;
  status: CatalogOrganizationStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  rejectionReason: string | null;
  categories: CatalogOrganizationCategory[];
  locations: CatalogLocation[];
};

export type CreateOrganizationPayload = {
  name: string;
  description?: string;
  websiteUrl?: string;
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
