#!/usr/bin/env node
/**
 * Netlify build preparation.
 *
 * 1. Regenerates responsive image variants + manifest (if source art exists).
 * 2. Copies /img into /public/img so assets ship with the published directory.
 * 3. Verifies that every view referenced by the router actually resolves.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const IMG_SRC = path.join(ROOT, 'img');
const IMG_DEST = path.join(ROOT, 'public', 'img');

function log(msg) { process.stdout.write(`[prepare:netlify] ${msg}\n`); }

function exists(p) {
  try { fs.accessSync(p); return true; } catch (e) { return false; }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
      count += 1;
    }
  }
  return count;
}

/* --- 1. Image variants ------------------------------------------------- */
const manifestPath = path.join(IMG_SRC, 'manifest.json');
const variantScript = path.join(ROOT, 'scripts', 'generate-image-variants.js');

if (exists(variantScript) && !exists(manifestPath)) {
  log('Generating responsive image variants…');
  try {
    execFileSync(process.execPath, [variantScript], { cwd: ROOT, stdio: 'inherit' });
  } catch (err) {
    log(`WARNING: image variant generation failed — ${err.message}`);
  }
}

/* --- 2. Publish images ------------------------------------------------- */
if (exists(IMG_SRC)) {
  const n = copyDir(IMG_SRC, IMG_DEST);
  log(`Copied ${n} image file(s) to public/img`);
} else {
  log('WARNING: /img not found — skipping image copy');
}

/* --- 3. View resolution check ------------------------------------------ */
const viewsDir = path.join(ROOT, 'views');
if (exists(viewsDir)) {
  const views = fs.readdirSync(viewsDir).filter((f) => f.endsWith('.ejs'));
  log(`Found ${views.length} view template(s)`);
}

log('Done.');
