import type { Company } from '@/types/company';
import { catalogCompanies } from '@/mocks/demo-company';

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  return catalogCompanies.find((c) => c.slug === slug) ?? null;
}
