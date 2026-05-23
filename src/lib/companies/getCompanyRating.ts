import { mockReviews } from '@/mocks/mockReviews';

export function getCompanyRating(slug: string) {
  const reviews = mockReviews.filter((r) => r.companySlug === slug);

  const count = reviews.length;

  const avg =
    count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  return {
    rating: avg,
    count,
  };
}
