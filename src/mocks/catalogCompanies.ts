import type { Company } from '@/types/company';

export const organizations: Company[] = [
  {
    id: 1,
    slug: 'demo',
    name: 'ТОВ «Приклад Інновації»',
    edrpou: '12345678',
    shortDescription: 'Демонстраційний запис організації для каркасу каталогу.',
    rating: 4.3,
    category: 'IT',
    status: 'active',
  },
  {
    id: 2,
    slug: 'it-academy',
    name: 'IT Academy',
    edrpou: '12345678',
    shortDescription: 'IT education center',
    rating: 4.5,
    category: 'IT',
    status: 'blocked',
  },
  {
    id: 3,
    slug: 'medical-center',
    name: 'Medical Center',
    edrpou: '87654321',
    shortDescription: 'Medical services',
    rating: 4.2,
    category: 'medicine',
    status: 'inactive',
  },
  {
    id: 4,
    slug: 'edu-house',
    name: 'Edu House',
    edrpou: '11223344',
    shortDescription: 'Education platform',
    rating: 4.8,
    category: 'education',
    status: 'pending',
  },
];
