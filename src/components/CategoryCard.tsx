// import Image from 'next/image';

// import { getCategoryIconSrc } from '@/lib/catalog-api/categoryIcon';
import { getCategoryIconId } from '@/lib/catalog-api/categoryIcon';
import type { CatalogCategory } from '@/types/catalog-api';

type CategoryCardProps = {
  category: CatalogCategory;
  isActive: boolean;
  onSelect: (categoryId: string) => void;
};

export function CategoryCard({
  category,
  isActive,
  onSelect,
}: CategoryCardProps) {
  const id = String(category.id);

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`flex h-[132px] w-full flex-col justify-between rounded-[20px] p-6 text-left transition-colors duration-300 ${
        isActive
          ? 'bg-[#1B224B] text-white' // Selected: тёмный фон + белый текст
          : 'bg-[#B4BBE4] text-black hover:cursor-pointer hover:bg-[#D9DDF2]' // Default + Hover: светлый фон + чёрный текст
      } focus:ring-2 focus:ring-[#8E99D7] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#8B8FA7] disabled:text-white`}
    >
      {/* <Image
        src={getCategoryIconSrc(category.id)}
        alt={category.name}
        width={24}
        height={24}
        className="h-6 w-6"
      /> */}

      <svg
        className={`h-6 w-6 ${isActive ? 'text-white' : 'text-[#1B224B]'}`}
        fill="currentColor"
      >
        <use
          href={`/assets/icons/sprite.svg#${getCategoryIconId(Number(category.id))}`}
        />
      </svg>

      <p className="text-base leading-6 font-normal">{category.name}</p>
    </button>
  );
}
