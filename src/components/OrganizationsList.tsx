'use client';

import { CompanyListCard } from '@/components/catalog/CompanyListCard';
import { Button } from '@/components/ui/button';
import type { Company } from '@/types/company';

type OrganizationsListProps = {
  data: Company[];
  isLoading?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  alignWithFilters?: boolean;
};

export function OrganizationsList({
  data,
  isLoading,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  alignWithFilters = false,
}: OrganizationsListProps) {
  return (
    <section className="flex min-w-0 flex-1 flex-col lg:h-full">
      {alignWithFilters && (
        <div className="mb-4 hidden h-7 shrink-0 lg:block" aria-hidden="true" />
      )}

      <div className="flex min-h-[280px] max-h-[min(55vh,480px)] flex-col rounded-2xl bg-[#d9d9d9] px-4 py-4 lg:max-h-none lg:min-h-0 lg:flex-1">
        <div className="min-h-0 flex-1 overflow-y-auto pr-8 sm:pr-10">
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center text-gray-600">
              Завантаження…
            </div>
          ) : !data.length ? (
            <div className="flex min-h-[200px] items-center justify-center text-gray-600">
              Організацій не знайдено
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {data.map((company) => (
                <CompanyListCard key={company.id} company={company} />
              ))}

              {hasMore && onLoadMore ? (
                <div className="flex justify-center pt-1 pb-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onLoadMore}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? 'Завантаження…' : 'Завантажити ще'}
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
