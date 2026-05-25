'use client';

import { useCallback, useMemo, useState } from 'react';

import HeroMapSection from '@/components/HeroMapSection';
import { CategoriesBar } from '@/components/CategoriesBar';
import { Toolbar } from '@/components/ToolBar';
import { SearchResultsInfo } from '@/components/SearchResultsInfo';
import { OrganizationsList } from '@/components/OrganizationsList';
import { mapOrganizationToCompany } from '@/lib/catalog-api/mapToCompany';
import type { CatalogCategory, CatalogOrganization } from '@/types/catalog-api';
import type { Company } from '@/types/company';

type CatalogHomeClientProps = {
  initialOrganizations: Company[];
  categories: CatalogCategory[];
};

export function CatalogHomeClient({
  initialOrganizations,
  categories,
}: CatalogHomeClientProps) {
  const [organizations, setOrganizations] =
    useState<Company[]>(initialOrganizations);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCategorySelect = useCallback(
    async (id: string | null) => {
      if (id === null) {
        setOrganizations(initialOrganizations);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/organizations?category_id=${encodeURIComponent(id)}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch organizations');
        }

        const data = (await response.json()) as CatalogOrganization[];
        setOrganizations(data.map(mapOrganizationToCompany));
      } catch (error) {
        console.error(error);
        setOrganizations([]);
      } finally {
        setIsLoading(false);
      }
    },
    [initialOrganizations],
  );

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) =>
      org.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [organizations, search]);

  return (
    <main>
      <HeroMapSection />

      <Toolbar search={search} onSearchChange={setSearch} />

      <div className="mx-auto max-w-6xl px-6">
        <CategoriesBar categories={categories} onSelect={handleCategorySelect} />
      </div>

      {isLoading ? (
        <div className="mx-auto max-w-6xl px-6 py-10 text-center text-gray-500">
          Завантаження…
        </div>
      ) : (
        <>
          <SearchResultsInfo
            search={search}
            count={filteredOrganizations.length}
          />
          <OrganizationsList data={filteredOrganizations} />
        </>
      )}
    </main>
  );
}
