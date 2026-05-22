import { organizations } from '@/mocks/catalogCompanies';

export async function getCompanies() {
  return [...organizations];
}
