/**
 * Soul Link Overlay — Minimal Static File Server
 * ===============================================
 *
 * Serves the overlay HTML, run.yaml data, and FLURO fonts
 * from the `public/` directory. No dependencies required.
 *
 * Usage:
 *   node server.js
 *   → http://localhost:3000/overlay.html
 *
 * @module server
 * @requires http (Node.js built-in)
 * @requires fs   (Node.js built-in)
 * @requires path (Node.js built-in)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// ─── Configuration ───────────────────────────────────────────────

/** @const {number} Port the server listens on */
const PORT = 3000;

/**
 * Root directory for static files.
 * @const {string}
 */
const PUBLIC_DIR = path.join(__dirname, 'public');

/**
 * MIME type map for served file extensions.
 * @const {Object<string, string>}
 */
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
  '.otf':  'font/otf',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

// ─── Server ──────────────────────────────────────────────────────

/**
 * Create and start the HTTP server.
 *
 * Routes:
 *   GET /              → 302 redirect to /overlay.html
 *   GET /overlay.html  → serves public/overlay.html
 *   GET /run.yaml      → serves public/run.yaml
 *   GET /fonts/*       → serves public/fonts/*
 *   GET /*             → serves public/* (generic fallback)
 *
 * Supports If-Modified-Since for efficient polling.
 */
const server = http.createServer((req, res) => {
  // ── Parse URL ──────────────────────────────────────────────
  let urlPath = req.url.split('?')[0]; // strip query params

  // Redirect root to overlay
  if (urlPath === '/') {
    res.writeHead(302, { Location: '/overlay.html' });
    res.end();
    return;
  }

  // ── Resolve file path ──────────────────────────────────────
  // Normalize to prevent directory traversal attacks
  const safePath = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  // Security: ensure resolved path is within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // ── Check file exists ──────────────────────────────────────
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  // ── Stat file for metadata ─────────────────────────────────
  const stat = fs.statSync(filePath);

  if (!stat.isFile()) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  // ── If-Modified-Since support ──────────────────────────────
  const ifModifiedSince = req.headers['if-modified-since'];
  if (ifModifiedSince) {
    const clientTime = new Date(ifModifiedSince).getTime();
    const serverTime = stat.mtimeMs;

    // Round to seconds for HTTP-date comparison
    if (!isNaN(clientTime) && Math.floor(serverTime / 1000) <= Math.floor(clientTime / 1000)) {
      res.writeHead(304);
      res.end();
      return;
    }
  }

  // ── Serve file ─────────────────────────────────────────────
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': mimeType,
    'Content-Length': stat.size,
    'Last-Modified': stat.mtime.toUTCString(),
    'Cache-Control': 'no-cache', // overlay polls for changes
  });

  fs.createReadStream(filePath).pipe(res);
});

// ─── Start ───────────────────────────────────────────────────────

server.listen(PORT, () => {
  console.log(`\n  🎮 Soul Link Overlay Server`);
  console.log(`  ─────────────────────────`);
  console.log(`  Local:   http://localhost:${PORT}/overlay.html`);
  console.log(`  Data:    http://localhost:${PORT}/run.yaml`);
  console.log(`\n  Edit public/run.yaml and the overlay auto-updates.\n`);
});
