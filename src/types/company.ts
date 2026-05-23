export type Company = {
  id: number;
  slug: string;
  name: string;
  edrpou: string;
  shortDescription: string;
  rating: number;
  category: string;
  status: CompanyStatus;
  addresses: string[];
  contacts: {
    website: string;
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
    telegram: string;
  };
};

export const statusLabels = {
  active: 'Активна',
  inactive: 'Неактивна',
  pending: 'Очікує',
  draft: 'Чернетка',
  blocked: 'Заблокована',
} as const;

export type CompanyStatus = keyof typeof statusLabels;
