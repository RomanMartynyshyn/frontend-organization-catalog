'use client';

import {ReadonlyURLSearchParams, usePathname, useSearchParams} from 'next/navigation';
import { useCallback, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

type ShareCurrentUrlButtonProps = {
  'aria-label'?: string;
  children: ReactNode;
  className?: string;
};

function buildCurrentUrl(pathname: string, searchParams: ReadonlyURLSearchParams): string {
  const search = searchParams.toString();

  if (typeof window === 'undefined') {
    return pathname;
  }

  return `${window.location.origin}${pathname}${search ? `?${search}` : ''}`;
}

export function ShareCurrentUrlButton({
  'aria-label': ariaLabel = 'Поділитися',
  children,
  className,
}: ShareCurrentUrlButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleShare = useCallback(async () => {
    const url = buildCurrentUrl(pathname, searchParams);

    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url,
        });

        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
    }

    await navigator.clipboard.writeText(url);
  }, [pathname, searchParams]);

  return (
    <button
      type="button"
      className={cn('shrink-0 opacity-80 transition hover:opacity-100', className)}
      aria-label={ariaLabel}
      onClick={() => {
        void handleShare();
      }}
    >
      {children}
    </button>
  );
}