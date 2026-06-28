# Frontend-organization-catalog

Веб-додаток каталогу організацій Криворізького регіону. Next.js (App Router) + TypeScript + Tailwind CSS v4 + TanStack Query + Axios. Дані з Catalog API отримуються через BFF (`/api/*`) на сервері; з браузера — лише на Next.js.

## Команди

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run format
```

Після `npm run dev` відкрийте [http://localhost:3000](http://localhost:3000).

## Змінні середовища

Скопіюйте `.env.local.example` у `.env.local`:

| Змінна | Опис |
|--------|------|
| `API_URL` | URL upstream Catalog API (лише на сервері Next.js) |
| `NOMINATIM_USER_AGENT` | Необовʼязково. User-Agent для запитів до OpenStreetMap Nominatim |

## Маршрути

| Шлях | Опис |
|------|------|
| `/` | Каталог організацій з фільтрами |
| `/companies/[id]` | Сторінка організації |
| `/companies/add` | Форма додавання організації |
| `/admin` | Адмін-панель (модерація заявок) |
| `/about`, `/support`, `/privacy` | Статичні сторінки |

## BFF-ендпоінти

Проксі до upstream API та допоміжні маршрути:

- `GET /api/categories` — категорії
- `GET /api/organizations` — список (`category_id`, `adminUnitId`, пагінація)
- `GET /api/organizations/:id` — деталі організації
- `POST /api/organizations` — створення організації
- `GET /api/districts` — райони (`admin-units` з `type=district`)
- `GET /api/communities` — громади (`type=community`)
- `GET /api/geocode/search?q=` — автопідказки адрес (Nominatim)
- `GET /api/admin/organizations` — заявки для модерації
- `PUT /api/admin/organizations/:id/status` — зміна статусу заявки

## Адмін-панель

Сторінка модерації: [http://localhost:3000/admin](http://localhost:3000/admin)

Призначення — перегляд і обробка заявок на додавання організацій. Нові записи з форми `/companies/add` потрапляють у статус `pending` і зʼявляються в каталозі лише після підтвердження.

### Вкладки за статусом

| Статус | Опис |
|--------|------|
| `pending` | Очікують модерації |
| `approved` | Активні (видимі в каталозі) |
| `rejected` | Відхилені |
| `archived` | Архів |

### Можливості

- пошук за назвою організації (debounce ~300 ms, параметр `search` на BFF);
- таблиця з назвою, категорією, адресою, датою створення;
- перегляд картки організації в новій вкладці;
- **Підтвердити** → `approved`;
- **Відхилити** → `rejected` (опційна причина у модальному вікні);
- **В архів** → `archived`;
- пагінація по 15 записів (`offset` / `limit`).

Код UI: `src/app/(admin)/admin/`, клієнт API: `src/lib/admin-api/organizations.ts`.

> Авторизація на фронтенді поки не підключена — `/admin` доступна без входу. Сторінки `/signin` і `/signup` є в проєкті, але не захищають адмін-маршрути.

## Фільтри каталогу

У URL зберігаються параметри пошуку (`nuqs`):

- `categoryId` — категорія
- `adminUnitId` — район або громада (можна кілька значень)
- `q` — текстовий пошук

На головній сторінці фільтри «Район» і «Громада» працюють через `adminUnitId`.

## Форма додавання організації

Багатокрокова форма (`/companies/add`):

1. Інформація про організацію
2. Режим роботи
3. Контакти та адреси

Для кожної адреси:

- **Адреса** — автопідказки через Nominatim (обовʼязковий вибір зі списку для координат)
- **Поштовий індекс**, **Населений пункт**, **Район**, **Громада**

Після вибору адреси з підказок автоматично заповнюються:

- координати (`latitude`, `longitude`)
- поштовий індекс
- населений пункт (`city` / `town` / `village` з Nominatim)
- район або громада (за `borough`, `municipality` тощо)

За замовчуванням населений пункт — «Кривий Ріг»; область — «Дніпропетровська область» (не показується в UI). У payload на бекенд передається один `adminUnitId` (пріоритет — обраний район).

## Структура проєкту

```
src/
  app/                    # App Router, BFF routes, сторінки
  components/             # UI-компоненти
  lib/
    catalog-api/          # клієнт API, мапінг, query keys
    admin-api/            # клієнт адмін-панелі (модерація)
    geocode/              # збагачення підказок, match admin units
    nominatim/            # клієнт Nominatim
    add-company/          # типи форми, валідація, payload
  types/                  # типи Catalog API
```

## Зовнішні сервіси

- **Catalog API** — основні дані (`API_URL`)
- **OpenStreetMap Nominatim** — геокодування адрес у формі додавання ([політика використання](https://operations.osmfoundation.org/policies/nominatim/))
