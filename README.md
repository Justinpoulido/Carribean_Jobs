# Caribbean Jobs

Public site for the Caribbean Jobs Facebook Page: https://carribeanjobs.online

Approved vacancies live in the Supabase `jobs` table. The homepage, `/jobs`, and `/jobs/[slug]` all read that table. There is no sample job data in the site.

## Local setup

```bash
npm install
npm run dev
```

Without Supabase environment variables the site still builds and shows “No open roles yet — employers, post a vacancy”.

## Fresh Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run the whole file `supabase/migrations/20261113043000_jobs_board.sql`.
   It creates `jobs` (and the related tables the site already uses), indexes, the slug trigger, and the row level security policies. It is safe to run more than once.
   The same file sets `status = 'closed'` on job ids 1 and 2 when those rows exist, and does nothing when they do not.
3. In Project Settings → API, copy the project URL and the anon public key.
4. In Vercel → Project → Settings → Environment Variables, add the names below. Do not commit the values.

## Environment variables

| Name | Where | Required | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Yes, to show and accept jobs | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Yes, to show and accept jobs | Public anon key. Safe for the browser. |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel, server only | Only for the existing import cron | Bypasses row level security. Never use it in client code and never commit it. |
| `CONTACT_EMAIL` | Vercel | No | Footer address. Defaults to `hello@caribbeanjobs.com`. |
| `NOTIFY_EMAIL` | Vercel | No | Inbox for new submissions. Defaults to `Jpoulido@gmail.com`. |
| `RESEND_API_KEY` | Vercel, server only | No | Sends the notification. If it is missing, the submission is still saved. |
| `NOTIFY_FROM_EMAIL` | Vercel | No | From address on a domain verified in Resend. Required together with `RESEND_API_KEY`. |

## Jobs table

Public visitors can read a row only when `status = 'approved'`. They can insert a row only when `status = 'pending'`. They cannot update or delete rows.

A listing is shown only when it is approved, has an application email or URL, and the closing date has not passed. With no closing date, it drops off 30 days after it was posted. The job page then says “This role is closed”.

Important columns:

| Column | Meaning |
| --- | --- |
| `slug` | Public URL, filled by the insert trigger, for example `sales-representative-penal-1` |
| `title`, `company_name`, `city`, `country` | Shown on the board |
| `category`, `job_type`, `work_mode` | Filters |
| `description`, `requirements` | Job page |
| `application_email`, `application_link` | How to apply. At least one is required before a job can be public |
| `salary_min`, `salary_max`, `currency`, `pay_period` | Shown as `TTD 7,700 – 8,000 / month` |
| `poster_name`, `contact_email` | The person who submitted the form. Not shown publicly |
| `expires_at` | Closing date |
| `is_featured` | Homepage highlight after approval. The fee is confirmed by email |
| `status` | `pending` (new), `approved` (live), `closed` (unpublished), `rejected` |

## Approval

There is no admin login yet.

1. An employer submits `/post-job`. The row is inserted with `status = 'pending'` and does not appear on the site.
2. Open the Supabase Table Editor, `jobs` table.
3. Check the employer, the town, and that an application email or URL is present.
4. Set `status` to `approved` to publish it.
5. Set `status` to `closed` to unpublish it. Do not delete the row.

Jobs 1 and 2 are set to `closed` by the migration when those rows exist.

The homepage, job pages, and sitemap refresh at least every hour. `/jobs` checks the database on each request.

## CVs

Applicants can upload a PDF, DOC, or DOCX up to 5 MB. The file goes into the private `resumes` storage bucket under a unique object name. `applications.resume_url` stores that object path, not a public URL.

Visitors can upload into the bucket. They cannot read, list, update, or delete files. No page links to a CV.

To open one, server code calls `createResumeSignedUrl` in `src/lib/resume-access.ts`. That uses `SUPABASE_SERVICE_ROLE_KEY` on the server and returns a link that expires after 60 seconds. Do not send the service-role key to the browser.
