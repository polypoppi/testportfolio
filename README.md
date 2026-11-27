# Resume site

Personal resume and writing site for Muslihuddin Ghazali, with its own admin ("Studio") for editing everything.

- **Site:** Astro, server-rendered on Cloudflare Workers (free plan).
- **Content:** Cloudflare D1 database: profile, skills, experience, projects, stories, chapters and uploaded images.
- **Admin:** `/admin`, signed in with a username and password.
- **Headless API:** `GET /api/content.json` returns everything published, as JSON.

## Deploying to Cloudflare (one time)

1. In the Cloudflare dashboard, open **Workers & Pages → Create → Import a repository** and pick `polypoppi/testportfolio`.
2. Set **Build command** to `npm run build` and **Deploy command** to `npm run deploy`. Leave the rest as is.
3. Deploy. Wrangler creates the `resume-site` D1 database on the first deploy, and `npm run deploy` applies the migrations, including your resume content.
4. In the Worker, open **Settings → Variables and Secrets**, add a **Secret** named `ADMIN_PASSWORD` with a password of at least 10 characters, and deploy again.
5. Open `https://resume-site.<your-subdomain>.workers.dev/admin` and sign in with username `admin` and that password. You can change both under **Account**. Once you do, the secret is no longer used.

Every push to `main` redeploys automatically. Content edits in the admin go live right away and need no redeploy.

## Working locally

```bash
npm install
npm run db:local                                # create the local database with seed content
echo 'ADMIN_PASSWORD=local-dev-password' > .dev.vars
npm run dev                                     # http://localhost:4321, admin at /admin
```

## Where things live

| Path | What |
| --- | --- |
| `src/pages/` | Public pages (home, experience, projects, writing, about) |
| `src/pages/admin/` | Admin pages: dashboard, writing editor, profile, experience, projects, account |
| `src/pages/api/` | Public JSON API and the admin's save, upload and reorder endpoints |
| `src/lib/` | Database access, sign-in and sessions, HTML sanitiser |
| `migrations/` | D1 schema and seed content (`0002_seed.sql` is generated from `src/data/profile.ts`) |

## Security notes

- Passwords changed in the admin are stored as PBKDF2-SHA256 hashes. Sessions are random tokens, stored hashed, in an HttpOnly, SameSite=Strict cookie.
- After 5 failed sign-ins, an IP address is locked out for 15 minutes.
- Chapter HTML is sanitised against an allowlist on save. Forms are protected by Astro's origin check.
