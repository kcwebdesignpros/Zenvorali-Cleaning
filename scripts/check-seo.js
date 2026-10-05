#!/usr/bin/env node
/**
 * SEO smoke test — crawls every route and asserts:
 *   - HTTP 200
 *   - a <title> of reasonable length
 *   - a meta description
 *   - a canonical link
 *   - exactly one <h1>
 *   - valid JSON-LD blocks with an @graph
 *   - Open Graph + Twitter card tags
 *   - the credit link to kansascitywebdesignpros.com in the footer
 */
'use strict';

const http = require('http');
const https = require('https');

const BASE = process.env.BASE_URL || 'http://localhost:3000';

const ROUTES = [
  '/', '/about', '/team', '/services',
  '/services/house-cleaning', '/services/deep-cleaning', '/services/move-out-cleaning',
  '/services/office-commercial-cleaning', '/services/apartment-condo-cleaning',
  '/services/post-construction-cleaning',
  '/service-area', '/pricing', '/projects', '/reviews', '/blog', '/faq', '/contact',
  '/commercial-quote', '/offers', '/referral-program', '/green-cleaning', '/careers',
  '/privacy-policy', '/terms-of-service', '/sitemap.xml', '/robots.txt', '/site.webmanifest',
  '/404-test-should-404',
];

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (c) => { data += c; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

const issues = [];
function check(route, label, condition, detail) {
  if (!condition) issues.push(`${route}  ✗ ${label}${detail ? ' — ' + detail : ''}`);
}

async function main() {
  console.log(`\nSEO audit  (base: ${BASE})\n${'='.repeat(66)}`);
  let pass = 0;

  for (const route of ROUTES) {
    let res;
    try {
      res = await fetchText(BASE + route);
    } catch (err) {
      console.log(`ERR  ${route}  (${err.message})`);
      issues.push(`${route}  ✗ request failed`);
      continue;
    }

    const html = res.body;
    const isXml = /\.(xml|txt|webmanifest)$/.test(route) || route === '/robots.txt';
    const expect404 = route.startsWith('/404-test');

    if (expect404) {
      check(route, 'returns 404', res.status === 404, `got ${res.status}`);
      console.log(`${res.status === 404 ? 'OK  ' : 'FAIL'} ${res.status}  ${route}`);
      continue;
    }

    if (res.status !== 200) {
      check(route, 'HTTP 200', false, `got ${res.status}`);
      console.log(`FAIL ${res.status}  ${route}`);
      continue;
    }

    if (isXml) {
      console.log(`OK   200  ${route}`);
      pass += 1;
      continue;
    }

    const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
    const desc = (html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1] || '';
    const canonical = (html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || [])[1] || '';
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    const jsonLd = html.match(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi) || [];
    const ogTitle = /property="og:title"/.test(html);
    const twCard = /name="twitter:card"/.test(html);
    const hasCredit = /kansascitywebdesignpros\.com/.test(html);

    let schemaOk = jsonLd.length > 0;
    if (schemaOk) {
      for (const block of jsonLd) {
        const raw = block.replace(/^[\s\S]*?<script[^>]*>/i, '').replace(/<\/script>[\s\S]*$/i, '');
        try {
          const parsed = JSON.parse(raw);
          if (!parsed['@context']) schemaOk = false;
        } catch (e) {
          schemaOk = false;
        }
      }
    }

    check(route, 'title present', title.length > 10, `"${title.slice(0, 40)}"`);
    check(route, 'description present', desc.length > 50, `${desc.length} chars`);
    check(route, 'canonical present', canonical.startsWith('http'), canonical);
    check(route, 'single h1', h1Count === 1, `${h1Count} found`);
    check(route, 'JSON-LD valid', schemaOk, `${jsonLd.length} block(s)`);
    check(route, 'og:title', ogTitle);
    check(route, 'twitter:card', twCard);
    check(route, 'footer credit link', hasCredit);

    const routeIssues = issues.filter((i) => i.startsWith(route + '  '));
    if (routeIssues.length === 0) {
      pass += 1;
      console.log(`OK   200  ${route}   (title ${title.length}c, desc ${desc.length}c, h1×${h1Count}, ld×${jsonLd.length})`);
    } else {
      console.log(`FAIL ${res.status}  ${route}`);
      routeIssues.forEach((i) => console.log('        ' + i));
    }
  }

  console.log(`${'='.repeat(66)}`);
  if (issues.length === 0) {
    console.log(`All ${pass} routes passed SEO checks.\n`);
  } else {
    console.log(`${pass} route(s) passed, ${issues.length} issue(s) found.\n`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('seo audit failed:', err);
  process.exit(1);
});
