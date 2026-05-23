'use client';

import { useMemo, useState } from 'react';

import HeroMapSection from '../../components/HeroMapSection';
import { CategoriesBar } from '@/components/CategoriesBar';
import { Toolbar } from '@/components/ToolBar';
import { SearchResultsInfo } from '@/components/SearchResultsInfo';
import { OrganizationsList } from '@/components/OrganizationsList';
import { organizations } from '@/mocks/catalogCompanies';

export default function HomePage() {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch = org.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory = !categoryId || org.category === categoryId;

      return matchesSearch && matchesCategory;
    });
  }, [search, categoryId]);

  return (
    <main>
      <HeroMapSection />

      <Toolbar search={search} onSearchChange={setSearch} />

      <div className="mx-auto max-w-6xl px-6">
        <CategoriesBar onSelect={setCategoryId} />
      </div>

      <SearchResultsInfo search={search} count={filteredOrganizations.length} />

      <OrganizationsList data={filteredOrganizations} />
    </main>
  );
}
