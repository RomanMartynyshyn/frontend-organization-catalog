'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';

const Star = ({
  filled,
  onClick,
}: {
  filled: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="text-2xl text-yellow-400 transition"
  >
    {filled ? '★' : '☆'}
  </button>
);

export const ReviewForm = () => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);

  return (
    <div className="rounded-xl border p-4">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          id="review-name"
          autoComplete="name"
          placeholder={t('reviewForm.namePlaceholder')}
          className="rounded-lg border px-3 py-2 text-sm"
        />

        <textarea
          name="text"
          id="review-text"
          autoComplete="off"
          placeholder={t('reviewForm.textPlaceholder')}
          className="min-h-[100px] rounded-lg border px-3 py-2 text-sm"
        />

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                filled={star <= rating}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <button
            className={cn(
              buttonVariants({ variant: 'primary' }),
              'bg-black text-white transition-colors hover:bg-neutral-800',
            )}
          >
            {t('reviewForm.submit')}
          </button>
        </div>
      </div>
    </div>
  );
};
