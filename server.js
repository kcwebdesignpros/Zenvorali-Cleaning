'use strict';

const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs'); // static require → esbuild can inline it (Netlify fix)

const site = require('./data/site');
const services = require('./data/services');
const posts = require('./data/posts');
const projects = require('./data/projects');
const team = require('./data/team');
const reviews = require('./data/reviews');
const faqGroups = require('./data/faqs');
const { icon } = require('./lib/icons');
const S = require('./lib/schema');

/* ------------------------------------------------------------------ *
 * Root resolution — works as a normal process, on Vercel and on Netlify
 * (where __dirname is <root>/netlify/functions after bundling).
 * ------------------------------------------------------------------ */
function resolveRoot() {
  const candidates = [
    process.env.APP_ROOT,
    __dirname,
    path.join(__dirname, '..', '..'),
    path.join(__dirname, '..'),
    process.cwd()
  ].filter(Boolean);

  for (const d of candidates) {
    if (fs.existsSync(path.join(d, 'views', 'index.ejs'))) return d;
  }
  return __dirname;
}

const ROOT = resolveRoot();
const app = express();

/* ---------------------------- Image manifest --------------------------- */
let IMAGE_MANIFEST = { images: {} };
try {
  const p = path.join(ROOT, 'img', 'manifest.json');
  if (fs.existsSync(p)) {
    const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
    IMAGE_MANIFEST = parsed && parsed.images ? parsed : { images: parsed || {} };
  }
} catch {
  IMAGE_MANIFEST = { images: {} };
}

/** camelCase key from a filename: hero-home.webp -> heroHome */
function manifestKey(file) {
  return String(file || '')
    .replace(/\?.*$/, '')
    .split('/')
    .pop()
    .replace(/\.(webp|png|jpe?g|svg)$/i, '')
    .replace(/-\d+$/, '')
    .replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
    .replace(/-/g, '');
}

/* ------------------------- Asset version hash -------------------------- */
function assetVersion() {
  try {
    const css = fs.readFileSync(path.join(ROOT, 'public', 'css', 'style.css'));
    const js = fs.existsSync(path.join(ROOT, 'public', 'js', 'main.js'))
      ? fs.readFileSync(path.join(ROOT, 'public', 'js', 'main.js'))
      : Buffer.from('');
    let h = 0;
    const buf = Buffer.concat([css, js]);
    for (let i = 0; i < buf.length; i += 97) h = (h * 31 + buf[i]) >>> 0;
    return String(h);
  } catch {
    return '1';
  }
}
const ASSET_V = assetVersion();

/* ------------------------------ App config ----------------------------- */
app.engine('ejs', ejs.__express); // pre-register → no runtime require('ejs')
app.set('view engine', 'ejs');
app.set('views', path.join(ROOT, 'views'));
app.set('trust proxy', true);
app.disable('x-powered-by');

app.use(compression());

/* ------------------------------------------------------------------ *
 * Static assets — explicit cache headers, no CDN.
 * ------------------------------------------------------------------ */
const staticOpts = {
  setHeaders(res, filePath) {
    if (/\.(webp|png|jpe?g|svg|ico|woff2?)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
};

// Images live in /img at the repo root AND are copied to /public/img for Netlify.
app.use('/img', express.static(path.join(ROOT, 'img'), staticOpts));
app.use(
  express.static(path.join(ROOT, 'public'), {
    ...staticOpts,
    etag: true,
    maxAge: 0
  })
);

app.use(express.urlencoded({ extended: true, limit: '64kb' }));

/* --------------------------- Security headers --------------------------- */
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  if (req.path.endsWith('.html') || req.path === '/' || !path.extname(req.path)) {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  }
  next();
});

/* ---------------------------- View helpers ------------------------------ */
const BASE_URL = site.url;

