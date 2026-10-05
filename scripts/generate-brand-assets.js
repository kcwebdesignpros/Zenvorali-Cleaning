#!/usr/bin/env node
/**
 * Brand asset generator for Zenvorali Cleaning.
 *
 * Everything is produced locally from vector SVG source — no CDN, no
 * external image services. Outputs:
 *
 *   /img/logo.svg, logo.webp, logo-mark.svg, logo-mark.webp
 *   /img/favicon.ico, favicon-16.png, favicon-32.png,
 *         favicon-192.png, favicon-512.png, apple-touch-icon.png
 *   /img/og-image.jpg
 *   All hero / service / blog / project / team / about imagery as .webp
 *   /img/manifest.json  (consumed by the server's srcset() helper)
 *
 * Usage: node scripts/generate-brand-assets.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const IMG = path.join(ROOT, 'img');
fs.mkdirSync(IMG, { recursive: true });

/* ---------------------------------------------------------------- palette */
const C = {
  navy900: '#050f1d',
  navy800: '#0a1a2f',
  navy700: '#102a47',
  navy600: '#16395e',
  navy500: '#1f4d7a',
  emerald700: '#0b7a5e',
  emerald600: '#0f8f6e',
  emerald500: '#14a37f',
  emerald400: '#2cbd96',
  emerald200: '#9ee3cd',
  gold700: '#a97f1e',
  gold500: '#e0b64a',
  gold400: '#ebcb77',
  white: '#ffffff',
  ink700: '#2a3949',
  ink500: '#5d6e80',
  ink300: '#a8b6c2',
  paper: '#fbfcfd',
};

const FONT = "'Plus Jakarta Sans','Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const DISPLAY = "'Barlow Condensed','Arial Narrow','Segoe UI',Arial,sans-serif";

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ======================================================================
   LOGO
   ====================================================================== */
/**
 * Leaf-droplet emblem: a stylised leaf formed from two arcs enclosing a
 * sparkle, on a rounded-square navy field with an emerald gradient.
 */
function logoMarkSvg(size = 512, withBg = true) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512" role="img" aria-label="Zenvorali Cleaning mark">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.navy700}"/>
      <stop offset="1" stop-color="${C.navy900}"/>
    </linearGradient>
    <linearGradient id="leaf" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="${C.emerald400}"/>
      <stop offset="0.55" stop-color="${C.emerald500}"/>
      <stop offset="1" stop-color="${C.emerald700}"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.gold400}"/>
      <stop offset="1" stop-color="${C.gold500}"/>
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" result="b"/>
      <feComposite in="SourceGraphic" in2="b" operator="over"/>
    </filter>
  </defs>
  ${withBg ? `<rect x="16" y="16" width="480" height="480" rx="112" fill="url(#bg)"/>` : ''}

  <!-- Ambient glow -->
  <circle cx="256" cy="248" r="150" fill="${C.emerald500}" opacity="${withBg ? '0.14' : '0.08'}"/>

  <!-- Leaf body: two mirrored arcs -->
  <g filter="url(#soft)">
    <path d="M256 92
             C 352 118, 402 196, 398 268
             C 394 340, 330 404, 256 424
             C 182 404, 118 340, 114 268
             C 110 196, 160 118, 256 92 Z"
          fill="url(#leaf)"/>
    <!-- Inner vein -->
    <path d="M256 108 C 256 220, 256 320, 256 418"
          stroke="${C.navy900}" stroke-opacity="0.28" stroke-width="9"
          stroke-linecap="round" fill="none"/>
    <path d="M256 188 C 300 200, 330 226, 348 258"
          stroke="${C.navy900}" stroke-opacity="0.2" stroke-width="7"
          stroke-linecap="round" fill="none"/>
    <path d="M256 188 C 212 200, 182 226, 164 258"
          stroke="${C.navy900}" stroke-opacity="0.2" stroke-width="7"
          stroke-linecap="round" fill="none"/>
    <path d="M256 278 C 292 288, 316 308, 330 332"
          stroke="${C.navy900}" stroke-opacity="0.18" stroke-width="6"
          stroke-linecap="round" fill="none"/>
    <path d="M256 278 C 220 288, 196 308, 182 332"
          stroke="${C.navy900}" stroke-opacity="0.18" stroke-width="6"
          stroke-linecap="round" fill="none"/>
  </g>

  <!-- Sparkle accent -->
  <g fill="url(#gold)">
    <path d="M356 132 l10 26 26 10 -26 10 -10 26 -10 -26 -26 -10 26 -10 z"/>
    <path d="M150 344 l7 18 18 7 -18 7 -7 18 -7 -18 -18 -7 18 -7 z" opacity="0.85"/>
  </g>

  <!-- Water droplet highlight -->
  <path d="M188 206 c 22 -34 46 -52 62 -56 c -8 30 -22 56 -40 76 c -14 4 -22 -6 -22 -20 z"
        fill="${C.white}" opacity="0.22"/>
</svg>`;
}

function logoSvg(width = 960, height = 240) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 960 240" role="img" aria-label="Zenvorali Cleaning">
  <defs>
    <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.emerald400}"/>
      <stop offset="1" stop-color="${C.emerald600}"/>
    </linearGradient>
  </defs>
  <g transform="translate(24,28) scale(0.36)">
    <rect x="16" y="16" width="480" height="480" rx="112" fill="${C.navy800}"/>
    <circle cx="256" cy="248" r="150" fill="${C.emerald500}" opacity="0.14"/>
    <path d="M256 92 C 352 118, 402 196, 398 268 C 394 340, 330 404, 256 424 C 182 404, 118 340, 114 268 C 110 196, 160 118, 256 92 Z" fill="url(#lg)"/>
    <path d="M256 108 C 256 220, 256 320, 256 418" stroke="${C.navy900}" stroke-opacity="0.28" stroke-width="9" stroke-linecap="round" fill="none"/>
    <path d="M256 188 C 300 200, 330 226, 348 258" stroke="${C.navy900}" stroke-opacity="0.2" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M256 188 C 212 200, 182 226, 164 258" stroke="${C.navy900}" stroke-opacity="0.2" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M356 132 l10 26 26 10 -26 10 -10 26 -10 -26 -26 -10 26 -10 z" fill="${C.gold500}"/>
  </g>
  <text x="228" y="118" font-family="${DISPLAY}" font-size="86" font-weight="700" letter-spacing="1.5" fill="${C.navy800}">ZENVORALI</text>
  <text x="230" y="164" font-family="${FONT}" font-size="27" font-weight="700" letter-spacing="8.5" fill="${C.emerald600}">CLEANING</text>
  <rect x="230" y="182" width="150" height="4" rx="2" fill="${C.gold500}"/>
  <text x="392" y="186" font-family="${FONT}" font-size="19" font-weight="600" letter-spacing="2.4" fill="${C.ink500}">KANSAS CITY, MO</text>
</svg>`;
}

/* ======================================================================
   PHOTOGRAPHIC PLACEHOLDER SCENES
   Each "photo" is a composed vector interior/exterior illustration so the
   site ships with real, on-brand imagery and zero external requests.
   ====================================================================== */

/** Shared defs: soft light gradients + textures used by interior scenes. */
function sceneDefs(id, a, b, glow) {
  return `
  <linearGradient id="wall-${id}" x1="0.1" y1="0" x2="0.55" y2="1">
    <stop offset="0" stop-color="${a}"/>
    <stop offset="0.62" stop-color="${a}"/>
    <stop offset="1" stop-color="${b}"/>
  </linearGradient>
  <linearGradient id="ceil-${id}" x1="0" y1="0" x2="0.4" y2="1">
    <stop offset="0" stop-color="${a}" stop-opacity="0.95"/>
    <stop offset="1" stop-color="${b}" stop-opacity="0.99"/>
  </linearGradient>
  <radialGradient id="glow-${id}" cx="0.74" cy="0.14" r="0.82">
    <stop offset="0" stop-color="${glow}" stop-opacity="0.68"/>
    <stop offset="0.45" stop-color="${glow}" stop-opacity="0.2"/>
    <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glowL-${id}" cx="0.06" cy="0.72" r="0.55">
    <stop offset="0" stop-color="${C.gold400}" stop-opacity="0.14"/>
    <stop offset="1" stop-color="${C.gold400}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="floor-${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.white}" stop-opacity="0.5"/>
    <stop offset="0.18" stop-color="${C.white}" stop-opacity="0.26"/>
    <stop offset="0.7" stop-color="${C.navy900}" stop-opacity="0.1"/>
    <stop offset="1" stop-color="${C.navy900}" stop-opacity="0.32"/>
  </linearGradient>
  <linearGradient id="skirt-${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.navy900}" stop-opacity="0.2"/>
    <stop offset="1" stop-color="${C.navy900}" stop-opacity="0.05"/>
  </linearGradient>
  <pattern id="plank-${id}" width="240" height="54" patternUnits="userSpaceOnUse" patternTransform="skewX(-24)">
    <rect width="240" height="54" fill="none"/>
    <line x1="0" y1="0.5" x2="240" y2="0.5" stroke="${C.navy900}" stroke-opacity="0.055" stroke-width="1.4"/>
    <line x1="0" y1="27.5" x2="240" y2="27.5" stroke="${C.navy900}" stroke-opacity="0.035" stroke-width="1"/>
    <line x1="0" y1="53.5" x2="240" y2="53.5" stroke="${C.navy900}" stroke-opacity="0.055" stroke-width="1.4"/>
    <line x1="60.5" y1="0" x2="60.5" y2="27" stroke="${C.navy900}" stroke-opacity="0.04" stroke-width="1"/>
    <line x1="180.5" y1="27" x2="180.5" y2="54" stroke="${C.navy900}" stroke-opacity="0.04" stroke-width="1"/>
  </pattern>
  <pattern id="tile-${id}" width="70" height="70" patternUnits="userSpaceOnUse">
    <rect width="70" height="70" fill="none"/>
    <path d="M0 0 H70 M0 0 V70" stroke="${C.white}" stroke-opacity="0.22" stroke-width="2"/>
  </pattern>
  <linearGradient id="glass-${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${C.white}" stop-opacity="0.34"/>
    <stop offset="0.42" stop-color="${C.white}" stop-opacity="0.1"/>
    <stop offset="0.6" stop-color="${C.white}" stop-opacity="0.3"/>
    <stop offset="1" stop-color="${C.white}" stop-opacity="0.08"/>
  </linearGradient>
  <linearGradient id="shine-${id}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${C.white}" stop-opacity="0"/>
    <stop offset="0.5" stop-color="${C.white}" stop-opacity="0.72"/>
    <stop offset="1" stop-color="${C.white}" stop-opacity="0"/>
  </linearGradient>`;
}

/**
 * Room shell: perspective floor, ceiling soffit, baseboards, and window
 * light. Gives the flat furniture geometry a believable sense of space.
 */
