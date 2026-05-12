import Link from 'next/link';
import { routes } from '@/config/routes';

export function SiteHeader() {
  return (
    <header className="border-border bg-card border-b shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <Link
          href={routes.home}
          className="focus-visible:outline-ring flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-bold">
            К
          </span>
          <span className="text-foreground text-base font-semibold">
            Каталог організацій
          </span>
        </Link>
      </div>
    </header>
  );
}
