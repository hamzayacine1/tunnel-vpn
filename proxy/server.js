"use strict";

/**
 * Tunnel VPN — Proxy authentifié (HTTP CONNECT + proxy HTTP absolu)
 * ---------------------------------------------------------------
 * S'installe sur n'importe quelle plateforme PaaS (Render) comme un
 * service web classique. Render gère le TLS (port 443) ; ce serveur
 * reçoit le trafic en clair derrière le proxy de bord.
 *
 * Sécurité intégrée :
 *  - Authentification Basic sur CHAQUE tunnel (Proxy-Authorization)
 *  - Tokens à durée de vie limitée, générés par la page web (/generate)
 *  - Blocage : SMTP (spam), IP privées/réservées, réseau interne Render
 *  - Limitation du nombre de générations par IP
 *
 * Variables d'environnement (optionnelles) :
 *  - PROXY_ADMIN_KEY : clé requise pour /generate (fortement conseillée)
 *  - PROXY_TOKEN_TTL_MS : durée de vie d'un token (défaut 1 h)
 */

const http = require("http");
const https = require("https");
const net = require("net");
const crypto = require("crypto");

// ─── Configuration ────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || "3001", 10);
const ADMIN_KEY = process.env.PROXY_ADMIN_KEY || "";
const TOKEN_TTL_MS = parseInt(process.env.PROXY_TOKEN_TTL_MS || String(60 * 60 * 1000), 10);
const MAX_TOKENS = 200;
const IDLE_TUNNEL_MS = 15 * 60 * 1000; // tue les tunnels inactifs après 15 min
const GEN_PER_IP_PER_DAY = 5;

// Ports bloqués : SMTP (bloqué par Render sur free, et source de spam)
const BLOCKED_PORTS = new Set([25, 26, 465, 587, 2525, 2526]);

// Plages IP privées / réservées / internes — jamais accessibles via le proxy
const PRIVATE_RANGES = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.168.0.0", 16],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
];

const tokens = new Map(); // token -> { user, expiry, created, ip }
const genLog = new Map(); // ip -> { day, count }

// ─── Helpers ──────────────────────────────────────────────────────
function ipToInt(ip) {
  return ip
    .split(".")
    .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function isBlockedHost(host) {
  const h = String(host || "").trim().toLowerCase().replace(/^\[|\]$/g, "");
  if (!h) return true;
  if (h.endsWith(".internal")) return true; // réseau interne Render
  if (h.includes(":")) return true; // pas d'IPv6 pour l'instant
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) return false; // hostname → ok
  const n = ipToInt(h);
  return PRIVATE_RANGES.some(([net, bits]) => {
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (n & mask) === (ipToInt(net) & mask);
  });
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (fwd) return String(fwd).split(",")[0].trim();
  return req.socket.remoteAddress || "?";
}

// ─── Tokens ───────────────────────────────────────────────────────
function cleanTokens() {
  const now = Date.now();
  for (const [token, info] of tokens) if (info.expiry <= now) tokens.delete(token);
}
setInterval(cleanTokens, 10 * 60 * 1000).unref();

function newToken(ip) {
  cleanTokens();
  if (tokens.size >= MAX_TOKENS) {
    const oldest = [...tokens.entries()].sort((a, b) => a[1].created - b[1].created)[0];
    if (oldest) tokens.delete(oldest[0]);
  }
  const token = crypto.randomBytes(24).toString("hex");
  tokens.set(token, { user: "tunnel", expiry: Date.now() + TOKEN_TTL_MS, created: Date.now(), ip });
  return token;
}

function checkAuth(req) {
  const raw = req.headers["proxy-authorization"] || req.headers["authorization"] || "";
  const m = raw.match(/^Basic\s+(.+)$/i);
  if (!m) return null;
  let decoded;
  try {
    decoded = Buffer.from(m[1], "base64").toString("utf8");
  } catch {
    return null;
  }
  const idx = decoded.indexOf(":");
  if (idx < 0) return null;
  const token = decoded.slice(idx + 1);
  const info = tokens.get(token);
  if (!info || info.expiry <= Date.now()) return null;
  return info;
}

// ─── Endpoint : fichier PAC (config automatique pour tout l'appareil) ─
function handlePac(req, res) {
  const fullHost = req.headers.host || "tunnel-vpn-proxy.onrender.com";
  const hostname = String(fullHost).split(":")[0];
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])/.test(hostname);
  const protocol = isLocal ? "http" : "https";
  const port = isLocal ? PORT : 443;

  const pac = `function FindProxyForURL(url, host) {
  if (host === "${hostname}" || host === "localhost" || host === "127.0.0.1" || host === "::1") return "DIRECT";
  return "HTTPS ${hostname}:${port}; DIRECT";
}`;

  res.setHeader("Content-Type", "application/x-ns-proxy-autoconfig");
  res.setHeader("Cache-Control", "no-store");
  res.end(pac);
}

