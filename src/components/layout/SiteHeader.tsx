'use client';

import Link from 'next/link';

import { useCatalogSearch } from '@/contexts/CatalogSearchContext';
import { routes } from '@/config/routes';

const CITY_NAME = 'Кривий Ріг';

export function SiteHeader() {
  const { search, setSearch } = useCatalogSearch();

  return (
    <header className="border-border bg-card border-b shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4">
        <Link href={routes.home} className="shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#d9d9d9] text-sm font-bold">
            logo
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-black bg-[#d9d9d9] px-4 py-2.5 shadow-sm">
          <span className="shrink-0 text-sm font-semibold">{CITY_NAME}</span>

          <div className="h-5 w-px shrink-0 bg-black/20" />

          <input
            type="text"
            name="search"
            id="search"
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Введіть свій запит"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />

          <svg
            className="h-5 w-5 shrink-0 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <Link
          href={routes.addCompany}
          className="shrink-0 rounded-md bg-black px-4 py-2.5 text-center text-sm text-white transition hover:opacity-80 sm:shrink-0"
        >
          Додати організацію
        </Link>
      </div>
    </header>
  );
}
