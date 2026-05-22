'use client';

import { useTranslation } from 'react-i18next';

type CatalogToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function Toolbar({ search, onSearchChange }: CatalogToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-4 px-6">
      <div className="flex w-full flex-col items-stretch gap-3 lg:flex-row">
        {/* SEARCH */}
        <div className="flex flex-[2] items-center rounded-full border bg-[#d9d9d9] px-4 py-3 shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('toolbar.search')}
            className="w-full bg-transparent text-sm outline-none"
          />

          <svg
            className="ml-2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* SORT */}
        <div className="relative flex-1">
          <select className="w-full appearance-none rounded-full border bg-[#d9d9d9] px-4 py-3 pr-10 text-sm text-gray-700 shadow-sm">
            <option value="">{t('toolbar.sort')}</option>
            <option value="popular">{t('toolbar.popular')}</option>
            <option value="newest">{t('toolbar.newest')}</option>
            <option value="reviews">{t('toolbar.reviews')}</option>
            <option value="recommended">{t('toolbar.recommended')}</option>
            <option value="alphabet">{t('toolbar.alphabet')}</option>
          </select>

          <svg
            className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        {/* FILTER */}
        <div className="relative flex-1">
          <select className="w-full appearance-none rounded-full border bg-[#d9d9d9] py-3 pr-10 pl-10 text-sm text-gray-700 shadow-sm">
            <option value="">{t('toolbar.filter')}</option>
            <option value="area">{t('toolbar.district')}</option>
            <option value="rating">{t('toolbar.rating')}</option>
            <option value="open_now">{t('toolbar.openNow')}</option>
            <option value="online_booking">{t('toolbar.onlineBooking')}</option>
          </select>

          <svg
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
