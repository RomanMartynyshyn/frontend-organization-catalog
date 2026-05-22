export type Company = {
  id: number;
  slug: string;
  name: string;
  edrpou: string;
  shortDescription: string;
  rating: number;
  category: string;
  status: CompanyStatus;
};

export type CompanyRaw = {
  id: string | number;
  name?: string;
  category?: string;
  shortDescription?: string;
  description?: string;
  status?: string;
  rating?: number;
  slug: string;
};

export const statusLabels = {
  active: 'Активна',
  inactive: 'Неактивна',
  pending: 'Очікує',
  draft: 'Чернетка',
  blocked: 'Заблокована',
} as const;

export type CompanyStatus = keyof typeof statusLabels;
