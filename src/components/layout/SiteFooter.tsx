import Link from 'next/link';
import { routes } from '@/config/routes';

export function SiteFooter() {
  return (
    <footer className="border-border bg-card mt-auto border-t">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link href={routes.home} className="flex items-center gap-3">
            <span className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-md text-sm font-bold">
              К
            </span>

            <span className="text-foreground text-base font-semibold">
              Каталог організацій
            </span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-4 text-sm md:justify-end">
            <Link href="/about">Про проєкт</Link>
            <Link href="/support">Підтримка каталогу</Link>
            <Link href="/privacy">Політика даних</Link>
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
