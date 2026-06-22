import {parseAsInteger, parseAsNativeArrayOf, parseAsString} from 'nuqs';

export const catalogSearchParsers = {
  categoryId: parseAsString,
  districtIds: parseAsNativeArrayOf(parseAsInteger).withDefault([]),
  search: parseAsString.withDefault(''),
};
