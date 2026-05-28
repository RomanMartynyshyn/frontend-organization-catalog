"use client"
// import { Metadata } from 'next';
import { useTranslation } from 'react-i18next';
import AddCompanyForm from '@/components/AddCompanyForm';

// export const metadata: Metadata = {
//   title: 'Add Company to Catalog',
// };

export default function AddCompanyToCatalogPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-semibold">{t('add.title')}</h1>
      <AddCompanyForm />
    </div>
  );
}