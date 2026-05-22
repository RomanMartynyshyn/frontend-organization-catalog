import Link from 'next/link';
import { routes } from '@/config/routes';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';

export default function CompanyNotFound() {
  return (
    <div className="border-border bg-card rounded-lg border p-10 text-center shadow-sm">
      <h1 className="text-foreground text-xl font-semibold">
        Компанію не знайдено
      </h1>
      <p className="text-muted mt-2 text-sm">
        Перевірте адресу або поверніться на головну сторінку.
      </p>
      <Link
        href={routes.home}
        className={cn(
          buttonVariants({ variant: 'primary' }),
          'mt-6 inline-flex bg-black text-white hover:bg-black/80',
        )}
      >
        На головну
      </Link>
    </div>
  );
}
