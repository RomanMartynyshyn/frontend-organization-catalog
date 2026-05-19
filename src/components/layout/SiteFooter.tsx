import Link from 'next/link';
import { routes } from '@/config/routes';

export function SiteFooter() {
  return (
    <footer className="border-border mt-auto border-t bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link href={routes.home} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#fff] text-sm font-bold text-[#000]">
              logo
            </span>

            <span className="text-foreground font-semibold text-white">
              Кривий Ріг
            </span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-4 text-sm md:justify-end">
            <Link href="/about">Про проєкт</Link>
            <Link href="/support">Підтримка каталогу</Link>
            <Link href="/privacy">Політика якості даних</Link>
            <Link href="/report">Повідомити про збій</Link>
          </nav>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          © {new Date().getFullYear()} Kharkiv IT
        </p>
      </div>
    </footer>
  );
}
