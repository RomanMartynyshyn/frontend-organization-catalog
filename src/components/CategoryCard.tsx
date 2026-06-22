import Image from 'next/image';

import { getCategoryIconSrc } from '@/lib/catalog-api/categoryIcon';
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
          ? 'bg-[#747474]'
          : 'bg-[#D0D0D0] hover:cursor-pointer hover:bg-[#c4c4c4]'
      }`}
    >
      <Image
        src={getCategoryIconSrc(category.id)}
        alt={category.name}
        width={24}
        height={24}
        className="h-6 w-6"
      />

      <p className="text-base leading-6 font-normal text-black">{category.name}</p>
    </button>
  );
}
