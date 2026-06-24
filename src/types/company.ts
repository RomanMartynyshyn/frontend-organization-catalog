export type CompanyLocation = {
  id: number;
  address: string;
  street: string;
  district: string | null;
};

export type Company = {
  id: number;
  slug: string;
  name: string;
  edrpou: string;
  shortDescription: string;
  rating: number;
  category: string;
  categoryId: number | null;
  primaryCategoryName: string;
  status: CompanyStatus;
  workingHours?: string;
  regions: string[];
  primaryAddress: string;
  streetAddress: string;
  addresses: string[];
  locations: CompanyLocation[];
  contacts: {
    website: string;
    phone: string;
    phones: string[];
    email: string;
    instagram: string;
    facebook: string;
    telegram: string;
  };
};

export type CompanyListItem = Company & {
  listKey: string;
};

export const statusLabels = {
  active: 'Активна',
  inactive: 'Неактивна',
  pending: 'Очікує',
  draft: 'Чернетка',
  blocked: 'Заблокована',
} as const;

export type CompanyStatus = keyof typeof statusLabels;
