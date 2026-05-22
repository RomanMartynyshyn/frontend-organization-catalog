import { catalogCompanies } from '@/mocks/demo-company';

export async function getCompanies() {
  return [...catalogCompanies];
}
