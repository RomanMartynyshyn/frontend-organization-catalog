import Link from 'next/link';

import { routes } from '@/config/routes';

export function NotFoundPage() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-white px-4">
      <div className="flex w-full max-w-[560px] flex-col items-center text-center">
        <p
          className="font-eUkraine select-none text-[clamp(5.5rem,22vw,8.5rem)] leading-none font-bold tracking-tight text-[#1B4332]"
          aria-hidden
        >
          404
        </p>

        <h1 className="font-eUkraine mt-6 text-[clamp(1.75rem,5vw,2.25rem)] leading-tight font-bold text-black">
          Сторінку не знайдено
        </h1>

        <p className="font-eUkraine mt-4 max-w-[420px] text-sm leading-relaxed font-normal text-black sm:text-base">
          Схоже, організація була видалена, змінила адресу, або ви перейшли за хибним
          посиланням.
        </p>

        <Link
          href={routes.home}
          className="font-eUkraine mt-8 inline-flex rounded-[10px] bg-[#1D2445] px-8 py-3 text-sm font-normal text-white transition hover:bg-[#252e55] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D2445]"
        >
          Повернутися на головну
        </Link>
      </div>
    </div>
  );
}
