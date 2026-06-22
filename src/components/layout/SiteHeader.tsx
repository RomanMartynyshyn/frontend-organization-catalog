'use client';

import Link from 'next/link';

import { HeaderSearch } from '@/components/layout/HeaderSearch';
import { routes } from '@/config/routes';
import { useDebouncedCatalogSearch } from '@/hooks/useDebouncedCatalogSearch';
import { PAGE_CONTAINER_CLASS } from '@/lib/constants';

export function SiteHeader() {
  const { inputValue, setInputValue } = useDebouncedCatalogSearch();

  return (
    <header className="border-b border-black/10 bg-white">
      <div className={`${PAGE_CONTAINER_CLASS} py-3`}>
        <div className="flex flex-col gap-3 md:h-[92px] md:flex-row md:items-center md:justify-between md:gap-6 md:py-0">
          <div className="flex items-center justify-between gap-3 md:contents">
            <Link
              href={routes.home}
              className="inline-flex shrink-0 items-center rounded-lg bg-black px-4 py-2 text-sm lowercase text-white transition hover:opacity-80 sm:px-5 sm:py-2.5"
            >
              logo
            </Link>

            <Link
              href={routes.addCompany}
              className="inline-flex shrink-0 items-center rounded-lg bg-black px-3 py-2 text-xs text-white transition hover:opacity-80 sm:px-5 sm:py-2.5 sm:text-sm md:order-3"
            >
              Додати організацію
            </Link>
          </div>

          <div className="w-full min-w-0 md:flex md:flex-1 md:justify-center md:px-2">
            <HeaderSearch search={inputValue} onSearchChange={setInputValue} />
          </div>
        </div>
      </div>
    </header>
  );
}
