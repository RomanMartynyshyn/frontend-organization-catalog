'use client';

import { useEffect, useState } from 'react';
import { useQueryStates } from 'nuqs';

import { catalogSearchParsers } from '@/lib/catalogSearchParsers';
import { catalogSearchUrlKeys } from '@/lib/catalogSearchUrlKeys';

const SEARCH_DEBOUNCE_MS = 400;

export function useDebouncedCatalogSearch() {
  const [{ search: urlSearch }, setCatalogFilters] = useQueryStates(
    catalogSearchParsers,
    {
      urlKeys: catalogSearchUrlKeys,
    },
  );
  const [inputValue, setInputValue] = useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);

  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setInputValue(urlSearch);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmedInput = inputValue.trim();
      const trimmedUrl = urlSearch.trim();

      if (trimmedInput === trimmedUrl) {
        return;
      }

      void setCatalogFilters({ search: inputValue });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [inputValue, setCatalogFilters, urlSearch]);

  return {
    inputValue,
    setInputValue,
  };
}
