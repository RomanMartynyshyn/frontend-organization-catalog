'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { routes } from '@/config/routes';
import { LanguageSwitcher } from '../LanguageSwitcher';

export function SiteHeader() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-border bg-card border-b shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* LOGO */}
        <Link href={routes.home} className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#d9d9d9] text-sm font-bold">
            logo
          </span>

          <span className="text-base font-semibold">{t('header.city')}</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={routes.register}
            className="rounded-md border border-black px-4 py-2 text-sm hover:bg-black hover:text-white"
          >
            {t('header.register')}
          </Link>

          <Link
            href={routes.login}
            className="rounded-md border border-black bg-[#d9d9d9] px-4 py-2 text-sm hover:bg-black hover:text-white"
          >
            {t('header.login')}
          </Link>

          <LanguageSwitcher />
        </div>

        {/* MOBILE BURGER */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            // CLOSE ICON
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            // BURGER ICON
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="flex flex-col gap-3 border-t border-black px-4 py-4 md:hidden">
          <Link
            href={routes.register}
            className="rounded-md border border-black px-4 py-2 text-sm"
            onClick={() => setIsOpen(false)}
          >
            {t('header.register')}
          </Link>

          <Link
            href={routes.login}
            className="rounded-md border border-black px-4 py-2 text-sm"
            onClick={() => setIsOpen(false)}
          >
            {t('header.login')}
          </Link>

          <LanguageSwitcher />
        </div>
      )}
    </header>
  );
}
