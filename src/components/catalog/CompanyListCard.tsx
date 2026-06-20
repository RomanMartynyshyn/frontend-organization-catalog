'use client';

import Image from 'next/image';
import Link from 'next/link';

import { routes } from '@/config/routes';
import { getCategoryIconSrc } from '@/lib/catalog-api/categoryIcon';
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
    className="h-4 w-4 shrink-0"
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

function formatWorkingHoursLabel(workingHours: string): string {
  const normalized = workingHours.trim();

  if (!normalized) {
    return '';
  }

  if (/24\s*\/\s*7|цілодобово/i.test(normalized)) {
    return 'Цілодобово';
  }

  const closingTimeMatch = normalized.match(/(\d{1,2}:\d{2})\s*$/);

  if (closingTimeMatch) {
    return `Відчинено до ${closingTimeMatch[1]}`;
  }

  return normalized;
}

export function CompanyListCard({ company }: CompanyListCardProps) {
  const categoryLabel = company.primaryCategoryName || company.category.trim();
  const displayAddress =
    company.streetAddress.trim() || company.primaryAddress.trim();
  const workingHoursLabel = company.workingHours
    ? formatWorkingHoursLabel(company.workingHours)
    : '';
  const hasDescription = Boolean(company.shortDescription?.trim());

  return (
    <article className="rounded-[24px] bg-[#c4c4c4] p-4 sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex w-[68px] shrink-0 flex-col items-center gap-1.5 sm:w-[92px] sm:gap-2.5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d9d9d9] sm:h-20 sm:w-20">
            <Image
              src={getCategoryIconSrc(company.categoryId)}
              alt={categoryLabel || company.name}
              width={28}
              height={28}
              className="h-5 w-5 sm:h-7 sm:w-7"
            />
          </div>

          {categoryLabel ? (
            <p className="max-w-[68px] text-center text-[10px] leading-[13px] text-black sm:max-w-[92px] sm:text-[11px] sm:leading-[14px]">
              {categoryLabel}
            </p>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 space-y-2 pt-0.5">
          <h3 className="break-words text-lg font-bold leading-tight text-black sm:text-xl md:text-[26px] md:leading-[1.15]">
            {company.name || '—'}
          </h3>

          {displayAddress ? (
            <p className="flex items-center gap-1.5 text-sm leading-snug text-black">
              <LocationIcon />
              <span>{displayAddress}</span>
            </p>
          ) : null}

          {workingHoursLabel ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black px-3 py-1 text-xs leading-none text-black">
              <ClockIcon />
              {workingHoursLabel}
            </span>
          ) : null}
        </div>
      </div>

      {hasDescription ? (
        <p className="mt-5 line-clamp-2 text-sm leading-[1.45] text-black">
          {company.shortDescription}
        </p>
      ) : null}

      <div className={hasDescription ? 'mt-5' : 'mt-6'}>
        <div className="flex justify-end">
          <Link
            href={routes.company(company.id)}
            className="inline-flex min-w-[148px] items-center justify-center rounded-2xl bg-black px-8 py-3 text-sm font-normal text-white transition hover:opacity-80"
          >
            Детальніше
          </Link>
        </div>
      </div>
    </article>
  );
}
