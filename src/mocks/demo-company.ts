import type { Company } from '@/types/company';

export const DEMO_COMPANY: Company = {
  slug: 'demo',
  name: 'ТОВ «Приклад Інновації»',
  edrpou: '12345678',
  shortDescription:
    'Демонстраційний запис організації для каркасу каталогу. Пізніше дані підставлятимуться з API.',
  rating: 4.3,
};

/** Єдине джерело списку для головної та lookup по slug. */
export const catalogCompanies: Company[] = [DEMO_COMPANY];
