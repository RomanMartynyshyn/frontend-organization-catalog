import Link from 'next/link';
import type { ReactNode } from 'react';

import { routes } from '@/config/routes';

export const metadata = {
  title: 'Про проєкт',
};

function AboutParagraph({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <p>
      <strong>{title}</strong> {children}
    </p>
  );
}

export default function AboutPage() {
  return (
    <article className="w-full space-y-6 pb-12">
      <nav className="text-sm" aria-label="Breadcrumb">
        <Link href={routes.home} className="text-black hover:underline">
          Головна
        </Link>
        <span className="text-[#666666]"> / </span>
        <span className="font-eUkraine text-[13px] leading-[18px] font-bold text-black">
          Про проєкт
        </span>
      </nav>

      <header className="space-y-4">
        <h1 className="font-eUkraine text-[28px] leading-[32px] font-semibold text-black">
          Про проєкт: BIT (Business in Touch)
        </h1>
        <p className="font-eUkraine text-sm leading-relaxed text-black sm:text-base">
          Ми – команда ентузіастів, що створює прозорий цифровий простір для взаємодії
          між організаціями та мешканцями Кривого Рогу.
        </p>
      </header>

      <div className="font-eUkraine space-y-8 text-sm leading-relaxed text-black sm:text-base">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-black sm:text-xl">1. Наша місія</h2>
          <p>
            Зробити пошук потрібних послуг у Кривому Розі простим, швидким і зручним. Ми
            віримо, що в сучасних умовах важливо мати швидкий доступ до актуальної
            інформації. Наш сервіс допомагає знайти саме ту організацію, яка вам потрібна:
            від бізнес-сервісів до побутових послуг, із можливістю зручного пошуку та
            фільтрації.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-black sm:text-xl">2. Що ми пропонуємо?</h2>
          <div className="space-y-3">
            <AboutParagraph title="Актуальні контакти:">
              У каталозі зібрана база організацій із графіками роботи, телефонами,
              посиланнями на соцмережі та офіційні ресурси.
            </AboutParagraph>
            <AboutParagraph title="Локальний пошук:">
              Сортування за районами дозволяє знайти потрібну установу або сервіс поруч із
              домом.
            </AboutParagraph>
            <AboutParagraph title="Зручна навігація:">
              Організації класифіковані за категоріями, що дозволяє швидко знайти
              потрібний профіль послуг, навіть якщо ви не знаєте точної назви компанії.
            </AboutParagraph>
            <AboutParagraph title="Спільнота:">
              Ви можете самостійно додати свою організацію через спеціальну форму. Ми
              прагнемо зробити каталог максимально повним та корисним для кожного.
            </AboutParagraph>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-black sm:text-xl">3. Розвиток спільноти</h2>
          <p>
            Ми формуємо надійний цифровий майданчик, де кожен може знайти інформацію про
            бізнес, послуги чи сервіси міста. Наш каталог постійно оновлюється – ви можете
            надіслати запит на уточнення даних, щоб ми завжди відображали найсвіжішу
            інформацію.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-black sm:text-xl">4. Як це працює?</h2>
          <div className="space-y-3">
            <AboutParagraph title="Пошук:">
              Оберіть категорію, що вас цікавить: від ремонту та електроніки до медицини
              чи закладів харчування.
            </AboutParagraph>
            <AboutParagraph title="Фільтрація:">
              Оберіть свій район у Кривому Розі, щоб побачити організації, які знаходяться
              найближче до вас.
            </AboutParagraph>
            <AboutParagraph title="Зв&apos;язок:">
              Отримуйте прямі контакти, посилання на соцмережі та адреси для швидкого
              зв&apos;язку з потрібною організацією.
            </AboutParagraph>
            <AboutParagraph title="Додавайте своє:">
              Ви представляєте бізнес, сервіс або волонтерську ініціативу? Додайте
              організацію до бази через форму на сайті. Розкажіть місту та зробіть послуги
              доступнішими!
            </AboutParagraph>
          </div>
        </section>
      </div>
    </article>
  );
}