/** srcset from the generated manifest (falls back to no srcset). */
function srcset(p) {
  if (!p) return '';
  const images = IMAGE_MANIFEST.images || {};
  const entry = images[manifestKey(p)];
  if (!entry || !Array.isArray(entry.sources) || !entry.sources.length) return '';
  const parts = entry.sources
    .filter((s) => s && s.src && s.width && (!s.type || s.type === 'image/webp'))
    .map((s) => `${s.src} ${s.width}w`);
  if (entry.src && entry.width) {
    parts.push(`${entry.src} ${entry.width}w`);
  }
  return parts.join(', ');
}

/** Width/height attributes for an image, from the manifest. */
function imgDims(p) {
  const entry = (IMAGE_MANIFEST.images || {})[manifestKey(p)];
  if (!entry || !entry.width || !entry.height) return '';
  return `width="${entry.width}" height="${entry.height}"`;
}

/** Largest WebP source for preloading. */
function preloadHref(p) {
  const entry = (IMAGE_MANIFEST.images || {})[manifestKey(p)];
  if (!entry) return p;
  const webp = (entry.sources || []).filter((s) => !s.type || s.type === 'image/webp');
  if (webp.length) return webp[webp.length - 1].src;
  return entry.src || p;
}

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function money(n) {
  return `$${Number(n).toLocaleString('en-US')}`;
}

function words(html) {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&\w+;/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Approximate read time for HTML content. */
function readMin(html) {
  return Math.max(1, Math.round(words(html) / 225));
}

const serviceBySlug = new Map(services.map((s) => [s.slug, s]));

app.use((req, res, next) => {
  res.locals.site = site;
  res.locals.services = services;
  res.locals.posts = posts;
  res.locals.projects = projects;
  res.locals.team = team;
  res.locals.reviews = reviews;
  res.locals.faqGroups = faqGroups;
  res.locals.icon = icon;
  res.locals.baseUrl = BASE_URL;
  res.locals.assetV = ASSET_V;
  res.locals.year = new Date().getFullYear();
  res.locals.currentPath = req.path;
  res.locals.query = req.query || {};
  res.locals.fmtDate = fmtDate;
  res.locals.money = money;
  res.locals.readMin = readMin;
  res.locals.words = words;
  res.locals.srcset = srcset;
  res.locals.imgDims = imgDims;
  res.locals.preloadHref = preloadHref;
  res.locals.serviceBySlug = serviceBySlug;
  res.locals.meta = { title: site.name, description: site.shortDesc, path: req.path };
  res.locals.pageSchema = [];
  res.locals.preloadImage = null;
  res.locals.bodyClass = '';
  res.locals.isActive = (href) => {
    if (!href) return false;
    if (href === '/') return req.path === '/';
    return req.path === href || req.path.startsWith(href + '/');
  };
  next();
});

/* Reusable schema nodes that appear on nearly every page. */
function baseSchema(extra) {
  return [S.organization(), S.localBusiness(), S.website()].concat(extra || []);
}

/* ================================================================== *
 *  ROUTES
 * ================================================================== */

/* ------------------------------- Home -------------------------------- */
app.get('/', (req, res) => {
  res.locals.meta = {
    title: `${site.name} | Premium House & Commercial Cleaning in Kansas City`,
    description:
      'Zenvorali Cleaning delivers premium house, deep, move-out and commercial cleaning across Kansas City from $129. Insured, background-checked crews, flat-rate pricing and a 100% re-clean guarantee. Call (816) 555-0142.',
    keywords:
      'cleaning services Kansas City, house cleaning Kansas City MO, commercial cleaning Kansas City, maid service Kansas City, deep cleaning, move out cleaning, cleaning company near me',
    path: '/',
    preloadImage: '/img/hero-home.webp'
  };
  res.locals.preloadImage = '/img/hero-home.webp';
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: `Premium Cleaning Services in Kansas City`,
      description:
        'Residential and commercial cleaning services across the Kansas City metro.',
      path: '/'
    }),
    S.faqSchema([
      ...faqGroups[0].items.slice(0, 3),
      ...faqGroups[1].items.slice(0, 2),
      ...faqGroups[2].items.slice(0, 1)
    ]),
    S.itemList(
      services.map((s) => ({ name: s.name, href: `/services/${s.slug}` }))
    )
  ]);
  res.render('index');
});

