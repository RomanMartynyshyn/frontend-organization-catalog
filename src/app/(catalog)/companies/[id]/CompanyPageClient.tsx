'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { routes } from '@/config/routes';
import { ReviewForm } from '@/components/company/ReviewForm';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RatingStarsDisplay } from '@/components/ui/RatingStars';
import { cn } from '@/lib/cn';
import type { Company } from '@/types/company';
import type { Review } from '@/types/review';

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
      <div>
        <Link
          href={routes.home}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'px-0 text-black',
          )}
        >
          {t('companyPage.back')}
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* LEFT BLOCK */}
          <div className="shrink-0">
            <div className="flex h-[193px] w-[193px] items-center justify-center rounded-full bg-gray-300 text-5xl font-bold text-gray-700">
              {company.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* RIGHT BLOCK */}
          <div className="flex flex-1 flex-col gap-5">
            {/* TITLE + RATING */}
            <div className="space-y-2">
              <h1 className="text-foreground text-3xl font-bold">
                {company.name}
              </h1>

              <div className="flex items-center gap-2">
                <RatingStarsDisplay
                  value={avgRating}
                  size="md"
                  fractional
                  ariaLabel={`Рейтинг ${avgRating.toFixed(1)} з 5`}
                />

                <span className="text-sm text-gray-600">
                  {avgRating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-3">
              <div className="rounded-xl border px-4 py-2">
                <p className="font-medium">{company.category}</p>
              </div>

              <div className="rounded-xl border px-4 py-2">
                <p className="font-medium">{company.status}</p>
              </div>

              <Link
                href="#review-form"
                className={cn(
                  buttonVariants({ variant: 'primary' }),
                  'border border-black bg-white text-black transition-colors hover:bg-black hover:text-white',
                )}
              >
                {t('companyPage.addReviewButton')}
              </Link>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl font-semibold">
                {t('companyPage.sections.description')}
              </h2>

              <p className="text-muted leading-relaxed">
                {company.shortDescription}
              </p>
            </div>

            {/* BRANCHES */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl font-semibold">
                {t('companyPage.sections.branches')}
              </h2>

              <div className="flex flex-col gap-2 text-sm text-gray-600">
                {company.addresses?.map((address: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <LocationIcon />
                    <span>{address}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTACTS (SVG НЕ ТРОГАВ — ЗАЛИШЕНО ЯК Є) */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl font-semibold">
                {t('companyPage.sections.contacts')}
              </h2>

              <div className="flex flex-col gap-3 text-sm text-gray-600">
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
                      className="h-4 w-4 shrink-0"
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

                {company.contacts?.phone && (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 shrink-0"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L9 10a16 16 0 0 0 6 6l.67-1.12a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92z" />
                    </svg>

                    <a
                      href={`tel:${company.contacts.phone}`}
                      className="hover:underline"
                    >
                      {company.contacts.phone}
                    </a>
                  </div>
                )}

                {company.contacts?.email && (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 shrink-0"
                    >
                      <path d="M4 4h16v16H4z" />
                      <path d="m22 6-10 7L2 6" />
                    </svg>

                    <a
                      href={`mailto:${company.contacts.email}`}
                      className="hover:underline"
                    >
                      {company.contacts.email}
                    </a>
                  </div>
                )}

                {company.contacts?.instagram && (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 shrink-0"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <path d="M16 11.37a4 4 0 1 1-7.75 1.25 4 4 0 0 1 7.75-1.25z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>

                    <a
                      href={company.contacts.instagram}
                      target="_blank"
                      className="hover:underline"
                    >
                      Instagram
                    </a>
                  </div>
                )}

                {company.contacts?.facebook && (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 shrink-0"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>

                    <a
                      href={company.contacts.facebook}
                      target="_blank"
                      className="hover:underline"
                    >
                      Facebook
                    </a>
                  </div>
                )}

                {company.contacts?.telegram && (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 shrink-0"
                    >
                      <path d="M22 2 11 13" />
                      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
                    </svg>

                    <a
                      href={company.contacts.telegram}
                      target="_blank"
                      className="hover:underline"
                    >
                      Telegram
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* REVIEWS */}
            <div id="review-form" className="scroll-mt-24 space-y-3 pt-4">
              <h2 className="text-xl font-semibold">
                {t('companyPage.sections.reviews')}
              </h2>

              <div className="flex flex-col gap-3">
                {companyReviews.map((review) => (
                  <div
                    key={review.id}
                    className="space-y-1 rounded-xl border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{review.name}</p>

                      <span className="text-xs text-gray-400">
                        {review.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <RatingStarsDisplay
                        value={review.rating}
                        size="sm"
                        fractional
                      />

                      <span className="text-sm text-gray-500">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FORM */}
            <div className="space-y-3 pt-4">
              <h2 className="text-xl font-semibold">
                {t('companyPage.sections.addReview')}
              </h2>

              <ReviewForm />
            </div>
          </div>
        </div>
      </Card>
    </article>
  );
}
