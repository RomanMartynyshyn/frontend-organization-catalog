'use client';

import { useEffect, useRef, useState } from 'react';

import type { CatalogCategory } from '@/types/catalog-api';

type CategoriesBarProps = {
  categories: CatalogCategory[];
  activeCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
};

export function CategoriesBar({
  categories,
  activeCategoryId,
  onSelect,
}: CategoriesBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 1,
    );
  };

  const scrollBy = (direction: 'left' | 'right') => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const offset = direction === 'left' ? -280 : 280;
    container.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleCategoryClick = (id: string) => {
    onSelect(activeCategoryId === id ? null : id);
  };

  useEffect(() => {
    updateScrollState();
  }, [categories]);

  if (!categories.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => {
          const id = String(category.id);
          const isActive = activeCategoryId === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleCategoryClick(id)}
              className={`flex min-w-[160px] shrink-0 flex-col items-center gap-3 rounded-2xl border border-black px-4 py-4 text-sm transition sm:min-w-[180px] ${
                isActive
                  ? 'bg-[#b8b8b8] text-black'
                  : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl border border-black ${
                  isActive ? 'bg-white' : 'bg-[#d9d9d9]'
                }`}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M4 12h16M4 17h10" />
                </svg>
              </div>

              <span className="text-center leading-tight">{category.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-6">
        <button
          type="button"
          onClick={() => scrollBy('left')}
          disabled={!canScrollLeft}
          className="text-black transition hover:opacity-70 disabled:opacity-30"
          aria-label="Прокрутити категорії ліворуч"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => scrollBy('right')}
          disabled={!canScrollRight}
          className="text-black transition hover:opacity-70 disabled:opacity-30"
          aria-label="Прокрутити категорії праворуч"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