/* ------------------------------ About -------------------------------- */
app.get('/about', (req, res) => {
  res.locals.meta = {
    title: `About Zenvorali Cleaning | Kansas City Cleaning Company Since 2013`,
    description:
      'Meet the Kansas City cleaning company behind 12,400+ cleans. Our story, our standards, our vetted team and the re-clean guarantee that backs every visit. Call (816) 555-0142.',
    keywords:
      'about Zenvorali Cleaning, Kansas City cleaning company, local cleaning business KC, professional cleaning team Missouri',
    path: '/about'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'About Zenvorali Cleaning',
      description: 'The Kansas City cleaning company built on consistency and trust.',
      path: '/about',
      type: 'AboutPage'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'About Us', href: '/about' }
    ])
  ]);
  res.render('about');
});

/* ------------------------------- Team -------------------------------- */
app.get('/team', (req, res) => {
  res.locals.meta = {
    title: `Our Cleaning Team in Kansas City | Zenvorali Cleaning`,
    description:
      'Meet the background-checked, insured and directly employed people who clean Kansas City homes and offices. Named crews, real accountability, no subcontractors.',
    keywords:
      'cleaning team Kansas City, vetted cleaners KC, background checked cleaners, cleaning staff Kansas City MO',
    path: '/team'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Our Cleaning Team',
      description: 'Vetted, insured, directly employed cleaning professionals in Kansas City.',
      path: '/team',
      type: 'AboutPage'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/team' }
    ])
  ]);
  res.render('team');
});

/* ---------------------------- Services index -------------------------- */
app.get('/services', (req, res) => {
  res.locals.meta = {
    title: `Cleaning Services Kansas City | Residential & Commercial | Zenvorali`,
    description:
      'Six professional cleaning services across Kansas City: house cleaning, deep cleaning, move-in/out, office & commercial, apartment & condo, and post-construction. Flat-rate quotes.',
    keywords:
      'cleaning services Kansas City, residential cleaning KC, commercial cleaning Kansas City MO, cleaning company services, professional cleaners Missouri',
    path: '/services'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Cleaning Services in Kansas City',
      description: 'Six specialist cleaning services for Kansas City homes and businesses.',
      path: '/services',
      type: 'CollectionPage'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' }
    ]),
    S.itemList(
      services.map((s) => ({ name: s.name, href: `/services/${s.slug}` }))
    )
  ]);
  res.render('services');
});

/* --------------------------- Service detail --------------------------- */
app.get('/services/:slug', (req, res, next) => {
  const service = serviceBySlug.get(req.params.slug);
  if (!service) return next();

  const related = (service.related || [])
    .map((slug) => serviceBySlug.get(slug))
    .filter(Boolean);

  const serviceFaqs = service.faqs || [];

  res.locals.meta = {
    title: service.meta.title,
    description: service.meta.description,
    keywords: service.meta.keywords,
    path: `/services/${service.slug}`
  };
  res.locals.preloadImage = service.image;
  res.locals.relatedServices = related;
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: service.name,
      description: service.meta.description,
      path: `/services/${service.slug}`,
      type: 'Service'
    }),
    S.serviceSchema(service),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: service.name, href: `/services/${service.slug}` }
    ])
  ].concat(serviceFaqs.length ? [S.faqSchema(serviceFaqs)] : []));
  res.render('service-detail', { service, related, serviceFaqs });
});

/* ---------------------------- Service area ---------------------------- */
app.get('/service-area', (req, res) => {
  res.locals.meta = {
    title: `Cleaning Service Area | Kansas City Metro | Zenvorali Cleaning`,
    description:
      'Zenvorali Cleaning serves the entire Kansas City metro within 35 miles of downtown — Overland Park, Lee\u2019s Summit, Independence, Olathe, Gladstone and more. No travel fees.',
    keywords:
      'cleaning service area Kansas City, house cleaning Overland Park, cleaners Lee\u2019s Summit, cleaning company Johnson County, Northland cleaning service',
    path: '/service-area'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Kansas City Service Area',
      description: 'Where Zenvorali Cleaning works across the Kansas City metro.',
      path: '/service-area'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Service Area', href: '/service-area' }
    ])
  ]);
  res.render('service-area');
});

