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

### Option A — Blueprint (recommandé, 1 clic)

1. Rendez-vous sur [render.com](https://render.com) et connectez-vous (GitHub).
2. Cliquez sur **New +** → **Blueprint**.
3. Sélectionnez le repository `tunnel-vpn`.
4. Render détecte automatiquement `render.yaml` et crée le service web.
5. Cliquez sur **Apply** → l'application se build et se déploie automatiquement.

### Option B — Manuel

1. Sur Render : **New +** → **Web Service**.
2. Connectez votre compte GitHub et sélectionnez le repository `tunnel-vpn`.
3. Render détecte automatiquement **Next.js** et pré-remplit la configuration :

   | Champ | Valeur |
   |---|---|
   | Runtime | Node |
   | Build Command | `npm run build` |
   | Start Command | `npm start` |
   | Plan | Free (ou Starter pour zéro mise en veille) |

4. Cliquez sur **Deploy Web Service**.
5. Une fois le déploiement terminé, vous recevez une URL du type `https://tunnel-vpn.onrender.com`.

### Mises à jour automatiques

Render re-déploie automatiquement à chaque `git push` sur la branche `main` (option `autoDeploy` activée).

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
