'use client';

import { CompanyListCard } from '@/components/catalog/CompanyListCard';
import type { Company } from '@/types/company';

export function OrganizationsList({ data }: { data: Company[] }) {
  if (!data.length) {
    return (
      <div className="py-10 text-center text-gray-500">
        Організацій не знайдено
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((company) => (
        <CompanyListCard key={company.id} company={company} />
      ))}
    </div>
  );
}