function roomBase(id, wallA, wallB, glow, w, h, opts = {}) {
  const horizon = h * (opts.horizon || 0.66);
  const wall = opts.surface || 'plaster';
  const texture = wall === 'tile' ? `url(#tile-${id})` : `url(#plank-${id})`;

  // Perspective plank lines converging toward a vanishing point.
  let perspective = '';
  if (wall !== 'tile') {
    const vpx = w * 1.42;
    for (let i = -6; i <= 14; i += 1) {
      const x0 = (w / 10) * i;
      perspective += `<line x1="${x0}" y1="${h}" x2="${vpx}" y2="${horizon}" stroke="${C.navy900}" stroke-opacity="0.045" stroke-width="1.5"/>`;
    }
  }

  return `
  <!-- ceiling -->
  <rect width="${w}" height="${h * 0.1}" fill="url(#ceil-${id})"/>
  <rect y="${h * 0.1 - 4}" width="${w}" height="4" fill="${C.navy900}" opacity="0.07"/>

  <!-- wall field -->
  <rect y="${h * 0.1}" width="${w}" height="${horizon - h * 0.1}" fill="url(#wall-${id})"/>
  <rect y="${h * 0.1}" width="${w}" height="${horizon - h * 0.1}" fill="${texture}" opacity="0.5"/>

  <!-- ambient light -->
  <rect width="${w}" height="${h}" fill="url(#glow-${id})"/>
  <rect width="${w}" height="${h}" fill="url(#glowL-${id})"/>

  <!-- floor -->
  <rect y="${horizon}" width="${w}" height="${h - horizon}" fill="url(#floor-${id})"/>
  <g>${perspective}</g>
  <!-- baseboard -->
  <rect y="${horizon - 12}" width="${w}" height="14" fill="url(#skirt-${id})"/>
  <rect y="${horizon - 13}" width="${w}" height="3" fill="${C.white}" opacity="0.55"/>
  <rect y="${horizon + 1}" width="${w}" height="2" fill="${C.navy900}" opacity="0.12"/>

  <!-- window with frame + glass + view -->
  <g>
    <rect x="${w * 0.615}" y="${h * 0.15}" width="${w * 0.29}" height="${h * 0.33}" rx="6"
          fill="${C.white}" opacity="0.42"/>
    <rect x="${w * 0.615}" y="${h * 0.15}" width="${w * 0.29}" height="${h * 0.33}" rx="6"
          fill="url(#glass-${id})"/>
    <rect x="${w * 0.615}" y="${h * 0.15}" width="${w * 0.29}" height="${h * 0.33}" rx="6"
          fill="none" stroke="${C.white}" stroke-opacity="0.85" stroke-width="6"/>
    <line x1="${w * 0.76}" y1="${h * 0.15}" x2="${w * 0.76}" y2="${h * 0.48}" stroke="${C.white}" stroke-opacity="0.8" stroke-width="5"/>
    <line x1="${w * 0.615}" y1="${h * 0.31}" x2="${w * 0.905}" y2="${h * 0.31}" stroke="${C.white}" stroke-opacity="0.8" stroke-width="5"/>
    <!-- skyline hint -->
    <g opacity="0.3" fill="${C.navy700}">
      <rect x="${w * 0.635}" y="${h * 0.37}" width="${w * 0.03}" height="${h * 0.1}"/>
      <rect x="${w * 0.675}" y="${h * 0.33}" width="${w * 0.026}" height="${h * 0.14}"/>
      <rect x="${w * 0.712}" y="${h * 0.39}" width="${w * 0.034}" height="${h * 0.08}"/>
      <rect x="${w * 0.80}" y="${h * 0.35}" width="${w * 0.028}" height="${h * 0.12}"/>
      <rect x="${w * 0.84}" y="${h * 0.40}" width="${w * 0.03}" height="${h * 0.07}"/>
    </g>
  </g>

  <!-- window light spill on floor -->
  <path d="M${w * 0.63} ${horizon - 10} L${w * 0.3} ${h} L${w} ${h} L${w * 0.905} ${horizon - 10} Z"
        fill="${C.white}" opacity="0.14"/>
  <path d="M${w * 0.7} ${horizon} L${w * 0.56} ${h} L${w * 0.86} ${h} L${w * 0.82} ${horizon} Z"
        fill="${C.white}" opacity="0.1"/>`;
}

/**
 * Scene builders. Each returns a full SVG string sized w×h.
 * `variant` selects the room; `mood` warms or cools the grade.
 */
