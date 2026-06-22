import { parseAsInteger, parseAsNativeArrayOf, parseAsString } from 'nuqs/server';

export const catalogSearchParsers = {
  categoryId: parseAsString,
  districtIds: parseAsNativeArrayOf(parseAsInteger).withDefault([]),
  page: parseAsInteger.withDefault(1),
};
