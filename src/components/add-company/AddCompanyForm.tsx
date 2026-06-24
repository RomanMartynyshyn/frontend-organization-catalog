'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type Dispatch, type SetStateAction } from 'react';

import {
  addCompanyInputClassName,
  addCompanySelectClassName,
  addCompanyTextareaClassName,
  fieldErrorClassName,
  FormField,
} from '@/components/add-company/FormField';
import { StepIndicator } from '@/components/add-company/StepIndicator';
import { Button } from '@/components/ui/button';
import { WEEKDAY_LABELS } from '@/lib/add-company/constants';
import {
  buildCreateOrganizationPayload,
  mapApiFieldToFormField,
  validateAllSteps,
  validateStep,
} from '@/lib/add-company/validation';
import {
  createInitialFormState,
  type AddCompanyFormState,
  type FieldErrors,
} from '@/lib/add-company/types';
import { organizationsQueryKeys } from '@/lib/catalog-api/organizationsQuery';
import { cn } from '@/lib/cn';
import type {
  ApiErrorResponse,
  CatalogCategory,
  CatalogDistrict,
  CatalogOrganization,
  CreateOrganizationPayload,
} from '@/types/catalog-api';

async function fetchCategories(): Promise<CatalogCategory[]> {
  const response = await fetch('/api/categories');

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return (await response.json()) as CatalogCategory[];
}

async function fetchDistricts(): Promise<CatalogDistrict[]> {
  const response = await fetch('/api/districts');

  if (!response.ok) {
    throw new Error('Failed to fetch districts');
  }

  return (await response.json()) as CatalogDistrict[];
}

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
      const error = new Error('Validation failed') as Error & {
        fieldErrors?: FieldErrors;
      };

      error.fieldErrors = data.errors.reduce<FieldErrors>((accumulator, item) => {
        const formField = mapApiFieldToFormField(item.field);
        accumulator[formField] = item.message;
        return accumulator;
      }, {});

      throw error;
    }

    throw new Error(
      'message' in data && typeof data.message === 'string'
        ? data.message
        : 'Не вдалося надіслати заявку',
    );
  }

  return data as CatalogOrganization;
}

function updateFormField<K extends keyof AddCompanyFormState>(
  setter: Dispatch<SetStateAction<AddCompanyFormState>>,
  field: K,
  value: AddCompanyFormState[K],
) {
  setter((current) => ({
    ...current,
    [field]: value,
  }));
}

