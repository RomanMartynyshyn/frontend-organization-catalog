'use client';

import Link from 'next/link';

import { routes } from '@/config/routes';

export function SiteFooter() {
  return (
    <footer className="border-border mt-auto border-t bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link href={routes.home} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-sm font-bold text-black">
              logo
            </span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-4 text-sm md:justify-start">
            <Link href="/about" className="hover:underline">
              Про проєкт
            </Link>

            <Link href="/support" className="hover:underline">
              Підтримка каталогу
            </Link>

            <Link href="/privacy" className="hover:underline">
              Політика приватності даних
            </Link>
          </nav>

          <Link
            href="/report"
            className="inline-flex justify-center rounded-md border border-white px-4 py-2 text-sm transition hover:bg-white hover:text-black"
          >
            Повідомити про збій
          </Link>
        </div>
      </div>
    </footer>
  );
}
