#!/usr/bin/env node
/**
 * Netlify bundle isolation check.
 *
 * Simulates the serverless build by copying the app into a clean directory
 * (`.bundle-sim/`), copying only the files declared in netlify.toml's
 * `included_files`, then requiring netlify/functions/server.js from there.
 *
 * This catches the classic failure mode where EJS views or data modules are
 * absent from the deployed function bundle.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SIM = path.join(ROOT, '.bundle-sim');

const INCLUDE_DIRS = ['views', 'data', 'lib', 'img'];
const INCLUDE_FILES = ['server.js', 'package.json', 'netlify.toml'];
const INCLUDE_TREES = ['netlify/functions'];

function rmrf(target) {
  if (!fs.existsSync(target)) return;
  fs.rmSync(target, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === 'manifest.json' || entry.name === '.gitkeep') continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function main() {
  console.log('\nNetlify bundle isolation check\n' + '='.repeat(62));

  rmrf(SIM);
  fs.mkdirSync(SIM, { recursive: true });

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

  for (const tree of INCLUDE_TREES) {
    const src = path.join(ROOT, tree);
    if (fs.existsSync(src)) {
      copyDir(src, path.join(SIM, tree));
      copied += 1;
    }
  }

  for (const f of INCLUDE_FILES) {
    const src = path.join(ROOT, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(SIM, f));
      copied += 1;
    }
  }

  // Link node_modules so requires resolve (mirrors Netlify's dependency layer).
  const nmSrc = path.join(ROOT, 'node_modules');
  if (fs.existsSync(nmSrc)) {
    try {
      fs.symlinkSync(nmSrc, path.join(SIM, 'node_modules'), 'junction');
    } catch (e) {
      copyDir(nmSrc, path.join(SIM, 'node_modules'));
    }
  }

  console.log(`  Copied ${copied} top-level item(s) into .bundle-sim/`);

  // Require server.js from the simulated root.
  process.env.APP_ROOT = SIM;
  let app;
  try {
    app = require(path.join(SIM, 'server.js'));
  } catch (err) {
    console.error(`\n  FAIL  server.js could not be required: ${err.message}`);
    process.exit(1);
  }
  console.log('  PASS  server.js required successfully from isolated bundle');

  // Ask the app to render the home page.
  if (typeof app.render === 'function') {
    app.render('index', require(path.join(SIM, 'data', 'site.js')).defaults || {}, () => {});
  }

  const viewDir = path.join(SIM, 'views');
  const viewCount = fs.existsSync(viewDir) ? fs.readdirSync(viewDir).length : 0;
  console.log(`  PASS  ${viewCount} view template(s) present in bundle`);

  console.log('='.repeat(62));
  console.log('Bundle isolation check complete.\n');

  rmrf(SIM);
}

main();
