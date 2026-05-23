import { notFound } from 'next/navigation';
import { getCompanyRating } from '@/lib/companies/getCompanyRating';
import { mockReviews } from '@/mocks/mockReviews';
import { getCompanyBySlug } from '@/lib/companies/getCompanyBySlug';
import CompanyPageClient from './CompanyPageClient';

type CompanyPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;

  const company = await getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  const { rating: avgRating } = getCompanyRating(company.slug);

  const companyReviews = mockReviews.filter(
    (review) => review.companySlug === company.slug,
  );

  return (
    <CompanyPageClient
      company={company}
      avgRating={avgRating}
      companyReviews={companyReviews}
    />
  );
}
