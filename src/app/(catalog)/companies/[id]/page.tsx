import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCompanyById } from '@/lib/companies/getCompanyById';
import CompanyPageClient from './CompanyPageClient';

export const metadata: Metadata = {
  title: 'Company Details',
};

type CompanyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;
  const company = await getCompanyById(id);

  if (!company) {
    notFound();
  }

  return <CompanyPageClient company={company} />;
}
