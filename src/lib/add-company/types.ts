import { DEFAULT_CITY, DEFAULT_REGION } from '@/lib/add-company/constants';

export type AddCompanyFormState = {
  name: string;
  categoryId: number | null;
  description: string;
  workingDays: boolean[];
  workStartTime: string;
  workEndTime: string;
  street: string;
  city: string;
  region: string;
  postCode: string;
  districtId: number | null;
  latitude: string;
  longitude: string;
  phone: string;
  email: string;
  websiteUrl: string;
  telegram: string;
  viber: string;
  instagram: string;
};

export type FieldErrors = Record<string, string>;

export function createInitialFormState(): AddCompanyFormState {
  return {
    name: '',
    categoryId: null,
    description: '',
    workingDays: [false, false, false, false, false, false, false],
    workStartTime: '',
    workEndTime: '',
    street: '',
    city: DEFAULT_CITY,
    region: DEFAULT_REGION,
    postCode: '',
    districtId: null,
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    websiteUrl: '',
    telegram: '',
    viber: '',
    instagram: '',
  };
}
