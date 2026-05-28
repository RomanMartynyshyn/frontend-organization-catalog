'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { fetchCategories } from '@/lib/catalog-api/client';
import type { CatalogOrganization, CreateOrganizationPayload } from '@/types/catalog-api';

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

  const data = (await response.json()) as CatalogOrganization | { message?: string };

  if (!response.ok) {
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
    });
  };

  const isSubmitDisabled =
    createOrganizationMutation.isPending ||
    !name.trim() ||
    categoryIds.length === 0;

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
        className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
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
        className="min-h-32 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
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
        className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>

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