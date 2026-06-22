import { FiltersPanel } from '@/components/FiltersPanel';
import { OrganizationsList } from '@/components/OrganizationsList';
import type { CatalogDistrict } from '@/types/catalog-api';
import type { CompanyListItem } from '@/types/company';

type CatalogBrowseSectionProps = {
  districts: CatalogDistrict[];
  selectedDistrictIds: number[];
  onSelectedDistrictsChange: (districtIds: number[]) => void;
  organizations: CompanyListItem[];
  isLoading: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  filtersKey: string;
};

export function CatalogBrowseSection({
  districts,
  selectedDistrictIds,
  onSelectedDistrictsChange,
  organizations,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadMore,
  filtersKey,
}: CatalogBrowseSectionProps) {
  return (
    <div className="flex flex-col gap-6 lg:min-h-[480px] lg:h-[min(70vh,720px)] lg:flex-row lg:items-stretch">
      <FiltersPanel
        districts={districts}
        selectedDistrictIds={selectedDistrictIds}
        onSelectedDistrictsChange={onSelectedDistrictsChange}
      />

      <OrganizationsList
        data={organizations}
        isLoading={isLoading}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={onLoadMore}
        alignWithFilters
        scrollToTopKey={filtersKey}
      />
    </div>
  );
}
