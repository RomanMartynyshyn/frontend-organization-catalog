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
import { StreetAddressAutocomplete } from '@/components/add-company/StreetAddressAutocomplete';
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
  createInitialLocation,
  type AddCompanyFormState,
  type FieldErrors,
  type LocationFormState,
} from '@/lib/add-company/types';
import { organizationsQueryKeys } from '@/lib/catalog-api/organizationsQuery';
import { getAdminUnitSelectValue, formatAdminUnitShortName } from '@/lib/catalog-api/adminUnitHelpers';
import { cn } from '@/lib/cn';
import type {
  ApiErrorResponse,
  CatalogCategory,
  CatalogAdminUnit,
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

async function fetchDistrictAdminUnits(): Promise<CatalogAdminUnit[]> {
  const response = await fetch('/api/districts');

  if (!response.ok) {
    throw new Error('Failed to fetch districts');
  }

  return (await response.json()) as CatalogAdminUnit[];
}

async function fetchCommunityAdminUnits(): Promise<CatalogAdminUnit[]> {
  const response = await fetch('/api/communities');

  if (!response.ok) {
    throw new Error('Failed to fetch communities');
  }

  return (await response.json()) as CatalogAdminUnit[];
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

function updatePhone(
  setter: Dispatch<SetStateAction<AddCompanyFormState>>,
  index: number,
  value: string,
) {
  setter((current) => ({
    ...current,
    phones: current.phones.map((phone, phoneIndex) =>
      phoneIndex === index ? value : phone,
    ),
  }));
}

function addPhone(setter: Dispatch<SetStateAction<AddCompanyFormState>>) {
  setter((current) => ({
    ...current,
    phones: [...current.phones, ''],
  }));
}

function removePhone(
  setter: Dispatch<SetStateAction<AddCompanyFormState>>,
  index: number,
) {
  setter((current) => ({
    ...current,
    phones:
      current.phones.length > 1
        ? current.phones.filter((_, phoneIndex) => phoneIndex !== index)
        : current.phones,
  }));
}

function hasPhoneFieldError(fieldErrors: FieldErrors): boolean {
  return Object.keys(fieldErrors).some(
    (field) => field === 'phones' || field.startsWith('phones.'),
  );
}

function hasLocationFieldError(fieldErrors: FieldErrors): boolean {
  return Object.keys(fieldErrors).some(
    (field) => field === 'locations' || field.startsWith('locations.'),
  );
}

function updateLocationField(
  setter: Dispatch<SetStateAction<AddCompanyFormState>>,
  index: number,
  field: keyof LocationFormState,
  value: LocationFormState[keyof LocationFormState],
) {
  setter((current) => ({
    ...current,
    locations: current.locations.map((location, locationIndex) =>
      locationIndex === index ? { ...location, [field]: value } : location,
    ),
  }));
}

function addLocation(setter: Dispatch<SetStateAction<AddCompanyFormState>>) {
  setter((current) => ({
    ...current,
    locations: [...current.locations, createInitialLocation()],
  }));
}

function removeLocation(
  setter: Dispatch<SetStateAction<AddCompanyFormState>>,
  index: number,
) {
  setter((current) => ({
    ...current,
    locations:
      current.locations.length > 1
        ? current.locations.filter((_, locationIndex) => locationIndex !== index)
        : current.locations,
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
    queryFn: fetchDistrictAdminUnits,
  });

  const {
    data: communities = [],
    isLoading: isCommunitiesLoading,
    isError: isCommunitiesError,
  } = useQuery({
    queryKey: ['communities'],
    queryFn: fetchCommunityAdminUnits,
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

        if (
          hasLocationFieldError(error.fieldErrors) ||
          error.fieldErrors.email ||
          error.fieldErrors.websiteUrl ||
          hasPhoneFieldError(error.fieldErrors) ||
          error.fieldErrors.telegram ||
          error.fieldErrors.instagram ||
          error.fieldErrors.facebook
        ) {
          setStep(3);
          return;
        }

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
          <div className="space-y-5">
            {formState.locations.map((location, locationIndex) => {
              const streetKey = `locations.${locationIndex}.street`;
              const postCodeKey = `locations.${locationIndex}.postCode`;
              const adminUnitKey = `locations.${locationIndex}.adminUnitId`;
              const streetError = fieldErrors[streetKey];
              const postCodeError = fieldErrors[postCodeKey];
              const adminUnitError = fieldErrors[adminUnitKey];

              return (
                <div
                  key={`location-${locationIndex}`}
                  className="space-y-3 rounded-xl border border-black/10 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-eUkraine text-sm font-semibold text-black">
                      Адреса {locationIndex + 1}
                    </h3>
                    {formState.locations.length > 1 ? (
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-8 px-3 text-xs"
                        onClick={() => {
                          removeLocation(setFormState, locationIndex);
                        }}
                      >
                        Видалити адресу
                      </Button>
                    ) : null}
                  </div>

                  <FormField
                    id={`company-street-${locationIndex}`}
                    label="Адреса"
                    required
                    error={streetError}
                  >
                    <StreetAddressAutocomplete
                      id={`company-street-${locationIndex}`}
                      value={location.street}
                      error={streetError}
                      onValueChange={(street) => {
                        updateLocationField(setFormState, locationIndex, 'street', street);
                        clearFieldError(streetKey);
                      }}
                      onManualEdit={() => {
                        setFormState((current) => ({
                          ...current,
                          locations: current.locations.map((item, index) =>
                            index === locationIndex
                              ? {
                                  ...item,
                                  latitude: '',
                                  longitude: '',
                                  districtAdminUnitId: null,
                                  communityAdminUnitId: null,
                                }
                              : item,
                          ),
                        }));
                      }}
                      onAddressSelect={({
                        street,
                        latitude,
                        longitude,
                        postCode,
                        districtAdminUnitId,
                        communityAdminUnitId,
                      }) => {
                        setFormState((current) => ({
                          ...current,
                          locations: current.locations.map((item, index) =>
                            index === locationIndex
                              ? {
                                  ...item,
                                  street,
                                  latitude,
                                  longitude,
                                  postCode: postCode?.trim() || item.postCode,
                                  districtAdminUnitId: districtAdminUnitId ?? null,
                                  communityAdminUnitId: communityAdminUnitId ?? null,
                                }
                              : item,
                          ),
                        }));
                        clearFieldError(streetKey);
                        clearFieldError(postCodeKey);
                        clearFieldError(adminUnitKey);
                      }}
                    />
                  </FormField>

                  <FormField
                    id={`company-post-code-${locationIndex}`}
                    label="Поштовий індекс"
                    error={postCodeError}
                  >
                    <input
                      id={`company-post-code-${locationIndex}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      value={location.postCode}
                      onChange={(event) => {
                        updateLocationField(
                          setFormState,
                          locationIndex,
                          'postCode',
                          event.target.value.replace(/\D/g, '').slice(0, 5),
                        );
                        clearFieldError(postCodeKey);
                      }}
                      placeholder="50000"
                      className={cn(
                        addCompanyInputClassName,
                        fieldErrorClassName(postCodeError),
                      )}
                    />
                  </FormField>

                  <FormField
                    id={`company-district-${locationIndex}`}
                    label="Район"
                    error={adminUnitError}
                  >
                    <select
                      id={`company-district-${locationIndex}`}
                      value={getAdminUnitSelectValue(
                        location.districtAdminUnitId,
                        districts,
                      )}
                      onChange={(event) => {
                        const value = event.target.value;
                        updateLocationField(
                          setFormState,
                          locationIndex,
                          'districtAdminUnitId',
                          value ? Number(value) : null,
                        );
                        if (value) {
                          updateLocationField(
                            setFormState,
                            locationIndex,
                            'communityAdminUnitId',
                            null,
                          );
                        }
                        clearFieldError(adminUnitKey);
                      }}
                      disabled={isDistrictsLoading || isDistrictsError}
                      className={cn(
                        addCompanySelectClassName,
                        fieldErrorClassName(adminUnitError),
                      )}
                    >
                      <option value="">Обрати район</option>
                      {districts.map((unit) => (
                        <option key={unit.adminUnitId} value={unit.adminUnitId}>
                          {formatAdminUnitShortName(unit)}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField
                    id={`company-community-${locationIndex}`}
                    label="Громада"
                    error={adminUnitError}
                  >
                    <select
                      id={`company-community-${locationIndex}`}
                      value={getAdminUnitSelectValue(
                        location.communityAdminUnitId,
                        communities,
                      )}
                      onChange={(event) => {
                        const value = event.target.value;
                        updateLocationField(
                          setFormState,
                          locationIndex,
                          'communityAdminUnitId',
                          value ? Number(value) : null,
                        );
                        if (value) {
                          updateLocationField(
                            setFormState,
                            locationIndex,
                            'districtAdminUnitId',
                            null,
                          );
                        }
                        clearFieldError(adminUnitKey);
                      }}
                      disabled={isCommunitiesLoading || isCommunitiesError}
                      className={cn(
                        addCompanySelectClassName,
                        fieldErrorClassName(adminUnitError),
                      )}
                    >
                      <option value="">Обрати громаду</option>
                      {communities.map((unit) => (
                        <option key={unit.adminUnitId} value={unit.adminUnitId}>
                          {formatAdminUnitShortName(unit)}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>
              );
            })}

            <Button
              type="button"
              variant="secondary"
              className="h-9 px-3 text-sm"
              onClick={() => addLocation(setFormState)}
            >
              Додати адресу
            </Button>

            {isDistrictsError ? (
              <p className="text-xs text-red-600">Не вдалося завантажити райони.</p>
            ) : null}

            {isCommunitiesError ? (
              <p className="text-xs text-red-600">Не вдалося завантажити громади.</p>
            ) : null}

            <div className="space-y-2">
              <p className="text-sm font-medium text-[#1A1A1A]">Телефон</p>
              {formState.phones.map((phone, index) => {
                const phoneFieldKey = `phones.${index}`;
                const phoneError = fieldErrors[phoneFieldKey];

                return (
                  <div key={phoneFieldKey} className="space-y-1">
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
                      id={index === 0 ? 'company-phone' : undefined}
                      type="tel"
                      value={phone}
                      onChange={(event) => {
                        updatePhone(setFormState, index, event.target.value);
                        clearFieldError(phoneFieldKey);
                      }}
                      placeholder="Ввести номер"
                      className={cn(
                        addCompanyInputClassName,
                        fieldErrorClassName(phoneError),
                      )}
                    />
                    {formState.phones.length > 1 ? (
                      <Button
                        type="button"
                        variant="secondary"
                        className="shrink-0 px-3"
                        onClick={() => {
                          removePhone(setFormState, index);
                          clearFieldError(phoneFieldKey);
                        }}
                      >
                        Видалити
                      </Button>
                    ) : null}
                    </div>
                    {phoneError ? (
                      <p className="text-xs text-red-600">{phoneError}</p>
                    ) : null}
                  </div>
                );
              })}
              <Button
                type="button"
                variant="secondary"
                className="h-9 px-3 text-sm"
                onClick={() => addPhone(setFormState)}
              >
                Додати номер
              </Button>
            </div>

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

              <FormField
                id="company-facebook"
                label="Facebook"
                error={fieldErrors.facebook}
              >
                <input
                  id="company-facebook"
                  type="text"
                  value={formState.facebook}
                  onChange={(event) => {
                    updateFormField(setFormState, 'facebook', event.target.value);
                    clearFieldError('facebook');
                  }}
                  placeholder="@username"
                  className={cn(
                    addCompanyInputClassName,
                    fieldErrorClassName(fieldErrors.facebook),
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
