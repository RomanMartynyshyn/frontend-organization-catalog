# Frontend-organization-catalog

Next.js (App Router) + TypeScript + Tailwind CSS v4 + TanStack Query + Axios. Каталог і сторінка організації підключені до Catalog API через BFF (`/api/*`) та SSR.

## Команди

```bash
npm install
npm run dev
npm run build
npm run lint
npm run format
```

Головна — це **каталог** (список карток). Детальний профіль: [http://localhost:3000/companies/1](http://localhost:3000/companies/1)

## Змінні середовища

Скопіюйте `.env.local.example` у `.env.local` і задайте `API_URL` (зовнішній API; на сервері через BFF `/api/*`, з браузера — лише на Next).

BFF-ендпоінти (проксі до upstream):

- `GET /api/categories`
- `GET /api/organizations?category_id=`
- `GET /api/organizations/:id`
