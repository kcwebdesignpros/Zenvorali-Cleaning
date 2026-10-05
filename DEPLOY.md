# Deploying Zenvorali Cleaning to Netlify

Everything is pre-configured. The only thing standing between you and a live
site is a one-time browser login.

---

## Option A — CLI (fastest, recommended)

Open a terminal in the project folder and run these two commands:

```bash
cd "D:/Romen Roy Workspace/Zenvorali Cleaning"

npx netlify login
```

This opens your browser. Log in (or create a free Netlify account) and click
**Authorize**. The token is saved to your machine — you only do this once.

Then:

```bash
npm run deploy
```

That runs `netlify deploy --build --prod`. It will:

1. Run `npm run build` (`prepare:netlify`) → copies 291 images into `public/img`
2. Bundle `netlify/functions/server.js` with esbuild
3. Upload `public/` + the function
4. Print a **Production URL** like `https://zenvorali-cleaning.netlify.app`

On first deploy it will ask **"Create & configure a new site?"** — choose
**Yes**, then either accept the suggested name or type your own.

If you'd rather do a dry run first:

```bash
npm run deploy:preview
```

That gives you a temporary draft URL without touching production.

---

## Option B — Netlify Dashboard (drag & drop / Git)

### Via Git (best for ongoing edits)

```bash
cd "D:/Romen Roy Workspace/Zenvorali Cleaning"
git init
git add .
git commit -m "Zenvorali Cleaning — production site"
git branch -M main
git remote add origin <your-empty-repo-url>
git push -u origin main
```

Then in Netlify: **Add new site → Import an existing project → GitHub →
pick the repo**. Netlify reads `netlify.toml` automatically, so leave all
build settings at their defaults.

### Drag & drop (no Git)

Not recommended here — the site is server-rendered (EJS + Express), so it
**requires** the serverless function. A pure static drag-and-drop will not
work. Use Option A or the Git route.

---

## What is already configured

`netlify.toml` handles all of this — nothing needs to be set in the dashboard:

| Setting | Value |
|---|---|
| Build command | `npm run prepare:netlify` |
| Publish directory | `public` |
| Functions directory | `netlify/functions` |
| Bundler | esbuild |
| Node version | 22 |
| `APP_ROOT` | `/var/task` |
| Redirect | `/*` → `/.netlify/functions/server` (200, `force = false`) |
| Cache headers | `css/`, `js/`, `img/`, `fonts/` → 1 year immutable |
| Security headers | nosniff, SAMEORIGIN, strict-origin-when-cross-origin, permissions |

### The one non-obvious requirement

```toml
[functions]
  included_files = ["views/**", "data/**", "lib/**", "img/**"]
```

EJS reads templates from disk at runtime. esbuild's dependency graph cannot see
those reads, so without `included_files` the function deploys without any
templates and every page returns a 500. This is already in place — just don't
remove it.

---

## After the first deploy

Test these live URLs:

- `/` — homepage
- `/services/deep-cleaning` — a service detail page
- `/projects` — case-study hub
- `/sitemap.xml` and `/robots.txt` — should return XML/plain text, not a 404
- `/this-page-should-404` — should show the styled 404 page

If the site works but **every page 500s**, the cause is almost always the
`included_files` block above.

---

## Optional: custom domain

In Netlify: **Site settings → Domain management → Add a domain**. Point your
DNS at Netlify (either the Netlify DNS nameservers, or an `A`/`CNAME` record).
Netlify provisions a free Let's Encrypt certificate automatically.

Once live, update `data/site.js` (the `url` field) so canonical URLs, the
sitemap, and Open Graph tags all point at the real domain, then redeploy.
