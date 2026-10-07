# Wiplay B2B Catalog

Production-ready Next.js 16 catalog foundation for playground equipment, outdoor fitness, urban furniture and safety flooring.

## Run locally

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. The quote basket is stored in the browser and submissions are posted to `/api/quotations`.

## Deploy

1. Create a Supabase project and copy the pooler URL to `DATABASE_URL` and direct URL to `DIRECT_URL`.
2. Add environment variables in Vercel.
3. Run `npx prisma db push && npm run db:seed` from a trusted deployment shell.
4. Configure a Supabase Storage bucket named `catalog-media` for the admin upload adapter.
5. Replace demo SVGs with optimized images and set `NEXT_PUBLIC_SITE_URL`.

## Architecture

- `app/`: App Router pages, API routes and metadata
- `lib/db.ts`: Prisma singleton
- `prisma/schema.prisma`: catalog, quotation and CMS data model
- `prisma/seed.ts`: demo catalog
- `app/admin`: protected CMS surface to connect to your auth provider

## Admin

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` in `.env`. Generate a hash with `node -e "console.log(require('bcryptjs').hashSync('YourStrongPassword', 12))"`. Open `/admin/login`. Sessions are HttpOnly, signed, SameSite=Lax and expire after eight hours. In production, create an ADMIN user with a bcrypt password through the seed or a protected provisioning script.

## Storage

Create a public Supabase Storage bucket named `catalog-media`, then set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Admin uploads use `/api/admin/upload`; never expose the service role key to browser code.

## Security checklist

- Set a random `ADMIN_SESSION_SECRET` of at least 32 characters.
- Set only a bcrypt `ADMIN_PASSWORD_HASH`; never store a plaintext admin password in production.
- Use Supabase pooler for `DATABASE_URL` and direct TLS URL for `DIRECT_URL`.
- Create the `catalog-media` bucket and keep `SUPABASE_SERVICE_ROLE_KEY` server-side.
- Run `npm audit --omit=dev` and resolve critical/high findings before deployment.
- Deploy over HTTPS and verify `/admin`, `/api/admin/*`, security headers, upload limits and login rate limiting.
- The included rate limiter is per process. For multi-region/serverless deployments, replace its map with a shared Redis/Upstash limiter.

## Security commands

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm audit --omit=dev
npm run build
npm run start
```

## Frontend media

The redesigned public pages use distinct editorial photography URLs for the demo catalog. Replace these demo references with your licensed company photography or Supabase Storage URLs before commercial launch; the database, Admin, APIs and security layer are unchanged.

## WhatsApp configuration

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env` using international digits only (for example `2126XXXXXXXX`). The floating button, product CTA, quote page and contact page generate URL encoded French or Arabic messages. After the first database push, `npm run db:seed` creates the `Settings` row; an administrator can update the number through `PATCH /api/settings`.

## Production database

Set `DATABASE_URL`, `DIRECT_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `NEXT_PUBLIC_WHATSAPP_NUMBER` before running `npx prisma db push` and `npm run db:seed`.
