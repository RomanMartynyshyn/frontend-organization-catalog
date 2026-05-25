import { notFound } from 'next/navigation';
import { getCompanyRating } from '@/lib/companies/getCompanyRating';
import { mockReviews } from '@/mocks/mockReviews';
import { getCompanyById } from '@/lib/companies/getCompanyById';
import CompanyPageClient from './CompanyPageClient';

type CompanyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;

  const company = await getCompanyById(id);

  if (!company) {
    notFound();
  }

  const companyKey = String(company.id);
  const { rating: avgRating } = getCompanyRating(companyKey);

  const companyReviews = mockReviews.filter(
    (review) => review.companySlug === companyKey,
  );

  return (
    <CompanyPageClient
      company={company}
      avgRating={avgRating}
      companyReviews={companyReviews}
    />
  );
}