/* ------------------------------ Pricing ------------------------------- */
app.get('/pricing', (req, res) => {
  res.locals.meta = {
    title: `Cleaning Prices Kansas City | Transparent Flat-Rate Pricing | Zenvorali`,
    description:
      'See exactly what cleaning costs in Kansas City. Flat-rate pricing from $89 for apartments and $129 for homes, with no hidden fees, no fuel surcharges and no hourly billing.',
    keywords:
      'cleaning prices Kansas City, house cleaning cost KC, cleaning rates Missouri, affordable cleaning service Kansas City, flat rate cleaning prices',
    path: '/pricing'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Cleaning Prices in Kansas City',
      description: 'Transparent flat-rate cleaning pricing for the Kansas City metro.',
      path: '/pricing'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Pricing', href: '/pricing' }
    ]),
    S.faqSchema([
      faqGroups[1].items[0],
      faqGroups[1].items[1],
      faqGroups[1].items[2],
      faqGroups[1].items[5]
    ])
  ]);
  res.render('pricing');
});

/* ----------------------------- Projects ------------------------------- */
app.get('/projects', (req, res) => {
  res.locals.meta = {
    title: `Before & After Cleaning Projects in Kansas City | Zenvorali Cleaning`,
    description:
      'Real before and after cleaning projects across Kansas City — Brookside bungalows, downtown lofts, Overland Park offices, Lee\u2019s Summit new builds and Plaza condos.',
    keywords:
      'cleaning before and after Kansas City, cleaning projects, house cleaning gallery, commercial cleaning case studies KC',
    path: '/projects'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Before & After Projects',
      description: 'Documented cleaning transformations across the Kansas City metro.',
      path: '/projects',
      type: 'CollectionPage'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Projects', href: '/projects' }
    ]),
    S.itemList(
      projects.map((p) => ({ name: p.title, href: `/projects/${p.slug}` }))
    )
  ]);
  res.render('projects');
});

app.get('/projects/:slug', (req, res, next) => {
  const project = projects.find((p) => p.slug === req.params.slug);
  if (!project) return next();

  res.locals.meta = {
    title: `${project.title} | Cleaning Project in ${project.location} | Zenvorali`,
    description: `${project.summary} Completed by Zenvorali Cleaning in ${project.location}.`,
    keywords: `${project.category} ${project.location}, cleaning project Kansas City, before after cleaning`,
    path: `/projects/${project.slug}`
  };
  res.locals.preloadImage = project.after;
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: project.title,
      description: project.summary,
      path: `/projects/${project.slug}`,
      type: 'Article'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Projects', href: '/projects' },
      { name: project.title, href: `/projects/${project.slug}` }
    ])
  ]);
  res.render('project-detail', { project });
});

/* ------------------------------ Reviews ------------------------------- */
app.get('/reviews', (req, res) => {
  res.locals.meta = {
    title: `Customer Reviews | Zenvorali Cleaning Kansas City | 4.9 / 5 Rating`,
    description:
      'Read 600+ verified reviews of Zenvorali Cleaning from Kansas City homeowners, renters and businesses. Rated 4.9 out of 5 across the metro. Call (816) 555-0142.',
    keywords:
      'Zenvorali Cleaning reviews, cleaning company reviews Kansas City, best cleaning service KC, trusted cleaners Missouri',
    path: '/reviews'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Customer Reviews',
      description: 'Verified reviews of Zenvorali Cleaning in Kansas City.',
      path: '/reviews'
    }),
    S.reviewsSchema(reviews),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Reviews', href: '/reviews' }
    ])
  ]);
  res.render('reviews');
});