function sceneSvg(opts) {
  const {
    w = 1600, h = 1000, variant = 0, mood = 'bright',
    wallA = '#eaf1f8', wallB = '#cddced', glow = '#ffffff',
  } = opts;
  const id = 's' + variant + mood.replace(/\W/g, '');
  const horizon = h * 0.66;
  const v = variant % 6;

  // Reusable helpers -------------------------------------------------
  const shadow = (x, y, rx, ry, o) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.navy900}" opacity="${o || 0.16}"/>`;

  let furniture = '';

  if (v === 0) {
    /* ---- KITCHEN: shaker cabinets, stone counter, island, pendants ---- */
    furniture = `
    <g>
      ${shadow(w * 0.28, horizon + 20, w * 0.26, h * 0.035, 0.2)}
      <!-- upper cabinets -->
      <g>
        <rect x="${w * 0.03}" y="${h * 0.13}" width="${w * 0.16}" height="${h * 0.17}" rx="4" fill="${C.white}" opacity="0.97"/>
        <rect x="${w * 0.20}" y="${h * 0.13}" width="${w * 0.16}" height="${h * 0.17}" rx="4" fill="${C.white}" opacity="0.97"/>
        <rect x="${w * 0.03}" y="${h * 0.13}" width="${w * 0.16}" height="${h * 0.17}" rx="4" fill="none" stroke="${C.ink300}" stroke-opacity="0.42" stroke-width="2"/>
        <rect x="${w * 0.20}" y="${h * 0.13}" width="${w * 0.16}" height="${h * 0.17}" rx="4" fill="none" stroke="${C.ink300}" stroke-opacity="0.42" stroke-width="2"/>
        <rect x="${w * 0.075}" y="${h * 0.135}" width="${w * 0.075}" height="${h * 0.16}" rx="3" fill="none" stroke="${C.ink300}" stroke-opacity="0.55" stroke-width="2"/>
        <rect x="${w * 0.245}" y="${h * 0.135}" width="${w * 0.075}" height="${h * 0.16}" rx="3" fill="none" stroke="${C.ink300}" stroke-opacity="0.55" stroke-width="2"/>
        <circle cx="${w * 0.142}" cy="${h * 0.245}" r="4" fill="${C.ink500}" opacity="0.7"/>
        <circle cx="${w * 0.312}" cy="${h * 0.245}" r="4" fill="${C.ink500}" opacity="0.7"/>
      </g>
      <!-- backsplash -->
      <rect x="${w * 0.03}" y="${h * 0.30}" width="${w * 0.44}" height="${h * 0.09}" fill="${C.white}" opacity="0.72"/>
      <rect x="${w * 0.03}" y="${h * 0.30}" width="${w * 0.44}" height="${h * 0.09}" fill="url(#tile-${id})" opacity="0.75"/>
      <!-- base cabinets -->
      <rect x="${w * 0.03}" y="${h * 0.39}" width="${w * 0.44}" height="${horizon - h * 0.39}" rx="5" fill="${C.white}" opacity="0.98"/>
      <line x1="${w * 0.14}" y1="${h * 0.39}" x2="${w * 0.14}" y2="${horizon}" stroke="${C.ink300}" stroke-opacity="0.5" stroke-width="2.5"/>
      <line x1="${w * 0.25}" y1="${h * 0.39}" x2="${w * 0.25}" y2="${horizon}" stroke="${C.ink300}" stroke-opacity="0.5" stroke-width="2.5"/>
      <line x1="${w * 0.36}" y1="${h * 0.39}" x2="${w * 0.36}" y2="${horizon}" stroke="${C.ink300}" stroke-opacity="0.5" stroke-width="2.5"/>
      <rect x="${w * 0.045}" y="${h * 0.43}" width="${w * 0.075}" height="${h * 0.055}" rx="3" fill="none" stroke="${C.ink300}" stroke-opacity="0.6" stroke-width="2"/>
      <rect x="${w * 0.155}" y="${h * 0.43}" width="${w * 0.075}" height="${h * 0.055}" rx="3" fill="none" stroke="${C.ink300}" stroke-opacity="0.6" stroke-width="2"/>
      <rect x="${w * 0.265}" y="${h * 0.43}" width="${w * 0.075}" height="${h * 0.055}" rx="3" fill="none" stroke="${C.ink300}" stroke-opacity="0.6" stroke-width="2"/>
      <!-- stone counter -->
      <rect x="${w * 0.015}" y="${h * 0.365}" width="${w * 0.47}" height="${h * 0.032}" rx="4" fill="#f2f0ec"/>
      <rect x="${w * 0.015}" y="${h * 0.365}" width="${w * 0.47}" height="${h * 0.032}" rx="4" fill="none" stroke="${C.ink300}" stroke-opacity="0.35" stroke-width="1.5"/>
      <rect x="${w * 0.015}" y="${h * 0.365}" width="${w * 0.47}" height="5" fill="${C.white}" opacity="0.85"/>
      <!-- sink + tap -->
      <rect x="${w * 0.14}" y="${h * 0.368}" width="${w * 0.11}" height="${h * 0.025}" rx="3" fill="${C.ink300}" opacity="0.55"/>
      <path d="M${w * 0.195} ${h * 0.368} v-${h * 0.05} h${w * 0.028} v${h * 0.028}" stroke="${C.ink500}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <!-- cooktop + kettle + jar -->
      <rect x="${w * 0.335}" y="${h * 0.362}" width="${w * 0.10}" height="${h * 0.012}" rx="2" fill="${C.navy700}" opacity="0.55"/>
      <path d="M${w * 0.40} ${h * 0.365} l-${w * 0.008} -${h * 0.045} h${w * 0.028} l-${w * 0.008} ${h * 0.045} z" fill="${C.emerald600}" opacity="0.94"/>
      <rect x="${w * 0.30}" y="${h * 0.295}" width="${w * 0.028}" height="${h * 0.072}" rx="4" fill="${C.gold500}" opacity="0.85"/>
      <!-- island -->
      ${shadow(w * 0.745, horizon + 24, w * 0.2, h * 0.032, 0.2)}
      <rect x="${w * 0.57}" y="${h * 0.47}" width="${w * 0.35}" height="${horizon - h * 0.47}" rx="6" fill="${C.navy700}"/>
      <rect x="${w * 0.57}" y="${h * 0.47}" width="${w * 0.35}" height="${h * 0.022}" fill="${C.navy600}" opacity="0.6"/>
      <rect x="${w * 0.555}" y="${h * 0.44}" width="${w * 0.38}" height="${h * 0.034}" rx="5" fill="#f4f2ee"/>
      <rect x="${w * 0.555}" y="${h * 0.44}" width="${w * 0.38}" height="5" fill="${C.white}" opacity="0.9"/>
      <!-- island stools -->
      <g opacity="0.9">
        <rect x="${w * 0.455}" y="${h * 0.60}" width="${w * 0.055}" height="${h * 0.018}" rx="4" fill="${C.gold500}"/>
        <rect x="${w * 0.475}" y="${h * 0.615}" width="8" height="${h * 0.075}" fill="${C.ink500}"/>
        <rect x="${w * 0.39}" y="${h * 0.60}" width="${w * 0.055}" height="${h * 0.018}" rx="4" fill="${C.gold500}"/>
        <rect x="${w * 0.41}" y="${h * 0.615}" width="8" height="${h * 0.075}" fill="${C.ink500}"/>
      </g>
      <!-- pendant lights -->
      <line x1="${w * 0.655}" y1="0" x2="${w * 0.655}" y2="${h * 0.20}" stroke="${C.ink500}" stroke-opacity="0.55" stroke-width="2.5"/>
      <path d="M${w * 0.635} ${h * 0.20} h${w * 0.04} l-${w * 0.008} ${h * 0.045} h-${w * 0.024} z" fill="${C.navy700}"/>
      <ellipse cx="${w * 0.655}" cy="${h * 0.246}" rx="${w * 0.008}" ry="5" fill="${C.gold500}" opacity="0.9"/>
      <line x1="${w * 0.815}" y1="0" x2="${w * 0.815}" y2="${h * 0.155}" stroke="${C.ink500}" stroke-opacity="0.55" stroke-width="2.5"/>
      <path d="M${w * 0.795} ${h * 0.155} h${w * 0.04} l-${w * 0.008} ${h * 0.045} h-${w * 0.024} z" fill="${C.navy700}"/>
      <ellipse cx="${w * 0.815}" cy="${h * 0.201}" rx="${w * 0.008}" ry="5" fill="${C.gold500}" opacity="0.9"/>
      <!-- bowl of fruit -->
      <path d="M${w * 0.66} ${h * 0.44} a${w * 0.035} ${h * 0.022} 0 0 0 ${w * 0.07} 0 z" fill="${C.white}" opacity="0.95"/>
      <circle cx="${w * 0.678}" cy="${h * 0.428}" r="9" fill="${C.emerald500}"/>
      <circle cx="${w * 0.698}" cy="${h * 0.432}" r="8" fill="${C.gold500}"/>
      <circle cx="${w * 0.712}" cy="${h * 0.426}" r="7" fill="${C.emerald600}"/>
    </g>`;
  } else if (v === 1) {
    /* ---- BATHROOM: gold-framed mirror, vanity, glass shower, tile ---- */
    furniture = `
    <g>
      <!-- tiled feature wall -->
      <rect x="0" y="${h * 0.1}" width="${w * 0.40}" height="${horizon - h * 0.1}" fill="${C.white}" opacity="0.55"/>
      <rect x="0" y="${h * 0.1}" width="${w * 0.40}" height="${horizon - h * 0.1}" fill="url(#tile-${id})" opacity="0.9"/>
      <!-- mirror -->
      <rect x="${w * 0.055}" y="${h * 0.16}" width="${w * 0.205}" height="${h * 0.215}" rx="14" fill="${C.navy600}" opacity="0.28"/>
      <rect x="${w * 0.055}" y="${h * 0.16}" width="${w * 0.205}" height="${h * 0.215}" rx="14" fill="url(#glass-${id})"/>
      <rect x="${w * 0.055}" y="${h * 0.16}" width="${w * 0.205}" height="${h * 0.215}" rx="14" fill="none" stroke="${C.gold500}" stroke-width="7"/>
      <rect x="${w * 0.055}" y="${h * 0.16}" width="${w * 0.205}" height="${h * 0.215}" rx="14" fill="none" stroke="${C.gold400}" stroke-opacity="0.5" stroke-width="2"/>
      <!-- vanity counter -->
      <rect x="${w * 0.03}" y="${h * 0.375}" width="${w * 0.33}" height="${h * 0.035}" rx="4" fill="#f4f2ee"/>
      <rect x="${w * 0.03}" y="${h * 0.375}" width="${w * 0.33}" height="5" fill="${C.white}" opacity="0.9"/>
      <rect x="${w * 0.03}" y="${h * 0.41}" width="${w * 0.33}" height="${horizon - h * 0.41}" rx="5" fill="${C.navy700}"/>
      <rect x="${w * 0.05}" y="${h * 0.43}" width="${w * 0.13}" height="${h * 0.055}" rx="3" fill="none" stroke="${C.gold500}" stroke-opacity="0.6" stroke-width="2.5"/>
      <rect x="${w * 0.20}" y="${h * 0.43}" width="${w * 0.13}" height="${h * 0.055}" rx="3" fill="none" stroke="${C.gold500}" stroke-opacity="0.6" stroke-width="2.5"/>
      <circle cx="${w * 0.115}" cy="${h * 0.487}" r="4" fill="${C.gold500}"/>
      <circle cx="${w * 0.265}" cy="${h * 0.487}" r="4" fill="${C.gold500}"/>
      <!-- basin + tap -->
      <ellipse cx="${w * 0.185}" cy="${h * 0.393}" rx="${w * 0.052}" ry="${h * 0.016}" fill="${C.white}"/>
      <ellipse cx="${w * 0.185}" cy="${h * 0.393}" rx="${w * 0.042}" ry="${h * 0.012}" fill="${C.ink300}" opacity="0.7"/>
      <path d="M${w * 0.185} ${h * 0.385} v-${h * 0.045} q0 -${h * 0.018} ${w * 0.016} -${h * 0.018}" stroke="${C.gold500}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <!-- amenities -->
      <rect x="${w * 0.265}" y="${h * 0.325}" width="${w * 0.02}" height="${h * 0.05}" rx="5" fill="${C.emerald500}" opacity="0.9"/>
      <rect x="${w * 0.295}" y="${h * 0.335}" width="${w * 0.016}" height="${h * 0.04}" rx="5" fill="${C.gold500}" opacity="0.9"/>
      <circle cx="${w * 0.335}" cy="${h * 0.355}" r="${h * 0.018}" fill="${C.white}" opacity="0.95"/>
      <!-- glass shower -->
      <rect x="${w * 0.455}" y="${h * 0.10}" width="${w * 0.31}" height="${horizon - h * 0.10}" fill="${C.navy600}" opacity="0.2"/>
      <rect x="${w * 0.455}" y="${h * 0.10}" width="${w * 0.31}" height="${horizon - h * 0.10}" fill="url(#glass-${id})"/>
      <rect x="${w * 0.455}" y="${h * 0.10}" width="${w * 0.31}" height="${horizon - h * 0.10}" fill="none" stroke="${C.white}" stroke-opacity="0.9" stroke-width="6"/>
      <line x1="${w * 0.61}" y1="${h * 0.10}" x2="${w * 0.61}" y2="${horizon}" stroke="${C.white}" stroke-opacity="0.7" stroke-width="4"/>
      <line x1="${w * 0.455}" y1="${h * 0.10}" x2="${w * 0.765}" y2="${h * 0.10}" stroke="${C.gold400}" stroke-opacity="0.85" stroke-width="8"/>
      <!-- shower fixtures -->
      <circle cx="${w * 0.665}" cy="${h * 0.195}" r="9" fill="${C.gold500}"/>
      <path d="M${w * 0.665} ${h * 0.195} l${w * 0.03} -${h * 0.05}" stroke="${C.gold500}" stroke-width="5" stroke-linecap="round"/>
      <!-- rolled towels -->
      <g>
        <rect x="${w * 0.80}" y="${h * 0.30}" width="${w * 0.02}" height="${h * 0.028}" rx="4" fill="${C.ink500}"/>
        <rect x="${w * 0.775}" y="${h * 0.325}" width="${w * 0.085}" height="${h * 0.11}" rx="6" fill="${C.white}" opacity="0.97"/>
        <line x1="${w * 0.775}" y1="${h * 0.355}" x2="${w * 0.86}" y2="${h * 0.355}" stroke="${C.ink300}" stroke-opacity="0.6" stroke-width="2"/>
        <line x1="${w * 0.775}" y1="${h * 0.39}" x2="${w * 0.86}" y2="${h * 0.39}" stroke="${C.emerald400}" stroke-opacity="0.7" stroke-width="3"/>
      </g>
      <!-- plant -->
      <rect x="${w * 0.885}" y="${h * 0.50}" width="${w * 0.055}" height="${h * 0.08}" rx="5" fill="${C.white}" opacity="0.95"/>
      <g fill="${C.emerald600}" opacity="0.92">
        <path d="M${w * 0.912} ${h * 0.50} q-${w * 0.03} -${h * 0.075} -${w * 0.008} -${h * 0.115} q${w * 0.022} ${h * 0.04} ${w * 0.008} ${h * 0.115} z"/>
        <path d="M${w * 0.912} ${h * 0.50} q${w * 0.03} -${h * 0.06} ${w * 0.008} -${h * 0.10} q-${w * 0.022} ${h * 0.035} -${w * 0.008} ${h * 0.10} z"/>
        <path d="M${w * 0.912} ${h * 0.50} q-${w * 0.045} -${h * 0.03} -${w * 0.048} -${h * 0.075} q${w * 0.038} ${h * 0.018} ${w * 0.048} ${h * 0.075} z"/>
      </g>
    </g>`;
  } else if (v === 2) {
    /* ---- LIVING ROOM: sofa, coffee table, rug, art, plant ---- */
    furniture = `
    <g>
      <!-- wall art -->
      <rect x="${w * 0.30}" y="${h * 0.145}" width="${w * 0.155}" height="${h * 0.185}" rx="3" fill="${C.white}" opacity="0.95"/>
      <rect x="${w * 0.315}" y="${h * 0.162}" width="${w * 0.125}" height="${h * 0.152}" fill="${C.emerald500}" opacity="0.35"/>
      <path d="M${w * 0.315} ${h * 0.314} l${w * 0.045} -${h * 0.075} l${w * 0.04} ${h * 0.05} l${w * 0.04} -${h * 0.09}" stroke="${C.gold500}" stroke-width="4" fill="none"/>
      <rect x="${w * 0.30}" y="${h * 0.145}" width="${w * 0.155}" height="${h * 0.185}" rx="3" fill="none" stroke="${C.gold500}" stroke-width="5" opacity="0.9"/>
      <rect x="${w * 0.485}" y="${h * 0.185}" width="${w * 0.10}" height="${h * 0.125}" rx="3" fill="${C.white}" opacity="0.95"/>
      <rect x="${w * 0.495}" y="${h * 0.20}" width="${w * 0.08}" height="${h * 0.095}" fill="${C.navy600}" opacity="0.4"/>
      <rect x="${w * 0.485}" y="${h * 0.185}" width="${w * 0.10}" height="${h * 0.125}" rx="3" fill="none" stroke="${C.gold500}" stroke-width="4" opacity="0.9"/>
      <!-- rug -->
      <path d="M${w * 0.10} ${horizon + h * 0.02} L${w * 0.09} ${h * 0.99} L${w * 0.90} ${h * 0.99} L${w * 0.88} ${horizon + h * 0.02} Z"
            fill="${C.white}" opacity="0.5"/>
      <path d="M${w * 0.13} ${horizon + h * 0.05} L${w * 0.125} ${h * 0.96} L${w * 0.87} ${h * 0.96} L${w * 0.855} ${horizon + h * 0.05} Z"
            fill="${C.emerald500}" opacity="0.14"/>
      <!-- sofa -->
      ${shadow(w * 0.28, horizon + h * 0.035, w * 0.20, h * 0.028, 0.22)}
      <rect x="${w * 0.115}" y="${h * 0.375}" width="${w * 0.345}" height="${h * 0.16}" rx="14" fill="${C.white}" opacity="0.98"/>
      <rect x="${w * 0.10}" y="${h * 0.415}" width="${w * 0.375}" height="${h * 0.155}" rx="16" fill="#f4f6f8"/>
      <rect x="${w * 0.10}" y="${h * 0.415}" width="${w * 0.375}" height="${h * 0.155}" rx="16" fill="none" stroke="${C.ink300}" stroke-opacity="0.5" stroke-width="2"/>
      <!-- seat cushion split -->
      <line x1="${w * 0.226}" y1="${h * 0.435}" x2="${w * 0.226}" y2="${h * 0.565}" stroke="${C.ink300}" stroke-opacity="0.6" stroke-width="2.5"/>
      <line x1="${w * 0.348}" y1="${h * 0.435}" x2="${w * 0.348}" y2="${h * 0.565}" stroke="${C.ink300}" stroke-opacity="0.6" stroke-width="2.5"/>
      <!-- armrests -->
      <rect x="${w * 0.085}" y="${h * 0.39}" width="${w * 0.05}" height="${h * 0.185}" rx="14" fill="${C.white}"/>
      <rect x="${w * 0.44}" y="${h * 0.39}" width="${w * 0.05}" height="${h * 0.185}" rx="14" fill="${C.white}"/>
      <!-- cushions -->
      <rect x="${w * 0.145}" y="${h * 0.345}" width="${w * 0.075}" height="${h * 0.09}" rx="12" fill="${C.emerald500}" opacity="0.92"/>
      <rect x="${w * 0.245}" y="${h * 0.345}" width="${w * 0.075}" height="${h * 0.09}" rx="12" fill="${C.gold500}" opacity="0.92"/>
      <rect x="${w * 0.345}" y="${h * 0.345}" width="${w * 0.075}" height="${h * 0.09}" rx="12" fill="${C.navy600}" opacity="0.85"/>
      <!-- legs -->
      <rect x="${w * 0.115}" y="${h * 0.565}" width="12" height="${h * 0.06}" rx="4" fill="${C.navy700}" opacity="0.7"/>
      <rect x="${w * 0.44}" y="${h * 0.565}" width="12" height="${h * 0.06}" rx="4" fill="${C.navy700}" opacity="0.7"/>
      <!-- coffee table -->
      ${shadow(w * 0.62, h * 0.755, w * 0.135, h * 0.022, 0.2)}
      <rect x="${w * 0.505}" y="${h * 0.635}" width="${w * 0.235}" height="${h * 0.022}" rx="5" fill="${C.white}" opacity="0.98"/>
      <rect x="${w * 0.505}" y="${h * 0.635}" width="${w * 0.235}" height="5" fill="${C.white}"/>
      <rect x="${w * 0.515}" y="${h * 0.655}" width="10" height="${h * 0.075}" fill="${C.navy700}" opacity="0.65"/>
      <rect x="${w * 0.72}" y="${h * 0.655}" width="10" height="${h * 0.075}" fill="${C.navy700}" opacity="0.65"/>
      <!-- tabletop objects -->
      <rect x="${w * 0.545}" y="${h * 0.60}" width="${w * 0.065}" height="${h * 0.032}" rx="3" fill="${C.navy700}" opacity="0.85"/>
      <rect x="${w * 0.548}" y="${h * 0.603}" width="${w * 0.059}" height="${h * 0.024}" rx="2" fill="${C.emerald400}" opacity="0.7"/>
      <path d="M${w * 0.655} ${h * 0.628} a${w * 0.018} ${h * 0.021} 0 0 0 ${w * 0.036} 0 z" fill="${C.white}"/>
      <path d="M${w * 0.662} ${h * 0.628} q0 -${h * 0.028} ${w * 0.011} -${h * 0.033} q${w * 0.011} ${h * 0.005} ${w * 0.011} ${h * 0.033} z" fill="${C.gold500}" opacity="0.85"/>
      <!-- floor lamp -->
      <line x1="${w * 0.885}" y1="${h * 0.30}" x2="${w * 0.885}" y2="${horizon + h * 0.09}" stroke="${C.ink500}" stroke-width="6"/>
      <ellipse cx="${w * 0.885}" cy="${horizon + h * 0.09}" rx="${w * 0.045}" ry="${h * 0.012}" fill="${C.navy700}" opacity="0.7"/>
      <path d="M${w * 0.855} ${h * 0.245} h${w * 0.06} l-${w * 0.012} ${h * 0.055} h-${w * 0.036} z" fill="${C.gold500}"/>
      <ellipse cx="${w * 0.885}" cy="${h * 0.30}" rx="${w * 0.016}" ry="7" fill="${C.gold400}" opacity="0.95"/>
    </g>`;
  } else if (v === 3) {
    /* ---- OFFICE: workstation rows, monitors, chairs, glass partition ---- */
    furniture = `
    <g>
      <!-- glass partition wall -->
      <rect x="${w * 0.50}" y="${h * 0.10}" width="${w * 0.47}" height="${horizon - h * 0.10}" fill="${C.navy600}" opacity="0.22"/>
      <rect x="${w * 0.50}" y="${h * 0.10}" width="${w * 0.47}" height="${horizon - h * 0.10}" fill="url(#glass-${id})"/>
      <rect x="${w * 0.50}" y="${h * 0.10}" width="${w * 0.47}" height="${horizon - h * 0.10}" fill="none" stroke="${C.white}" stroke-opacity="0.8" stroke-width="6"/>
      <line x1="${w * 0.735}" y1="${h * 0.10}" x2="${w * 0.735}" y2="${horizon}" stroke="${C.white}" stroke-opacity="0.6" stroke-width="4"/>
      <rect x="${w * 0.50}" y="${h * 0.10}" width="${w * 0.47}" height="${h * 0.022}" fill="${C.navy700}" opacity="0.75"/>
      <!-- silhouettes behind glass -->
      <g opacity="0.28" fill="${C.navy700}">
        <circle cx="${w * 0.575}" cy="${h * 0.34}" r="${h * 0.032}"/>
        <rect x="${w * 0.555}" y="${h * 0.375}" width="${w * 0.04}" height="${h * 0.13}" rx="12"/>
        <circle cx="${w * 0.845}" cy="${h * 0.365}" r="${h * 0.030}"/>
        <rect x="${w * 0.826}" y="${h * 0.398}" width="${w * 0.038}" height="${h * 0.11}" rx="12"/>
      </g>

      <!-- desk row -->
      ${shadow(w * 0.25, horizon + h * 0.05, w * 0.22, h * 0.026, 0.22)}
      <rect x="${w * 0.03}" y="${h * 0.585}" width="${w * 0.44}" height="${h * 0.028}" rx="5" fill="${C.white}" opacity="0.98"/>
      <rect x="${w * 0.03}" y="${h * 0.585}" width="${w * 0.44}" height="6" fill="${C.white}"/>
      <rect x="${w * 0.045}" y="${h * 0.613}" width="${w * 0.045}" height="${h * 0.075}" rx="4" fill="${C.ink500}" opacity="0.55"/>
      <rect x="${w * 0.41}" y="${h * 0.613}" width="${w * 0.045}" height="${h * 0.075}" rx="4" fill="${C.ink500}" opacity="0.55"/>

      <!-- monitor left -->
      <rect x="${w * 0.075}" y="${h * 0.375}" width="${w * 0.155}" height="${h * 0.165}" rx="7" fill="${C.navy700}"/>
      <rect x="${w * 0.082}" y="${h * 0.385}" width="${w * 0.141}" height="${h * 0.145}" rx="4" fill="${C.emerald600}" opacity="0.65"/>
      <g stroke="${C.white}" stroke-opacity="0.55" stroke-width="2.5">
        <line x1="${w * 0.092}" y1="${h * 0.41}" x2="${w * 0.205}" y2="${h * 0.41}"/>
        <line x1="${w * 0.092}" y1="${h * 0.44}" x2="${w * 0.185}" y2="${h * 0.44}"/>
        <line x1="${w * 0.092}" y1="${h * 0.47}" x2="${w * 0.20}" y2="${h * 0.47}"/>
        <line x1="${w * 0.092}" y1="${h * 0.50}" x2="${w * 0.16}" y2="${h * 0.50}"/>
      </g>
      <rect x="${w * 0.142}" y="${h * 0.54}" width="14" height="${h * 0.045}" fill="${C.navy700}"/>
      <rect x="${w * 0.112}" y="${h * 0.578}" width="${w * 0.074}" height="8" rx="4" fill="${C.navy700}"/>

      <!-- monitor right (drawn sitting on desk) -->
      <rect x="${w * 0.255}" y="${h * 0.415}" width="${w * 0.135}" height="${h * 0.145}" rx="6" fill="${C.navy700}"/>
      <rect x="${w * 0.261}" y="${h * 0.424}" width="${w * 0.123}" height="${h * 0.127}" rx="4" fill="${C.gold500}" opacity="0.5"/>
      <rect x="${w * 0.315}" y="${h * 0.56}" width="12" height="${h * 0.025}" fill="${C.navy700}"/>

      <!-- keyboard + mug -->
      <rect x="${w * 0.145}" y="${h * 0.592}" width="${w * 0.085}" height="${h * 0.014}" rx="3" fill="${C.white}" opacity="0.9"/>
      <rect x="${w * 0.145}" y="${h * 0.592}" width="${w * 0.085}" height="${h * 0.014}" rx="3" fill="none" stroke="${C.ink300}" stroke-width="1.5"/>
      <rect x="${w * 0.35}" y="${h * 0.565}" width="${w * 0.026}" height="${h * 0.026}" rx="3" fill="${C.white}"/>
      <path d="M${w * 0.376} ${h * 0.572} h${w * 0.01} v${h * 0.012} h-${w * 0.01}" stroke="${C.white}" stroke-width="3" fill="none"/>

      <!-- task chair -->
      <g>
        <rect x="${w * 0.19}" y="${h * 0.66}" width="${w * 0.10}" height="${h * 0.045}" rx="10" fill="${C.navy700}"/>
        <rect x="${w * 0.205}" y="${h * 0.705}" width="12" height="${h * 0.055}" fill="${C.ink500}"/>
        <path d="M${w * 0.19} ${h * 0.775} h${w * 0.10}" stroke="${C.ink500}" stroke-width="8" stroke-linecap="round"/>
        <path d="M${w * 0.205} ${h * 0.76} l-${w * 0.012} ${h * 0.018}" stroke="${C.ink500}" stroke-width="6" stroke-linecap="round"/>
        <path d="M${w * 0.275} ${h * 0.76} l${w * 0.012} ${h * 0.018}" stroke="${C.ink500}" stroke-width="6" stroke-linecap="round"/>
      </g>

      <!-- filing cabinet + plant -->
      <rect x="${w * 0.885}" y="${h * 0.47}" width="${w * 0.09}" height="${h * 0.20}" rx="5" fill="${C.white}" opacity="0.97"/>
      <line x1="${w * 0.885}" y1="${h * 0.535}" x2="${w * 0.975}" y2="${h * 0.535}" stroke="${C.ink300}" stroke-opacity="0.7" stroke-width="2.5"/>
      <line x1="${w * 0.885}" y1="${h * 0.60}" x2="${w * 0.975}" y2="${h * 0.60}" stroke="${C.ink300}" stroke-opacity="0.7" stroke-width="2.5"/>
      <rect x="${w * 0.918}" y="${h * 0.50}" width="${w * 0.024}" height="5" rx="2" fill="${C.ink500}"/>
      <rect x="${w * 0.918}" y="${h * 0.565}" width="${w * 0.024}" height="5" rx="2" fill="${C.ink500}"/>
      <g fill="${C.emerald600}" opacity="0.9">
        <path d="M${w * 0.93} ${h * 0.47} q-${w * 0.028} -${h * 0.07} -${w * 0.006} -${h * 0.105} q${w * 0.02} ${h * 0.038} ${w * 0.006} ${h * 0.105} z"/>
        <path d="M${w * 0.93} ${h * 0.47} q${w * 0.03} -${h * 0.055} ${w * 0.008} -${h * 0.092} q-${w * 0.022} ${h * 0.032} -${w * 0.008} ${h * 0.092} z"/>
      </g>
    </g>`;
  } else if (v === 4) {
    /* ---- NEW BUILD / POST-CONSTRUCTION: bare shell, ladder, sheeting ---- */
    furniture = `
    <g>
      <!-- unfinished ceiling joists -->
      <g stroke="${C.ink300}" stroke-opacity="0.55" stroke-width="10">
        ${[0.03, 0.14, 0.25, 0.36, 0.47, 0.58, 0.69, 0.80, 0.91].map((p) => `<line x1="${w * p}" y1="0" x2="${w * p}" y2="${h * 0.09}"/>`).join('')}
      </g>
      <!-- plastic sheeting -->
      <path d="M${w * 0.02} ${h * 0.10} q${w * 0.05} ${h * 0.16} 0 ${h * 0.32} q-${w * 0.03} ${h * 0.14} ${w * 0.015} ${h * 0.22} l${w * 0.115} 0 q-${w * 0.03} -${h * 0.12} 0 -${h * 0.26} q${w * 0.03} -${h * 0.16} 0 -${h * 0.28} z"
            fill="${C.white}" opacity="0.3"/>
      <path d="M${w * 0.02} ${h * 0.10} q${w * 0.05} ${h * 0.16} 0 ${h * 0.32} q-${w * 0.03} ${h * 0.14} ${w * 0.015} ${h * 0.22} l${w * 0.115} 0 q-${w * 0.03} -${h * 0.12} 0 -${h * 0.26} q${w * 0.03} -${h * 0.16} 0 -${h * 0.28} z"
            fill="none" stroke="${C.white}" stroke-opacity="0.6" stroke-width="3"/>
      <!-- window openings -->
      <rect x="${w * 0.62}" y="${h * 0.14}" width="${w * 0.15}" height="${h * 0.26}" fill="${C.white}" opacity="0.4"/>
      <rect x="${w * 0.62}" y="${h * 0.14}" width="${w * 0.15}" height="${h * 0.26}" fill="none" stroke="${C.white}" stroke-opacity="0.75" stroke-width="6"/>
      <rect x="${w * 0.80}" y="${h * 0.14}" width="${w * 0.15}" height="${h * 0.26}" fill="${C.white}" opacity="0.4"/>
      <rect x="${w * 0.80}" y="${h * 0.14}" width="${w * 0.15}" height="${h * 0.26}" fill="none" stroke="${C.white}" stroke-opacity="0.75" stroke-width="6"/>
      <!-- dust sheet on floor -->
      <path d="M${w * 0.30} ${horizon} L${w * 0.22} ${h} L${w * 0.72} ${h} L${w * 0.66} ${horizon} Z" fill="${C.white}" opacity="0.45"/>
      <path d="M${w * 0.30} ${horizon} L${w * 0.22} ${h} L${w * 0.72} ${h} L${w * 0.66} ${horizon} Z" fill="none" stroke="${C.white}" stroke-opacity="0.65" stroke-width="3"/>
      <!-- stepladder -->
      <g stroke="${C.ink500}" stroke-opacity="0.9" stroke-width="11" stroke-linecap="round" fill="none">
        <path d="M${w * 0.40} ${h * 0.98} l${w * 0.055} -${h * 0.56}"/>
        <path d="M${w * 0.545} ${h * 0.98} l-${w * 0.05} -${h * 0.56}"/>
      </g>
      <g stroke="${C.ink500}" stroke-opacity="0.9" stroke-width="9">
        <line x1="${w * 0.422}" y1="${h * 0.62}" x2="${w * 0.527}" y2="${h * 0.62}"/>
        <line x1="${w * 0.412}" y1="${h * 0.74}" x2="${w * 0.533}" y2="${h * 0.74}"/>
        <line x1="${w * 0.402}" y1="${h * 0.86}" x2="${w * 0.538}" y2="${h * 0.86}"/>
      </g>
      <rect x="${w * 0.437}" y="${h * 0.385}" width="${w * 0.075}" height="14" rx="4" fill="${C.gold500}"/>
      <!-- paint can + tools -->
      <rect x="${w * 0.76}" y="${h * 0.735}" width="${w * 0.05}" height="${h * 0.075}" rx="4" fill="${C.white}" opacity="0.95"/>
      <rect x="${w * 0.762}" y="${h * 0.725}" width="${w * 0.046}" height="10" rx="4" fill="${C.gold500}"/>
      <path d="M${w * 0.757} ${h * 0.74} q${w * 0.025} -${h * 0.022} ${w * 0.056} 0" stroke="${C.ink500}" stroke-width="4" fill="none"/>
      <rect x="${w * 0.845}" y="${h * 0.79}" width="${w * 0.08} " height="10" rx="4" fill="${C.ink500}" opacity="0.8"/>
      <!-- debris -->
      <ellipse cx="${w * 0.62}" cy="${h * 0.90}" rx="${w * 0.05}" ry="${h * 0.02}" fill="${C.ink500}" opacity="0.25"/>
      <ellipse cx="${w * 0.15}" cy="${h * 0.94}" rx="${w * 0.04}" ry="${h * 0.016}" fill="${C.ink500}" opacity="0.22"/>
    </g>`;
  } else {
    /* ---- COMMERCIAL / GYM FLOOR: open plan, equipment, big windows ---- */
    furniture = `
    <g>
      <!-- tall glazing -->
      <g>
        <rect x="${w * 0.03}" y="${h * 0.10}" width="${w * 0.94}" height="${h * 0.42}" fill="${C.white}" opacity="0.26"/>
        <rect x="${w * 0.03}" y="${h * 0.10}" width="${w * 0.94}" height="${h * 0.42}" fill="url(#glass-${id})"/>
        <rect x="${w * 0.03}" y="${h * 0.10}" width="${w * 0.94}" height="${h * 0.42}" fill="none" stroke="${C.white}" stroke-opacity="0.75" stroke-width="6"/>
        ${[0.19, 0.35, 0.51, 0.67, 0.83].map((p) => `<line x1="${w * p}" y1="${h * 0.10}" x2="${w * p}" y2="${h * 0.52}" stroke="${C.white}" stroke-opacity="0.6" stroke-width="4"/>`).join('')}
        <rect x="${w * 0.03}" y="${h * 0.52}" width="${w * 0.94}" height="${h * 0.022}" fill="${C.navy700}" opacity="0.7"/>
      </g>
      <!-- city view through glass -->
      <g opacity="0.2" fill="${C.navy700}">
        <rect x="${w * 0.06}" y="${h * 0.34}" width="${w * 0.045}" height="${h * 0.18}"/>
        <rect x="${w * 0.12}" y="${h * 0.28}" width="${w * 0.035}" height="${h * 0.24}"/>
        <rect x="${w * 0.45}" y="${h * 0.38}" width="${w * 0.04}" height="${h * 0.14}"/>
        <rect x="${w * 0.75}" y="${h * 0.30}" width="${w * 0.048}" height="${h * 0.22}"/>
        <rect x="${w * 0.88}" y="${h * 0.36}" width="${w * 0.04}" height="${h * 0.16}"/>
      </g>

      <!-- rubber floor tiles -->
      <g opacity="0.3">
        <rect y="${horizon}" width="${w}" height="${h - horizon}" fill="${C.navy700}"/>
      </g>

      <!-- treadmill row -->
      ${shadow(w * 0.25, h * 0.79, w * 0.19, h * 0.026, 0.24)}
      <g>
        <rect x="${w * 0.055}" y="${h * 0.575}" width="${w * 0.235}" height="${h * 0.038}" rx="10" fill="${C.white}" opacity="0.97"/>
        <rect x="${w * 0.055}" y="${h * 0.575}" width="${w * 0.235}" height="6" fill="${C.white}"/>
        <rect x="${w * 0.062}" y="${h * 0.578}" width="${w * 0.221}" height="${h * 0.014}" rx="6" fill="${C.ink300}" opacity="0.6"/>
        <path d="M${w * 0.07} ${h * 0.612} q0 ${h * 0.055} ${w * 0.018} ${h * 0.075}" stroke="${C.ink500}" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M${w * 0.275} ${h * 0.612} q0 ${h * 0.055} -${w * 0.018} ${h * 0.075}" stroke="${C.ink500}" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M${w * 0.046} ${h * 0.575} l${w * 0.006} -${h * 0.145}" stroke="${C.ink500}" stroke-width="8" stroke-linecap="round"/>
        <path d="M${w * 0.046} ${h * 0.43} h${w * 0.052}" stroke="${C.ink500}" stroke-width="8" stroke-linecap="round"/>
        <rect x="${w * 0.03}" y="${h * 0.352}" width="${w * 0.078}" height="${h * 0.046}" rx="6" fill="${C.navy700}"/>
        <rect x="${w * 0.036}" y="${h * 0.360}" width="${w * 0.066}" height="${h * 0.030}" rx="4" fill="${C.emerald500}" opacity="0.85"/>
      </g>
      <!-- treadmill 2 -->
      ${shadow(w * 0.55, h * 0.80, w * 0.16, h * 0.022, 0.22)}
      <g>
        <rect x="${w * 0.43}" y="${h * 0.605}" width="${w * 0.19}" height="${h * 0.034}" rx="10" fill="${C.white}" opacity="0.97"/>
        <rect x="${w * 0.436}" y="${h * 0.608}" width="${w * 0.178}" height="${h * 0.012}" rx="6" fill="${C.ink300}" opacity="0.6"/>
        <path d="M${w * 0.442} ${h * 0.638} q0 ${h * 0.048} ${w * 0.016} ${h * 0.065}" stroke="${C.ink500}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M${w * 0.607} ${h * 0.638} q0 ${h * 0.048} -${w * 0.016} ${h * 0.065}" stroke="${C.ink500}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M${w * 0.422} ${h * 0.605} l${w * 0.005} -${h * 0.125}" stroke="${C.ink500}" stroke-width="7" stroke-linecap="round"/>
        <path d="M${w * 0.422} ${h * 0.482} h${w * 0.044}" stroke="${C.ink500}" stroke-width="7" stroke-linecap="round"/>
        <rect x="${w * 0.408}" y="${h * 0.418}" width="${w * 0.064}" height="${h * 0.040}" rx="5" fill="${C.navy700}"/>
        <rect x="${w * 0.413}" y="${h * 0.425}" width="${w * 0.054}" height="${h * 0.026}" rx="4" fill="${C.emerald500}" opacity="0.85"/>
      </g>

      <!-- weight rack -->
      <g>
        ${shadow(w * 0.80, h * 0.66, w * 0.14, h * 0.024, 0.22)}
        <rect x="${w * 0.685}" y="${h * 0.505}" width="${w * 0.275}" height="${h * 0.022}" rx="6" fill="${C.navy700}"/>
        <rect x="${w * 0.685}" y="${h * 0.505}" width="${w * 0.275}" height="${h * 0.008}" rx="4" fill="${C.navy600}" opacity="0.8"/>
        <rect x="${w * 0.700}" y="${h * 0.525}" width="12" height="${h * 0.115}" fill="${C.navy700}"/>
        <rect x="${w * 0.940}" y="${h * 0.525}" width="12" height="${h * 0.115}" fill="${C.navy700}"/>
        ${[0, 1, 2, 3].map((i) => `
          <g>
            <rect x="${w * (0.705 + i * 0.062)}" y="${h * 0.545}" width="${w * 0.042}" height="${h * 0.082}" rx="9" fill="${C.ink700}" opacity="0.92"/>
            <rect x="${w * (0.705 + i * 0.062)}" y="${h * 0.545}" width="${w * 0.042}" height="${h * 0.030}" rx="5" fill="${C.ink500}"/>
            <rect x="${w * (0.705 + i * 0.062)}" y="${h * 0.597}" width="${w * 0.042}" height="${h * 0.030}" rx="5" fill="${C.ink500}"/>
          </g>`).join('')}
      </g>

      <!-- cleaning cart (brand touch) -->
      ${shadow(w * 0.30, h * 0.93, w * 0.10, h * 0.018, 0.2)}
      <g>
        <rect x="${w * 0.245}" y="${h * 0.790}" width="${w * 0.105}" height="${h * 0.108}" rx="6" fill="${C.emerald600}"/>
        <rect x="${w * 0.245}" y="${h * 0.790}" width="${w * 0.105}" height="${h * 0.020}" fill="${C.emerald700}"/>
        <rect x="${w * 0.255}" y="${h * 0.800}" width="${w * 0.085}" height="${h * 0.010}" rx="4" fill="${C.white}" opacity="0.25"/>
        <circle cx="${w * 0.268}" cy="${h * 0.898}" r="${h * 0.013}" fill="${C.navy700}"/>
        <circle cx="${w * 0.327}" cy="${h * 0.898}" r="${h * 0.013}" fill="${C.navy700}"/>
        <rect x="${w * 0.258}" y="${h * 0.752}" width="${w * 0.020}" height="${h * 0.042}" rx="4" fill="${C.white}" opacity="0.95"/>
        <rect x="${w * 0.288}" y="${h * 0.762}" width="${w * 0.017}" height="${h * 0.032}" rx="4" fill="${C.gold500}"/>
        <rect x="${w * 0.312}" y="${h * 0.768}" width="${w * 0.014}" height="${h * 0.026}" rx="4" fill="${C.emerald400}"/>
        <path d="M${w * 0.342} ${h * 0.868} l${w * 0.020} -${h * 0.055}" stroke="${C.gold500}" stroke-width="6" stroke-linecap="round"/>
      </g>
    </g>`;
  }

  // Sparkle specks — the "just cleaned" signal.
  let sparkles = '';
  const seeds = [[0.13, 0.17], [0.32, 0.24], [0.47, 0.13], [0.67, 0.36], [0.86, 0.22], [0.23, 0.60], [0.57, 0.68], [0.78, 0.55], [0.40, 0.82], [0.90, 0.72]];
  seeds.forEach(([sx, sy], i) => {
    if ((i + variant) % 2) return;
    const s = 9 + ((i * 7) % 13);
    const x = w * sx, y = h * sy;
    sparkles += `<g opacity="${0.26 + (i % 3) * 0.1}">
      <path d="M${x} ${y - s} l${s * 0.22} ${s * 0.78} l${s * 0.78} ${s * 0.22} l-${s * 0.78} ${s * 0.22} l-${s * 0.22} ${s * 0.78} l-${s * 0.22} -${s * 0.78} l-${s * 0.78} -${s * 0.22} l${s * 0.78} -${s * 0.22} z" fill="${C.white}"/>
      <circle cx="${x}" cy="${y}" r="${s * 0.16}" fill="${C.white}" opacity="0.9"/>
    </g>`;
  });

  const warm = mood === 'warm';
  const grade = warm
    ? `<rect width="${w}" height="${h}" fill="${C.gold500}" opacity="0.055"/>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    ${sceneDefs(id, wallA, wallB, glow)}
    <linearGradient id="vig-${id}" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0" stop-color="${C.navy900}" stop-opacity="0.06"/>
      <stop offset="0.55" stop-color="${C.navy900}" stop-opacity="0"/>
      <stop offset="1" stop-color="${C.navy900}" stop-opacity="0.34"/>
    </linearGradient>
    <linearGradient id="edge-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.navy900}" stop-opacity="0.2"/>
      <stop offset="0.14" stop-color="${C.navy900}" stop-opacity="0"/>
      <stop offset="0.86" stop-color="${C.navy900}" stop-opacity="0"/>
      <stop offset="1" stop-color="${C.navy900}" stop-opacity="0.2"/>
    </linearGradient>
  </defs>
  ${roomBase(id, wallA, wallB, glow, w, h, { horizon: 0.66, surface: v === 1 ? 'tile' : 'plaster' })}
  ${furniture}
  ${grade}
  ${sparkles}
  <rect width="${w}" height="${h}" fill="url(#vig-${id})"/>
  <rect width="${w}" height="${h}" fill="url(#edge-${id})"/>
</svg>`;
}

