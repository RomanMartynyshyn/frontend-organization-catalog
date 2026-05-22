'use client';

import Link from 'next/link';
import type { Company } from '@/types/company';
import { routes } from '@/config/routes';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { RatingStarsDisplay } from '@/components/ui/RatingStars';
import { useTranslation } from 'react-i18next';

type CompanyListCardProps = {
  company: Company;
};

export function CompanyListCard({ company }: CompanyListCardProps) {
  const { t } = useTranslation();

  const statusKey = company.status ?? 'unknown';

  return (
    <Card className="w-full transition-shadow hover:shadow-md">
      <div className="flex w-full flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {/* AVATAR */}
        <div className="flex-shrink-0">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-300 text-base font-semibold text-gray-700">
            {company.name?.[0]}
          </div>
        </div>

        {/* TEXT BLOCK */}
        <div className="flex flex-1 flex-col">
          <CardTitle className="text-lg">{company.name || '—'}</CardTitle>

          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-3 text-sm">
            <span>{company.category ?? 'Категорія'}</span>

            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
              {t(`company.status.${statusKey}`)}
            </span>

            <RatingStarsDisplay
              value={company.rating ?? 0}
              fractional
              ariaLabel={`Рейтинг ${company.rating ?? 0} з 5`}
            />
          </div>

          <CardContent className="p-0 pt-2">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {company.shortDescription || 'Опис відсутній'}
            </p>
          </CardContent>
        </div>

        {/* BUTTON */}
        <div className="mt-2 flex-shrink-0 sm:mt-0">
          <Link
            href={routes.company(company.slug)}
            className="inline-flex rounded-md bg-black px-4 py-2 text-sm text-white hover:opacity-80"
          >
            {t('company.details')}
          </Link>
        </div>
      </div>
    </Card>
  );
}
