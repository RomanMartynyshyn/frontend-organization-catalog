'use client';

import Link from 'next/link';

import { routes } from '@/config/routes';
import { PAGE_CONTAINER_CLASS } from '@/lib/constants';

export function SiteFooter() {
  return (
    <footer className="border-border mt-auto border-t bg-black text-white">
      <div className={`${PAGE_CONTAINER_CLASS} py-6`}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Link href={routes.home} className="flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-sm font-bold text-black">
              logo
            </span>
          </Link>

          <nav className="flex flex-wrap justify-start gap-4 text-sm sm:ml-auto sm:justify-end">
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
        </div>
      </div>
    </footer>
  );
}
