// Útěk ze školy – multiplayer relay. Každá herní místnost = jeden Durable Object,
// který drží presence všech připojených hráčů a rozesílá změny ostatním.

const MAX_CONN = 24;
const MAX_MSG = 8192;
const ROOM_RE = /^[a-z0-9-]{3,40}$/;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const m = url.pathname.match(/^\/room\/([^/]+)$/);
    if (!m) {
      return new Response('Útěk ze školy relay OK', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
    }
    const room = decodeURIComponent(m[1]).toLowerCase();
    if (!ROOM_RE.test(room)) return new Response('bad room', { status: 400 });
    if (req.headers.get('Upgrade') !== 'websocket') return new Response('expected websocket', { status: 426 });
    if (!originAllowed(req.headers.get('Origin'), env.ALLOWED_ORIGINS)) return new Response('origin not allowed', { status: 403 });
    const stub = env.ROOMS.get(env.ROOMS.idFromName(room));
    return stub.fetch(req);
  },
};

function originAllowed(origin, list) {
  if (!list || list.trim() === '' || list.trim() === '*') return true;
  if (!origin) return false;
  return list.split(',').map((s) => s.trim()).filter(Boolean).some((o) => {
    if (o.startsWith('*.')) {
      try { return new URL(origin).hostname.endsWith(o.slice(1)); } catch (e) { return false; }
    }
    return origin === o;
  });
}

export class Room {
  constructor(state) {
    this.state = state;
  }

  async fetch() {
    const socks = this.state.getWebSockets();
    if (socks.length >= MAX_CONN) return new Response('room full', { status: 503 });
    const pair = new WebSocketPair();
    const id = crypto.randomUUID().slice(0, 12);
    this.state.acceptWebSocket(pair[1]);
    pair[1].serializeAttachment({ id, p: {} });
    const peers = socks.map((s) => s.deserializeAttachment()).filter(Boolean);
    pair[1].send(JSON.stringify({ t: 'init', id, peers }));
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  webSocketMessage(ws, data) {
    if (typeof data !== 'string' || data.length > MAX_MSG) return;
    let msg;
    try { msg = JSON.parse(data); } catch (e) { return; }
    if (!msg || msg.t !== 'p' || typeof msg.p !== 'object' || msg.p === null) return;
    const me = ws.deserializeAttachment();
    if (!me) return;
    me.p = msg.p;
    ws.serializeAttachment(me);
    this.broadcast(ws, JSON.stringify({ t: 'p', id: me.id, p: me.p }));
  }

  webSocketClose(ws) { this.drop(ws); }
  webSocketError(ws) { this.drop(ws); }

  drop(ws) {
    const me = ws.deserializeAttachment();
    try { ws.close(1000, 'bye'); } catch (e) {}
    if (me) this.broadcast(ws, JSON.stringify({ t: 'x', id: me.id }));
  }

  broadcast(from, text) {
    for (const s of this.state.getWebSockets()) {
      if (s === from) continue;
      try { s.send(text); } catch (e) {}
    }
  }
}
