# JustInns

A booking site for hotels, inns and pension houses — the 2024 IT37GLO PHP/MySQL school project, rebuilt with **Next.js 16, Drizzle ORM, Neon Postgres, Better Auth and Neon Object Storage**.

> Demo only. Every lodging, address, review and person is invented, and checkout records a simulated payment — no gateway, no card details.

## Features

- Browse and search hotels, inns and pensions; photo gallery, amenities, room types, reviews
- Live availability per room type and date range, discount codes, price quote
- Booking with a simulated payment; double-booking is blocked by a Postgres exclusion constraint
- My trips (cancel before check-in), saved favorites, profile, reviews after a stay
- Admin: dashboard stats, create/edit/delete lodgings, room types, rooms, photo uploads to Neon storage, manage booking status
- Email/password auth with Better Auth (guest and admin roles)

## Architecture

```
Neon Postgres ─ Drizzle ORM (src/db)
  └─ services/*.service.ts      business rules + queries
     └─ usecases/*.usecase.ts   one use case per service function: validation (zod), mapping, orchestration
        └─ app/api/**/route.ts  one route handler per use case
           └─ stores/*.store.ts       Zustand state + API calls
              └─ composables/use-*.ts reusable hooks
                 └─ components/ + app/**/page.tsx
```

## Getting started

```bash
npm install
cp .env.example .env          # fill in DATABASE_URL, BETTER_AUTH_SECRET, AWS_* (Neon storage)
npm run db:push               # or apply drizzle/*.sql (0001 adds the no-overlap constraint)
npm run db:seed               # fictional lodgings, rooms, reviews and demo users
npm run dev
```

Demo logins (password `justinns-demo`): `guest@justinns.test`, `admin@justinns.test`.

### Images

Admin uploads go straight to the Neon Object Storage bucket (`S3_BUCKET`, public-read).
The seed illustrations are generated SVGs (`scripts/lib/art.ts`), served by `/api/seed-images/*` by default.
To host them in the bucket too: `npm run images:upload`, then set `SEED_IMAGES_IN_STORAGE=true`.

### Local Postgres

If `DATABASE_URL` points at `localhost`, the app uses node-postgres instead of Neon's HTTP driver, so you can develop offline.

## What changed from the PHP version

- Passwords were unsalted MD5 → Better Auth (scrypt) sessions
- Availability counted cancelled bookings and missed some overlaps → correct `[check_in, check_out)` overlap check plus a DB exclusion constraint
- Prices and discounts were carried in the session → recomputed on the server at booking time
- Hard-coded `localhost` URLs, duplicate `dashbaords/` folder, empty scripts, `Last_Accessed:` column name → removed
- Anyone could post reviews → only guests whose stay has started, one review per place

## Repositories

`justinns-private` is the source of truth; `.github/workflows/mirror-to-public.yml` mirrors every push to the public `justinns` repo.
