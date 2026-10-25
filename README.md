# Caribbean Jobs

Job board connecting Caribbean employers and job seekers. Next.js 16 (App Router) + Supabase, deployed on Vercel. Live at https://carribeanjobs.online.

## How jobs get onto the site

1. **Employer submissions**: `/post-job`. Every submission is saved as `draft` / `pending` and only goes live when an admin publishes it.
2. **Imports**: approved sources (Greenhouse, Lever, RSS, JSON API, career pages) run daily via Vercel Cron at `/api/cron/import-jobs`. Imports wait for review unless the source is marked "trusted auto publish".
3. **Review**: `/admin/imports` (review queue, live jobs, featured requests, contact messages, sources).

Candidates apply **directly to the employer**, by the job's application email or application link. The site does not collect resumes.

Jobs stay live for 30 days after publishing (extendable in admin). The daily cron closes expired jobs.

**Featured listings** are paid. Employers tick "Request a Featured listing" when posting; the request shows in admin, and an admin clicks "Mark featured (paid)" once the fee is received.

## Environment variables (Vercel → Settings → Environment Variables)

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Public read access to live jobs |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-only writes (submissions, admin, imports). Never expose to the browser. |
| `ADMIN_SECRET` | yes | Password for `/admin` (username `admin` unless `ADMIN_USER` is set). If unset, admin is locked for everyone. |
| `ADMIN_USER` | no | Admin username (default `admin`) |
| `CRON_SECRET` | yes | Vercel sends it to the cron route automatically |
| `NEXT_PUBLIC_SITE_URL` | no | Defaults to `https://carribeanjobs.online` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | no | Public contact / report address. Defaults to `hello@carribeanjobs.online`; it must be a real mailbox. |

## Database

- New project: run `supabase/schema.sql` once in Supabase → SQL Editor (safe to re-run).
- Future schema changes go in `supabase/migrations/` (dated files), applied in order **before** deploying the code that needs them; `schema.sql` is kept up to date as the full current schema.

## Development

```bash
npm ci
npm run dev        # http://localhost:3000
npm run lint
npx next build
```

This project uses Next.js 16: middleware is now `src/proxy.ts`. Read `node_modules/next/dist/docs/` before relying on older Next.js conventions.
