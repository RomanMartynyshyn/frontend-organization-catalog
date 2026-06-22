'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import { CategoryCard } from '@/components/CategoryCard';
import type { CatalogCategory } from '@/types/catalog-api';

const SLIDE_WIDTH = 268;
const SLIDE_GAP = 16;

type CategoriesLayout = 'static' | 'scroll' | 'loop';

type CategoriesBarProps = {
  categories: CatalogCategory[];
  activeCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
};

function getHorizontalPadding(): number {
  return window.matchMedia('(min-width: 640px)').matches ? 48 : 32;
}

function getContentWidth(slideCount: number): number {
  if (slideCount === 0) {
    return 0;
  }

  return slideCount * (SLIDE_WIDTH + SLIDE_GAP);
}

function getCategoriesLayout(slideCount: number): CategoriesLayout {
  if (slideCount <= 1) {
    return 'static';
  }

  const viewportWidth = window.innerWidth;
  const paddingX = getHorizontalPadding();
  const contentWidth = getContentWidth(slideCount);
  const availableWidth = viewportWidth - paddingX;

  if (contentWidth <= availableWidth) {
    return 'static';
  }

  const slideStride = SLIDE_WIDTH + SLIDE_GAP;
  const visibleSlides = availableWidth / slideStride;
  const minSlidesForLoop = Math.ceil(visibleSlides) + 2;
  const hasEnoughContentForLoop =
    slideCount >= minSlidesForLoop && contentWidth >= availableWidth * 1.5;

  return hasEnoughContentForLoop ? 'loop' : 'scroll';
}

function useCategoriesLayout(slideCount: number): CategoriesLayout {
  const [layout, setLayout] = useState<CategoriesLayout>('static');

  useEffect(() => {
    const update = () => {
      setLayout(getCategoriesLayout(slideCount));
    };

    update();
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
    };
  }, [slideCount]);

  return layout;
}

type CategorySlidesProps = {
  categories: CatalogCategory[];
  activeCategoryId: string | null;
  onSelect: (id: string) => void;
  slideClassName?: string;
};

function CategorySlides({
  categories,
  activeCategoryId,
  onSelect,
  slideClassName = '',
}: CategorySlidesProps) {
  return (
    <>
      {categories.map((category) => {
        const id = String(category.id);

        return (
          <div
            key={id}
            className={`min-w-0 shrink-0 grow-0 basis-[268px] ${slideClassName}`.trim()}
          >
            <CategoryCard
              category={category}
              isActive={activeCategoryId === id}
              onSelect={onSelect}
            />
          </div>
        );
      })}
    </>
  );
}

type CategoriesCarouselProps = {
  categories: CatalogCategory[];
  activeCategoryId: string | null;
  onSelect: (id: string) => void;
  loop: boolean;
};

function CategoriesCarousel({
  categories,
  activeCategoryId,
  onSelect,
  loop,
}: CategoriesCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: loop ? false : 'trimSnaps',
    dragFree: false,
    loop,
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    emblaApi?.reInit({
      loop,
      containScroll: loop ? false : 'trimSnaps',
    });
  }, [categories, emblaApi, loop]);

  return (
    <>
      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
        <div
          ref={emblaRef}
          className="overflow-hidden px-4 pb-2 sm:px-6"
        >
          <div className="flex touch-pan-y">
            <CategorySlides
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelect={onSelect}
              slideClassName="mr-4"
            />
          </div>
        </div>
      </div>

      <CarouselArrows onPrev={scrollPrev} onNext={scrollNext} />
    </>
  );
}

type CategoriesStaticProps = {
  categories: CatalogCategory[];
  activeCategoryId: string | null;
  onSelect: (id: string) => void;
};

function CategoriesStatic({
  categories,
  activeCategoryId,
  onSelect,
}: CategoriesStaticProps) {
  return (
    <>
      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
        <div className="flex justify-center gap-4 px-4 pb-2 sm:px-6">
          <CategorySlides
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelect={onSelect}
          />
        </div>
      </div>

      <CarouselArrows disabled />
    </>
  );
}

type CarouselArrowsProps = {
  onPrev?: () => void;
  onNext?: () => void;
  disabled?: boolean;
};

function CarouselArrows({ onPrev, onNext, disabled = false }: CarouselArrowsProps) {
  return (
    <div className="flex w-full justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={disabled}
        className="transition hover:opacity-70 disabled:opacity-30"
        aria-label="Прокрутити категорії ліворуч"
      >
        <Image
          src="/assets/icons/arrow_circle_left.svg"
          alt=""
          width={32}
          height={32}
        />
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="transition hover:opacity-70 disabled:opacity-30"
        aria-label="Прокрутити категорії праворуч"
      >
        <Image
          src="/assets/icons/arrow_circle_right.svg"
          alt=""
          width={32}
          height={32}
        />
      </button>
    </div>
  );
}

export function CategoriesBar({
  categories,
  activeCategoryId,
  onSelect,
}: CategoriesBarProps) {
  const layout = useCategoriesLayout(categories.length);

  const handleCategorySelect = useCallback(
    (id: string) => {
      onSelect(activeCategoryId === id ? null : id);
    },
    [activeCategoryId, onSelect],
  );

  if (!categories.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      {layout === 'static' ? (
        <CategoriesStatic
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelect={handleCategorySelect}
        />
      ) : (
        <CategoriesCarousel
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelect={handleCategorySelect}
          loop={layout === 'loop'}
        />
      )}
    </section>
  );
}
