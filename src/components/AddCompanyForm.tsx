'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { fetchCategories } from '@/lib/catalog-api/client';
import type {
  ApiErrorResponse,
  CatalogOrganization,
  CreateOrganizationPayload,
} from '@/types/catalog-api';

const inputClassName =
  'rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary';

async function submitOrganization(
  payload: CreateOrganizationPayload,
): Promise<CatalogOrganization> {
  const response = await fetch('/api/organizations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as
    | CatalogOrganization
    | ApiErrorResponse
    | { message?: string };

  if (!response.ok) {
    if ('errors' in data && Array.isArray(data.errors) && data.errors.length > 0) {
      throw new Error(data.errors.map((error) => error.message).join('. '));
    }

    throw new Error(
      'message' in data && typeof data.message === 'string'
        ? data.message
        : 'Failed to create organization',
    );
  }

  return data as CatalogOrganization;
}


export default function AddCompanyForm() {
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [postCode, setPostCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const createOrganizationMutation = useMutation({
    mutationFn: submitOrganization,
    onSuccess: async () => {
      setName('');
      setDescription('');
      setWebsiteUrl('');
      setCategoryIds([]);
      setStreet('');
      setCity('');
      setRegion('');
      setPostCode('');
      setLatitude('');
      setLongitude('');

      await queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const toggleCategory = (categoryId: number) => {
    setCategoryIds((currentCategoryIds) =>
      currentCategoryIds.includes(categoryId)
        ? currentCategoryIds.filter((id) => id !== categoryId)
        : [...currentCategoryIds, categoryId],
    );
  };

  const handleSubmit = (
    event: Parameters<NonNullable<ComponentProps<'form'>['onSubmit']>>[0],
  ) => {
    event.preventDefault();

    createOrganizationMutation.mutate({
      name,
      description,
      websiteUrl,
      categoryIds,
      locations: [
        {
          street: street.trim(),
          city: city.trim(),
          region: region.trim(),
          postCode: postCode.trim(),
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
      ],
    });
  };

  const isLocationComplete =
    street.trim() !== '' &&
    city.trim() !== '' &&
    region.trim() !== '' &&
    postCode.trim().length === 5 &&
    latitude.trim() !== '' &&
    longitude.trim() !== '' &&
    !Number.isNaN(Number(latitude)) &&
    !Number.isNaN(Number(longitude));

  const isSubmitDisabled =
    createOrganizationMutation.isPending ||
    !name.trim() ||
    categoryIds.length === 0 ||
    !isLocationComplete;

  return (
  <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-5">
    <div className="flex flex-col gap-2">
      <label htmlFor="company-name" className="text-sm font-medium">
        Company name
      </label>
      <input
        id="company-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Company name"
        className={inputClassName}
        required
      />
    </div>

    <div className="flex flex-col gap-2">
      <label htmlFor="company-description" className="text-sm font-medium">
        Description
      </label>
      <textarea
        id="company-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Describe the organization"
        className={`min-h-32 ${inputClassName}`}
      />
    </div>

    <div className="flex flex-col gap-2">
      <label htmlFor="company-website" className="text-sm font-medium">
        Website
      </label>
      <input
        id="company-website"
        type="url"
        value={websiteUrl}
        onChange={(event) => setWebsiteUrl(event.target.value)}
        placeholder="https://example.com"
        className={inputClassName}
      />
    </div>

    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium">Location</legend>
      <p className="text-muted-foreground text-xs">
        At least one address. Post code — 5 digits; latitude −90…90, longitude
        −180…180.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="location-street" className="text-sm font-medium">
            Street
          </label>
          <input
            id="location-street"
            type="text"
            value={street}
            onChange={(event) => setStreet(event.target.value)}
            placeholder="вул. Хрещатик, 1"
            className={inputClassName}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="location-city" className="text-sm font-medium">
            City
          </label>
          <input
            id="location-city"
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Київ"
            className={inputClassName}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="location-region" className="text-sm font-medium">
            Region
          </label>
          <input
            id="location-region"
            type="text"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            placeholder="Київська область"
            className={inputClassName}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="location-post-code" className="text-sm font-medium">
            Post code
          </label>
          <input
            id="location-post-code"
            type="text"
            value={postCode}
            onChange={(event) => setPostCode(event.target.value)}
            placeholder="01001"
            minLength={5}
            maxLength={5}
            pattern="\d{5}"
            className={inputClassName}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="location-latitude" className="text-sm font-medium">
            Latitude
          </label>
          <input
            id="location-latitude"
            type="number"
            step="any"
            min={-90}
            max={90}
            value={latitude}
            onChange={(event) => setLatitude(event.target.value)}
            placeholder="50.4501"
            className={inputClassName}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="location-longitude" className="text-sm font-medium">
            Longitude
          </label>
          <input
            id="location-longitude"
            type="number"
            step="any"
            min={-180}
            max={180}
            value={longitude}
            onChange={(event) => setLongitude(event.target.value)}
            placeholder="30.5234"
            className={inputClassName}
            required
          />
        </div>
      </div>
    </fieldset>

    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium">Categories</legend>

      {isCategoriesLoading ? (
        <p className="text-sm text-muted-foreground">Loading categories...</p>
      ) : null}

      {isCategoriesError ? (
        <p className="text-sm text-destructive">Failed to load categories.</p>
      ) : null}

      {!isCategoriesLoading && !isCategoriesError ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={categoryIds.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
                className="size-4"
              />
              {category.name}
            </label>
          ))}
        </div>
      ) : null}
    </fieldset>

    {createOrganizationMutation.isError ? (
      <p className="text-sm text-destructive">
        {createOrganizationMutation.error.message}
      </p>
    ) : null}

    {createOrganizationMutation.isSuccess ? (
      <p className="text-sm text-green-600">
        Organization was successfully submitted.
      </p>
    ) : null}

    <Button type="submit" disabled={isSubmitDisabled}>
      {createOrganizationMutation.isPending ? 'Adding...' : 'Add Company'}
    </Button>
  </form>
  );
}