import { WEEKDAY_LABELS } from '@/lib/add-company/constants';
import type { AddCompanyFormState, FieldErrors } from '@/lib/add-company/types';
import type { CreateOrganizationPayload } from '@/types/catalog-api';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeInstagram(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/^http:\/\//i, 'https://');
  }

  const username = trimmed.replace(/^@/, '');
  return `https://www.instagram.com/${username}`;
}

function normalizeTelegram(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/^http:\/\//i, 'https://');
  }

  const username = trimmed.replace(/^@/, '');
  return `https://t.me/${username}`;
}

export function buildWorkingHours(state: AddCompanyFormState): string | undefined {
  const selectedDays = WEEKDAY_LABELS.filter((_, index) => state.workingDays[index]);

  if (
    selectedDays.length === 0 &&
    !state.workStartTime.trim() &&
    !state.workEndTime.trim()
  ) {
    return undefined;
  }

  const start = state.workStartTime.trim();
  const end = state.workEndTime.trim();

  if (selectedDays.length > 0 && start && end) {
    return `${selectedDays.join(', ')}: ${start}-${end}`.slice(0, 100);
  }

  if (selectedDays.length > 0) {
    return selectedDays.join(', ').slice(0, 100);
  }

  if (start && end) {
    return `${start}-${end}`.slice(0, 100);
  }

  return undefined;
}

function normalizePhone(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith('+')) {
    return trimmed;
  }

  if (trimmed.startsWith('380')) {
    return `+${trimmed}`;
  }

  return `+380${trimmed.replace(/^0/, '')}`;
}

export function buildCreateOrganizationPayload(
  state: AddCompanyFormState,
): CreateOrganizationPayload {
  const phoneNumbers = [
    normalizePhone(state.phone),
    normalizePhone(state.viber),
  ].filter((value): value is string => Boolean(value));
  const instagram = normalizeInstagram(state.instagram);
  const telegram = normalizeTelegram(state.telegram);

  const socialLinks: CreateOrganizationPayload['socialLinks'] = {};

  if (instagram) {
    socialLinks.instagram = instagram;
  }

  if (telegram) {
    socialLinks.telegram = telegram;
  }

  const payload: CreateOrganizationPayload = {
    name: state.name.trim(),
    categoryIds: state.categoryId ? [state.categoryId] : [],
    locations: [
      {
        street: state.street.trim() || undefined,
        city: state.city.trim(),
        region: state.region.trim(),
        postCode: state.postCode.trim() || undefined,
        latitude: Number(state.latitude),
        longitude: Number(state.longitude),
        districtId: state.districtId ?? undefined,
      },
    ],
  };

  const description = state.description.trim();

  if (description) {
    payload.description = description;
  }

  const websiteUrl = state.websiteUrl.trim();

  if (websiteUrl) {
    payload.websiteUrl = websiteUrl;
  }

  const workingHours = buildWorkingHours(state);

  if (workingHours) {
    payload.workingHours = workingHours;
  }

  const email = state.email.trim();

  if (email || phoneNumbers.length > 0) {
    payload.contacts = {
      ...(email ? { email } : {}),
      ...(phoneNumbers.length > 0 ? { phoneNumbers } : {}),
    };
  }

  if (Object.keys(socialLinks).length > 0) {
    payload.socialLinks = socialLinks;
  }

  return payload;
}

export function validateStep(
  step: 1 | 2 | 3,
  state: AddCompanyFormState,
): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 1) {
    const name = state.name.trim();

    if (!name) {
      errors.name = 'Введіть назву організації';
    } else if (name.length < 2 || name.length > 255) {
      errors.name = 'Назва має містити від 2 до 255 символів';
    }

    if (!state.categoryId) {
      errors.categoryId = 'Оберіть категорію';
    }

    if (state.description.trim().length > 1000) {
      errors.description = 'Опис не може перевищувати 1000 символів';
    }
  }

  if (step === 2) {
    const workingHoursPreview = buildWorkingHours(state);

    if (workingHoursPreview && workingHoursPreview.length > 100) {
      errors.workingHours = 'Графік роботи не може перевищувати 100 символів';
    }
  }

  if (step === 3) {
    const city = state.city.trim();
    const region = state.region.trim();

    if (!city) {
      errors.city = 'Введіть місто';
    } else if (city.length > 50) {
      errors.city = 'Місто не може перевищувати 50 символів';
    }

    if (!region) {
      errors.region = 'Введіть область';
    } else if (region.length > 50) {
      errors.region = 'Область не може перевищувати 50 символів';
    }

    if (state.street.trim().length > 50) {
      errors.street = 'Адреса не може перевищувати 50 символів';
    }

    const postCode = state.postCode.trim();

    if (postCode && postCode.length !== 5) {
      errors.postCode = 'Індекс має містити 5 цифр';
    }

    const latitude = Number(state.latitude);
    const longitude = Number(state.longitude);

    if (!state.latitude.trim()) {
      errors.latitude = 'Вкажіть широту';
    } else if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
      errors.latitude = 'Широта має бути числом від -90 до 90';
    }

    if (!state.longitude.trim()) {
      errors.longitude = 'Вкажіть довготу';
    } else if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
      errors.longitude = 'Довгота має бути числом від -180 до 180';
    }

    const email = state.email.trim();

    if (email && !isValidEmail(email)) {
      errors.email = 'Введіть коректну email-адресу';
    }

    const websiteUrl = state.websiteUrl.trim();

    if (websiteUrl && !isValidHttpsUrl(websiteUrl)) {
      errors.websiteUrl = 'Сайт має бути коректним HTTPS-посиланням';
    }

    const instagram = normalizeInstagram(state.instagram);

    if (state.instagram.trim() && instagram && !isValidHttpsUrl(instagram)) {
      errors.instagram = 'Введіть коректне посилання або @username для Instagram';
    }

    const telegram = normalizeTelegram(state.telegram);

    if (state.telegram.trim() && telegram && !isValidHttpsUrl(telegram)) {
      errors.telegram = 'Введіть коректне посилання або @username для Telegram';
    }
  }

  return errors;
}

export function validateAllSteps(state: AddCompanyFormState): FieldErrors {
  return {
    ...validateStep(1, state),
    ...validateStep(2, state),
    ...validateStep(3, state),
  };
}

export function mapApiFieldToFormField(field: string): string {
  const mappings: Record<string, string> = {
    'categoryIds.0': 'categoryId',
    'categoryIds': 'categoryId',
    'locations.0.city': 'city',
    'locations.0.region': 'region',
    'locations.0.street': 'street',
    'locations.0.postCode': 'postCode',
    'locations.0.latitude': 'latitude',
    'locations.0.longitude': 'longitude',
    'locations.0.districtId': 'districtId',
    'locations': 'street',
    'contacts.email': 'email',
    'contacts.phoneNumbers.0': 'phone',
    'socialLinks.instagram': 'instagram',
    'socialLinks.telegram': 'telegram',
    'socialLinks.facebook': 'instagram',
    websiteUrl: 'websiteUrl',
    workingHours: 'workingHours',
    description: 'description',
    name: 'name',
  };

  return mappings[field] ?? field;
}
