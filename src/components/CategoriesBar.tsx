'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { CatalogCategory } from '@/types/catalog-api';
import { getCategoryIconSrc } from '@/lib/catalog-api/categoryIcon';


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
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 1,
    );
  };

  const scrollBy = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const offset = direction === 'left' ? -280 : 280;
    container.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleCategoryClick = (id: string) => {
    onSelect(activeCategoryId === id ? null : id);
  };

  useEffect(() => {
    updateScrollState();
  }, [categories]);

  if (!categories.length) return null;

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2">
      <div className="space-y-4 px-4">
        {/* Слайдер карточек */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="no-scrollbar flex gap-4 overflow-x-auto pb-2"
        >
          {categories.map((category) => {
            const id = String(category.id);
            const isActive = activeCategoryId === id;

            return (
              <div
                key={id}
                onClick={() => handleCategoryClick(id)}
                className={`flex h-[132px] w-[268px] flex-shrink-0 flex-col justify-between rounded-[20px] p-6 transition-colors duration-300 ${
                  isActive
                    ? 'bg-[#747474]'
                    : 'bg-[#D0D0D0] hover:cursor-pointer'
                }`}
              >
               
                  <Image
                    src={getCategoryIconSrc(category.id)}
                    alt={category.name}
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                
                <p className="text-base leading-6 font-normal text-black">
                  {category.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* Стрелки */}
        <div className="mt-4 flex justify-between px-[11%]">
          <button
            type="button"
            onClick={() => scrollBy('left')}
            disabled={!canScrollLeft}
            className="transition hover:opacity-70 disabled:opacity-30"
            aria-label="Прокрутити категорії ліворуч"
          >
            <Image
              src="/assets/icons/arrow_circle_left.svg"
              alt="Left"
              width={32}
              height={32}
            />
          </button>

          <button
            type="button"
            onClick={() => scrollBy('right')}
            disabled={!canScrollRight}
            className="transition hover:opacity-70 disabled:opacity-30"
            aria-label="Прокрутити категорії праворуч"
          >
            <Image
              src="/assets/icons/arrow_circle_right.svg"
              alt="Right"
              width={32}
              height={32}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
