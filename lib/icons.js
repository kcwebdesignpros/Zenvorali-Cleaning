'use strict';

/**
 * Inline SVG icon set. Avoids icon fonts and extra network requests.
 * All paths use currentColor so CSS controls the colour.
 */

const PATHS = {
  /* --- UI --- */
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail:
    '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="m22 7-10 6L2 7"/>',
  map:
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  calendar:
    '<rect x="3" y="4.5" width="18" height="17" rx="2"/><path d="M3 10h18M8 2.5v4M16 2.5v4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.2 2.4 2.4 4.6-4.9"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  arrowLeft: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',

  /* --- Business / trust --- */
  shield: '<path d="M12 3l8 3v6c0 5-3.4 8.3-8 9-4.6-.7-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  badge:
    '<circle cx="12" cy="9" r="6"/><path d="m8.5 14.2-1.5 7 5-2.6 5 2.6-1.5-7"/>',
  medal:
    '<circle cx="12" cy="14" r="5"/><path d="M8.5 9.5 6 3h12l-2.5 6.5"/><path d="m12 12.4.9 1.9 2 .3-1.5 1.5.4 2-1.8-1-1.8 1 .4-2L9 14.6l2-.3z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-6 6-10 16-10 0 10-5 15-9 17z"/><path d="M4 20c2-4 5-7 9-8.5"/>',
  sparkle:
    '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
  heart: '<path d="M12 20s-7-4.3-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.7 12 20 12 20z"/>',
  refresh:
    '<path d="M21 12a9 9 0 0 1-15.5 6.2"/><path d="M3 12a9 9 0 0 1 15.5-6.2"/><path d="M3 20v-5h5"/><path d="M21 4v5h-5"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  clipboard:
    '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.8h6V4"/><path d="M9 11h6M9 15h4"/>',
  tag: '<path d="M20.6 13.4 12 22l-9-9V3h10z"/><circle cx="7.5" cy="7.5" r="1.6"/>',
  award: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.3 2.3 2.3 4.7-5"/>',
  users:
    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M17 5.2a3.5 3.5 0 0 1 0 6.6"/><path d="M18 14.3a6.5 6.5 0 0 1 3.5 5.7"/>',
  team:
    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M17 5.2a3.5 3.5 0 0 1 0 6.6"/><path d="M18 14.3a6.5 6.5 0 0 1 3.5 5.7"/>',
  building:
    '<path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17"/><path d="M15 9h4a1 1 0 0 1 1 1v11"/><path d="M7.5 7h1.5M7.5 11h1.5M7.5 15h1.5M11 7h1.5M11 11h1.5M11 15h1.5"/><path d="M2 21h20"/>',
  building2:
    '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h1.5M13.5 7H15M9 11h1.5M13.5 11H15M9 15h1.5M13.5 15H15"/><path d="M10 21v-3h4v3"/>',
  home: '<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9.6V20h13V9.6"/><path d="M10 20v-5.5h4V20"/>',
  truck:
    '<path d="M2 7h10v9H2z"/><path d="M12 10h4.6l2.4 3v3h-7z"/><circle cx="6" cy="18" r="1.8"/><circle cx="16.5" cy="18" r="1.8"/>',
  hardhat:
    '<path d="M4 16a8 8 0 0 1 16 0"/><path d="M2.5 16h19v2.5h-19z"/><path d="M9.5 9.4V5.5h5v3.9"/>',
  brush:
    '<path d="M9.5 14 4 19.5"/><path d="M14 4.5 19.5 10"/><path d="M11.5 7 17 12.5l-4 4-5.5-5.5z"/>',
  spray:
    '<path d="M8 8h7v12H8z"/><path d="M10 8V5.5h3V8"/><path d="M17.5 5h1.5M18.5 8.5h1.5M17.5 12h1.5"/>',
  droplet: '<path d="M12 3s6 6.2 6 10.4A6 6 0 0 1 6 13.4C6 9.2 12 3 12 3z"/>',
  star: '<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.6 9.7l5.8-.8z"/>',
  quote:
    '<path d="M9 6C6.2 6 4 8.2 4 11v7h7v-7H7.4C7.6 9.6 8.2 9 9 9z"/><path d="M19 6c-2.8 0-5 2.2-5 5v7h7v-7h-3.6c.2-1.4.8-2 1.6-2z"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  key: '<circle cx="8" cy="12" r="4"/><path d="M12 12h9"/><path d="M17.5 12v3M20.5 12v2.2"/>',
  alert: '<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4M12 17.2h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8h.01"/>',

  /* --- Socials --- */
  facebook:
    '<path d="M14.5 8.5V6.8c0-.7.2-1.1 1.3-1.1h1.5V3h-2.4c-2.6 0-3.6 1.3-3.6 3.5v2H9.5V11h1.8v10h3.2V11h2.2l.4-2.5z"/>',
  instagram:
    '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/>',
  x: '<path d="M4 4h4.2l4.4 6 5.2-6H21l-6.8 7.6L21.5 20h-4.3l-4.8-6.5L6.8 20H4l7.2-8L4 4z"/>',
  pinterest:
    '<circle cx="12" cy="12" r="9"/><path d="M10 20c.6-2 1.4-4.6 1.6-5.6"/><path d="M9.4 13.4c-.5-1.7.3-3.7 2.3-4.2 1.7-.4 3.3.6 3.6 2.3.4 2-.7 4-2.7 4.2-1 .1-1.8-.5-2-1.4"/>',
  youtube:
    '<rect x="2.5" y="6" width="19" height="12" rx="3.5"/><path d="m10.5 9.5 5 2.5-5 2.5z"/>',
  linkedin:
    '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V17"/><circle cx="8" cy="7.8" r="1.1" fill="currentColor" stroke="none"/><path d="M12 17v-3.6c0-1.3.8-2.1 1.9-2.1s1.9.8 1.9 2.1V17"/><path d="M12 10.5V17"/>',
  google:
    '<path d="M20.5 12.2c0-.7-.06-1.2-.17-1.8H12v3.3h4.8c-.1.8-.63 2-1.8 2.8l-.02.1 2.6 2 .18.02c1.65-1.5 2.74-3.8 2.74-6.42z"/><path d="M12 21c2.4 0 4.4-.8 5.9-2.2l-2.8-2.2c-.75.5-1.76.87-3.1.87-2.36 0-4.36-1.55-5.08-3.7l-.1.01-2.7 2.1-.03.1C5.6 18.8 8.55 21 12 21z"/><path d="M6.92 13.77A5.4 5.4 0 0 1 6.64 12c0-.62.1-1.22.27-1.77l-.01-.12-2.73-2.12-.09.04A9 9 0 0 0 3 12c0 1.45.35 2.82.96 4.02z"/><path d="M12 6.55c1.67 0 2.8.72 3.44 1.32l2.5-2.44C16.4 3.98 14.4 3 12 3 8.55 3 5.6 5.2 4.08 8.03l2.83 2.2C7.63 8.1 9.63 6.55 12 6.55z"/>'
};

/**
 * @param {string} name  key from PATHS
 * @param {number} [size] rendered px (viewport units)
 * @param {string} [cls] extra class names
 * @param {string} [stroke] stroke width
 */
function icon(name, size, cls, stroke) {
  const d = PATHS[name] || PATHS.check;
  const s = size || 24;
  const sw = stroke || 1.7;
  const filled = name === 'facebook' || name === 'x' || name === 'star' || name === 'quote' || name === 'google';

  return (
    `<svg class="icon${cls ? ' ' + cls : ''}" width="${s}" height="${s}" viewBox="0 0 24 24" ` +
    `fill="${filled ? 'currentColor' : 'none'}" stroke="${filled ? 'none' : 'currentColor'}" ` +
    `stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ` +
    `aria-hidden="true" focusable="false">${d}</svg>`
  );
}

module.exports = { icon, PATHS };
