export const routes = {
  home: '/',
  login: '/signin',
  register: '/signup',
  addCompany: '/companies/add',
  admin: '/admin',
  about: '/about',
  privacy: '/privacy',
  support: '/support',

  company: (id: string | number) => `/companies/${id}` as const,
} as const;