/* -------------------------------- Blog -------------------------------- */
app.get('/blog', (req, res) => {
  res.locals.meta = {
    title: `Cleaning Tips & Guides | Zenvorali Cleaning Blog | Kansas City`,
    description:
      'Practical cleaning guides from Kansas City professionals — pricing explained, deep clean vs standard, move-out checklists, pet-safe products and seasonal plans.',
    keywords:
      'cleaning blog, house cleaning tips, cleaning guides Kansas City, move out cleaning checklist, cleaning advice',
    path: '/blog'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Cleaning Blog',
      description: 'Practical cleaning guides from the Zenvorali team in Kansas City.',
      path: '/blog',
      type: 'Blog'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Blog', href: '/blog' }
    ]),
    S.itemList(posts.map((p) => ({ name: p.title, href: `/blog/${p.slug}` })))
  ]);
  res.render('blog');
});

app.get('/blog/:slug', (req, res, next) => {
  const post = posts.find((p) => p.slug === req.params.slug);
  if (!post) return next();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  res.locals.meta = {
    title: `${post.title} | Zenvorali Cleaning`,
    description: post.description,
    keywords: `${post.category}, cleaning Kansas City, ${post.title.toLowerCase().slice(0, 60)}`,
    path: `/blog/${post.slug}`,
    type: 'article'
  };
  res.locals.preloadImage = post.image;
  res.locals.pageSchema = baseSchema([
    S.articleSchema(post),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Blog', href: '/blog' },
      { name: post.title, href: `/blog/${post.slug}` }
    ])
  ]);
  res.render('post', { post, related });
});

/* --------------------------------- FAQ --------------------------------- */
app.get('/faq', (req, res) => {
  const allFaqs = faqGroups.flatMap((g) => g.items);
  res.locals.meta = {
    title: `Cleaning FAQ | Kansas City Cleaning Questions Answered | Zenvorali`,
    description:
      'Answers to every common question about cleaning in Kansas City — booking, pricing, insurance, products, pets, service area and commercial contracts.',
    keywords:
      'cleaning FAQ Kansas City, cleaning questions, how much does cleaning cost, are cleaners insured, cleaning service questions',
    path: '/faq'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Frequently Asked Questions',
      description: 'Everything you need to know about Zenvorali Cleaning in Kansas City.',
      path: '/faq',
      type: 'FAQPage'
    }),
    S.faqSchema(allFaqs),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'FAQ', href: '/faq' }
    ])
  ]);
  res.render('faq');
});

/* ------------------------------- Contact ------------------------------- */
app.get('/contact', (req, res) => {
  res.locals.meta = {
    title: `Contact Zenvorali Cleaning | Free Kansas City Cleaning Quote`,
    description:
      'Get a free, flat-rate cleaning quote in Kansas City. Call (816) 555-0142 or send the form — we reply within one business hour. No obligation, no pressure.',
    keywords:
      'contact cleaning company Kansas City, free cleaning quote KC, book cleaning service Kansas City, cleaning estimate Missouri',
    path: '/contact'
  };
  res.locals.pageSchema = baseSchema([
    S.contactPage(),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Contact', href: '/contact' }
    ]),
    S.faqSchema([
      faqGroups[0].items[0],
      faqGroups[0].items[3],
      faqGroups[1].items[0],
      faqGroups[1].items[3]
    ])
  ]);
  res.render('contact', { form: { errors: [], values: {} }, sent: false });
});

