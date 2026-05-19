import { getCompanies } from '@/lib/companies/getCompanies';
import { CompanyListCard } from '@/components/catalog/CompanyListCard';
import { Register } from '@/components/catalog/Register';

export default async function HomePage() {
  const companies = await getCompanies();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-foreground text-3xl font-bold">
          Каталог організацій
        </h1>
      </header>
      <section aria-label="Список організацій">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <li key={company.slug}>
              <CompanyListCard company={company} />
            </li>
          ))}
        </ul>
      </section>
      <Register />
    </div>
  );
}
