import type { Review } from '@/types/review';

export const mockReviews: Review[] = [
  {
    id: 1,
    companySlug: 'demo',
    name: 'Олена',
    rating: 5,
    text: 'Дуже якісна робота, швидко відповідають.',
    date: '2026-05-20',
  },
  {
    id: 2,
    companySlug: 'demo',
    name: 'Ігор',
    rating: 4,
    text: 'Хороша компанія, але є дрібні затримки.',
    date: '2026-05-18',
  },
  {
    id: 3,
    companySlug: 'demo',
    name: 'Марина',
    rating: 5,
    text: 'Все організовано на високому рівні.',
    date: '2026-05-17',
  },

  {
    id: 4,
    companySlug: 'it-academy',
    name: 'Марія',
    rating: 5,
    text: 'Навчання дуже структуроване, викладачі топ.',
    date: '2026-05-19',
  },
  {
    id: 5,
    companySlug: 'it-academy',
    name: 'Данило',
    rating: 4,
    text: 'Гарна база, але хотілося більше практики.',
    date: '2026-05-17',
  },
  {
    id: 6,
    companySlug: 'it-academy',
    name: 'Світлана',
    rating: 5,
    text: 'Дуже сильна програма навчання.',
    date: '2026-05-16',
  },
  {
    id: 7,
    companySlug: 'it-academy',
    name: 'Олег',
    rating: 4,
    text: 'Пояснюють доступно, але темп швидкий.',
    date: '2026-05-15',
  },

  {
    id: 8,
    companySlug: 'medical-center',
    name: 'Світлана',
    rating: 5,
    text: 'Дуже уважні лікарі, професійний підхід.',
    date: '2026-05-21',
  },
  {
    id: 9,
    companySlug: 'medical-center',
    name: 'Андрій',
    rating: 4,
    text: 'Все добре, але черга була довга.',
    date: '2026-05-16',
  },

  {
    id: 10,
    companySlug: 'edu-house',
    name: 'Наталія',
    rating: 5,
    text: 'Чудова освітня платформа, рекомендую.',
    date: '2026-05-22',
  },
];
