const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  if (pathname === '/mythos-ok') { res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}); return res.end('MYTHOS online server'); }
  let file = pathname === '/' ? 'index.html' : decodeURIComponent(pathname).replace(/^\/+/, '');
  const full = path.resolve(ROOT, file);
  if (!full.startsWith(ROOT + path.sep) && full !== path.join(ROOT,'index.html')) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    const ext = path.extname(full).toLowerCase();
    const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
    res.writeHead(200, {'Content-Type':types[ext] || 'application/octet-stream'}); res.end(data);
  });
});
const wss = new WebSocket.Server({server});
const clients = new Map();
function send(ws, obj) { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj)); }
function broadcast(room, obj, except) { for (const [ws,c] of clients) if (c.room === room && ws !== except) send(ws,obj); }
wss.on('connection', ws => {
  const c = {id: Math.random().toString(36).slice(2,11), room:'main', presence:{}};
  clients.set(ws,c);
  ws.on('message', raw => {
    let m; try { m=JSON.parse(raw.toString()); } catch { return; }
    if (m.t === 'join') {
      c.room = String(m.room || 'main').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,20) || 'main';
      const peers=[];
      for (const [other,oc] of clients) if (other !== ws && oc.room === c.room) peers.push({id:oc.id,d:oc.presence || {}});
      send(ws,{t:'hello',id:c.id,peers});
      broadcast(c.room,{t:'join',id:c.id},ws);
    } else if (m.t === 'p') {
      c.presence = (m.d && typeof m.d === 'object') ? m.d : {};
      broadcast(c.room,{t:'p',id:c.id,d:c.presence},ws);
    } else if (m.t === 'e' && typeof m.k === 'string' && m.k.length <= 30) {
      broadcast(c.room,{t:'e',id:c.id,k:m.k.slice(0,30),d:m.d},ws);
    }
  });
  ws.on('close', () => { clients.delete(ws); broadcast(c.room,{t:'leave',id:c.id}); });
});
server.listen(PORT, '0.0.0.0', () => console.log(`MYTHOS server listening on ${PORT}`));
