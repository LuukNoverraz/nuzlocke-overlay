/**
 * Nuzlocke Overlay Relay — Pages Function: POST /api/update
 * ==========================================================
 *
 * Receives YAML data from the setup page (index.html) and stores it
 * in D1, keyed by a session key (?key=abc12345).
 *
 * The overlay (overlay.html) polls GET /api/data?key=xxx every second
 * to pick up changes.
 *
 * @param {PagesFunctionContext} context
 * @returns {Response}
 */
export async function onRequestPost(context) {
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

  // Read YAML body
  const yaml = await request.text();
  if (!yaml || !yaml.trim()) {
    return new Response(JSON.stringify({ error: 'Empty YAML body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Upsert into D1
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    `INSERT INTO sessions (key, yaml, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET yaml = excluded.yaml, updated_at = excluded.updated_at`
  ).bind(key, yaml, now).run();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
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