/** Before/after pair: same scene, dirtied vs pristine. */
function beforeAfterSvg(w, h, variant, mode) {
  const dirty = mode === 'before';
  const v = variant % 6;

  const base = sceneSvg({
    w, h, variant,
    wallA: dirty ? '#b9b2a2' : '#eaf1f8',
    wallB: dirty ? '#8c867a' : '#cddced',
    glow: dirty ? '#c9bfa4' : '#ffffff',
    mood: dirty ? 'dim' : 'bright',
  });
  if (!dirty) return base;

  const id = 'dirt' + variant;
  const horizon = h * 0.66;
  let grime = '';

  // Wall scuffs and grease smears, denser near work surfaces.
  const scuffs = [
    [0.10, 0.30, 78, 42], [0.24, 0.26, 62, 34], [0.38, 0.33, 90, 46],
    [0.56, 0.28, 70, 38], [0.72, 0.34, 84, 44], [0.88, 0.26, 58, 32],
    [0.16, 0.50, 96, 40], [0.44, 0.52, 74, 36], [0.68, 0.50, 88, 40],
    [0.86, 0.54, 66, 34],
  ];
  scuffs.forEach(([sx, sy, rx, ry]) => {
    grime += `<ellipse cx="${w * sx}" cy="${h * sy}" rx="${rx}" ry="${ry}" fill="${C.ink700}" opacity="0.16"/>`;
  });

  // Vertical drips / streaks down the wall.
  for (let i = 0; i < 14; i += 1) {
    const x = w * (0.04 + i * 0.068);
    const top = h * (0.12 + ((i * 7) % 9) * 0.025);
    const len = h * (0.14 + ((i * 5) % 7) * 0.035);
    grime += `<rect x="${x}" y="${top}" width="${5 + (i % 3) * 3}" height="${len}" fill="${C.ink500}" opacity="0.09" rx="2"/>`;
  }

  // Floor grime, footprints and pooled dust.
  grime += `<ellipse cx="${w * 0.32}" cy="${horizon + h * 0.19}" rx="${w * 0.22}" ry="${h * 0.07}" fill="${C.ink700}" opacity="0.18"/>`;
  grime += `<ellipse cx="${w * 0.74}" cy="${horizon + h * 0.24}" rx="${w * 0.19}" ry="${h * 0.06}" fill="${C.ink700}" opacity="0.16"/>`;
  for (let i = 0; i < 8; i += 1) {
    const fx = w * (0.14 + i * 0.10);
    const fy = horizon + h * (0.10 + ((i * 3) % 5) * 0.045);
    grime += `<ellipse cx="${fx}" cy="${fy}" rx="17" ry="10" fill="${C.ink700}" opacity="0.2" transform="rotate(${(i * 37) % 40 - 20} ${fx} ${fy})"/>`;
  }

  // Clutter: boxes, crates, bags, debris.
  const clutter = [
    [0.09, 0.72, 0.10, 0.09, 0.40], [0.24, 0.78, 0.075, 0.065, 0.34],
    [0.55, 0.74, 0.09, 0.075, 0.38], [0.86, 0.80, 0.065, 0.055, 0.30],
  ];
  clutter.forEach(([cx, cy, cw, ch, o]) => {
    grime += `<rect x="${w * cx}" y="${h * cy}" width="${w * cw}" height="${h * ch}" rx="5" fill="${C.ink700}" opacity="${o}"/>`;
    grime += `<rect x="${w * cx}" y="${h * cy}" width="${w * cw}" height="${h * ch * 0.28}" rx="4" fill="${C.ink700}" opacity="${o * 0.6}"/>`;
    grime += `<line x1="${w * (cx + cw * 0.22)}" y1="${h * cy}" x2="${w * (cx + cw * 0.78)}" y2="${h * cy}" stroke="${C.white}" stroke-opacity="0.14" stroke-width="2"/>`;
  });
  grime += `<path d="M${w * 0.68} ${h * 0.86} q${w * 0.04} -${h * 0.05} ${w * 0.09} 0 q-${w * 0.045} ${h * 0.035} -${w * 0.09} 0 z" fill="${C.ink700}" opacity="0.3"/>`;

  // Scattered dust specks.
  const specks = [[0.15, 0.62], [0.27, 0.68], [0.41, 0.60], [0.53, 0.72], [0.66, 0.64], [0.79, 0.70], [0.90, 0.62], [0.35, 0.88], [0.61, 0.90], [0.83, 0.92]];
  specks.forEach(([sx, sy], i) => {
    const r = 3 + (i % 4) * 1.6;
    grime += `<circle cx="${w * sx}" cy="${h * sy}" r="${r}" fill="${C.ink700}" opacity="0.24"/>`;
  });

  // Cobwebs in a corner.
  grime += `<g stroke="${C.white}" stroke-opacity="0.3" stroke-width="1.6" fill="none">
    <path d="M0 ${h * 0.10} L${w * 0.10} ${h * 0.10} M0 ${h * 0.10} L${w * 0.07} ${h * 0.19} M0 ${h * 0.10} L${w * 0.10} ${h * 0.10}"/>
    <path d="M${w * 0.015} ${h * 0.10} q${w * 0.02} ${h * 0.035} ${w * 0.038} ${h * 0.052}"/>
    <path d="M${w * 0.032} ${h * 0.115} q${w * 0.02} ${h * 0.02} ${w * 0.032} ${h * 0.042}"/>
    <path d="M${w * 0.05} ${h * 0.13} q${w * 0.018} ${h * 0.016} ${w * 0.028} ${h * 0.036}"/>
  </g>`;

  return base.replace(
    '</svg>',
    `<g>${grime}</g>
  <rect width="${w}" height="${h}" fill="#7d7358" opacity="0.2"/>
  <rect width="${w}" height="${h}" fill="#3a3227" opacity="0.1"/>
  <rect width="${w}" height="${h}" fill="url(#vig-${id})" opacity="0.55"/>
</svg>`
  );
}

