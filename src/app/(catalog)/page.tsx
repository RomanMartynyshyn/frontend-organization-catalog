import { CatalogHomeClient } from '@/app/(catalog)/CatalogHomeClient';
import { fetchCategories } from '@/lib/catalog-api/client';
import { getCompanies } from '@/lib/companies/getCompanies';

export default async function HomePage() {
  const [organizations, categories] = await Promise.all([
    getCompanies(),
    fetchCategories(),
  ]);

  return (
    <CatalogHomeClient
      initialOrganizations={organizations}
      categories={categories}
    />
  );
}
