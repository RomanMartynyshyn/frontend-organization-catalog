const CATEGORY_ICON_COUNT = 10;

export function getCategoryIconSrc(categoryId: number | null | undefined): string {
  if (
    typeof categoryId === 'number' &&
    Number.isInteger(categoryId) &&
    categoryId >= 1 &&
    categoryId <= CATEGORY_ICON_COUNT
  ) {
    return `/assets/icons/icon-${categoryId}.svg`;
  }

  return '/assets/icons/icon-1.svg';
}
