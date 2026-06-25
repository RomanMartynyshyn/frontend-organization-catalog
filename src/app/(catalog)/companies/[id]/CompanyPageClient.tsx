'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import { ShareUrlMenu } from '@/components/ShareUrlMenu';
import { routes } from '@/config/routes';
// import { getCategoryIconSrc } from '@/lib/catalog-api/categoryIcon';
import { getCategoryIconId } from '@/lib/catalog-api/categoryIcon';
import {
  formatWorkingHoursBadge,
  formatWorkingHoursSchedule,
} from '@/lib/companies/workingHours';
import type { Company, CompanyLocation } from '@/types/company';

type CompanyPageClientProps = {
  company: Company;
};

type SocialLink = {
  href: string;
  label: string;
  iconSrc?: string;
};

const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 shrink-0 text-black"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 shrink-0 text-black"
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

function buildWebsiteHref(website: string): string {
  const trimmed = website.trim();

  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function buildSocialLinks(company: Company): SocialLink[] {
  const links: SocialLink[] = [];

  if (company.contacts.instagram) {
    links.push({
      href: company.contacts.instagram,
      iconSrc: '/assets/icons/instagram.svg',
      label: 'Instagram',
    });
  }

  if (company.contacts.facebook) {
    links.push({
      href: company.contacts.facebook,
      label: 'Facebook',
    });
  }

  if (company.contacts.telegram) {
    links.push({
      href: company.contacts.telegram,
      iconSrc: '/assets/icons/telegram.svg',
      label: 'Telegram',
    });
  }

  return links;
}

export default function CompanyPageClient({ company }: CompanyPageClientProps) {
  const locations = useMemo<CompanyLocation[]>(
    () =>
      company.locations.length > 0
        ? company.locations
        : company.addresses.map((address, index) => ({
            id: index,
            address,
            street: address.split(',')[0]?.trim() || address,
            district: null,
          })),
    [company.addresses, company.locations],
  );

  const categoriesLabel = company.category.trim();
  const description = company.shortDescription.trim();
  const workingHoursBadge = company.workingHours
    ? formatWorkingHoursBadge(company.workingHours)
    : '';
  const workingHoursSchedule = company.workingHours
    ? formatWorkingHoursSchedule(company.workingHours)
    : '';
  const phones = company.contacts.phones;
  const email = company.contacts.email.trim();
  const website = company.contacts.website.trim();
  const socialLinks = buildSocialLinks(company);
  const hasContactsSection =
    phones.length > 0 || Boolean(email) || Boolean(website) || socialLinks.length > 0;
  const hasDetailsSection =
    Boolean(description) || Boolean(workingHoursSchedule) || hasContactsSection;

  return (
    <article className="space-y-8">
      <nav className="mb-10 text-sm" aria-label="Breadcrumb">
        <Link href={routes.home} className="text-black hover:underline">
          Головна
        </Link>
        {categoriesLabel && company.categoryId ? (
          <>
            <span className="text-[#666666]"> / </span>
            <Link
              href={`/?categoryId=${company.categoryId}`}
              className="text-black hover:underline"
            >
              {categoriesLabel}
            </Link>
          </>
        ) : categoriesLabel ? (
          <>
            <span className="text-[#666666]"> / </span>
            <span className="text-black">{categoriesLabel}</span>
          </>
        ) : null}
        <span className="text-[#666666]"> / </span>
        <span className="font-eUkraine text-[13px] leading-[18px] font-bold text-black">
          {company.name}
        </span>
      </nav>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="shrink-0">
          <div className="mb-3 flex h-[176px] w-[176px] items-center justify-center rounded-full bg-[#AEEAD7]">
            {/* <Image
                src={getCategoryIconSrc(company.categoryId)}
                alt={categoriesLabel || company.name}
                width={48}
                height={48}
              /> */}

            <svg className="h-12 w-12 text-[#1B224B]" fill="currentColor">
              <use
                href={`/assets/icons/sprite.svg#${getCategoryIconId(Number(company.categoryId))}`}
              />
            </svg>
          </div>
          {categoriesLabel ? (
            <p className="font-eUkraine max-w-[176px] text-center text-[13px] leading-[18px] font-normal text-black">
              {categoriesLabel}
            </p>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex w-full flex-col gap-5 rounded-[20px] bg-[#ECEEF8] p-6 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-eUkraine text-[28px] leading-[32px] font-semibold text-black">
                {company.name}
              </h1>
              <ShareUrlMenu title={company.name}>
                <Image
                  src="/assets/icons/share.svg"
                  alt=""
                  width={32}
                  height={32}
                  aria-hidden
                />
              </ShareUrlMenu>
            </div>

            {locations.length > 0 ? (
              <div className="space-y-3">
                {locations.map((location) => (
                  <div key={location.id} className="flex items-start gap-2">
                    <Image
                      src="/assets/icons/location_on.svg"
                      alt=""
                      width={24}
                      height={24}
                      className="mt-0.5 shrink-0"
                      aria-hidden
                    />
                    <div className="space-y-1">
                      <p className="font-eUkraine text-[20px] leading-[24px] font-normal text-black">
                        {location.address}
                      </p>
                      {location.district ? (
                        <p className="font-eUkraine text-[14px] leading-[20px] font-light text-[#666666]">
                          {location.district}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {workingHoursBadge ? (
              <div className="inline-flex h-8 w-fit items-center gap-2 rounded-[20px] border border-[#15513E] py-[7px] pr-3 pl-2">
                {/* <Image
                  src="/assets/icons/radio_button_checked.svg"
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden
                /> */}

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="text-[#15513E]"
                  aria-hidden="true"
                >
                  <mask
                    id="mask0_3017_1452"
                    style={{ maskType: 'alpha' }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="16"
                    height="16"
                  >
                    <rect width="16" height="16" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_3017_1452)">
                    <path
                      d="M10.3585 10.3584C11.0085 9.70837 11.3335 8.92226 11.3335 8.00004C11.3335 7.07782 11.0085 6.29171 10.3585 5.64171C9.7085 4.99171 8.92238 4.66671 8.00016 4.66671C7.07794 4.66671 6.29183 4.99171 5.64183 5.64171C4.99183 6.29171 4.66683 7.07782 4.66683 8.00004C4.66683 8.92226 4.99183 9.70837 5.64183 10.3584C6.29183 11.0084 7.07794 11.3334 8.00016 11.3334C8.92238 11.3334 9.7085 11.0084 10.3585 10.3584ZM8.00016 14.6667C7.07794 14.6667 6.21127 14.4917 5.40016 14.1417C4.58905 13.7917 3.8835 13.3167 3.2835 12.7167C2.6835 12.1167 2.2085 11.4112 1.8585 10.6C1.5085 9.78893 1.3335 8.92226 1.3335 8.00004C1.3335 7.07782 1.5085 6.21115 1.8585 5.40004C2.2085 4.58893 2.6835 3.88337 3.2835 3.28337C3.8835 2.68337 4.58905 2.20837 5.40016 1.85837C6.21127 1.50837 7.07794 1.33337 8.00016 1.33337C8.92238 1.33337 9.78905 1.50837 10.6002 1.85837C11.4113 2.20837 12.1168 2.68337 12.7168 3.28337C13.3168 3.88337 13.7918 4.58893 14.1418 5.40004C14.4918 6.21115 14.6668 7.07782 14.6668 8.00004C14.6668 8.92226 14.4918 9.78893 14.1418 10.6C13.7918 11.4112 13.3168 12.1167 12.7168 12.7167C12.1168 13.3167 11.4113 13.7917 10.6002 14.1417C9.78905 14.4917 8.92238 14.6667 8.00016 14.6667ZM8.00016 13.3334C9.48905 13.3334 10.7502 12.8167 11.7835 11.7834C12.8168 10.75 13.3335 9.48893 13.3335 8.00004C13.3335 6.51115 12.8168 5.25004 11.7835 4.21671C10.7502 3.18337 9.48905 2.66671 8.00016 2.66671C6.51127 2.66671 5.25016 3.18337 4.21683 4.21671C3.1835 5.25004 2.66683 6.51115 2.66683 8.00004C2.66683 9.48893 3.1835 10.75 4.21683 11.7834C5.25016 12.8167 6.51127 13.3334 8.00016 13.3334Z"
                      fill="currentColor"
                    />
                  </g>
                </svg>
                <p className="font-eUkraine text-[13px] leading-[18px] font-normal text-[#15513E]">
                  {workingHoursBadge}
                </p>
              </div>
            ) : null}
          </div>

          {hasDetailsSection ? (
            <div className="flex w-full flex-col gap-6 rounded-[20px] bg-[#ECEEF8] p-6 sm:p-10">
              {description ? (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-black">
                    Про організацію
                  </h2>
                  <p className="font-eUkraine text-[16px] leading-[24px] font-light text-black">
                    {description}
                  </p>
                </div>
              ) : null}

              {workingHoursSchedule ? (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-black">
                    Графік роботи
                  </h2>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/icons/schedule.svg"
                      alt=""
                      width={24}
                      height={24}
                      aria-hidden
                    />
                    <p className="font-eUkraine text-[16px] leading-[24px] font-light text-black">
                      {workingHoursSchedule}
                    </p>
                  </div>
                </div>
              ) : null}

              {hasContactsSection ? (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-black">Контакти</h2>

                  {phones.map((phone) => (
                    <div key={phone} className="flex items-start gap-2">
                      <Image
                        src="/assets/icons/call.svg"
                        alt=""
                        width={24}
                        height={24}
                        className="mt-0.5 shrink-0"
                        aria-hidden
                      />
                      <a
                        href={`tel:${phone.replace(/\s/g, '')}`}
                        className="font-eUkraine text-[16px] leading-[24px] font-light text-black hover:underline"
                      >
                        {phone}
                      </a>
                    </div>
                  ))}

                  {email ? (
                    <div className="flex items-center gap-2">
                      <Image
                        src="/assets/icons/mail.svg"
                        alt=""
                        width={24}
                        height={24}
                        aria-hidden
                      />
                      <a
                        href={`mailto:${email}`}
                        className="font-eUkraine text-[16px] leading-[24px] font-light text-black hover:underline"
                      >
                        {email}
                      </a>
                    </div>
                  ) : null}

                  {website ? (
                    <div className="flex items-center gap-2">
                      <GlobeIcon />
                      <a
                        href={buildWebsiteHref(website)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-eUkraine text-[16px] leading-[24px] font-light text-black hover:underline"
                      >
                        {website}
                      </a>
                    </div>
                  ) : null}

                  {socialLinks.length > 0 ? (
                    <div className="flex items-center gap-3 pt-1">
                      {socialLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={link.label}
                          className="transition hover:opacity-80"
                        >
                          {link.iconSrc ? (
                            <Image
                              src={link.iconSrc}
                              alt=""
                              width={32}
                              height={32}
                              aria-hidden
                            />
                          ) : (
                            <FacebookIcon />
                          )}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