app.post('/contact', (req, res) => {
  const b = req.body || {};
  const errors = [];
  const values = {
    name: (b.name || '').trim(),
    email: (b.email || '').trim(),
    phone: (b.phone || '').trim(),
    service: (b.service || '').trim(),
    property: (b.property || '').trim(),
    city: (b.city || '').trim(),
    frequency: (b.frequency || '').trim(),
    message: (b.message || '').trim()
  };

  if (values.name.length < 2) errors.push('Please enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email))
    errors.push('Please enter a valid email address.');
  if (values.phone.replace(/\D/g, '').length < 10)
    errors.push('Please enter a phone number we can reach you on.');
  if (!values.service) errors.push('Please choose the service you need.');

  if (errors.length) {
    res.status(422);
    res.locals.meta = {
      title: `Contact Zenvorali Cleaning | Free Kansas City Cleaning Quote`,
      description: 'Get a free flat-rate cleaning quote in Kansas City.',
      path: '/contact'
    };
    res.locals.pageSchema = baseSchema([S.contactPage()]);
    return res.render('contact', { form: { errors, values }, sent: false });
  }

  // No database — log the enquiry so it is recoverable from the function logs.
  // Wire to SMTP / a form endpoint / transactional API for production delivery.
  console.log('[contact] new enquiry', JSON.stringify({ ...values, at: new Date().toISOString() }));

  res.locals.meta = {
    title: `Thank You | Your Kansas City Cleaning Quote Is On Its Way`,
    description: 'Your cleaning quote request has been received. We reply within one business hour.',
    path: '/contact'
  };
  res.locals.pageSchema = baseSchema([S.contactPage()]);
  res.render('contact', { form: { errors: [], values: {} }, sent: true });
});

/* --------------------------- Commercial quote -------------------------- */
app.get('/commercial-quote', (req, res) => {
  res.locals.meta = {
    title: `Commercial Cleaning Bid Request | Kansas City | Zenvorali Cleaning`,
    description:
      'Request a commercial cleaning bid for your Kansas City facility. Free walkthrough, written zone-by-zone proposal within 24 hours, COI provided. Call (816) 555-0142.',
    keywords:
      'commercial cleaning quote Kansas City, janitorial bid KC, office cleaning proposal, facilities cleaning contract Missouri',
    path: '/commercial-quote'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Commercial Cleaning Bid Request',
      description: 'Request a commercial cleaning proposal in Kansas City.',
      path: '/commercial-quote'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Commercial Bid', href: '/commercial-quote' }
    ])
  ]);
  res.render('commercial-quote');
});

/* ------------------------------ Offers -------------------------------- */
app.get('/offers', (req, res) => {
  res.locals.meta = {
    title: `Cleaning Special Offers Kansas City | Zenvorali Cleaning Discounts`,
    description:
      'Current Zenvorali Cleaning offers in Kansas City — first-clean discounts, referral credits, senior and veteran rates, and new-client bundles on recurring plans.',
    keywords:
      'cleaning offers Kansas City, cleaning coupons KC, cleaning deals, first clean discount, referral credit cleaning',
    path: '/offers'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Cleaning Offers in Kansas City',
      description: 'Current Zenvorali Cleaning promotions and discounts.',
      path: '/offers'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Offers', href: '/offers' }
    ])
  ]);
  res.render('offers');
});

/* ---------------------------- Referral program -------------------------- */
app.get('/referral-program', (req, res) => {
  res.locals.meta = {
    title: `Refer a Neighbour | $40 Cleaning Referral Credit | Kansas City`,
    description:
      'Refer a neighbour to Zenvorali Cleaning and you both get $40 off. Simple, unlimited and no forms to chase. Referral credits apply across the Kansas City metro.',
    keywords:
      'cleaning referral program, refer a friend cleaning Kansas City, cleaning discount KC, referral credit',
    path: '/referral-program'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Referral Program',
      description: 'Earn $40 in cleaning credit for every referral in Kansas City.',
      path: '/referral-program'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Referral Program', href: '/referral-program' }
    ])
  ]);
  res.render('referral-program');
});

/* --------------------------- Green cleaning ----------------------------- */
app.get('/green-cleaning', (req, res) => {
  res.locals.meta = {
    title: `Green Cleaning Promise | Eco-Friendly Cleaning Kansas City`,
    description:
      'EPA Safer Choice certified products, microfiber systemisation and waste reduction. See exactly what Zenvorali\u2019s green cleaning promise means in practice in Kansas City homes.',
    keywords:
      'green cleaning Kansas City, eco friendly cleaning service, non toxic cleaning products, EPA Safer Choice cleaners',
    path: '/green-cleaning'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Green Cleaning Promise',
      description: 'Eco-friendly, EPA Safer Choice cleaning across Kansas City.',
      path: '/green-cleaning'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Green Cleaning', href: '/green-cleaning' }
    ])
  ]);
  res.render('green-cleaning');
});

