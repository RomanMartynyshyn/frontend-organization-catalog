import type { Company } from '@/types/company';
import { organizations } from '@/mocks/catalogCompanies';

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  return organizations.find((c) => c.slug === slug) ?? null;
}
