/**
 * Vercel serverless entry: forwards all /api/* requests to the Nest app.
 * Requires `npm run build` (nest build) so that dist/serverless.js exists.
 */
module.exports = require('../dist/serverless').default;
