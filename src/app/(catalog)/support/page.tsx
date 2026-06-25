import Link from 'next/link';

import { routes } from '@/config/routes';

export const metadata = {
  title: 'Волонтерство',
};

const UANIMALS_URL = 'https://uanimals.org/';

export default function SupportPage() {
  return (
    <article className="w-full space-y-6 pb-12">
      <nav className="text-sm" aria-label="Breadcrumb">
        <Link href={routes.home} className="text-black hover:underline">
          Головна
        </Link>
        <span className="text-[#666666]"> / </span>
        <span className="font-eUkraine text-[13px] leading-[18px] font-bold text-black">
          Підтримка каталогу
        </span>
      </nav>

      <header className="space-y-4">
        <h1 className="font-eUkraine text-[28px] leading-[32px] font-semibold text-black">
          Волонтерство
        </h1>
        <h2 className="font-eUkraine text-lg font-bold text-black sm:text-xl">
          Волонтерська ініціатива: UAnimals
        </h2>
      </header>

      <div className="font-eUkraine space-y-5 text-sm leading-relaxed text-black sm:text-base">
        <p>
          Кривий Ріг – це місто небайдужих людей. Окрім бізнес-каталогу, ми підтримуємо
          ініціативи, які рятують життя та допомагають тим, хто найбільше цього
          потребує.
        </p>

        <p>
          UAnimals – всеукраїнський гуманістичний рух, що системно працює над
          утвердженням гуманного ставлення до тварин в Україні. Організація діє в
          багатьох напрямках: від конкретної допомоги притулкам до глобальної адвокації
          прав тварин на державному рівні.
        </p>

        <div className="space-y-3">
          <p className="font-bold">Основні напрямки діяльності:</p>
          <div className="space-y-3">
            <p>
              <strong>Підтримка притулків:</strong> Забезпечення кормами, медикаментами
              та фінансування притулків, які потребують допомоги по всій Україні
            </p>
            <p>
              <strong>Законодавчі ініціативи:</strong> Адвокація прав тварин, боротьба з
              жорстоким поводженням та ініціювання законопроєктів для кращого захисту
              тварин
            </p>
            <p>
              <strong>Гуманна освіта:</strong> Проведення уроків доброти, розробка
              освітніх матеріалів та популяризація відповідального ставлення до тварин.
            </p>
            <p>
              <strong>Порятунок та реабілітація:</strong> Допомога диким та свійським
              тваринам, що опинилися в біді, організація їхньої реабілітації та пошук
              нових домівок
            </p>
          </div>
        </div>

        <p>
          UAnimals – це про системну роботу, яка має на меті змінити ставлення до тварин
          у суспільстві та створити безпечні умови для їхнього життя в Україні.
        </p>

        <p>
          <strong>Як долучитися:</strong> Ознайомитися з повною діяльністю руху,
          переглянути звіти про використання коштів та зробити свій внесок можна на
          офіційному ресурсі:
        </p>

        <p>
          <Link
            href={UANIMALS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline hover:no-underline"
          >
            Перейти на сайт UAnimals: {UANIMALS_URL}
          </Link>
        </p>
      </div>
    </article>
  );
}
