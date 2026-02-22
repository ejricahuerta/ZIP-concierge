/**
 * Single Vercel serverless entry: handles /api and /api/* via rewrites.
 * All API traffic is rewritten to this function so Nest receives the correct path.
 */
module.exports = require('../dist/serverless').default;
