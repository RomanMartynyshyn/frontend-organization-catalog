export function getCatalogApiBaseUrl(): string {
  const baseUrl = process.env.CATALOG_API_URL?.trim();

  if (!baseUrl) {
    throw new Error(
      'CATALOG_API_URL is not set. Copy .env.local.example to .env.local and set the catalog API base URL.',
    );
  }

  return baseUrl.replace(/\/$/, '');
}
