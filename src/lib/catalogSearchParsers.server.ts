import { parseAsInteger, parseAsNativeArrayOf, parseAsString } from 'nuqs/server';

export const catalogSearchParsers = {
  categoryId: parseAsString,
  adminUnitIds: parseAsNativeArrayOf(parseAsInteger).withDefault([]),
  search: parseAsString.withDefault(''),
};
