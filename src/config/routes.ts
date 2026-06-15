export const routes = {
  home: '/',
  login: '/signin',
  register: '/signup',
  addCompany: '/companies/add',

  company: (id: string | number) => `/companies/${id}` as const,
} as const;
