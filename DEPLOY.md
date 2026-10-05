# Deploying Zenvorali Cleaning to Netlify

The repository is live at
**https://github.com/kcwebdesignpros/Zenvorali-Cleaning**

`netlify.toml` contains the complete build configuration, so Netlify needs no
dashboard setup — just point it at the repo.

---

## Option A — GitHub integration (recommended)

Connect once, and every push to `main` deploys automatically.

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project**
2. Choose **GitHub**, authorise Netlify if prompted
3. Select **kcwebdesignpros/Zenvorali-Cleaning**
4. On the build settings screen, **change nothing** — Netlify reads
   `netlify.toml` and fills everything in:

   | Field | Auto-detected value |
   |---|---|
   | Build command | `npm run prepare:netlify` |
   | Publish directory | `public` |
   | Functions directory | `netlify/functions` |

5. Click **Deploy site**

First build takes roughly 1–2 minutes. After that, `git push` deploys.

---

## Option B — CLI

```bash
cd "D:/Romen Roy Workspace/Zenvorali Cleaning"

npx netlify login      # one-time, opens a browser
npm run deploy         # netlify deploy --build --prod
```

Use `npm run deploy:preview` for a draft URL that doesn't touch production.

---

## Do not use drag & drop

This site is **server-rendered** (Express + EJS). A static drag-and-drop deploy
would upload `public/` but no function, and every page would 404. Use Option A
or B.

---

## What `netlify.toml` already handles

| Setting | Value |
|---|---|
| Build command | `npm run prepare:netlify` |
| Publish directory | `public` |
| Functions directory | `netlify/functions` |
| Bundler | esbuild |
| Node version | 22 |
| `APP_ROOT` | `/var/task` |
| `NODE_ENV` | `production` (skips devDependencies — faster builds) |
| Redirect | `/*` → `/.netlify/functions/server` (200, `force = false`) |
| Cache headers | `css/`, `js/`, `img/`, `fonts/` → 1 year immutable |
| Security headers | nosniff, SAMEORIGIN, strict-origin-when-cross-origin, permissions |

### The one non-obvious requirement

```toml
[functions]
  included_files = ["views/**", "data/**", "lib/**", "img/**"]
```

EJS reads templates from disk at runtime. esbuild's dependency graph cannot see
those reads, so without `included_files` the function deploys with no templates
and every page returns a 500. This is already configured — do not remove it.

### Why `public/img/` is not in Git

The 291 image files are generated, not source. `img/` (the source art) **is**
committed; the build copies it into `public/img/` before publishing. This keeps
the repository lean and guarantees the published assets always match the source.

---

## Post-deploy checklist

Test these on the live URL:

- `/` — homepage
- `/services/deep-cleaning` — a service detail page
- `/projects` — case-study hub
- `/sitemap.xml` — should return XML
- `/robots.txt` — should return plain text
- `/this-page-should-404` — should show the styled 404 page

**If the site loads but every page 500s**, the cause is almost always the
`included_files` block above.

---

## Custom domain

Netlify → **Site settings → Domain management → Add a domain**. Point DNS at
Netlify (their nameservers, or an `A`/`CNAME` record). A free Let's Encrypt
certificate is provisioned automatically.

Then update the `url` field in `data/site.js` so canonical URLs, the sitemap and
Open Graph tags point at the real domain, and push.

---

## Continuous integration

`.github/workflows/verify.yml` runs on every push and pull request. It installs
runtime dependencies on Ubuntu, runs the Netlify build, checks the serverless
bundle, then audits SEO and word count. Because it runs on Linux — the same
platform Netlify builds on — a green check means the deploy will build.
