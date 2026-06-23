'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Modal } from '@/components/ui/modal';
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

function formatExtraAddressesLabel(count: number): string {
  const remainder10 = count % 10;
  const remainder100 = count % 100;

  if (remainder100 >= 11 && remainder100 <= 14) {
    return `+ ще ${count} адрес`;
  }

  if (remainder10 === 1) {
    return `+ ще ${count} адресу`;
  }

  if (remainder10 >= 2 && remainder10 <= 4) {
    return `+ ще ${count} адреси`;
  }

  return `+ ще ${count} адрес`;
}

export function CompanyListCard({ company }: CompanyListCardProps) {
  const [isAddressesModalOpen, setIsAddressesModalOpen] = useState(false);
  const categoryLabel = company.primaryCategoryName || company.category.trim();
  const addresses = company.addresses
    .map((address) => address.trim())
    .filter(Boolean);
  const displayAddress =
    company.streetAddress.trim() || company.primaryAddress.trim();
  const extraAddressCount = Math.max(addresses.length - 1, 0);
  const hasMoreAddresses = extraAddressCount > 0;
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

          {displayAddress || addresses.length > 0 ? (
            <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm leading-snug text-black">
              <LocationIcon />
              <span>{displayAddress || addresses[0]}</span>
              {hasMoreAddresses ? (
                <button
                  type="button"
                  onClick={() => setIsAddressesModalOpen(true)}
                  className="text-sm leading-snug text-black underline underline-offset-2 transition hover:opacity-70"
                  aria-haspopup="dialog"
                >
                  {formatExtraAddressesLabel(extraAddressCount)}
                </button>
              ) : null}
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

      <Modal
        isOpen={isAddressesModalOpen}
        onClose={() => setIsAddressesModalOpen(false)}
        className="max-w-md"
      >
        <div className="space-y-4">
          <h2 className="pr-8 text-lg font-bold text-black">
            {company.name || '—'} — адреси
          </h2>

          <ul className="max-h-[min(60vh,420px)] space-y-3 overflow-y-auto text-sm text-black">
            {addresses.map((address, index) => (
              <li key={`${company.id}-${index}`} className="flex items-start gap-2">
                <LocationIcon />
                <span>{address}</span>
              </li>
            ))}
          </ul>
        </div>
      </Modal>

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
