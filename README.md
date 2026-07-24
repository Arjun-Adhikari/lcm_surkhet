# LCM Surkhet

Full-stack Next.js 15 cinema website for Laxmi Chalchitra Mandir, Surkhet.

## Stack

- **Next.js 15** (App Router) — frontend + API route handlers in one project
- **React 19** + **Tailwind CSS v4** + **shadcn/ui**
- **TanStack Query v5** — client-side data fetching
- **Prisma 6** + **PostgreSQL** — database ORM
- **TypeScript 5.5**
- **pnpm**

## Project Structure

```
src/
  app/
    api/              ← Next.js Route Handlers (server functions)
      movies/
      showtimes/
      events/
      gallery/
      announcements/
      settings/
    (public)/         ← Home page
    movies/           ← Movies listing + detail
    events/           ← Events listing
    gallery/          ← Photo gallery
    about/            ← About page
    contact/          ← Contact page
    coming-soon/      ← Coming Soon alias
    admin/            ← Admin panel (login, movies, showtimes, events, gallery, announcements, settings)
  components/         ← UI components (shadcn/ui + theme)
  layouts/            ← PublicLayout + AdminLayout
  lib/
    prisma.ts         ← PrismaClient singleton
    store.tsx         ← React Context + TanStack Query data store
    utils.ts          ← cn() helper
prisma/
  schema.prisma       ← Database schema
  seed.ts             ← Demo data seed
```

## Setup

1. **Copy environment file**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and set DATABASE_URL
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Generate Prisma client**
   ```bash
   pnpm db:generate
   ```

4. **Run database migration** (first time)
   ```bash
   pnpm db:migrate
   ```

5. **Seed demo data** (optional)
   ```bash
   pnpm db:seed
   ```

6. **Start development server**
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Admin Panel

Visit `/admin/login` — demo mode accepts any credentials.

## API Routes

All server logic lives in `src/app/api/` as Next.js Route Handlers:

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/movies` | List / create movies |
| GET/PATCH/DELETE | `/api/movies/[id]` | Get / update / delete movie |
| GET/POST | `/api/showtimes` | List / create showtimes |
| GET/PATCH/DELETE | `/api/showtimes/[id]` | Showtime CRUD |
| GET/POST | `/api/events` | List / create events |
| GET/PATCH/DELETE | `/api/events/[id]` | Event CRUD |
| GET/POST | `/api/gallery` | List / add gallery items |
| DELETE | `/api/gallery/[id]` | Delete gallery item |
| GET/POST | `/api/announcements` | List / create announcements |
| GET/PATCH/DELETE | `/api/announcements/[id]` | Announcement CRUD |
| GET/PATCH | `/api/settings` | Get / update cinema settings |
