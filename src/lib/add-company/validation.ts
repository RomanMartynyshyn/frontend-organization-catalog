import { WEEKDAY_LABELS } from '@/lib/add-company/constants';
import { resolveLocationAdminUnitId } from '@/lib/geocode/matchAdminUnits';
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

function normalizeFacebook(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/^http:\/\//i, 'https://');
  }

  const username = trimmed.replace(/^@/, '');
  return `https://www.facebook.com/${username}`;
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
  const phoneNumbers = state.phones
    .map(normalizePhone)
    .filter((value): value is string => Boolean(value));
  const instagram = normalizeInstagram(state.instagram);
  const telegram = normalizeTelegram(state.telegram);
  const facebook = normalizeFacebook(state.facebook);

  const socialLinks: CreateOrganizationPayload['socialLinks'] = {};

  if (instagram) {
    socialLinks.instagram = instagram;
  }

  if (telegram) {
    socialLinks.telegram = telegram;
  }

  if (facebook) {
    socialLinks.facebook = facebook;
  }

  const payload: CreateOrganizationPayload = {
    name: state.name.trim(),
    categoryIds: state.categoryId ? [state.categoryId] : [],
    locations: state.locations.map((location) => ({
      street: location.street.trim() || undefined,
      city: location.city.trim(),
      region: location.region.trim(),
      postCode: location.postCode.trim() || undefined,
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
      adminUnitId: resolveLocationAdminUnitId(location),
    })),
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

function validateLocation(
  location: AddCompanyFormState['locations'][number],
  index: number,
  errors: FieldErrors,
): void {
  const prefix = `locations.${index}`;
  const city = location.city.trim();
  const region = location.region.trim();

  if (!city) {
    errors[`${prefix}.city`] = 'Введіть населений пункт';
  } else if (city.length > 50) {
    errors[`${prefix}.city`] = 'Населений пункт не може перевищувати 50 символів';
  }

  if (!region) {
    errors[`${prefix}.region`] = 'Введіть область';
  } else if (region.length > 50) {
    errors[`${prefix}.region`] = 'Область не може перевищувати 50 символів';
  }

  if (location.street.trim().length > 50) {
    errors[`${prefix}.street`] = 'Адреса не може перевищувати 50 символів';
  }

  const postCode = location.postCode.trim();

  if (postCode && postCode.length !== 5) {
    errors[`${prefix}.postCode`] = 'Індекс має містити 5 цифр';
  }

  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);

  if (!location.latitude.trim() || !location.longitude.trim()) {
    errors[`${prefix}.street`] = 'Оберіть адресу зі списку підказок';
  } else if (
    Number.isNaN(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    Number.isNaN(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    errors[`${prefix}.street`] = 'Оберіть коректну адресу зі списку підказок';
  }
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
    state.locations.forEach((location, index) => {
      validateLocation(location, index, errors);
    });

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

    const facebook = normalizeFacebook(state.facebook);

    if (state.facebook.trim() && facebook && !isValidHttpsUrl(facebook)) {
      errors.facebook = 'Введіть коректне посилання або @username для Facebook';
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
  const phoneNumberMatch = field.match(/^contacts\.phoneNumbers\.(\d+)$/);

  if (phoneNumberMatch) {
    return `phones.${phoneNumberMatch[1]}`;
  }

  const categoryMatch = field.match(/^categoryIds(?:\.(\d+))?$/);

  if (categoryMatch) {
    return 'categoryId';
  }

  const locationMatch = field.match(/^locations\.(\d+)\.(.+)$/);

  if (locationMatch) {
    return `locations.${locationMatch[1]}.${locationMatch[2]}`;
  }

  if (field === 'locations') {
    return 'locations.0.street';
  }

  const mappings: Record<string, string> = {
    'categoryIds.0': 'categoryId',
    'categoryIds': 'categoryId',
    'contacts.email': 'email',
    'socialLinks.instagram': 'instagram',
    'socialLinks.telegram': 'telegram',
    'socialLinks.facebook': 'facebook',
    websiteUrl: 'websiteUrl',
    workingHours: 'workingHours',
    description: 'description',
    name: 'name',
  };

  return mappings[field] ?? field;
}