/* ------------------------------ Careers --------------------------------- */
app.get('/careers', (req, res) => {
  res.locals.meta = {
    title: `Cleaning Jobs in Kansas City | Careers at Zenvorali Cleaning`,
    description:
      'Hiring cleaners and crew leads across Kansas City. Direct employment, paid training, background-checked team, competitive pay and real progression. Apply today.',
    keywords:
      'cleaning jobs Kansas City, house cleaner jobs KC, commercial cleaning jobs, maid jobs Missouri, cleaning careers',
    path: '/careers'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Careers at Zenvorali Cleaning',
      description: 'Cleaning jobs in Kansas City with a company that treats staff properly.',
      path: '/careers'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Careers', href: '/careers' }
    ])
  ]);
  res.render('careers');
});

/* ------------------------------- Legal ---------------------------------- */
app.get('/privacy-policy', (req, res) => {
  res.locals.meta = {
    title: `Privacy Policy | Zenvorali Cleaning Kansas City`,
    description:
      'How Zenvorali Cleaning collects, uses, stores and protects personal information for clients, website visitors and job applicants in Kansas City, Missouri.',
    keywords: 'privacy policy, cleaning company privacy, data protection Kansas City',
    path: '/privacy-policy'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Privacy Policy',
      description: 'Zenvorali Cleaning privacy policy.',
      path: '/privacy-policy'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Privacy Policy', href: '/privacy-policy' }
    ])
  ]);
  res.render('privacy-policy');
});

app.get('/terms-of-service', (req, res) => {
  res.locals.meta = {
    title: `Terms of Service | Zenvorali Cleaning Kansas City`,
    description:
      'The terms governing Zenvorali Cleaning services in Kansas City — booking, cancellation, pricing, liability, the re-clean guarantee and payment conditions.',
    keywords: 'terms of service, cleaning service terms, cancellation policy Kansas City cleaning',
    path: '/terms-of-service'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Terms of Service',
      description: 'Zenvorali Cleaning terms of service.',
      path: '/terms-of-service'
    }),
    S.breadcrumb([
      { name: 'Home', href: '/' },
      { name: 'Terms of Service', href: '/terms-of-service' }
    ])
  ]);
  res.render('terms-of-service');
});

/* ------------------------------- Search --------------------------------- */
app.get('/search', (req, res) => {
  const q = String(req.query.q || '').trim();
  const needle = q.toLowerCase();
  let results = [];

  if (needle) {
    services.forEach((s) => {
      const hay = `${s.name} ${s.shortDesc} ${s.meta.keywords} ${s.tagline}`.toLowerCase();
      if (hay.includes(needle))
        results.push({ title: s.name, href: `/services/${s.slug}`, kind: 'Service', excerpt: s.tagline });
    });
    posts.forEach((p) => {
      const hay = `${p.title} ${p.excerpt} ${p.category}`.toLowerCase();
      if (hay.includes(needle))
        results.push({ title: p.title, href: `/blog/${p.slug}`, kind: 'Article', excerpt: p.excerpt });
    });
    projects.forEach((p) => {
      const hay = `${p.title} ${p.summary} ${p.location} ${p.category}`.toLowerCase();
      if (hay.includes(needle))
        results.push({ title: p.title, href: `/projects/${p.slug}`, kind: 'Project', excerpt: p.summary });
    });
  }

  res.locals.meta = {
    title: q ? `Search results for "${q}" | Zenvorali Cleaning` : `Search | Zenvorali Cleaning`,
    description: `Search Zenvorali Cleaning services, guides and projects.`,
    path: '/search'
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Search',
      description: 'Search Zenvorali Cleaning.',
      path: '/search'
    })
  ]);
  res.render('search', { q, results });
});

