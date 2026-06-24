'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { routes } from '@/config/routes';
// import { ReviewForm } from '@/components/company/ReviewForm';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RatingStarsDisplay } from '@/components/ui/RatingStars';
import { cn } from '@/lib/cn';
import type { Company } from '@/types/company';
import type { Review } from '@/types/review';
import Image from 'next/image';
import { getCategoryIconSrc } from '@/lib/catalog-api/categoryIcon';
import { CatalogOrganization  } from '@/types/catalog-api';


type Props = {
  company: Company;
  avgRating: number;
  companyReviews: Review[];
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
    className="mt-0.5 h-4 w-4 shrink-0 text-gray-500"
  >
    <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2" />
  </svg>
);

export default function CompanyPageClient({
  company,
  avgRating,
  companyReviews,
}: Props) {
  const { t } = useTranslation();

  return (
    <article className="space-y-8">
      <div className="mb-10">
        <Link
          href={routes.home}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'px-0 text-[#666666]',
          )}
        >
          {t('companyPage.back')}
        </Link>
        <span> / </span>
        <Link href={`/?categoryId=${company.categoryId}`}>
          {company.primaryCategoryName}
        </Link>
        <span> / </span>
        <span className="font-eUkraine text-[13px] leading-[18px] font-bold text-black">
          {company.name}
        </span>
      </div>

      <Card className="border-0 p-0">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* LEFT BLOCK */}
          <div className="shrink-0">
            <div className="mb-3 flex h-[176px] w-[176px] items-center justify-center rounded-full bg-gray-300 text-5xl font-bold text-gray-700">
              <Image
                src={getCategoryIconSrc(company.categoryId)}
                alt={company.category}
                width={48}
                height={48}
              />
              {/* {company.name?.charAt(0).toUpperCase()} */}
            </div>
            <p className="font-eUkraine text-center text-sm text-[13px] leading-[18px] font-normal">
              {company.category}
              {/* Мережа супермаркетів */}
            </p>
          </div>

          {/* RIGHT BLOCK */}
          <div className="flex flex-1 flex-col gap-5">
            {/* TITLE + RATING */}
            <div className="flex min-h-[742px] w-full max-w-[884px] flex-col gap-4 rounded-[20px] bg-white">
              <div className="flex h-auto min-h-[196px] w-full max-w-[884px] flex-col gap-5 rounded-[20px] bg-[#E7E7E7] p-10">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h1 className="font-eUkraine mb-2 text-[28px] leading-[32px] font-semibold text-black">
                      {company.name}
                    </h1>
                    <div>
                      <Image
                        src="/assets/icons/share.svg"
                        alt="Phone"
                        width={32}
                        height={32}
                      />
                    </div>
                  </div>
                  <div className="mb-5 flex items-center gap-1">
                    {/* <Image
                      src="/assets/icons/location_on.svg"
                      alt="Location"
                      width={24}
                      height={24}
                    /> */}
                    <div className="font-eUkraine text-[20px] leading-[24px] font-normal text-black">
                      {/* ФРАГМЕНТ, ЕСЛИ НУЖНО ВЫВОДИТЬ ВСЕ АДРЕСА */}

                      {company.addresses.map((addr, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Image
                            src="/assets/icons/location_on.svg"
                            alt="Location"
                            width={24}
                            height={24}
                          />
                          <p className="font-eUkraine text-[20px] leading-[24px] font-regular text-black">
                            {addr}
                          </p>
                        </div>
                      ))}
                      {/* {company.primaryAddress} */}
                    </div>
                  </div>

                  <div className="flex h-[32px] w-[185px] items-center gap-2 rounded-[20px] border border-black py-[7px] pr-[12px] pl-[8px]">
                    <Image
                      src="/assets/icons/radio_button_checked.svg"
                      alt="Clock"
                      width={16}
                      height={16}
                    />
                    <p className="font-eUkraine text-[13px] leading-[18px] font-normal text-black">
                      {/* Відчинено до */}
                      {company.workingHours}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex h-auto min-h-[196px] w-full max-w-[884px] flex-col gap-2 rounded-[20px] bg-[#E7E7E7] p-10">
                <div className="flex flex-col gap-2 space-y-3">
                  <h2 className="text-xl font-semibold">
                    {/* Про організацію */}
                    {t('companyPage.sections.description')}
                  </h2>

                  <p className="font-eUkraine mb-6 text-[16px] leading-[24px] font-light text-black">
                    {/* {company.shortDescription} */}
                    Мережа АТБ надає не лише базові послуги з роздрібної
                    торгівлі, а й пропонує зручну цифрову екосистему. Основні
                    послуги охоплюють доставку, онлайн-замовлення, спеціальні
                    банківські програми, послуги на касі та мобільні сервіси.
                  </p>
                </div>
                <div className="mb-6 flex flex-col gap-2 space-y-3">
                  <h2 className="mb-0 text-xl font-semibold">
                    Графік роботи
                    {/* {t('companyPage.sections.schedule')} */}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/icons/schedule.svg"
                      alt="Clock"
                      width={24}
                      height={24}
                    />
                    <p className="font-eUkraine text-[16px] leading-[24px] font-light text-black">
                      {/* Пн-Нд: */}
                      {company.workingHours}
                      {/* 05:00 - 23:00 */}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 space-y-3">
                  <h2 className="mb-0 text-xl font-semibold">
                    {t('companyPage.sections.contacts')}
                  </h2>
                  <div className="mb-0 flex items-start gap-2">
                    <Image
                      src="/assets/icons/call.svg"
                      alt="Phone"
                      width={24}
                      height={24}
                    />
                    <div className="flex flex-col">
                      <p className="font-eUkraine text-[16px] leading-[24px] font-light text-black">
                        0-800-50-04-15
                        {/* {company.contacts?.phone && (
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://${company.contacts.phone}`}
                              target="_blank"
                              className="hover:underline"
                            >
                              {company.contacts.p}
                            </a>
                          </div>
                        )} */}
                      </p>
                      <p className="font-eUkraine text-black-400 text-[13px] leading-[18px] font-light">
                        Дзвінки приймаються з 09:00 до 17:00
                      </p>
                    </div>
                  </div>
                  <div className="mb-0 flex items-center gap-2">
                    <Image
                      src="/assets/icons/mail.svg"
                      alt="Phone"
                      width={24}
                      height={24}
                    />
                    <p className="font-eUkraine text-[16px] leading-[24px] font-light text-black">
                      atb.office@atbmarket.com
                      {/* {company.contacts?.email && (
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://${company.contacts.email}`}
                            target="_blank"
                            className="hover:underline"
                          >
                            {company.contacts.email}
                          </a>
                        </div>
                      )} */}
                    </p>
                  </div>
                  <div className="mb-6 flex flex-col gap-3 text-sm text-gray-600">
                    {company.contacts?.website && (
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6 shrink-0"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M2 12h20" />
                          <path d="M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20" />
                        </svg>

                        <a
                          href={`https://${company.contacts.website}`}
                          target="_blank"
                          className="hover:underline"
                        >
                          {company.contacts.website}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <Image
                        src="/assets/icons/instagram.svg"
                        alt="Phone"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div>
                      <Image
                        src="/assets/icons/linkedin.svg"
                        alt="Phone"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div>
                      <Image
                        src="/assets/icons/telegram.svg"
                        alt="Phone"
                        width={32}
                        height={32}
                      />
                    </div>
                    <Image
                      src="/assets/icons/viber.svg"
                      alt="Phone"
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </article>
  );
}
