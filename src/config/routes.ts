export const routes = {
  home: '/',
  login: '/signin',
  register: '/signup',

  company: (slug: string) => `/companies/${slug}` as const,
} as const;
