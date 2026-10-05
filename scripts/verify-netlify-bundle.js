#!/usr/bin/env node
/**
 * Netlify serverless verification.
 *
 * This is the test that catches the "Unsupported framework" class of bug. It
 * does what Netlify's build does, in the same order:
 *
 *   1. Bundle netlify/functions/server.js with esbuild (the configured bundler).
 *   2. Assert the Express app is ACTUALLY inside the bundle. A variable
 *      `require()` is invisible to esbuild, so the bundle silently ships as a
 *      34 KB wrapper with none of the app — every page then dies at runtime
 *      with "Error: Unsupported framework". Marker strings catch that.
 *   3. Lay out an isolated directory the way `included_files` does.
 *   4. Require the bundle and invoke the handler with synthetic Lambda events.
 *
 * An earlier version of this script required the ROOT server.js and rendered a
 * view. That proved the views were present but never loaded the function entry
 * point, so it passed while production crashed on every request.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SIM = path.join(ROOT, '.bundle-sim');
const ENTRY = path.join(ROOT, 'netlify', 'functions', 'server.js');
const BUNDLE = path.join(SIM, 'netlify', 'functions', 'server.js');

/** Copied the way netlify.toml `included_files` copies them. */
const INCLUDE_DIRS = ['views', 'data', 'lib', 'img'];

/**
 * Strings that must survive bundling. Each comes from the root server.js, so if
 * the entry point ever goes back to a dynamic require these disappear.
 */
const APP_MARKERS = ['resolveRoot', 'service-area'];

/** A wrapper-only bundle is ~35 KB. Anything near that means the app is absent. */
const MIN_BUNDLE_BYTES = 200 * 1024;

const ROUTES = [
  { path: '/', expect: 200 },
  { path: '/services/deep-cleaning', expect: 200 },
  { path: '/pricing', expect: 200 },
  { path: '/sitemap.xml', expect: 200 },
  { path: '/definitely-not-a-page', expect: 404 },
];

let failures = 0;
const fail = (msg) => { failures += 1; console.log(`  FAIL  ${msg}`); };
const pass = (msg) => console.log(`  PASS  ${msg}`);

function rmrf(target) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

/* --- 1. Bundle exactly as Netlify does --------------------------------- */
function bundle() {
  let esbuild;
  try {
    esbuild = require('esbuild');
  } catch (e) {
    // Never skip silently — a skipped bundle check is how the
    // "Unsupported framework" bug reached production.
    fail('esbuild is not installed, so the function bundle cannot be verified.');
    console.log('        run: npm install   (esbuild is a devDependency)');
    return false;
  }

  try {
    esbuild.buildSync({
      entryPoints: [ENTRY],
      bundle: true,
      platform: 'node',
      target: 'node20',
      format: 'cjs',
      outfile: BUNDLE,
      logLevel: 'silent',
    });
  } catch (err) {
    fail(`esbuild could not bundle the function entry: ${err.message.split('\n')[0]}`);
    return false;
  }

  const src = fs.readFileSync(BUNDLE, 'utf8');
  const bytes = Buffer.byteLength(src);

  if (bytes < MIN_BUNDLE_BYTES) {
    fail(`bundle is only ${(bytes / 1024).toFixed(0)} KB — the Express app was NOT bundled.`);
    console.log('        This is the "Unsupported framework" bug: a variable require()');
    console.log('        is invisible to esbuild, so the wrapper ships without the app.');
    console.log('        Keep `require(\'../../server\')` a static string literal.');
    return false;
  }

  const missing = APP_MARKERS.filter((m) => !src.includes(m));
  if (missing.length) {
    fail(`bundle is missing app markers: ${missing.join(', ')}`);
    return false;
  }

  pass(`function bundle built (${(bytes / 1024).toFixed(0)} KB, app included)`);
  return true;
}

/* --- 2. Lay out included_files ----------------------------------------- */
function stage() {
  let copied = 0;
  for (const dir of INCLUDE_DIRS) {
    const src = path.join(ROOT, dir);
    if (!fs.existsSync(src)) {
      console.log(`  MISSING SOURCE  ${dir}/  (declared in included_files)`);
      continue;
    }
    copyDir(src, path.join(SIM, dir));
    copied += 1;
  }
  pass(`staged ${copied} included_files director(ies)`);
}

/* --- 3. Load and invoke ------------------------------------------------ */
async function invoke() {
  process.env.APP_ROOT = SIM;

  let mod;
  try {
    mod = require(BUNDLE);
  } catch (err) {
    fail(`function entry threw on load: ${err.message}`);
    console.log(`        ${(err.stack || '').split('\n')[1] || ''}`);
    return;
  }

  if (typeof mod.handler !== 'function') {
    fail(`entry did not export a handler (got ${typeof mod.handler})`);
    return;
  }
  pass('function entry loaded and exported a handler');

  for (const route of ROUTES) {
    const event = {
      path: route.path,
      httpMethod: 'GET',
      headers: { host: 'localhost' },
      queryStringParameters: null,
      body: null,
      isBase64Encoded: false,
    };

    let res;
    try {
      res = await mod.handler(event, {});
    } catch (err) {
      fail(`GET ${route.path} threw: ${err.message}`);
      continue;
    }

    const body = (res && res.body) || '';
    const status = res && res.statusCode;

    if (status !== route.expect) {
      fail(`GET ${route.path} returned ${status}, expected ${route.expect}`);
      continue;
    }
    // Error responses are legitimately short; only content pages must be substantial.
    if (route.expect === 200 && body.length < 500) {
      fail(`GET ${route.path} returned only ${body.length} bytes`);
      continue;
    }
    const svg = (body.match(/<svg/g) || []).length;
    pass(`GET ${route.path} -> ${status} (${body.length} bytes, ${svg} icons)`);
  }
}

(async () => {
  console.log('\nNetlify function verification\n' + '='.repeat(62));

  if (!fs.existsSync(ENTRY)) {
    fail(`entry point not found: ${ENTRY}`);
    process.exit(1);
  }

  rmrf(SIM);
  fs.mkdirSync(SIM, { recursive: true });

  const bundled = bundle();
  if (bundled) {
    stage();
    await invoke();
  }

  console.log('='.repeat(62));
  rmrf(SIM);

  if (failures > 0) {
    console.log(`${failures} check(s) failed.\n`);
    process.exit(1);
  }
  console.log('All function checks passed.\n');
})();
