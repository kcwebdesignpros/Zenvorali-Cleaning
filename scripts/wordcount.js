#!/usr/bin/env node
/**
 * Word-count audit.
 *
 * Measures visible word count inside <main> for every route, then flags any
 * page under the configured floor. Intended to be run against a live dev
 * server (npm start, default http://localhost:3000).
 *
 * Usage:
 *   node scripts/wordcount.js                 # audit all routes
 *   node scripts/wordcount.js --min 1800      # custom floor
 *   node scripts/wordcount.js --base http://localhost:3000
 */
'use strict';

const http = require('http');
const https = require('https');

const args = process.argv.slice(2);
function arg(flag, fallback) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

const BASE = arg('--base', process.env.BASE_URL || 'http://localhost:3000');
const MIN = parseInt(arg('--min', '1800'), 10);
const FAIL_HARD = args.includes('--fail');

const ROUTES = [
  '/',
  '/about',
  '/team',
  '/services',
  '/services/house-cleaning',
  '/services/deep-cleaning',
  '/services/move-out-cleaning',
  '/services/office-commercial-cleaning',
  '/services/apartment-condo-cleaning',
  '/services/post-construction-cleaning',
  '/service-area',
  '/pricing',
  '/projects',
  '/reviews',
  '/blog',
  '/faq',
  '/contact',
  '/commercial-quote',
  '/offers',
  '/referral-program',
  '/green-cleaning',
  '/careers',
  '/privacy-policy',
  '/terms-of-service',
];

/* Append data-driven detail routes from local data so every published page
   (services, blog posts, project case studies) is measured, not just hubs. */
try {
  const services = require('../data/services');
  const posts = require('../data/posts');
  const projects = require('../data/projects');
  services.forEach((s) => ROUTES.push('/services/' + s.slug));
  posts.forEach((p) => ROUTES.push('/blog/' + p.slug));
  projects.forEach((p) => ROUTES.push('/projects/' + p.slug));
} catch (e) {
  /* data files unavailable — audit the static list only */
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          resolve(fetchText(new URL(res.headers.location, url).href));
          return;
        }
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (c) => { data += c; });
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      })
      .on('error', reject);
  });
}

function extractMain(html) {
  const match = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return match ? match[1] : html;
}

function countWords(html) {
  const text = html
    /* Strip inline SVG first — icon path data is markup, not prose. Leaving it in
       inflates the count dramatically (349 icons × ~10 tokens each). */
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-zA-Z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return 0;
  return text.split(' ').filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

async function main() {
  console.log(`\nWord-count audit  (base: ${BASE}, floor: ${MIN})\n${'='.repeat(62)}`);
  const results = [];
  let failures = 0;

  for (const route of ROUTES) {
    try {
      const { status, body } = await fetchText(BASE + route);
      const words = countWords(extractMain(body));
      const ok = status === 200 && words >= MIN;
      if (!ok) failures += 1;
      results.push({ route, status, words, ok });
      const flag = ok ? 'OK  ' : 'LOW ';
      console.log(`${flag} ${String(words).padStart(5)} words  ${String(status).padEnd(4)} ${route}`);
    } catch (err) {
      failures += 1;
      results.push({ route, status: 0, words: 0, ok: false });
      console.log(`ERR  ${'     '}       000  ${route}  (${err.message})`);
    }
  }

  const total = results.reduce((a, r) => a + r.words, 0);
  const avg = Math.round(total / (results.length || 1));
  console.log(`${'='.repeat(62)}`);
  console.log(`Pages: ${results.length}   Average: ${avg} words   Below floor: ${failures}\n`);

  if (FAIL_HARD && failures > 0) process.exit(1);
}

main().catch((err) => {
  console.error('wordcount failed:', err);
  process.exit(1);
});
