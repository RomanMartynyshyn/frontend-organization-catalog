import Link from 'next/link';
import { routes } from '@/config/routes';

export function SiteHeader() {
  return (
    <header className="border-border bg-card border-b shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href={routes.home}
          className="focus-visible:outline-ring flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-md text-sm font-bold">
            К
          </span>

          <span className="text-foreground text-base font-semibold">
            Каталог організацій
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={routes.register}
            className="border-border hover:bg-muted rounded-md border px-4 py-2 text-sm transition-colors"
          >
            Зареєструватися
          </Link>

          <Link
            href={routes.login}
            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm"
          >
            Увійти
          </Link>
        </div>
      </div>
    </header>
  );
}