/* ======================================================================
   OG IMAGE  (1200 × 630)
   ====================================================================== */
function ogImageSvg() {
  const w = 1200, h = 630;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="ogbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.navy900}"/>
      <stop offset="0.55" stop-color="${C.navy800}"/>
      <stop offset="1" stop-color="${C.navy600}"/>
    </linearGradient>
    <radialGradient id="ogglow" cx="0.84" cy="0.14" r="0.7">
      <stop offset="0" stop-color="${C.emerald500}" stop-opacity="0.45"/>
      <stop offset="1" stop-color="${C.emerald500}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ogglow2" cx="0.04" cy="0.94" r="0.6">
      <stop offset="0" stop-color="${C.gold500}" stop-opacity="0.3"/>
      <stop offset="1" stop-color="${C.gold500}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#ogbg)"/>
  <rect width="${w}" height="${h}" fill="url(#ogglow)"/>
  <rect width="${w}" height="${h}" fill="url(#ogglow2)"/>
  <!-- grid -->
  <g stroke="${C.white}" stroke-opacity="0.05" stroke-width="1">
    ${Array.from({ length: 21 }, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${h}"/>`).join('')}
    ${Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 63}" x2="${w}" y2="${i * 63}"/>`).join('')}
  </g>

  <!-- mark -->
  <g transform="translate(72,92) scale(0.30)">
    <rect x="16" y="16" width="480" height="480" rx="112" fill="${C.navy700}"/>
    <path d="M256 92 C 352 118, 402 196, 398 268 C 394 340, 330 404, 256 424 C 182 404, 118 340, 114 268 C 110 196, 160 118, 256 92 Z" fill="${C.emerald500}"/>
    <path d="M256 108 C 256 220, 256 320, 256 418" stroke="${C.navy900}" stroke-opacity="0.3" stroke-width="10" stroke-linecap="round" fill="none"/>
    <path d="M356 132 l10 26 26 10 -26 10 -10 26 -10 -26 -26 -10 26 -10 z" fill="${C.gold500}"/>
  </g>

  <text x="72" y="316" font-family="${DISPLAY}" font-size="112" font-weight="700" letter-spacing="2" fill="${C.white}">ZENVORALI CLEANING</text>
  <text x="76" y="372" font-family="${FONT}" font-size="34" font-weight="700" letter-spacing="6" fill="${C.gold500}">KANSAS CITY, MISSOURI</text>
  <rect x="76" y="400" width="200" height="5" rx="3" fill="${C.emerald500}"/>

  <text x="76" y="470" font-family="${FONT}" font-size="31" font-weight="500" fill="#b6c7d8">Premium residential &amp; commercial cleaning.</text>
  <text x="76" y="516" font-family="${FONT}" font-size="31" font-weight="500" fill="#b6c7d8">Insured, bonded, background-checked teams.</text>

  <!-- trust chips -->
  <g font-family="${FONT}" font-size="23" font-weight="700">
    <rect x="76" y="552" width="196" height="52" rx="26" fill="${C.emerald500}" opacity="0.2" stroke="${C.emerald400}" stroke-opacity="0.5"/>
    <text x="102" y="585" fill="${C.emerald400}">★ 4.9 · 612 reviews</text>

    <rect x="292" y="552" width="210" height="52" rx="26" fill="${C.white}" opacity="0.08" stroke="${C.white}" stroke-opacity="0.2"/>
    <text x="318" y="585" fill="#eaf1f8">100% Re-Clean</text>

    <rect x="522" y="552" width="230" height="52" rx="26" fill="${C.white}" opacity="0.08" stroke="${C.white}" stroke-opacity="0.2"/>
    <text x="548" y="585" fill="#eaf1f8">Flat-Rate Pricing</text>
  </g>

  <text x="${w - 76}" y="${h - 44}" text-anchor="end" font-family="${FONT}" font-size="27" font-weight="800" fill="${C.white}">zenvoralicleaning.com</text>
</svg>`;
}

/* ======================================================================
   FAVICON — simplified mark legible at 16px
   ====================================================================== */
function faviconSvg(size) {
  const s = size;
  const r = Math.round(s * 0.22);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="fbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.navy700}"/>
      <stop offset="1" stop-color="${C.navy900}"/>
    </linearGradient>
    <linearGradient id="fl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.emerald400}"/>
      <stop offset="1" stop-color="${C.emerald700}"/>
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="62" height="62" rx="${r}" fill="url(#fbg)"/>
  <path d="M32 10 C 45 14, 51 25, 50.5 35 C 50 45, 42 54, 32 57 C 22 54, 14 45, 13.5 35 C 13 25, 19 14, 32 10 Z" fill="url(#fl)"/>
  <path d="M32 12 C 32 28, 32 43, 32 56" stroke="${C.navy900}" stroke-opacity="0.35" stroke-width="2.4" stroke-linecap="round" fill="none"/>
  <path d="M46 15 l2.4 6 6 2.4 -6 2.4 -2.4 6 -2.4 -6 -6 -2.4 6 -2.4 z" fill="${C.gold500}"/>
</svg>`;
}

/* ======================================================================
   SOURCE IMAGE INVENTORY
   ====================================================================== */
const SCENES = [
  // --- heroes -------------------------------------------------------
  { name: 'hero-home', w: 1600, h: 1000, variant: 0 },
  { name: 'hero-about', w: 1600, h: 900, variant: 2 },
  { name: 'hero-team', w: 1600, h: 900, variant: 4 },
  { name: 'hero-services', w: 1600, h: 900, variant: 1 },
  { name: 'hero-service-area', w: 1600, h: 900, variant: 3 },
  { name: 'hero-pricing', w: 1600, h: 900, variant: 0 },
  { name: 'hero-projects', w: 1600, h: 900, variant: 2 },
  { name: 'hero-reviews', w: 1600, h: 900, variant: 5 },
  { name: 'hero-blog', w: 1600, h: 900, variant: 3 },
  { name: 'hero-faq', w: 1600, h: 900, variant: 1 },
  { name: 'hero-contact', w: 1600, h: 900, variant: 4 },
  { name: 'hero-commercial', w: 1600, h: 900, variant: 3 },
  { name: 'hero-offers', w: 1600, h: 900, variant: 5 },
  { name: 'hero-green', w: 1600, h: 900, variant: 2 },
  { name: 'hero-referral', w: 1600, h: 900, variant: 0 },
  { name: 'hero-careers', w: 1600, h: 900, variant: 4 },

  // --- services -----------------------------------------------------
  { name: 'service-house-cleaning', w: 1200, h: 750, variant: 2 },
  { name: 'service-deep-cleaning', w: 1200, h: 750, variant: 1 },
  { name: 'service-move-out-cleaning', w: 1200, h: 750, variant: 4 },
  { name: 'service-commercial-cleaning', w: 1200, h: 750, variant: 3 },
  { name: 'service-apartment-cleaning', w: 1200, h: 750, variant: 2 },
  { name: 'service-post-construction', w: 1200, h: 750, variant: 4 },

  // --- about / why --------------------------------------------------
  { name: 'about-team', w: 1200, h: 960, variant: 4 },
  { name: 'about-detail', w: 900, h: 675, variant: 1 },
  { name: 'about-standards', w: 1200, h: 900, variant: 3 },
  { name: 'why-us', w: 1100, h: 1180, variant: 0 },
  { name: 'team-crew', w: 1200, h: 900, variant: 4 },

  // --- blog ---------------------------------------------------------
  { name: 'blog-cost-guide', w: 1200, h: 750, variant: 2 },
  { name: 'blog-deep-vs-standard', w: 1200, h: 750, variant: 1 },
  { name: 'blog-move-out-checklist', w: 1200, h: 750, variant: 4 },
  { name: 'blog-office-cleanliness', w: 1200, h: 750, variant: 3 },
  { name: 'blog-pet-safe', w: 1200, h: 750, variant: 2 },
  { name: 'blog-spring-cleaning', w: 1200, h: 750, variant: 0 },

  // --- team portraits ----------------------------------------------
  { name: 'team-romen', w: 700, h: 700, variant: 0 },
  { name: 'team-marisol', w: 700, h: 700, variant: 1 },
  { name: 'team-deshawm', w: 700, h: 700, variant: 4 },
  { name: 'team-anh', w: 700, h: 700, variant: 2 },
  { name: 'team-bobby', w: 700, h: 700, variant: 5 },
  { name: 'team-yolanda', w: 700, h: 700, variant: 3 },
];

const PROJECTS = [
  { name: 'bungalow', variant: 2 },
  { name: 'loft', variant: 1 },
  { name: 'office', variant: 3 },
  { name: 'newbuild', variant: 4 },
  { name: 'condo', variant: 0 },
  { name: 'gym', variant: 5 },
];

/* ======================================================================
   RENDER
   ====================================================================== */
async function writeSvgPng(svg, outPath, width) {
  const buf = Buffer.from(svg);
  const pipe = sharp(buf, { density: 300 });
  if (width) pipe.resize({ width });
  await pipe.png({ compressionLevel: 9 }).toFile(outPath);
}

async function writeSvgWebp(svg, outPath, width, quality = 78) {
  const buf = Buffer.from(svg);
  const pipe = sharp(buf, { density: 220 });
  if (width) pipe.resize({ width, withoutEnlargement: true });
  await pipe.webp({ quality, effort: 6 }).toFile(outPath);
}

async function writeSvgJpg(svg, outPath, width, quality = 82) {
  const buf = Buffer.from(svg);
  const pipe = sharp(buf, { density: 200 });
  if (width) pipe.resize({ width, withoutEnlargement: true });
  await pipe.jpeg({ quality, mozjpeg: true, progressive: true }).toFile(outPath);
}

/** Build a valid multi-size .ico from PNG buffers. */
function buildIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);  // reserved
  header.writeUInt16LE(1, 2);  // type = icon
  header.writeUInt16LE(count, 4);

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  const blobs = [];

  images.forEach((img, i) => {
    const b = i * 16;
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, b + 0);
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, b + 1);
    dir.writeUInt8(0, b + 2);           // palette
    dir.writeUInt8(0, b + 3);           // reserved
    dir.writeUInt16LE(1, b + 4);        // color planes
    dir.writeUInt16LE(32, b + 6);       // bpp
    dir.writeUInt32LE(img.data.length, b + 8);
    dir.writeUInt32LE(offset, b + 12);
    offset += img.data.length;
    blobs.push(img.data);
  });

  return Buffer.concat([header, dir, ...blobs]);
}