// ─── Endpoint : génération d'accès ────────────────────────────────
function handleGenerate(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  const ip = clientIp(req);
  const day = new Date().toISOString().slice(0, 10);
  const rec = genLog.get(ip);

  if (ADMIN_KEY) {
    const url = new URL(req.url, "http://x");
    if (url.searchParams.get("key") !== ADMIN_KEY) {
      res.writeHead(401);
      res.end(JSON.stringify({ error: "Clé admin requise (?key=…)" }));
      return;
    }
  } else if (rec && rec.day === day && rec.count >= GEN_PER_IP_PER_DAY) {
    res.writeHead(429);
    res.end(JSON.stringify({ error: "Limite de générations atteinte pour aujourd'hui" }));
    return;
  }
  genLog.set(ip, { day, count: rec && rec.day === day ? rec.count + 1 : 1 });

  const token = newToken(ip);
  const host = req.headers.host || "tunnel-vpn-proxy.onrender.com";
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])/.test(host);
  const protocol = isLocal ? "http" : "https";
  const port = isLocal ? PORT : 443;

  res.writeHead(200);
  res.end(
    JSON.stringify({
      host,
      port,
      protocol,
      username: "tunnel",
      password: token,
      expiresInMinutes: Math.round(TOKEN_TTL_MS / 60000),
      pacUrl: `${protocol}://${host}/pac`,
      curl: `curl -x ${protocol}://tunnel:${token}@${host} https://api.ipify.org`,
    })
  );
}

// ─── Proxy HTTP absolu (http://… dans l'URL de requête) ───────────
function stripHopByHop(headers) {
  const out = { ...headers };
  ["connection", "proxy-connection", "keep-alive", "upgrade", "transfer-encoding"].forEach(
    (h) => delete out[h]
  );
  return out;
}

function handleHttpProxy(req, res) {
  if (!checkAuth(req)) {
    res.writeHead(407, { "Proxy-Authenticate": 'Basic realm="TunnelVPN Proxy"' });
    res.end();
    return;
  }
  let u;
  try {
    u = new URL(req.url);
  } catch {
    res.writeHead(400);
    res.end();
    return;
  }
  const port = u.port ? parseInt(u.port, 10) : u.protocol === "https:" ? 443 : 80;
  if (BLOCKED_PORTS.has(port) || isBlockedHost(u.hostname)) {
    res.writeHead(403);
    res.end();
    return;
  }
  const headers = stripHopByHop(req.headers);
  headers.host = u.host;
  delete headers["proxy-authorization"];
  delete headers.authorization;

  const lib = u.protocol === "https:" ? https : http;
  const upReq = lib.request(u, { method: req.method, headers }, (upRes) => {
    res.writeHead(upRes.statusCode, stripHopByHop(upRes.headers));
    upRes.pipe(res);
  });
  upReq.on("error", () => {
    if (!res.headersSent) res.writeHead(502);
    res.end();
  });
  req.pipe(upReq);
}

// ─── Tunnel CONNECT (cœur du proxy) ───────────────────────────────
function handleConnect(req, clientSocket, head) {
  if (!checkAuth(req)) {
    clientSocket.write(
      'HTTP/1.1 407 Proxy Authentication Required\r\nProxy-Authenticate: Basic realm="TunnelVPN Proxy"\r\n\r\n'
    );
    clientSocket.end();
    return;
  }

  const m = String(req.url || "").match(/^([^:]+):(\d+)$/);
  if (!m) {
    clientSocket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
    clientSocket.end();
    return;
  }
  const [, host, portStr] = m;
  const port = parseInt(portStr, 10);

  if (BLOCKED_PORTS.has(port) || isBlockedHost(host)) {
    console.log(`[proxy] bloqué : ${host}:${port}`);
    clientSocket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    clientSocket.end();
    return;
  }

  const upstream = net.connect(port, host, () => {
    clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
    if (head && head.length) upstream.write(head);
    clientSocket.pipe(upstream).pipe(clientSocket);
    clientSocket.setTimeout(IDLE_TUNNEL_MS, () => {
      clientSocket.destroy();
      upstream.destroy();
    });
    upstream.setTimeout(IDLE_TUNNEL_MS, () => {
      clientSocket.destroy();
      upstream.destroy();
    });
    console.log(`[proxy] tunnel : ${host}:${port}`);
  });

  upstream.on("error", () => {
    if (!clientSocket.destroyed) {
      clientSocket.write("HTTP/1.1 502 Bad Gateway\r\n\r\n");
      clientSocket.end();
    }
  });
  clientSocket.on("error", () => upstream.destroy());
}

