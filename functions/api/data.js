/**
 * Nuzlocke Overlay Relay — Pages Function: GET /api/data
 * ==========================================================
 *
 * Returns the latest YAML for a given session key from D1.
 * Called by the overlay (overlay.html) on initial load and
 * every 1 second for polling.
 *
 * @param {PagesFunctionContext} context
 * @returns {Response}
 */
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const key = url.searchParams.get('key');

  // Validate session key
  if (!key || key.length < 4 || key.length > 64) {
    return new Response(JSON.stringify({ error: 'Missing or invalid key parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Fetch from D1
  const result = await env.DB.prepare(
    `SELECT yaml FROM sessions WHERE key = ?`
  ).bind(key).first();

  const yaml = result?.yaml || '';

  return new Response(yaml, {
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

/**
 * Handle CORS preflight.
 */
export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