async function main() {
  const t0 = Date.now();
  let files = 0;
  const manifest = { generatedAt: new Date().toISOString(), images: {} };

  function track(key, src, width, height, sources) {
    manifest.images[key] = {
      src,
      width,
      height,
      aspect: width && height ? +(width / height).toFixed(4) : null,
      sources: sources || [],
      alt: '',
    };
  }

  /* ---- Logo & favicon ---- */
  const logoFull = logoSvg(960, 240);
  const logoMark = logoMarkSvg(512, true);
  const logoMarkFlat = logoMarkSvg(512, false);

  fs.writeFileSync(path.join(IMG, 'logo.svg'), logoFull);
  fs.writeFileSync(path.join(IMG, 'logo-mark.svg'), logoMarkFlat);
  await writeSvgWebp(logoFull, path.join(IMG, 'logo.webp'), 960, 88);
  await writeSvgWebp(logoFull, path.join(IMG, 'logo@2x.webp'), 1440, 88);
  await writeSvgWebp(logoMark, path.join(IMG, 'logo-mark.webp'), 184, 90);
  await writeSvgWebp(logoMark, path.join(IMG, 'logo-mark@2x.webp'), 368, 90);
  track('logo', '/img/logo.webp', 960, 240, [
    { width: 480, src: '/img/logo.webp' },
    { width: 720, src: '/img/logo@2x.webp' },
  ]);
  track('logoMark', '/img/logo-mark.webp', 184, 184, [
    { width: 92, src: '/img/logo-mark.webp' },
    { width: 184, src: '/img/logo-mark@2x.webp' },
  ]);
  files += 6;

  const favSizes = [16, 32, 48, 180, 192, 512];
  const icoParts = [];
  for (const s of favSizes) {
    const svg = faviconSvg(Math.max(s, 64));
    const pngBuf = await sharp(Buffer.from(svg), { density: 400 })
      .resize(s, s)
      .png({ compressionLevel: 9 })
      .toBuffer();
    const name = s === 180 ? 'apple-touch-icon.png' : `favicon-${s}.png`;
    fs.writeFileSync(path.join(IMG, name), pngBuf);
    files += 1;
    if (s === 16 || s === 32 || s === 48) {
      icoParts.push({ size: s, data: pngBuf });
    }
  }
  fs.writeFileSync(path.join(IMG, 'favicon.ico'), buildIco(icoParts));
  files += 1;

  /* ---- OG image ---- */
  const og = ogImageSvg();
  await writeSvgJpg(og, path.join(IMG, 'og-image.jpg'), 1200, 84);
  track('ogImage', '/img/og-image.jpg', 1200, 630, []);
  files += 1;

  /* ---- Scenes (responsive webp set) ---- */
  const RESPONSIVE = [480, 768, 1024, 1440, 1920];

  for (const scene of SCENES) {
    const svg = sceneSvg({
      w: scene.w, h: scene.h, variant: scene.variant,
      wallA: '#eaf1f8', wallB: '#cddced', glow: '#ffffff',
    });
    const sources = [];
    const widths = RESPONSIVE.filter((w) => w <= scene.w || w === RESPONSIVE[0]);
    for (const w of widths) {
      const out = `${scene.name}-${w}.webp`;
      await writeSvgWebp(svg, path.join(IMG, out), w, 76);
      sources.push({ width: w, src: `/img/${out}` });
      files += 1;
    }
    await writeSvgWebp(svg, path.join(IMG, `${scene.name}.webp`), scene.w, 80);
    await writeSvgJpg(svg, path.join(IMG, `${scene.name}-fallback.jpg`), Math.min(1024, scene.w), 78);
    files += 2;

    const key = scene.name.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/-/g, '');
    track(key, `/img/${scene.name}.webp`, scene.w, scene.h, sources);
  }

  /* ---- Projects (before / after) ---- */
  for (const proj of PROJECTS) {
    for (const mode of ['before', 'after']) {
      const svg = beforeAfterSvg(1400, 875, proj.variant, mode);
      const name = `project-${proj.name}-${mode}`;
      const sources = [];
      for (const w of [480, 768, 1024, 1400]) {
        const out = `${name}-${w}.webp`;
        await writeSvgWebp(svg, path.join(IMG, out), w, 74);
        sources.push({ width: w, src: `/img/${out}` });
        files += 1;
      }
      await writeSvgWebp(svg, path.join(IMG, `${name}.webp`), 1400, 80);
      await writeSvgJpg(svg, path.join(IMG, `${name}-fallback.jpg`), 1024, 78);
      files += 2;
      const key = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/-/g, '');
      track(key, `/img/${name}.webp`, 1400, 875, sources);
    }
  }

  /* ---- Service area map ---- */
  const mapW = 1200, mapH = 900;
  const mapSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${mapW}" height="${mapH}" viewBox="0 0 ${mapW} ${mapH}">
  <defs>
    <linearGradient id="mbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.navy800}"/>
      <stop offset="1" stop-color="${C.navy900}"/>
    </linearGradient>
    <radialGradient id="mcore" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${C.emerald400}"/>
      <stop offset="1" stop-color="${C.emerald700}"/>
    </radialGradient>
  </defs>
  <rect width="${mapW}" height="${mapH}" fill="url(#mbg)"/>
  <g stroke="${C.white}" stroke-opacity="0.05" stroke-width="1">
    ${Array.from({ length: 25 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${mapH}"/>`).join('')}
    ${Array.from({ length: 19 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="${mapW}" y2="${i * 50}"/>`).join('')}
  </g>
  <!-- highways -->
  <path d="M0 560 C 240 520, 420 380, 620 340 C 800 305, 980 250, 1200 200" stroke="${C.navy500}" stroke-width="9" fill="none" opacity="0.8"/>
  <path d="M420 900 C 470 700, 520 560, 600 430 C 660 330, 700 200, 720 0" stroke="${C.navy500}" stroke-width="9" fill="none" opacity="0.8"/>
  <path d="M900 900 C 870 720, 830 560, 800 420 C 780 300, 770 160, 760 0" stroke="${C.navy600}" stroke-width="6" fill="none" opacity="0.6"/>
  <!-- rivers -->
  <path d="M120 0 C 160 180, 130 330, 60 470 C 10 570, 20 720, 90 900" stroke="#1f4d7a" stroke-width="16" fill="none" opacity="0.55" stroke-linecap="round"/>
  <path d="M1080 900 C 1040 740, 1060 600, 1130 470 C 1180 380, 1195 250, 1170 120" stroke="#1f4d7a" stroke-width="13" fill="none" opacity="0.45" stroke-linecap="round"/>
  <!-- radius rings -->
  <circle cx="600" cy="450" r="330" fill="${C.emerald500}" opacity="0.07"/>
  <circle cx="600" cy="450" r="330" stroke="${C.emerald400}" stroke-width="3" stroke-dasharray="12 10" fill="none" opacity="0.55"/>
  <circle cx="600" cy="450" r="215" fill="${C.emerald500}" opacity="0.09"/>
  <circle cx="600" cy="450" r="215" stroke="${C.emerald400}" stroke-width="3" stroke-dasharray="12 10" fill="none" opacity="0.7"/>
  <circle cx="600" cy="450" r="105" fill="${C.emerald500}" opacity="0.13"/>
  <circle cx="600" cy="450" r="105" stroke="${C.emerald400}" stroke-width="3" fill="none" opacity="0.85"/>
  <!-- centre -->
  <circle cx="600" cy="450" r="44" fill="url(#mcore)"/>
  <circle cx="600" cy="450" r="66" stroke="${C.emerald400}" stroke-width="3" fill="none" opacity="0.5"/>
  <!-- city pins -->
  ${[[520, 380], [690, 505], [455, 520], [740, 350], [610, 610], [820, 470], [380, 430], [660, 290]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${C.gold500}"/><circle cx="${x}" cy="${y}" r="18" fill="${C.gold500}" opacity="0.22"/>`)
    .join('')}
  <g font-family="${FONT}" fill="${C.white}" font-weight="700">
    <text x="600" y="436" font-size="19" text-anchor="middle" fill="${C.white}">KANSAS</text>
    <text x="600" y="458" font-size="19" text-anchor="middle" fill="${C.white}">CITY</text>
    <text x="600" y="484" font-size="12" text-anchor="middle" fill="#cfe6dd" letter-spacing="1.6">HEADQUARTERS</text>
    <text x="617" y="330" font-size="13" fill="#9ee3cd">NORTHLAND</text>
    <text x="700" y="540" font-size="13" fill="#9ee3cd">PLAZA</text>
    <text x="330" y="400" font-size="13" fill="#9ee3cd">JOHNSON CO.</text>
    <text x="836" y="418" font-size="13" fill="#9ee3cd">LEE'S SUMMIT</text>
    <text x="580" y="660" font-size="13" fill="#9ee3cd">OVERLAND PARK</text>
  </g>
  <g font-family="${FONT}" font-size="13" fill="#a8b6c2">
    <text x="40" y="60" font-size="15" font-weight="800" fill="${C.white}" letter-spacing="2.4">SERVICE AREA</text>
    <circle cx="44" cy="88" r="6" fill="${C.emerald400}"/><text x="60" y="93">0–10 mi · core</text>
    <circle cx="44" cy="112" r="6" fill="${C.emerald400}" opacity="0.75"/><text x="60" y="117">10–22 mi · standard</text>
    <circle cx="44" cy="136" r="6" fill="${C.ink300}" opacity="0.7"/><text x="60" y="141">22–35 mi · extended</text>
  </g>
  <text x="${mapW - 40}" y="${mapH - 34}" text-anchor="end" font-family="${FONT}" font-size="15" font-weight="800" fill="${C.gold500}">35-mile radius from Kansas City, MO</text>
</svg>`;

  const mapSources = [];
  for (const w of [480, 768, 1024, 1200]) {
    await writeSvgWebp(mapSvg, path.join(IMG, `service-area-map-${w}.webp`), w, 76);
    mapSources.push({ width: w, src: `/img/service-area-map-${w}.webp` });
    files += 1;
  }
  await writeSvgWebp(mapSvg, path.join(IMG, 'service-area-map.webp'), 1200, 80);
  await writeSvgJpg(mapSvg, path.join(IMG, 'service-area-map-fallback.jpg'), 1024, 78);
  files += 2;
  track('serviceAreaMap', '/img/service-area-map.webp', mapW, mapH, mapSources);

  /* ---- Write manifest ---- */
  const outManifest = {
    generatedAt: manifest.generatedAt,
    count: Object.keys(manifest.images).length,
    images: manifest.images,
  };
  fs.writeFileSync(
    path.join(IMG, 'manifest.json'),
    JSON.stringify(outManifest, null, 2)
  );

  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n[brand-assets] ${files} file(s) written to /img in ${secs}s`);
  console.log(`[brand-assets] manifest.json covers ${outManifest.count} image key(s)\n`);
  console.log('Keys: ' + Object.keys(outManifest.images).join(', '));
}

main().catch((err) => {
  console.error('[brand-assets] FAILED:', err);
  process.exit(1);
});
