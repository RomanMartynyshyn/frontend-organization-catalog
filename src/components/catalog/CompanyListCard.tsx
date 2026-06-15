'use client';

import Link from 'next/link';

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
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 shrink-0 text-gray-600"
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
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5 shrink-0"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

const StoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-gray-700"
    aria-hidden="true"
  >
    <path d="M6 7h12l-1 12H7L6 7z" />
    <path d="M9 7V5a3 3 0 0 1 6 0v2" />
  </svg>
);

export function CompanyListCard({ company }: CompanyListCardProps) {
  const hasCategory = Boolean(company.category?.trim());
  const hasAddress = Boolean(company.primaryAddress?.trim());
  const hasWorkingHours = Boolean(company.workingHours?.trim());
  const hasDescription = Boolean(company.shortDescription?.trim());

  return (
    <article className="rounded-2xl bg-[#c4c4c4] p-5">
      <div className="flex gap-5">
        <div className="flex w-24 shrink-0 flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d9d9d9]">
            <StoreIcon />
          </div>

          {hasCategory && (
            <p className="text-center text-xs leading-snug text-gray-700">
              {company.category}
            </p>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-2">
            <h3 className="text-xl font-bold leading-tight">
              {company.name || '—'}
            </h3>

            {hasAddress && (
              <p className="flex items-start gap-2 text-sm text-gray-700">
                <LocationIcon />
                <span>{company.primaryAddress}</span>
              </p>
            )}

            {hasWorkingHours && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-black/50 px-3 py-1 text-xs text-gray-700">
                <ClockIcon />
                {company.workingHours}
              </span>
            )}
          </div>

          {hasDescription && (
            <p className="text-sm leading-relaxed text-gray-600">
              {company.shortDescription}
            </p>
          )}

          <div className="flex justify-end pt-1">
            <Link
              href={routes.company(company.id)}
              className="inline-flex rounded-md bg-black px-5 py-2 text-sm text-white transition hover:opacity-80"
            >
              Детальніше
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
