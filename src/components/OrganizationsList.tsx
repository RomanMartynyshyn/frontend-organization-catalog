'use client';

import { useTranslation } from 'react-i18next';
import { CompanyListCard } from '@/components/catalog/CompanyListCard';
import type { Company } from '@/types/company';

export function OrganizationsList({ data }: { data: Company[] }) {
  const { t } = useTranslation();

  if (!data.length) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 text-center text-gray-500">
        {t('organizations.empty')}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6">
      {data.map((company) => (
        <CompanyListCard key={company.id} company={company} />
      ))}
    </div>
  );
}
