'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Category = {
  id: string | null;
  key: string;
};

const categories: Category[] = [
  { id: null, key: 'all' },
  { id: 'medicine', key: 'medicine' },
  { id: 'education', key: 'education' },
  { id: 'it', key: 'it' },
  { id: 'marketplaces', key: 'marketplaces' },
];

export function CategoriesBar({
  onSelect,
}: {
  onSelect: (categoryId: string | null) => void;
}) {
  const { t } = useTranslation();
  const [active, setActive] = useState<string | null>(null);

  const handleClick = (id: string | null) => {
    setActive(id);
    onSelect(id);
  };

  return (
    <div className="flex w-full flex-wrap gap-3 py-3">
      {categories.map((cat) => (
        <button
          key={cat.id ?? 'all'}
          onClick={() => handleClick(cat.id)}
          className={`flex w-[calc(50%-6px)] items-center gap-3 rounded-full border border-black px-3 py-2 text-sm transition sm:w-[calc(33.333%-8px)] lg:w-[calc(20%-10px)] ${
            active === cat.id
              ? 'bg-black text-white'
              : 'text-black hover:bg-black hover:text-white'
          }`}
        >
          {/* CIRCLE */}
          <div
            className={`h-10 w-10 flex-shrink-0 rounded-full border border-black sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${active === cat.id ? 'bg-white' : 'bg-gray-100'} `}
          />

          {/* TEXT */}
          <span className="min-w-0 flex-1 text-center leading-tight break-words whitespace-normal">
            {t(`categories.${cat.key}`)}
          </span>
        </button>
      ))}
    </div>
  );
}
