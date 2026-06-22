import AddCompanyForm from '@/components/AddCompanyForm';

export default function AddCompanyToCatalogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-semibold">
        Додати організацію до каталогу
      </h1>
      <AddCompanyForm />
    </div>
  );
}