// ─── Page HTML de secours (fallback) ──────────────────────────────
function servePage(req, res) {
  const needsKey = !!ADMIN_KEY;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(`<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Tunnel VPN — Proxy</title>
<style>
  :root{color-scheme:dark}
  body{background:#04060e;color:#cbd5e1;font-family:system-ui,sans-serif;display:flex;justify-content:center;padding:48px 16px}
  main{max-width:560px;width:100%}
  h1{color:#fff;font-size:1.6rem}
  .sub{color:#94a3b8;line-height:1.6}
  input,button{width:100%;padding:12px;border-radius:10px;border:1px solid #1e293b;background:#0b1226;color:#fff;font-size:1rem;margin-top:12px;box-sizing:border-box}
  button{background:linear-gradient(90deg,#10b981,#22d3ee);color:#04060e;font-weight:700;cursor:pointer;border:none}
  button:hover{filter:brightness(1.1)}
  pre{background:#0b1226;border:1px solid #1e293b;border-radius:10px;padding:14px;overflow-x:auto;color:#6ee7b7;font-size:.85rem;white-space:pre-wrap}
  .row{display:flex;gap:8px;align-items:center;background:#0b1226;border:1px solid #1e293b;border-radius:10px;padding:10px 14px;margin-top:8px}
  .row span{flex:1;font-family:monospace;font-size:.85rem;color:#fff;word-break:break-all}
  .copy{background:#1e293b;border:none;color:#fff;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:.8rem}
  .warn{margin-top:16px;font-size:.8rem;color:#fbbf24;line-height:1.5;border:1px solid #78350f;background:#451a03;padding:12px;border-radius:10px}
</style>
</head>
<body>
<main>
  <h1>⚡ Tunnel VPN — Proxy</h1>
  <p class="sub">Générez vos identifiants proxy : configurez-les dans votre navigateur (Chrome, Firefox, Edge) et tout votre trafic HTTP/HTTPS passera par ce serveur.</p>
  ${needsKey ? '<input id="key" type="password" placeholder="Clé admin (PROXY_ADMIN_KEY)"/>' : ""}
  <button id="gen">Générer mon accès</button>
  <div id="out" hidden>
    <p style="margin-top:16px;color:#6ee7b7">✅ Accès généré — valide ${""} :</p>
    <div class="row"><span id="c-host"></span><button class="copy" data-copy="c-host">Copier</button></div>
    <div class="row"><span id="c-user"></span><button class="copy" data-copy="c-user">Copier</button></div>
    <div class="row"><span id="c-pass"></span><button class="copy" data-copy="c-pass">Copier</button></div>
    <p style="margin:16px 0 8px;color:#e2e8f0;font-size:.9rem">Test rapide (terminal) :</p>
    <pre id="c-curl"></pre>
    <p style="margin-top:8px;font-size:.85rem;color:#94a3b8">Configuration : Proxy → HTTPS → hôte : <b id="h-host"></b> · port : <b id="h-port"></b> · utilisateur : <b>tunnel</b> · mot de passe : le token ci-dessus.</p>
  </div>
  <div class="warn">⚠️ Proxy HTTP/HTTPS uniquement (pas d'UDP) · hébergé sur Render free : dort après 15 min d'inactivité · usage personnel et authentifié uniquement.</div>
</main>
<script>
  const btn=document.getElementById("gen");
  btn.onclick=async()=>{
    btn.disabled=true;btn.textContent="Génération…";
    const key=document.getElementById("key")?.value||"";
    try{
      const r=await fetch("/generate"+(key?"?key="+encodeURIComponent(key):""));
      const d=await r.json();
      if(d.error) throw new Error(d.error);
      const set=(id,v)=>{const el=document.getElementById(id);el.textContent=v;};
      set("c-host",d.protocol+"://"+d.host+":"+d.port);
      set("c-user",d.username);
      set("c-pass",d.password);
      set("c-curl",d.curl);
      set("h-host",d.host);set("h-port",d.port);
      document.getElementById("out").hidden=false;
    }catch(e){alert("Erreur : "+e.message);}
    btn.disabled=false;btn.textContent="Générer mon accès";
  };
  document.querySelectorAll(".copy").forEach(b=>{
    b.onclick=()=>{const el=document.getElementById(b.dataset.copy);navigator.clipboard.writeText(el.textContent);b.textContent="✅";setTimeout(()=>b.textContent="Copier",1200);};
  });
</script>
</body>
</html>`);
}

// ─── Serveur ──────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
    servePage(req, res);
  } else if (req.method === "GET" && req.url.startsWith("/generate")) {
    handleGenerate(req, res);
  } else if (req.method === "GET" && req.url === "/pac") {
    handlePac(req, res);
  } else if (req.method === "GET" && req.url === "/healthz") {
    res.setHeader("Content-Type", "text/plain");
    res.end("ok");
  } else if (req.url.startsWith("http://") || req.url.startsWith("https://")) {
    handleHttpProxy(req, res);
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.on("connect", handleConnect);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[proxy] Tunnel VPN Proxy prêt sur le port ${PORT}`);
  console.log(`[proxy] clé admin : ${ADMIN_KEY ? "activée" : "NON DÉFINIE (génération ouverte, limitée par IP)"}`);
});
