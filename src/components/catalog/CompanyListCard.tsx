'use client';

import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { routes } from '@/config/routes';
import type { Company } from '@/types/company';

type CompanyListCardProps = {
  company: Company;
};

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 shrink-0 text-gray-500"
    aria-hidden="true"
  >
    <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2" />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 shrink-0 text-gray-500"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

export function CompanyListCard({ company }: CompanyListCardProps) {
  const hasCategory = Boolean(company.category?.trim());
  const hasAddress = Boolean(company.primaryAddress?.trim());
  const hasWorkingHours = Boolean(company.workingHours?.trim());
  const hasDescription = Boolean(company.shortDescription?.trim());

  return (
    <Card className="rounded-2xl border-black p-4 transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#d9d9d9] text-base font-semibold text-gray-700">
            {company.name?.charAt(0).toUpperCase() || '?'}
          </div>

          <div className="min-w-0 space-y-2">
            {hasCategory && (
              <p className="text-sm text-gray-600">{company.category}</p>
            )}

            <h3 className="text-lg font-semibold">{company.name || '—'}</h3>

            {hasAddress && (
              <p className="flex items-start gap-2 text-sm text-gray-600">
                <LocationIcon />
                <span>{company.primaryAddress}</span>
              </p>
            )}

            {hasWorkingHours && (
              <p className="flex items-start gap-2 text-sm text-gray-600">
                <ClockIcon />
                <span>{company.workingHours}</span>
              </p>
            )}

            {hasDescription && (
              <p className="text-sm leading-relaxed text-gray-600">
                {company.shortDescription}
              </p>
            )}
          </div>
        </div>

        <div className="shrink-0 sm:pt-1">
          <Link
            href={routes.company(company.id)}
            className="inline-flex rounded-md bg-black px-4 py-2 text-sm text-white transition hover:opacity-80"
          >
            Детальніше
          </Link>
        </div>
      </div>
    </Card>
  );
}
