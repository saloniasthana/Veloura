# Veloura

A full-stack luxury fashion ecommerce storefront built with Next.js (App
Router) and Prisma/PostgreSQL — customer storefront, checkout, accounts, and
an admin dashboard, all in one app.

## Features

- **Storefront** — homepage, shop with filters/sort/pagination, product
  detail pages with a photo gallery
- **Cart & wishlist** — persisted client-side per browser
- **Accounts** — registration/login with hashed passwords and httpOnly
  session cookies, order history, saved addresses
- **Checkout** — address form, shipping method, payment method (UI only —
  see note below), order confirmation
- **Admin dashboard** — order management with status updates, product
  catalog CRUD with image upload, customer list, live stats
- Real product and marketing photography throughout

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion ·
Prisma 7 + PostgreSQL · JWT sessions (`jose`) · bcryptjs · Vercel Blob

## Getting started

You'll need a Postgres database — [Neon](https://neon.com) has a free tier
that takes about two minutes to set up (no credit card).

```bash
npm install

# copy the example env, then fill in DATABASE_URL (from Neon) and a JWT_SECRET
cp .env.example .env

# create the tables and seed products + the admin account
npx prisma migrate dev --name init
npm run db:seed

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin dashboard: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
— seeded credentials are `admin@veloura.com` / `veloura2026`.

Without `BLOB_READ_WRITE_TOKEN` set, admin product photo uploads save to
`public/uploads/products` on local disk — that's expected in local dev.

