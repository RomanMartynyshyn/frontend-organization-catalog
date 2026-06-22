'use client';

import { useState } from 'react';

import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { RatingStarsInput } from '@/components/ui/RatingStars';

export const ReviewForm = () => {
  const [rating, setRating] = useState('');

  return (
    <div className="rounded-xl border p-4">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          id="review-name"
          autoComplete="name"
          placeholder="Ваше ім'я"
          className="rounded-lg border px-3 py-2 text-sm"
        />

        <textarea
          name="text"
          id="review-text"
          autoComplete="off"
          placeholder="Уведіть ваш відгук..."
          className="min-h-[100px] rounded-lg border px-3 py-2 text-sm"
        />

        <div className="flex items-center justify-between gap-4">
          <RatingStarsInput
            name="rating"
            idPrefix="review-rating"
            value={rating}
            onChange={setRating}
            showCaptions={false}
          />

          <button
            className={cn(
              buttonVariants({ variant: 'primary' }),
              'bg-black text-white transition-colors hover:bg-neutral-800',
            )}
          >
            Надіслати
          </button>
        </div>
      </div>
    </div>
  );
};
