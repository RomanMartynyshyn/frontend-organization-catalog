import type { Company, CompanyListItem } from '@/types/company';

export function toCompanyListItems(
  companies: Company[],
  pageNumber: number,
): CompanyListItem[] {
  return companies.map((company, index) => ({
    ...company,
    listKey: `${company.id}-p${pageNumber}-i${index}`,
  }));
}
