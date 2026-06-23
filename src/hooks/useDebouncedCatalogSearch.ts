'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQueryStates } from 'nuqs';

import { routes } from '@/config/routes';
import { catalogSearchParsers } from '@/lib/catalogSearchParsers';
import { catalogSearchUrlKeys } from '@/lib/catalogSearchUrlKeys';

const SEARCH_DEBOUNCE_MS = 400;

function buildHomeSearchUrl(search: string): string {
  const params = new URLSearchParams();

  if (search) {
    params.set('search', search);
  }

  const queryString = params.toString();

  return queryString ? `${routes.home}?${queryString}` : routes.home;
}

export function useDebouncedCatalogSearch() {
  const pathname = usePathname();
  const router = useRouter();
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

      if (pathname !== routes.home) {
        router.push(buildHomeSearchUrl(inputValue));
        return;
      }

      void setCatalogFilters({ search: inputValue });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [inputValue, pathname, router, setCatalogFilters, urlSearch]);

  return {
    inputValue,
    setInputValue,
  };
}
