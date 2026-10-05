/**
 * Netlify serverless entry point.
 *
 * Wraps the Express app in `serverless-http` so the whole site runs as a
 * single Lambda-style function. Netlify rewrites every request here via
 * `netlify.toml`.
 *
 * IMPORTANT: the path is resolved defensively because the bundler may place
 * this file at a different depth in the built function bundle.
 */
'use strict';

const path = require('path');

let app;
const candidates = [
  '../../server',
  './server',
  '../server',
  path.join(process.cwd(), 'server'),
];

let lastError;
for (const candidate of candidates) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    app = require(candidate);
    break;
  } catch (err) {
    lastError = err;
  }
}

if (!app) {
  throw lastError || new Error('Unable to load Express app from server.js');
}

const serverless = require('serverless-http');

module.exports.handler = serverless(app, {
  binary: [
    'image/*',
    'font/*',
    'application/pdf',
    'application/octet-stream',
  ],
});
