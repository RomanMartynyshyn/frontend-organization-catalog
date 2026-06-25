const CATEGORY_ICON_COUNT = 10;

// export function getCategoryIconSrc(categoryId: number | null | undefined): string {
//   if (
//     typeof categoryId === 'number' &&
//     Number.isInteger(categoryId) &&
//     categoryId >= 1 &&
//     categoryId <= CATEGORY_ICON_COUNT
//   ) {
//     return `/assets/icons/icon-${categoryId}.svg`;
//   }

//   return '/assets/icons/icon-1.svg';
// }


// ///////////////////////////////////////////////////////

// export function getCategoryIconSrc(
//   categoryId: number | null | undefined,
// ): string {
//   if (
//     typeof categoryId === 'number' &&
//     Number.isInteger(categoryId) &&
//     categoryId >= 1 &&
//     categoryId <= CATEGORY_ICON_COUNT
//   ) {
//     return `/assets/icons/icon-${categoryId}.svg`;
//   }

//   return '/assets/icons/icon-1.svg';
// }

// 🔹 Новая функция для спрайта
export function getCategoryIconId(
  categoryId: number | null | undefined,
): string {
  if (
    typeof categoryId === 'number' &&
    Number.isInteger(categoryId) &&
    categoryId >= 1 &&
    categoryId <= CATEGORY_ICON_COUNT
  ) {
    return `icon-${categoryId}`; // совпадает с id в sprite.svg
  }

  return 'icon-1';
}
