import { PAGE_CONTAINER_CLASS } from '@/lib/constants';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col bg-[#f4f6f8]">
      <main className={`${PAGE_CONTAINER_CLASS} flex-1 py-8`}>{children}</main>
    </div>
  );
}
