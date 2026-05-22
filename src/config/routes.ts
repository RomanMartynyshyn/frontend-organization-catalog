export const routes = {
  home: '/',
  login: '/login',
  register: '/register',

  company: (slug: string) => `/companies/${slug}` as const,
} as const;
