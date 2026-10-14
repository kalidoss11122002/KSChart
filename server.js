// KSChat server: code-based routing for messages, photos and video-call signalling
const http = require('http'), fs = require('fs'), path = require('path');
const { WebSocketServer } = require('ws');
const PORT = process.env.PORT || 3000;
const pub = path.join(__dirname, 'public');

const srv = http.createServer((q, r) => {
  const f = q.url === '/' ? 'index.html' : q.url.slice(1).split('?')[0];
  const p = path.join(pub, path.normalize(f));
  if (!p.startsWith(pub)) { r.writeHead(403); return r.end(); }
  fs.readFile(p, (e, d) => {
    if (e) { r.writeHead(404); return r.end('Not found'); }
    r.writeHead(200, { 'Content-Type': ({'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'})[path.extname(p)] || 'text/plain' });
    r.end(d);
  });
});

const wss = new WebSocketServer({ server: srv, maxPayload: 8 * 1024 * 1024 });
const users = new Map();   // code -> websocket
const queue = new Map();   // code -> messages waiting for an offline user

wss.on('connection', ws => {
  ws.on('message', raw => {
    let m; try { m = JSON.parse(raw); } catch { return; }
    if (m.t === 'hello') {
      const id = String(m.id || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
      if (!id) return;
      ws.id = id; users.set(id, ws);
      ws.send(JSON.stringify({ t: 'ready', id }));
      (queue.get(id) || []).forEach(x => ws.send(x));   // deliver what arrived while offline
      queue.delete(id);
      return;
    }
    if (!ws.id || !m.to) return;
    m.from = ws.id; m.to = String(m.to).toUpperCase();
    const s = JSON.stringify(m), dst = users.get(m.to);
    if (dst && dst.readyState === 1) dst.send(s);
    else if (m.t === 'msg' || m.t === 'img') {          // store text/photos for later
      const q = queue.get(m.to) || []; if (q.length < 200) q.push(s); queue.set(m.to, q);
      ws.send(JSON.stringify({ t: 'queued', to: m.to }));
    } else ws.send(JSON.stringify({ t: 'offline', to: m.to })); // calls need both online
  });
  ws.on('close', () => { if (ws.id && users.get(ws.id) === ws) users.delete(ws.id); });
});
srv.listen(PORT, '0.0.0.0', () => console.log('KSChat running on http://localhost:' + PORT));
