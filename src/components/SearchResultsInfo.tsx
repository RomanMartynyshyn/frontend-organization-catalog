'use client';

import { useTranslation } from 'react-i18next';

type SearchResultsInfoProps = {
  search: string;
  count: number;
};

export function SearchResultsInfo({ search, count }: SearchResultsInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full px-6">
      <div className="mx-auto max-w-6xl">
        <div className="w-full rounded-full border border-black bg-[#d9d9d9] px-6 py-3">
          <p className="text-sm text-gray-700">
            {t('search.results', {
              search: search || '...',
              count,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
