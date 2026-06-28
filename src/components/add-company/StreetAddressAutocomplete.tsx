'use client';

import { useEffect, useId, useRef, useState } from 'react';

import {
  addCompanyInputClassName,
  fieldErrorClassName,
} from '@/components/add-company/FormField';
import { fetchStreetSuggestions } from '@/lib/geocode/fetchStreetSuggestions';
import { NOMINATIM_MIN_QUERY_LENGTH } from '@/lib/nominatim/constants';
import type { GeocodeSuggestion } from '@/lib/nominatim/types';
import { cn } from '@/lib/cn';

type StreetAddressAutocompleteProps = {
  id: string;
  value: string;
  error?: string;
  onValueChange: (street: string) => void;
  onAddressSelect: (selection: {
    street: string;
    latitude: string;
    longitude: string;
    postCode?: string | null;
    districtAdminUnitId?: number | null;
    communityAdminUnitId?: number | null;
  }) => void;
  onManualEdit: () => void;
};

export function StreetAddressAutocomplete({
  id,
  value,
  error,
  onValueChange,
  onAddressSelect,
  onManualEdit,
}: StreetAddressAutocompleteProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const loadSuggestions = (query: string) => {
    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
    }

    if (query.trim().length < NOMINATIM_MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      setSearchError('');
      return;
    }

    setIsLoading(true);
    setSearchError('');

    debounceRef.current = window.setTimeout(() => {
      void fetchStreetSuggestions(query)
        .then((results) => {
          setSuggestions(results);
          setIsOpen(results.length > 0);
        })
        .catch(() => {
          setSuggestions([]);
          setIsOpen(false);
          setSearchError('Не вдалося завантажити підказки адрес.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 400);
  };

  const handleSelect = (suggestion: GeocodeSuggestion) => {
    onAddressSelect({
      street: suggestion.street,
      latitude: String(suggestion.latitude),
      longitude: String(suggestion.longitude),
      postCode: suggestion.postCode,
      districtAdminUnitId: suggestion.districtAdminUnitId ?? null,
      communityAdminUnitId: suggestion.communityAdminUnitId ?? null,
    });
    setIsOpen(false);
    setSuggestions([]);
    setSearchError('');
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        type="text"
        value={value}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-invalid={Boolean(error)}
        onChange={(event) => {
          const nextValue = event.target.value;
          onValueChange(nextValue);
          onManualEdit();
          loadSuggestions(nextValue);
        }}
        onFocus={() => {
          if (suggestions.length > 0) {
            setIsOpen(true);
          }
        }}
        placeholder="Почніть вводити вулицю або адресу"
        className={cn(addCompanyInputClassName, fieldErrorClassName(error))}
        autoComplete="off"
      />

      {isLoading ? (
        <p className="mt-1 text-xs text-[#666666]">Пошук адрес...</p>
      ) : null}

      {searchError ? (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {searchError}
        </p>
      ) : null}

      {isOpen && suggestions.length > 0 ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute top-full right-0 left-0 z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-black/10 bg-white py-1 shadow-lg"
        >
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} role="option">
              <button
                type="button"
                className="flex w-full cursor-pointer flex-col gap-0.5 px-3 py-2 text-left text-sm transition hover:bg-[#F4F4F4]"
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  handleSelect(suggestion);
                }}
              >
                <span className="font-medium text-black">{suggestion.street}</span>
                <span className="text-xs text-[#666666]">{suggestion.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-1 text-xs text-[#666666]">
        ©{' '}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          OpenStreetMap
        </a>{' '}
        contributors
      </p>
    </div>
  );
}
