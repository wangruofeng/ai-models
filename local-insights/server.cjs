const { getInsights } = require('./history.cjs');
const localHost = new Set(['localhost', '127.0.0.1', '[::1]']);
function isLocal(req) {
  let host;
  try { host = new URL(`http://${req.headers.host}`).hostname; } catch { return false; }
  return localHost.has(host) && ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress) &&
    !req.headers.forwarded && !req.headers['x-forwarded-for'] && !req.headers['x-forwarded-host'];
}
async function middleware(req, res, next) {
  const pathname = (req.url || '').split('?')[0];
  if (pathname !== '/local-insights/snapshot.json' || !isLocal(req)) return next();
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET', 'HEAD'].includes(req.method)) { res.statusCode = 405; res.setHeader('Allow', 'GET, HEAD'); return res.end(); }
  try {
    const content = JSON.stringify(await getInsights());
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch (error) {
    console.error('[local insights]', error.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Unable to read local Git history. Check the development server output.' }));
  }
}
module.exports = { middleware, isLocal };
