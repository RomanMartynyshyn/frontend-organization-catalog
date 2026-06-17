'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export function CategoriesBlock() {
  const figmaCategories = [
    { id: '1', name: 'Бізнес, фінанси і сервіси', icon: 'card_travel.svg' },
    { id: '2', name: 'Будинок, ремонт і будівництво', icon: 'cottage.svg' },
    {
      id: '3',
      name: 'Електроніка та побутова техніка',
      icon: 'plug_connect.svg',
    },
    { id: '4', name: 'Заклади харчування', icon: 'dining.svg' },
    { id: '5', name: "Медицина та здоров'я", icon: 'cardiology.svg' },
    { id: '6', name: 'Одяг, взуття та аксесуари', icon: 'apparel.svg' },
    { id: '7', name: 'Послуги краси', icon: 'spa.svg' },
    { id: '8', name: 'Продукти і супермаркети', icon: 'shopping_cart.svg' },
    { id: '9', name: 'Торгові центри та універмаги', icon: 'local_mall.svg' },
    { id: '10', name: 'Туризм і відпочинок', icon: 'explore.svg' },
  ];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Слайдер */}
      <div ref={sliderRef} className="no-scrollbar flex gap-4 overflow-x-auto">
        {figmaCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedId(cat.id)}
            className={`flex h-[132px] w-[268px] flex-shrink-0 flex-col justify-between rounded-[20px] pt-6 pr-[84px] pb-6 pl-6 transition-colors duration-300 ${
              selectedId === cat.id
                ? 'bg-[#747474]'
                : 'bg-[#D0D0D0] hover:cursor-pointer'
            }`}
          >
            <Image
              src={`/assets/icons/${cat.icon}`}
              alt={cat.name}
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <p className="font-eUkraine text-base leading-6 font-normal text-black">
              {cat.name}
            </p>
          </div>
        ))}
      </div>

      {/* Стрелки */}
      <div className="mt-4 flex justify-between px-[11%]">
        <button onClick={scrollLeft}>
          <Image
            src="/assets/icons/arrow_circle_left.svg"
            alt="Left"
            width={48}
            height={48}
          />
        </button>
        <button onClick={scrollRight}>
          <Image
            src="/assets/icons/arrow_circle_right.svg"
            alt="Right"
            width={48}
            height={48}
          />
        </button>
      </div>
    </div>
  );
}
