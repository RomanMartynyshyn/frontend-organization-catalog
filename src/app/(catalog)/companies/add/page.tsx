import Link from 'next/link';

import AddCompanyForm from '@/components/add-company/AddCompanyForm';
import { routes } from '@/config/routes';

export const metadata = {
  title: 'Форма додавання',
};

export default function AddCompanyToCatalogPage() {
  return (
    <article className="mx-auto max-w-[720px] space-y-5">
      <nav className="text-sm" aria-label="Breadcrumb">
        <Link href={routes.home} className="text-black hover:underline">
          Головна
        </Link>
        <span className="text-[#666666]"> / </span>
        <span className="font-eUkraine text-[13px] leading-[18px] font-bold text-black">
          Форма додавання
        </span>
      </nav>

      <h1 className="font-eUkraine text-[28px] leading-[32px] font-semibold text-black">
        Додати організацію
      </h1>

      <AddCompanyForm />
    </article>
  );
}
