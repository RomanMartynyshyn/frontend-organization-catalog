export const routes = {
  home: '/',
  login: '/signin',
  register: '/signup',

  company: (id: string | number) => `/companies/${id}` as const,
} as const;
