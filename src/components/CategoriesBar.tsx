'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { CatalogCategory } from '@/types/catalog-api';

type CategoriesBarProps = {
  categories: CatalogCategory[];
  onSelect: (categoryId: string | null) => void;
};

export function CategoriesBar({ categories, onSelect }: CategoriesBarProps) {
  const { t } = useTranslation();
  const [active, setActive] = useState<string | null>(null);

  const handleClick = (id: string | null) => {
    setActive(id);
    onSelect(id);
  };

  return (
    <div className="my-10 flex w-full flex-wrap gap-3 py-3">
      <button
        key="all"
        type="button"
        onClick={() => handleClick(null)}
        className={`flex w-[calc(50%-6px)] items-center gap-3 rounded-full border border-black px-3 py-2 text-sm transition sm:w-[calc(33.333%-8px)] lg:w-[calc(20%-10px)] ${
          active === null
            ? 'bg-black text-white'
            : 'text-black hover:bg-black hover:text-white'
        }`}
      >
        <div
          className={`h-10 w-10 flex-shrink-0 rounded-full border border-black sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${active === null ? 'bg-white' : 'bg-gray-100'} `}
        />
        <span className="min-w-0 flex-1 text-center leading-tight break-words whitespace-normal">
          {t('categories.all')}
        </span>
      </button>

      {categories.map((cat) => {
        const id = String(cat.id);

        return (
          <button
            key={id}
            type="button"
            onClick={() => handleClick(id)}
            className={`flex w-[calc(50%-6px)] items-center gap-3 rounded-full border border-black px-3 py-2 text-sm transition sm:w-[calc(33.333%-8px)] lg:w-[calc(20%-10px)] ${
              active === id
                ? 'bg-black text-white'
                : 'text-black hover:bg-black hover:text-white'
            }`}
          >
            <div
              className={`h-10 w-10 flex-shrink-0 rounded-full border border-black sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${active === id ? 'bg-white' : 'bg-gray-100'} `}
            />
            <span className="min-w-0 flex-1 text-center leading-tight break-words whitespace-normal">
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