/* ------------------------------ Sitemap -------------------------------- */
const STATIC_PAGES = [
  { path: '/', priority: '1.0', freq: 'weekly' },
  { path: '/services', priority: '0.9', freq: 'weekly' },
  { path: '/about', priority: '0.8', freq: 'monthly' },
  { path: '/pricing', priority: '0.9', freq: 'monthly' },
  { path: '/service-area', priority: '0.8', freq: 'monthly' },
  { path: '/projects', priority: '0.8', freq: 'weekly' },
  { path: '/reviews', priority: '0.8', freq: 'weekly' },
  { path: '/team', priority: '0.7', freq: 'monthly' },
  { path: '/blog', priority: '0.8', freq: 'weekly' },
  { path: '/faq', priority: '0.8', freq: 'monthly' },
  { path: '/offers', priority: '0.7', freq: 'monthly' },
  { path: '/green-cleaning', priority: '0.6', freq: 'yearly' },
  { path: '/referral-program', priority: '0.6', freq: 'yearly' },
  { path: '/commercial-quote', priority: '0.7', freq: 'monthly' },
  { path: '/careers', priority: '0.6', freq: 'monthly' },
  { path: '/contact', priority: '0.9', freq: 'monthly' },
  { path: '/privacy-policy', priority: '0.3', freq: 'yearly' },
  { path: '/terms-of-service', priority: '0.3', freq: 'yearly' }
];

app.get('/sitemap.xml', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [];

  STATIC_PAGES.forEach((p) => {
    urls.push({ loc: p.path, lastmod: today, changefreq: p.freq, priority: p.priority });
  });
  services.forEach((s) => {
    urls.push({
      loc: `/services/${s.slug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.9'
    });
  });
  posts.forEach((p) => {
    urls.push({
      loc: `/blog/${p.slug}`,
      lastmod: p.date,
      changefreq: 'monthly',
      priority: '0.7'
    });
  });
  projects.forEach((p) => {
    urls.push({
      loc: `/projects/${p.slug}`,
      lastmod: p.date,
      changefreq: 'monthly',
      priority: '0.6'
    });
  });

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${BASE_URL}${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n` +
          `    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
      )
      .join('\n') +
    `\n</urlset>\n`;

  res.type('application/xml').send(body);
});

/* ------------------------------ robots.txt ------------------------------ */
app.get('/robots.txt', (req, res) => {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /search',
    '',
    `Sitemap: ${BASE_URL}/sitemap.xml`,
    ''
  ].join('\n');
  res.type('text/plain').send(body);
});

/* -------------------------- Web manifest / icon ------------------------- */
app.get('/site.webmanifest', (req, res) => {
  res.json({
    name: site.name,
    short_name: 'Zenvorali',
    description: site.shortDesc,
    start_url: '/',
    display: 'standalone',
    background_color: '#0A1A2F',
    theme_color: '#0A1A2F',
    icons: [
      { src: '/img/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/img/favicon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/img/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  });
});

/* ------------------------------- 404 / 500 ------------------------------ */
app.use((req, res) => {
  res.status(404);
  res.locals.meta = {
    title: `Page Not Found | Zenvorali Cleaning Kansas City`,
    description:
      'That page has moved or never existed. Find Kansas City cleaning services, guides and contact details here.',
    path: req.path
  };
  res.locals.pageSchema = baseSchema([
    S.webPage({
      title: 'Page Not Found',
      description: 'Page not found.',
      path: req.path
    })
  ]);
  res.render('404');
});

app.use((err, req, res, _next) => {
  console.error('[error]', err && err.stack ? err.stack : err);
  res.status(500);
  res.locals.meta = {
    title: `Something Went Wrong | Zenvorali Cleaning`,
    description: 'An unexpected error occurred. Please call (816) 555-0142 and we will help directly.',
    path: req.path
  };
  res.locals.pageSchema = baseSchema([]);
  res.render('500');
});

/* ------------------------------- Listen -------------------------------- */
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n  Zenvorali Cleaning running → http://localhost:${PORT}`);
    console.log(`  Root: ${ROOT}  |  asset v${ASSET_V}\n`);
  });
}

module.exports = app;
