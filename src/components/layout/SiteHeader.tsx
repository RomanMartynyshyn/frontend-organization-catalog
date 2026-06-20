'use client';

import Link from 'next/link';

import { useCatalogSearch } from '@/contexts/CatalogSearchContext';
import { routes } from '@/config/routes';

const CITY_NAME = 'Кривий Ріг';

const SearchArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export function SiteHeader() {
  const { search, setSearch } = useCatalogSearch();

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex h-[92px] max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href={routes.home}
          className="inline-flex shrink-0 items-center rounded-lg bg-black px-5 py-2.5 text-sm lowercase text-white transition hover:opacity-80"
        >
          logo
        </Link>

        <div className="flex min-w-0 flex-1 justify-center px-2">
          <div className="flex w-full max-w-[640px] overflow-hidden rounded-lg border border-black">
            <span className="inline-flex shrink-0 items-center bg-black px-4 py-2.5 text-sm font-bold text-white sm:px-5">
              {CITY_NAME}
            </span>

            <label className="flex min-w-0 flex-1 items-center gap-3 bg-white px-4 py-2.5">
              <span className="sr-only">Пошук організацій</span>
              <input
                type="search"
                name="search"
                id="search"
                autoComplete="off"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Введіть свій запит"
                className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-[#6b6b6b]"
              />
              <span className="shrink-0 text-[#6b6b6b]">
                <SearchArrowIcon />
              </span>
            </label>
          </div>
        </div>

        <Link
          href={routes.addCompany}
          className="inline-flex shrink-0 items-center rounded-lg bg-black px-4 py-2.5 text-sm text-white transition hover:opacity-80 sm:px-5"
        >
          Додати організацію
        </Link>
      </div>
    </header>
  );
}
