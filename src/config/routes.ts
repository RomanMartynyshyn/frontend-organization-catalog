export const routes = {
  home: '/',
  login: '/signin',
  register: '/signup',
  addCompany: '/companies/add',
  admin: '/admin',

  company: (id: string | number) => `/companies/${id}` as const,
} as const;
