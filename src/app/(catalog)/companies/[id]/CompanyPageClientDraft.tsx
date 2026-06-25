'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import { ShareUrlMenu } from '@/components/ShareUrlMenu';
import { routes } from '@/config/routes';
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
          <div className="mb-3 flex h-[176px] w-[176px] items-center justify-center rounded-full bg-[#E7E7E7]">
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
          <div className="flex w-full flex-col gap-5 rounded-[20px] bg-[#E7E7E7] p-6 sm:p-10">
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
              <div className="inline-flex h-8 w-fit items-center gap-2 rounded-[20px] border border-black py-[7px] pr-3 pl-2">
                <Image
                  src="/assets/icons/radio_button_checked.svg"
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden
                />
                <p className="font-eUkraine text-[13px] leading-[18px] font-normal text-black">
                  {workingHoursBadge}
                </p>
              </div>
            ) : null}
          </div>

          {hasDetailsSection ? (
            <div className="flex w-full flex-col gap-6 rounded-[20px] bg-[#E7E7E7] p-6 sm:p-10">
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
