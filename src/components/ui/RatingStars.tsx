'use client';

import { useState } from 'react';
import clsx from 'clsx';
import styles from './RatingStars.module.css';

export type StarSize = 'sm' | 'md';

const STARS_ORDER = [1, 2, 3, 4, 5] as const;

const DEFAULT_CAPTIONS: Record<(typeof STARS_ORDER)[number], string> = {
  5: 'Excellent',
  4: 'Good',
  3: 'OK',
  2: 'Fair',
  1: 'Poor',
};

const STAR_DIMS: Record<StarSize, { w: number; h: number }> = {
  sm: { w: 18, h: 17 },
  md: { w: 25, h: 24 },
};

function StarIcon({ fillRatio, size }: { fillRatio: number; size: StarSize }) {
  const { w, h } = STAR_DIMS[size];
  const safeRatio = Math.min(1, Math.max(0, fillRatio));
  const needsClipPath = safeRatio < 1;
  const clipRight = `${(1 - safeRatio) * 100}%`;

  return (
    <svg
      className={styles.starSvg}
      width={w}
      height={h}
      viewBox="0 0 25 24"
      fill="none"
      aria-hidden
    >
      <use href="/icons.svg#star-empty-icon" className={styles.emptyStar} />
      <use
        href="/icons.svg#star-full-icon"
        className={styles.fullStar}
        style={
          needsClipPath ? { clipPath: `inset(0 ${clipRight} 0 0)` } : undefined
        }
      />
    </svg>
  );
}

function clampStarValue(value: number, max: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(max, Math.max(0, value));
}

export type RatingStarsDisplayProps = {
  value: number;
  max?: number;
  size?: StarSize;
  className?: string;
  title?: string;
  ariaLabel?: string;
  fractional?: boolean;
};

export function RatingStarsDisplay({
  value,
  max = 5,
  size = 'sm',
  className,
  title,
  ariaLabel,
  fractional = false,
}: RatingStarsDisplayProps) {
  const ratingValue = clampStarValue(value, max);
  const rounded = Math.round(ratingValue);
  const displayValue = fractional ? ratingValue : rounded;
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <span
      className={clsx(
        styles.display,
        size === 'md' && styles.displayMd,
        className,
      )}
      role="img"
      title={title}
      aria-label={ariaLabel ?? `${rounded} out of ${max} stars`}
    >
      {stars.map((star) => {
        const fillRatio = Math.min(1, Math.max(0, displayValue - (star - 1)));
        return <StarIcon key={star} fillRatio={fillRatio} size={size} />;
      })}
    </span>
  );
}

export type RatingStarsInputProps = {
  name: string;
  idPrefix: string;
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  showCaptions?: boolean;
  captions?: Partial<Record<(typeof STARS_ORDER)[number], string>>;
  className?: string;
};

export function RatingStarsInput({
  name,
  idPrefix,
  value,
  onChange,
  disabled = false,
  showCaptions = true,
  captions,
  className,
}: RatingStarsInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const ratingNum = Number(value);
  const displayValue =
    hoverValue ?? (Number.isFinite(ratingNum) ? ratingNum : 0);

  const cap = { ...DEFAULT_CAPTIONS, ...captions };

  return (
    <div
      className={clsx(styles.inputWrap, className)}
      onMouseLeave={() => setHoverValue(null)}
    >
      {STARS_ORDER.map((starValue) => {
        const id = `${idPrefix}-${starValue}`;
        const filled = displayValue >= starValue;
        return (
          <div key={starValue} className={styles.starCell}>
            <input
              id={id}
              name={name}
              type="radio"
              className={styles.starInput}
              value={String(starValue)}
              checked={value === String(starValue)}
              disabled={disabled}
              onChange={() => onChange(String(starValue))}
              onFocus={() => setHoverValue(null)}
            />
            <label
              htmlFor={id}
              className={styles.starLabel}
              onMouseEnter={() => setHoverValue(starValue)}
            >
              <StarIcon fillRatio={filled ? 1 : 0} size="md" />
              {showCaptions ? (
                <span className={styles.starCaption}>{cap[starValue]}</span>
              ) : null}
            </label>
          </div>
        );
      })}
    </div>
  );
}
