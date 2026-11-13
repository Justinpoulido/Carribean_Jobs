# Jobs board

The public jobs board is the file `data/jobs.json`. The site reads that file only. There is no database and no admin login.

Pushing a change to `data/jobs.json` on the default branch (`master`) makes Vercel redeploy. The new deployment is what visitors see. A failed build does not replace the live site, so a bad edit stays offline until it validates.

`data/jobs.fixtures.json` is example data for tests. The site never reads it. Every fixture is `status: "closed"`, so copying one into the live file without changing that status still will not show it.

`data/jobs.schema.json` is the same contract in JSON Schema. The check that actually fails the build is `src/lib/board-jobs.ts`, run by `npm run validate:jobs` before `next build`.

## Add a job

Append one object to the array in `data/jobs.json`. Keep the file as a JSON array. `[]` means the board is empty.

```json
{
  "id": "massy-stores-sales-associate-20261113",
  "title": "Sales Associate",
  "employer": "Massy Stores",
  "location": "Trincity Mall, Trincity",
  "country": "Trinidad and Tobago",
  "jobType": "full-time",
  "salary": "TTD 5,500–6,500 per month",
  "description": "Serve customers on the shop floor at the Trincity supermarket, keep shelves stocked, and help shoppers find grocery and household items.",
  "highlights": [
    "Full-time shifts, including one weekend day",
    "Training on the till and customer service"
  ],
  "howToApply": "Apply on the Massy Stores website. Mention the Sales Associate role at Trincity Mall and include a phone number.",
  "applyUrl": "https://www.massystores.com/",
  "applyEmail": "careers@employer.example",
  "sourceName": "Massy Stores",
  "datePosted": "2026-11-13",
  "closingDate": "2026-11-27",
  "status": "open"
}
```

`id` must be unique across the file. Use a lowercase slug, `employer-title-yyyymmdd`, with letters, numbers, and single hyphens only. That id is the page URL: `/jobs/massy-stores-sales-associate-20261113`. Reuse the same id when you update a job. Do not mint a second id for the same posting.

Required: `id`, `title`, `employer`, `location`, `description`, `howToApply`, `sourceName`, `datePosted`, `status`, and at least one of `applyUrl` or `applyEmail`.

Optional:

| Field | Notes |
| --- | --- |
| `country` | Defaults to `Trinidad and Tobago` when omitted. |
| `jobType` | `full-time`, `part-time`, `contract`, `temporary`, `internship`, `freelance`, or `casual`. |
| `salary` | Free text, such as `TTD 8,000 per month`. Omit when unknown. |
| `highlights` | Short list of requirements or selling points. |
| `closingDate` | ISO date. The job stays visible through the end of that day. |
| `applyEmail` | Shown as a mailto link. Use the real application inbox. |

`status` is `open` or `closed`. `datePosted` and `closingDate` are `YYYY-MM-DD`, or a full ISO timestamp with seconds. A date with no time is Trinidad and Tobago time (America/Port_of_Spain, UTC−4).

`applyUrl` must be an `http` or `https` link to the original employer or board. `howToApply` is the paragraph visitors read in the How to apply section.

Unknown fields, a duplicate id, a bad date, or a missing apply link fail validation. `npm run validate:jobs` prints every problem. `npm run build` runs that check first.

## Update a job

Edit the object with that `id`. Do not change the id if the Facebook caption or the page URL should stay the same. Commit to `master`.

## Close a job

Either set `"status": "closed"`, or set `closingDate` to a date that has already ended. Both hide the job. You do not have to delete the object.

The board also hides an open job that has no `closingDate` once `datePosted` is more than 30 days ago.

Hiding does not wait for the next commit. `/jobs` checks the clock on each request. The homepage, each job page, and the sitemap are regenerated at least every hour, so a passed closing date drops off on its own.

Closed and expired jobs return a not-found page. They are left out of the sitemap.

## What visitors see

- `/jobs` lists open jobs, newest `datePosted` first, with keyword, employer, and location filters. A closing date within 7 days is marked **Closing soon**.
- `/jobs/[id]` has the description, highlights, and a How to apply section with the source link and email.
- The homepage shows the latest few open jobs.
- If nothing is open, the board says: New jobs are posted daily, follow us on Facebook.

The Facebook link is `facebookPageUrl` in `src/lib/site.ts`. It is a search for this site until the Page URL is pasted there.

## Add a job from the GitHub API

The poster should change only `data/jobs.json` on `master`.

1. `GET https://api.github.com/repos/Justinpoulido/Carribean_Jobs/contents/data/jobs.json?ref=master` with a token that can write contents.
2. Decode `content` from base64 and `JSON.parse` it. It is an array.
3. If `id` already exists, update that object. Otherwise append. Never drop the other objects.
4. `PUT` the same URL:

```json
{
  "message": "Add job massy-stores-sales-associate-20261113",
  "content": "<base64 of the full pretty-printed file, including a trailing newline>",
  "sha": "<sha from the GET>",
  "branch": "master"
}
```

5. If the PUT returns 409, start again from the GET. Another write landed first.
6. Vercel builds that commit. `npm run validate:jobs` must pass or the deployment fails and the previous site stays up.

Pretty-print with two spaces so the diff stays readable. Order in the file does not matter. The site sorts by `datePosted`.

Do not put secrets in the file. Apply addresses are public on the page.
