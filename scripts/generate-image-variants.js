#!/usr/bin/env node
/**
 * Generates responsive WebP (and JPEG poster) variants for every image in
 * /img, then writes /img/manifest.json which the server reads at boot to
 * build `srcset` attributes.
 *
 * Source art may be SVG (logo/icons), PNG or JPEG. If a source is already
 * sized correctly the script simply re-encodes it.
 *
 * Requires: sharp (devDependency).
 */
'use strict';

const fs = require('fs');
const path = require('path');

let sharp;
try {
  // eslint-disable-next-line import/no-extraneous-dependencies
  sharp = require('sharp');
} catch (err) {
  console.error('[images] sharp is not installed. Run: npm i -D sharp');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');
const IMG = path.join(ROOT, 'img');

/** Photographic images that get full responsive treatment. */
const RESPONSIVE_WIDTHS = [480, 768, 1024, 1440, 1920];

/** Derive a manifest key from a file name: hero-kitchen.webp -> heroKitchen */
function keyFor(file) {
  return path
    .basename(file)
    .replace(/\.(webp|png|jpe?g|svg)$/i, '')
    .replace(/[-_]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/[-_]/g, '');
}

function slugFor(file) {
  return path.basename(file).replace(/\.(webp|png|jpe?g|svg)$/i, '');
}

function isPhoto(file) {
  return /\.(jpe?g|png|webp)$/i.test(file) && !/logo|favicon|icon|apple-touch/i.test(file);
}

async function main() {
  if (!fs.existsSync(IMG)) {
    console.error('[images] /img directory not found.');
    process.exit(1);
  }

  const files = fs.readdirSync(IMG).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  const entries = {};
  let generated = 0;

  for (const file of files) {
    const srcPath = path.join(IMG, file);
    const slug = slugFor(file);
    const meta = await sharp(srcPath).metadata();
    const widths = isPhoto(file)
      ? RESPONSIVE_WIDTHS.filter((w) => w <= Math.max(meta.width || 1920, 1920))
      : [];

    const sources = [];

    if (widths.length) {
      for (const w of widths) {
        const outName = `${slug}-${w}.webp`;
        const outPath = path.join(IMG, outName);
        if (!fs.existsSync(outPath) || fs.statSync(outPath).mtimeMs < fs.statSync(srcPath).mtimeMs) {
          await sharp(srcPath)
            .resize({ width: w, withoutEnlargement: true })
            .webp({ quality: 76, effort: 5 })
            .toFile(outPath);
        }
        sources.push({ width: w, src: `/img/${outName}` });
        generated += 1;
      }

      // JPEG fallback at the mid width.
      const fallbackName = `${slug}-fallback.jpg`;
      const fallbackPath = path.join(IMG, fallbackName);
      if (!fs.existsSync(fallbackPath)) {
        await sharp(srcPath)
          .resize({ width: 1024, withoutEnlargement: true })
          .jpeg({ quality: 80, mozjpeg: true })
          .toFile(fallbackPath);
      }
      sources.push({ width: 1024, src: `/img/${fallbackName}`, type: 'image/jpeg' });
    }

    // Always produce a canonical .webp for the base file if it isn't one.
    let baseSrc = `/img/${file}`;
    if (!/\.webp$/i.test(file)) {
      const webpName = `${slug}.webp`;
      const webpPath = path.join(IMG, webpName);
      if (!fs.existsSync(webpPath)) {
        await sharp(srcPath).webp({ quality: 78, effort: 5 }).toFile(webpPath);
        generated += 1;
      }
      baseSrc = `/img/${webpName}`;
    }

    entries[keyFor(file)] = {
      src: baseSrc,
      width: meta.width || null,
      height: meta.height || null,
      aspect: meta.width && meta.height ? +(meta.width / meta.height).toFixed(4) : null,
      sources: sources.sort((a, b) => a.width - b.width),
      alt: '',
    };
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    count: Object.keys(entries).length,
    images: entries,
  };

  fs.writeFileSync(path.join(IMG, 'manifest.json'), JSON.stringify(manifest, null, 2));
  process.stdout.write(
    `[images] ${Object.keys(entries).length} image(s) processed, ${generated} variant(s) generated.\n`
  );
}

main().catch((err) => {
  console.error('[images] Failed:', err);
  process.exit(1);
});