export default function AddCompanyForm() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formState, setFormState] = useState<AddCompanyFormState>(createInitialFormState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const {
    data: districts = [],
    isLoading: isDistrictsLoading,
    isError: isDistrictsError,
  } = useQuery({
    queryKey: ['districts'],
    queryFn: fetchDistricts,
  });

  const createOrganizationMutation = useMutation({
    mutationFn: submitOrganization,
    onSuccess: async () => {
      setFormState(createInitialFormState());
      setFieldErrors({});
      setFormError('');
      setStep(1);

      await queryClient.invalidateQueries({
        queryKey: organizationsQueryKeys.all,
      });
    },
    onError: (error: Error & { fieldErrors?: FieldErrors }) => {
      if (error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
        setFormError('Перевірте поля форми та виправте помилки.');

        if (
          error.fieldErrors.categoryId ||
          error.fieldErrors.name ||
          error.fieldErrors.description
        ) {
          setStep(1);
          return;
        }

        if (error.fieldErrors.workingDays || error.fieldErrors.workStartTime) {
          setStep(2);
          return;
        }

        setStep(3);
        return;
      }

      setFormError(error.message);
    },
  });

  const clearFieldError = (field: string) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const goToNextStep = () => {
    const errors = validateStep(step, formState);
    setFieldErrors(errors);
    setFormError('');

    if (Object.keys(errors).length > 0) {
      return;
    }

    setStep((current) => (current < 3 ? ((current + 1) as 1 | 2 | 3) : current));
  };

  const goToPreviousStep = () => {
    setFieldErrors({});
    setFormError('');
    setStep((current) => (current > 1 ? ((current - 1) as 1 | 2 | 3) : current));
  };

  const handleSubmit = () => {
    const errors = validateAllSteps(formState);
    setFieldErrors(errors);
    setFormError('');

    if (Object.keys(errors).length > 0) {
      if (errors.name || errors.categoryId || errors.description) {
        setStep(1);
      } else if (errors.workingDays || errors.workStartTime || errors.workEndTime) {
        setStep(2);
      } else {
        setStep(3);
      }

      setFormError('Перевірте обов\'язкові поля перед відправкою.');
      return;
    }

    createOrganizationMutation.mutate(buildCreateOrganizationPayload(formState));
  };

  const toggleWorkingDay = (index: number) => {
    setFormState((current) => {
      const workingDays = [...current.workingDays];
      workingDays[index] = !workingDays[index];

      return {
        ...current,
        workingDays,
      };
    });
    clearFieldError('workingDays');
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#666666]">
        Поля з позначкою <span className="text-black">*</span> є обов&apos;язковими.
      </p>

      <StepIndicator currentStep={step} />

      <div className="rounded-[20px] border border-black/10 bg-white p-5">
        {step === 1 ? (
          <div className="space-y-3">
            <FormField
              id="company-name"
              label="Назва організації"
              required
              error={fieldErrors.name}
            >
              <input
                id="company-name"
                type="text"
                value={formState.name}
                onChange={(event) => {
                  updateFormField(setFormState, 'name', event.target.value);
                  clearFieldError('name');
                }}
                placeholder="Ввести назву"
                className={cn(addCompanyInputClassName, fieldErrorClassName(fieldErrors.name))}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? 'company-name-error' : undefined}
              />
            </FormField>

            <FormField
              id="company-category"
              label="Категорія"
              required
              error={fieldErrors.categoryId}
            >
              <select
                id="company-category"
                value={formState.categoryId ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  updateFormField(
                    setFormState,
                    'categoryId',
                    value ? Number(value) : null,
                  );
                  clearFieldError('categoryId');
                }}
                disabled={isCategoriesLoading || isCategoriesError}
                className={cn(
                  addCompanySelectClassName,
                  fieldErrorClassName(fieldErrors.categoryId),
                )}
                aria-invalid={Boolean(fieldErrors.categoryId)}
              >
                <option value="">Обрати категорію</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {isCategoriesError ? (
                <p className="text-xs text-red-600">Не вдалося завантажити категорії.</p>
              ) : null}
            </FormField>

            <FormField
              id="company-description"
              label="Опис організації"
              error={fieldErrors.description}
            >
              <textarea
                id="company-description"
                value={formState.description}
                onChange={(event) => {
                  updateFormField(setFormState, 'description', event.target.value);
                  clearFieldError('description');
                }}
                placeholder="Ввести опис"
                className={cn(
                  addCompanyTextareaClassName,
                  fieldErrorClassName(fieldErrors.description),
                )}
                aria-invalid={Boolean(fieldErrors.description)}
              />
            </FormField>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <h2 className="font-eUkraine text-sm font-semibold text-black">
              Графік роботи
            </h2>

            <FormField
              id="working-days"
              label="Робочі дні"
              error={fieldErrors.workingDays}
            >
              <div className="flex flex-wrap gap-1.5">
                {WEEKDAY_LABELS.map((label, index) => {
                  const isSelected = formState.workingDays[index];

                  return (
                    <button
                      key={label}
                      type="button"
                      className={cn(
                        'min-w-10 cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs transition',
                        isSelected
                          ? 'border-black bg-black text-white'
                          : 'border-black/20 bg-white text-black hover:border-black/40',
                      )}
                      aria-pressed={isSelected}
                      onClick={() => {
                        toggleWorkingDay(index);
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </FormField>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                id="work-start-time"
                label="Час початку робочого дня"
                error={fieldErrors.workStartTime}
              >
                <input
                  id="work-start-time"
                  type="time"
                  value={formState.workStartTime}
                  onChange={(event) => {
                    updateFormField(setFormState, 'workStartTime', event.target.value);
                    clearFieldError('workStartTime');
                    clearFieldError('workEndTime');
                  }}
                  className={cn(
                    addCompanyInputClassName,
                    fieldErrorClassName(fieldErrors.workStartTime),
                  )}
                />
              </FormField>

              <FormField
                id="work-end-time"
                label="Час закінчення робочого дня"
                error={fieldErrors.workEndTime}
              >
                <input
                  id="work-end-time"
                  type="time"
                  value={formState.workEndTime}
                  onChange={(event) => {
                    updateFormField(setFormState, 'workEndTime', event.target.value);
                    clearFieldError('workStartTime');
                    clearFieldError('workEndTime');
                  }}
                  className={cn(
                    addCompanyInputClassName,
                    fieldErrorClassName(fieldErrors.workEndTime),
                  )}
                />
              </FormField>
            </div>

            {fieldErrors.workingHours ? (
              <p className="text-xs text-red-600" role="alert">
                {fieldErrors.workingHours}
              </p>
            ) : null}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <FormField
              id="company-street"
              label="Адреса"
              error={fieldErrors.street}
            >
              <input
                id="company-street"
                type="text"
                value={formState.street}
                onChange={(event) => {
                  updateFormField(setFormState, 'street', event.target.value);
                  clearFieldError('street');
                }}
                placeholder="Ввести адресу"
                className={cn(addCompanyInputClassName, fieldErrorClassName(fieldErrors.street))}
              />
            </FormField>

            <FormField
              id="company-district"
              label="Район"
              error={fieldErrors.districtId}
            >
              <select
                id="company-district"
                value={formState.districtId ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  updateFormField(
                    setFormState,
                    'districtId',
                    value ? Number(value) : null,
                  );
                  clearFieldError('districtId');
                }}
                disabled={isDistrictsLoading || isDistrictsError}
                className={cn(
                  addCompanySelectClassName,
                  fieldErrorClassName(fieldErrors.districtId),
                )}
              >
                <option value="">Обрати район</option>
                {districts.map((district) => (
                  <option key={district.districtId} value={district.districtId}>
                    {district.name}
                  </option>
                ))}
              </select>
              {isDistrictsError ? (
                <p className="text-xs text-red-600">Не вдалося завантажити райони.</p>
              ) : null}
            </FormField>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                id="company-latitude"
                label="Широта"
                required
                error={fieldErrors.latitude}
              >
                <input
                  id="company-latitude"
                  type="number"
                  step="any"
                  min={-90}
                  max={90}
                  value={formState.latitude}
                  onChange={(event) => {
                    updateFormField(setFormState, 'latitude', event.target.value);
                    clearFieldError('latitude');
                  }}
                  placeholder="47.9105"
                  className={cn(
                    addCompanyInputClassName,
                    fieldErrorClassName(fieldErrors.latitude),
                  )}
                />
              </FormField>

              <FormField
                id="company-longitude"
                label="Довгота"
                required
                error={fieldErrors.longitude}
              >
                <input
                  id="company-longitude"
                  type="number"
                  step="any"
                  min={-180}
                  max={180}
                  value={formState.longitude}
                  onChange={(event) => {
                    updateFormField(setFormState, 'longitude', event.target.value);
                    clearFieldError('longitude');
                  }}
                  placeholder="33.3918"
                  className={cn(
                    addCompanyInputClassName,
                    fieldErrorClassName(fieldErrors.longitude),
                  )}
                />
              </FormField>
            </div>

            <FormField id="company-phone" label="Телефон" error={fieldErrors.phone}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="+380"
                  readOnly
                  tabIndex={-1}
                  className={cn(
                    addCompanyInputClassName,
                    'w-[88px] shrink-0 bg-[#F4F4F4] text-[#666666]',
                  )}
                />
                <input
                  id="company-phone"
                  type="tel"
                  value={formState.phone}
                  onChange={(event) => {
                    updateFormField(setFormState, 'phone', event.target.value);
                    clearFieldError('phone');
                  }}
                  placeholder="Ввести номер"
                  className={cn(addCompanyInputClassName, fieldErrorClassName(fieldErrors.phone))}
                />
              </div>
            </FormField>

            <FormField
              id="company-email"
              label="Email"
              error={fieldErrors.email}
            >
              <input
                id="company-email"
                type="email"
                value={formState.email}
                onChange={(event) => {
                  updateFormField(setFormState, 'email', event.target.value);
                  clearFieldError('email');
                }}
                placeholder="example@company.com"
                className={cn(addCompanyInputClassName, fieldErrorClassName(fieldErrors.email))}
              />
            </FormField>

            <FormField
              id="company-website"
              label="Вебсайт"
              error={fieldErrors.websiteUrl}
            >
              <input
                id="company-website"
                type="url"
                value={formState.websiteUrl}
                onChange={(event) => {
                  updateFormField(setFormState, 'websiteUrl', event.target.value);
                  clearFieldError('websiteUrl');
                }}
                placeholder="https://www.example.com"
                className={cn(
                  addCompanyInputClassName,
                  fieldErrorClassName(fieldErrors.websiteUrl),
                )}
              />
            </FormField>

            <div className="grid gap-3 sm:grid-cols-3">
              <FormField
                id="company-telegram"
                label="Telegram"
                error={fieldErrors.telegram}
              >
                <input
                  id="company-telegram"
                  type="text"
                  value={formState.telegram}
                  onChange={(event) => {
                    updateFormField(setFormState, 'telegram', event.target.value);
                    clearFieldError('telegram');
                  }}
                  placeholder="@username"
                  className={cn(
                    addCompanyInputClassName,
                    fieldErrorClassName(fieldErrors.telegram),
                  )}
                />
              </FormField>

              <FormField
                id="company-viber"
                label="Viber"
                error={fieldErrors.viber}
              >
                <input
                  id="company-viber"
                  type="tel"
                  value={formState.viber}
                  onChange={(event) => {
                    updateFormField(setFormState, 'viber', event.target.value);
                    clearFieldError('viber');
                  }}
                  placeholder="Ввести номер телефону"
                  className={cn(addCompanyInputClassName, fieldErrorClassName(fieldErrors.viber))}
                />
              </FormField>

              <FormField
                id="company-instagram"
                label="Instagram"
                error={fieldErrors.instagram}
              >
                <input
                  id="company-instagram"
                  type="text"
                  value={formState.instagram}
                  onChange={(event) => {
                    updateFormField(setFormState, 'instagram', event.target.value);
                    clearFieldError('instagram');
                  }}
                  placeholder="@username"
                  className={cn(
                    addCompanyInputClassName,
                    fieldErrorClassName(fieldErrors.instagram),
                  )}
                />
              </FormField>
            </div>
          </div>
        ) : null}
      </div>

      {formError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {formError}
        </p>
      ) : null}

      {createOrganizationMutation.isSuccess ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Заявку надіслано. Організація з&apos;явиться в каталозі після модерації.
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {step > 1 ? (
          <Button
            type="button"
            variant="secondary"
            className="cursor-pointer rounded-full px-6"
            onClick={goToPreviousStep}
            disabled={createOrganizationMutation.isPending}
          >
            Повернутись назад
          </Button>
        ) : null}

        {step < 3 ? (
          <Button
            type="button"
            className="cursor-pointer rounded-full px-6"
            onClick={goToNextStep}
          >
            Далі
          </Button>
        ) : (
          <Button
            type="button"
            className="cursor-pointer rounded-full px-6"
            onClick={handleSubmit}
            disabled={createOrganizationMutation.isPending}
          >
            {createOrganizationMutation.isPending ? 'Збереження...' : 'Зберегти'}
          </Button>
        )}
      </div>
    </div>
  );
}
