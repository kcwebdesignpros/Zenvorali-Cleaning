/**
 * Netlify serverless entry point.
 *
 * Wraps the Express app in `serverless-http` so the whole site runs as a
 * single Lambda-style function. Netlify rewrites every request here via
 * `netlify.toml`.
 *
 * IMPORTANT — the require below MUST stay a static string literal.
 *
 * An earlier version resolved the app through a loop of candidate paths
 * (`require(candidate)` with a variable). esbuild cannot resolve a variable
 * require, so it left it in the bundle as a runtime `require()` and shipped a
 * 34 KB wrapper containing none of the Express app. At runtime inside the
 * Lambda the candidates resolved like this:
 *
 *   require('../../server')  -> /var/task/server.js          -> MODULE_NOT_FOUND
 *   require('./server')      -> this file, mid-execution     -> returns `{}`
 *
 * The empty object is truthy, so the loop stopped and `serverless({})` was
 * called. `serverless-http` probes the app for `.callback`/`.handle`/`.handler`,
 * finds none, and throws:
 *
 *   Error: Unsupported framework
 *     at getFramework (.../netlify/functions/server.js:219:13)
 *
 * A static literal lets esbuild follow the dependency graph and inline the app.
 * `npm run verify:bundle` fails the build if this regresses.
 */
'use strict';

const serverless = require('serverless-http');
const app = require('../../server');

module.exports.handler = serverless(app, {
  binary: [
    'image/*',
    'font/*',
    'application/pdf',
    'application/octet-stream',
  ],
});
