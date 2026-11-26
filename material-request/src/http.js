import { createServer } from 'node:http';

// Adapter reusable. The application returns { status, body, headers }.
export function httpServer(app) {
  return createServer(async (req, res) => {
    try {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (Buffer.byteLength(body) > 65536) {
          res.writeHead(413, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ error: 'BODY_TOO_LARGE' }));
          return;
        }
      }
      let parsed;
      try { parsed = body ? JSON.parse(body) : undefined; }
      catch { res.writeHead(400, { 'content-type': 'application/json' }); res.end('{"error":"INVALID_JSON"}'); return; }
      const result = await app({ method: req.method, url: req.url, body: parsed });
      res.writeHead(result.status, { 'content-type': 'application/json; charset=utf-8', ...result.headers });
      res.end(typeof result.body === 'string' ? result.body : JSON.stringify(result.body));
    } catch {
      res.writeHead(500, { 'content-type': 'application/json' });
      res.end('{"error":"INTERNAL_ERROR"}');
    }
  });
}
