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
          <span className="text-text-[#000] flex h-10 w-10 items-center justify-center rounded-md bg-[#d9d9d9] text-sm font-bold">
            logo
          </span>

          <span className="text-foreground text-base font-semibold">
            Кривий Ріг
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={routes.register}
            className="border-border rounded-md border px-4 py-2 text-sm transition-colors hover:bg-[#000] hover:text-[#fff]"
          >
            Зареєструватися
          </Link>

          <Link
            href={routes.login}
            className="text-text-[#000] rounded-md bg-[#d9d9d9] px-4 py-2 text-sm hover:bg-[#000] hover:text-[#fff]"
          >
            Увійти
          </Link>
        </div>
      </div>
    </header>
  );
}
