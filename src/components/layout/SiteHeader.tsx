'use client';

import Link from 'next/link';

import { HeaderSearch } from '@/components/layout/HeaderSearch';
import { routes } from '@/config/routes';
import { useDebouncedCatalogSearch } from '@/hooks/useDebouncedCatalogSearch';
import { PAGE_CONTAINER_CLASS } from '@/lib/constants';
import Image from 'next/image';

export function SiteHeader() {
  const { inputValue, setInputValue } = useDebouncedCatalogSearch();

  return (
    <header className="border-b border-black/10 bg-white">
      <div className={`${PAGE_CONTAINER_CLASS} py-3`}>
        <div className="flex flex-col gap-3 md:h-[92px] md:flex-row md:items-center md:justify-between md:gap-6 md:py-0">
          <div className="flex items-center justify-between gap-3 md:contents">
            <Link
              href={routes.home}
              className="inline-flex shrink-0 items-center rounded-lg text-sm text-white lowercase transition hover:opacity-80"
            >
              <Image
                src="/assets/icons/logo.svg"
                alt="Logo"
                width={111}
                height={44}
                className="h-auto w-[80px] sm:w-[100px] md:w-[111px]"
              />
            </Link>

            <Link
              href={routes.addCompany}
              className="inline-flex shrink-0 items-center rounded-lg bg-[#1B224B] px-3 py-2 text-xs text-white transition hover:bg-[#283371] focus:bg-[#0D1126] disabled:bg-[#585C74] sm:px-5 sm:py-2.5 sm:text-sm md:order-3"
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
