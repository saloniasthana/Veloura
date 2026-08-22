# Veloura

A full-stack luxury fashion ecommerce storefront built with Next.js (App
Router), Prisma, and SQLite — customer storefront, checkout, accounts, and
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
Prisma 7 + SQLite · JWT sessions (`jose`) · bcryptjs

## Getting started

```bash
npm install

# copy the example env and fill in a JWT secret
cp .env.example .env

# create the database and seed products + the admin account
npx prisma migrate dev
npm run db:seed

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin dashboard: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
— seeded credentials are `admin@veloura.com` / `veloura2026`.

## Notes

This is a portfolio/demo project, not production-ready as-is:

- **Payments are simulated** — checkout does not process a real
  transaction with any payment provider.
- **Uploaded product images** are written to the local filesystem
  (`public/uploads/products`), which works for local development but not
  for serverless hosting — swap in an object store (S3, Cloudinary, etc.)
  before deploying.
- Cart and wishlist are stored in the browser (`localStorage`), not the
  database.
