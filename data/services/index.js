'use strict';

/**
 * Service index. Requires are listed STATICALLY on purpose — a dynamic
 * require('./' + slug) works locally but breaks the Netlify/esbuild bundle.
 */
module.exports = [
  require('./house-cleaning'),
  require('./deep-cleaning'),
  require('./move-out-cleaning'),
  require('./office-commercial-cleaning'),
  require('./apartment-cleaning'),
  require('./post-construction-cleaning')
].sort((a, b) => (a.order || 99) - (b.order || 99));
