# Tunnel VPN 🔒

Landing page / site vitrine **Next.js 16** pour un service VPN moderne : thème sombre premium, sections fonctionnalités, serveurs, tarifs (toggle mensuel/annuel), FAQ interactive et appel à l'action.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** (design system custom : couleurs `night` / `mint`)
- **TypeScript** strict
- Fonts auto-hébergées via `next/font` (aucune dépendance CDN)

## Démarrage en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## 🚀 Déploiement sur Render (3 minutes)

> 📖 **Guide complet pas-à-pas : [DEPLOYMENT.md](DEPLOYMENT.md)** (Render + Koyeb + anti-sommeil + dépannage).

### Option A — Blueprint (recommandé, 1 clic)

1. Rendez-vous sur [render.com](https://render.com) et connectez-vous (GitHub).
2. Cliquez sur **New +** → **Blueprint**.
3. Sélectionnez le repository `tunnel-vpn`.
4. Render détecte automatiquement `render.yaml` → **2 services** : le site (`tunnel-vpn`) et le proxy (`tunnel-vpn-proxy`).
5. Cliquez sur **Apply** → l'application se build et se déploie automatiquement.

### Option B — Manuel

1. Sur Render : **New +** → **Web Service**.
2. Connectez votre compte GitHub et sélectionnez le repository `tunnel-vpn` (rootDir `.` pour le site, `proxy` pour le proxy).
3. Render détecte automatiquement **Next.js** et pré-remplit la configuration :

   | Champ | Valeur |
   |---|---|
   | Runtime | Node |
   | Root Directory | `.` (site) ou `proxy` (proxy) |
   | Build Command | `npm run build` (site) ou `npm install --omit=dev` (proxy) |
   | Start Command | `npm start` (site) ou `node server.js` (proxy) |
   | Plan | Free (ou Starter pour zéro mise en veille) |

4. Cliquez sur **Deploy Web Service**.
5. Une fois le déploiement terminé, vous recevez une URL du type `https://tunnel-vpn.onrender.com`.

### Backup gratuit sur Koyeb (optionnel)

Le repo contient un [Dockerfile](proxy/Dockerfile) pour déployer le proxy sur
[Koyeb](https://koyeb.com) (1 service free sans expiration, région Frankfurt,
dort après 1 h) : créez une app depuis le repo GitHub, build « Dockerfile »,
chemin `proxy/Dockerfile`, port 3001. Détails dans [DEPLOYMENT.md](DEPLOYMENT.md).

### Mises à jour automatiques

Render re-déploie automatiquement à chaque `git push` sur la branche `main` (option `autoDeploy` activée).

### Anti-sommeil (le proxy ne dort jamais)

Le workflow GitHub Actions [keep-alive.yml](.github/workflows/keep-alive.yml)
ping le site et le proxy toutes les 5 minutes (gratuit, inclus dans votre repo).

## ⚡ Service Proxy intégré (`/proxy`)

Le repo contient un **deuxième service** : un proxy HTTP/HTTPS authentifié
(Node.js pur, **zéro dépendance**) qui fait sortir votre trafic navigateur
par le serveur Render.

- La section **« Accès Proxy »** de la page (`#acces-proxy`) génère des
  identifiants (token valide 1 h) via `GET /generate`.
- Le proxy accepte `CONNECT` (tunnel TCP) + requêtes HTTP absolues, avec
  authentification Basic sur chaque tunnel.
- Sécurité intégrée : tokens à durée de vie limitée, blocage SMTP, IP
  privées/réservées et réseau interne `.internal`, limite de génération par IP.

### Variables d'environnement du proxy

| Variable | Rôle |
|---|---|
| `PROXY_ADMIN_KEY` | Clé requise pour `/generate` (à définir dans le dashboard Render — fortement conseillé) |
| `PROXY_TOKEN_TTL_MS` | Durée de vie d'un token (défaut : 1 h) |

### ⚠️ Limites honnêtes

- **Proxy HTTP/HTTPS uniquement** — pas d'UDP (jeux, appels VoIP non routés),
  ce n'est pas un vrai VPN système.
- Render **free** : le service dort après 15 min d'inactivité (30-60 s de
  réveil), 100 Go/mois de bande passante.
- L'IP visible est une **IP de datacenter** (certains sites la bloquent).
- **Usage personnel et authentifié uniquement** — un proxy ouvert exposé au
  public peut entraîner la suspension du compte (acceptable use des PaaS).
  Pour un service commercial, utilisez un VPS (Hetzner ~4 €/mois).

### Test en local

```bash
cd proxy
PORT=3001 node server.js
curl -s http://127.0.0.1:3001/generate        # récupérer un token
curl -x http://127.0.0.1:3001 -U tunnel:TOKEN https://api.ipify.org
```

## Scripts

```bash
npm run dev     # serveur de développement
npm run build   # build de production
npm start       # serveur de production
npm run lint    # eslint
```

## Structure

```
src/
├── app/
│   ├── layout.tsx      # métadonnées + fonts
│   ├── page.tsx        # composition de la page
│   └── globals.css     # thème Tailwind v4
└── components/
    ├── Navbar.tsx      # navigation (client)
    ├── Hero.tsx        # hero + mockup app
    ├── Features.tsx    # 6 fonctionnalités
    ├── Servers.tsx     # grille de serveurs
    ├── Pricing.tsx     # tarifs (client, toggle)
    ├── FAQ.tsx         # accordéon (client)
    ├── CTA.tsx         # appel à l'action final
    ├── Footer.tsx      # pied de page
    └── icons.tsx       # icônes SVG inline
```
