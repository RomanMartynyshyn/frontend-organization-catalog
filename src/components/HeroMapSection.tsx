'use client';

import { useTranslation } from 'react-i18next';

export default function HeroMapSection() {
  const { t } = useTranslation();

  return (
    <section className="w-full px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        {/* LEFT */}
        <div className="flex-1">
          <h1 className="mb-4 text-3xl font-semibold">{t('hero.title')}</h1>

          <p className="mb-6 text-gray-600">{t('hero.description')}</p>

          <button className="cursor-pointer rounded-md bg-black px-6 py-3 text-white transition hover:opacity-80">
            {t('hero.button')}
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex flex-1 flex-col gap-4">
          {/* MAP */}
          <div className="h-[300px] w-full cursor-grab overflow-hidden rounded-xl shadow transition hover:shadow-lg active:cursor-grabbing">
            <iframe
              className="h-[300px] w-full rounded-xl"
              src="https://www.openstreetmap.org/export/embed.html?bbox=30.5%2C50.4%2C30.6%2C50.5&layer=mapnik"
            />
          </div>

          {/* COORDINATES */}
          <div className="grid w-full grid-cols-3 gap-3">
            <div className="cursor-pointer rounded-md border p-3 text-center text-sm transition hover:bg-gray-50">
              <div className="break-words whitespace-normal">
                <span className="text-2xl font-bold">X</span> donec
              </div>
            </div>

            <div className="cursor-pointer rounded-md border p-3 text-center text-sm transition hover:bg-gray-50">
              <div className="break-words whitespace-normal">
                <span className="text-2xl font-bold">Y</span> parturient
              </div>
            </div>

            <div className="cursor-pointer rounded-md border p-3 text-center text-sm transition hover:bg-gray-50">
              <div className="break-words whitespace-normal">
                <span className="text-2xl font-bold">Z</span> mattis
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
