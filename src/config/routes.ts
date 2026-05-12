export const routes = {
  home: '/',
  company: (slug: string) => `/companies/${slug}` as const,
} as const;
