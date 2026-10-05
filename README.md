# Zenvorali Cleaning — Kansas City

Premium residential & commercial cleaning website. Node.js + Express + EJS,
server-rendered, deployed to Netlify as a single serverless function.

**No CDN.** Every asset — fonts, icons, images — is served from this repo.

---

## Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js 20+ |
| Server | Express 4 |
| Templates | EJS 3 (server-rendered, data-driven) |
| Styling | Hand-written CSS (design tokens + custom animation system) |
| Scripting | Vanilla ES5-safe JS, no framework |
| Images | Locally generated SVG → WebP/JPEG/PNG via `sharp` |
| Deploy | Netlify Functions (`serverless-http`) |

---

## Quick start

```bash
npm install --no-audit --no-fund --ignore-scripts
npm start           # http://localhost:3000
```

> The `--ignore-scripts` flag avoids the esbuild/sharp postinstall `EBUSY`
> failure common in restricted Windows sandboxes.
>
> `sharp` and its Windows platform binaries (`@img/sharp-win32-x64`,
> `@img/sharp-libvips-win32-x64`) are **devDependencies** — they are only used by
> the local image-generation scripts and are never loaded by the server or the
> Netlify function at runtime. `npm run images` is only needed if you change the
> brand SVGs; the generated assets are already committed under `/img`.

---

## Deploy

```bash
npx netlify login                        # one-time, opens a browser
npm run deploy                           # netlify deploy --build --prod
npm run deploy:preview                   # draft deploy, no production alias
```

Set `NODE_VERSION=22` and `APP_ROOT=/var/task` are already declared in
`netlify.toml`, so no dashboard configuration is required.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm start` | Run the Express server locally |
| `npm run images` | Regenerate all brand imagery + `img/manifest.json` |
| `npm run prepare:netlify` | Build step: copy `/img` → `/public/img` |
| `npm run wordcount` | Audit visible `<main>` word count per route |
| `npm run audit:seo` | Crawl every route, assert meta/canonical/H1/JSON-LD |
| `npm run verify:bundle` | Simulate the Netlify function bundle and require it |
| `npm run check` | `wordcount` + `audit:seo` |
| `npm run build` | Alias for `prepare:netlify` |
| `npm run deploy` | Build + deploy to production |
| `npm run deploy:preview` | Build + deploy a draft URL |

---

## Structure

```
server.js                    Express app + all routes + view helpers
netlify.toml                 Redirects, headers, included_files
netlify/functions/server.js  serverless-http wrapper (deploy entry)

data/
  site.js                    Global config: NAP, hours, nav, stats, trust
  services/*.js              6 service pages (content + FAQs + meta)
  services/index.js          STATIC requires (esbuild-safe)
  posts.js                   6 blog posts
  projects.js                6 before/after case studies
  team.js                    6 team members
  reviews.js                 18 reviews
  faqs.js                    6 FAQ groups / 34 items

lib/
  icons.js                   ~50 inline SVG icons (icon())
  schema.js                  JSON-LD builders (11 types)

views/
  partials/{head,header,footer,cta,page-hero}.ejs
  *.ejs                      One per route

public/
  css/style.css              Full design system (~2500 lines)
  js/main.js                 20 progressive-enhancement behaviours
  img/                       Copied from /img at build time

img/                         Generated brand assets + manifest.json
scripts/                     Build, audit and generation tooling
```

---

## Design system

Brand palette (rebranded from the reference template):

| Token | Value | Use |
|---|---|---|
| `--navy-800` | `#0a1a2f` | Dark sections, headings |
| `--emerald-500` | `#14a37f` | Primary brand / CTAs |
| `--gold-500` | `#e0b64a` | Accent, premium highlights |

Type: **Barlow Condensed** (display) + **Plus Jakarta Sans** (body),
self-hosted via non-blocking `<link>` to local files.

### Animation system
Scroll reveals use CSS `animation` (not `transition`) gated behind an
`html.js` class, driven by `IntersectionObserver`. On `animationend` the
element gets `.is-done`, which releases `will-change` and restores hover
transforms. Staggering uses a `--d` custom property.

`prefers-reduced-motion: reduce` forces every reveal to its end state and
disables all looping animations.

---

## Netlify deployment

`netlify.toml` handles everything:

1. **Build** — `npm run prepare:netlify` (generates images, publishes `/img`).
2. **Redirect** — all paths → `/.netlify/functions/server` with `status = 200`.
3. **included_files** — `views/**`, `data/**`, `lib/**`, `img/**`. This is
   **required**: EJS reads templates from disk at runtime, which esbuild's
   dependency graph cannot see.
4. **Headers** — immutable caching for `/css`, `/js`, `/img`, `/fonts`;
   security headers for everything else.

### The two esbuild traps (both handled)

- **Dynamic `require('ejs')`** — the engine is pre-registered with
  `app.engine('ejs', ejs.__express)` so bundlers keep the require static.
- **Dynamic service loading** — `data/services/index.js` uses explicit
  `require('./slug')` calls instead of `require('./' + slug)`, which esbuild
  cannot follow.

Run `npm run verify:bundle` to confirm the function boots from an isolated
bundle containing only the declared `included_files`.

---

## SEO

Every route emits:

- Unique `<title>`, meta description, canonical URL
- Open Graph + Twitter card tags
- Geo meta (`geo.region`, `geo.placename`, `ICBM`)
- A JSON-LD `@graph` combining the relevant schema nodes

Schema builders in `lib/schema.js`: `LocalBusiness`/`CleaningService`,
`Organization`, `WebSite`, `WebPage`, `Service`, `FAQPage`, `BlogPosting`,
`BreadcrumbList`, `ItemList`, `Review`, `ContactPage`.

Also served: dynamic `/sitemap.xml`, `/robots.txt`, `/site.webmanifest`.

---

## Content model

Swap the demo details in `data/site.js` before going live:

- `phone` / `phoneHref` / `emergencyPhone`
- `address` (street, suite, city, state, zip)
- `geo` (lat/lng)
- `email`, `quotesEmail`
- `socials`
- `url`
- `credit` (footer attribution)

---

## Footer credit

Rendered in `views/partials/footer.ejs`:

> Web and Marketing By [KC Web Design Pros](https://kansascitywebdesignpros.com/)

---

## License

Proprietary. © Zenvorali Cleaning LLC.
