# 🚀 Guide de déploiement — Tunnel VPN (site + proxy + anti-sommeil)

Guide pas-à-pas pour mettre en ligne **gratuitement** :
1. le site (Next.js) → **Render**
2. le proxy (Node pur) → **Render**
3. le backup du proxy → **Koyeb** (optionnel)
4. l'anti-sommeil → **GitHub Actions** (automatique)

---

## Étape 1 — Déployer sur Render (Blueprint, ~5 min)

1. Allez sur **https://render.com** → **Sign up** → « **Sign up with GitHub** » (autorisez l'accès au repo `tunnel-vpn`).
2. Cliquez sur **New +** → **Blueprint**.
3. Sélectionnez le repository **`tunnel-vpn`**.
4. Render lit `render.yaml` et vous montre **2 services** :
   - `tunnel-vpn` (site) — build `npm run build`, start `npm start`
   - `tunnel-vpn-proxy` (proxy) — build `npm install --omit=dev`, start `node server.js`
5. Cliquez sur **Apply** → attendez le build (~3-5 min, première fois plus long).
6. Vous obtenez deux URLs :
   - Site : `https://tunnel-vpn.onrender.com`
   - Proxy : `https://tunnel-vpn-proxy.onrender.com`

✅ **Testez tout de suite** :
```bash
# Le proxy répond ?
curl https://tunnel-vpn-proxy.onrender.com/healthz   # → ok

# Générez un accès (sans clé admin)
curl https://tunnel-vpn-proxy.onrender.com/generate

# Tunnel complet (remplacez TOKEN)
curl -x https://tunnel-vpn-proxy.onrender.com -U tunnel:TOKEN https://api.ipify.org
```
> ⚠️ Le `curl -x` avec URL HTTPS nécessite curl ≥ 7.62 (ou utilisez le site web pour générer et tester).

---

## Étape 2 — Sécuriser avec une clé admin (recommandé)

Sans clé admin, n'importe qui peut générer des tokens (limités à 5/jour/IP, mais autant verrouiller).

1. Dashboard Render → service **`tunnel-vpn-proxy`** → onglet **Environment**.
2. Ajoutez la variable : `PROXY_ADMIN_KEY` = `votre-clé-longue-au-choix` (ex. `Tvpn-2026-9f3a…`)
3. **Deploy** le service (bouton Manual Deploy → Deploy latest commit).
4. Le site doit connaître cette clé : service **`tunnel-vpn`** → **Environment** → ajoutez `NEXT_PUBLIC_PROXY_KEY` = la même valeur → **Deploy**.

> Si vous ne définissez pas `NEXT_PUBLIC_PROXY_KEY`, le bouton « Générer » de la page affichera une erreur 401 tant que la clé admin est active — c'est normal.

---

## Étape 3 — L'anti-sommeil (déjà dans le repo)

Le workflow `.github/workflows/keep-alive.yml` ping le site et le proxy **toutes les 5 minutes** :

1. Vérifiez qu'il est bien actif : GitHub → repo `tunnel-vpn` → onglet **Actions** → « keep-alive ».
2. Si vous ne le voyez pas : onglet **Actions** → cliquez sur « keep-alive » → **Enable workflow**.
3. Testez-le : **Run workflow** (bouton) → le job doit passer au vert.

Résultat : le proxy ne dort **plus jamais** (le ping toutes les 5 min < le seuil de 15 min).

**Alternative sans GitHub Actions** : UptimeRobot (gratuit, 50 monitors à 5 min) → ajoutez les deux URLs en monitor HTTP.

---

## Étape 4 (option) — Backup gratuit sur Koyeb

Koyeb offre 1 service web gratuit **sans expiration**, région **Frankfurt** (proche de l'Algérie), qui ne dort qu'après **1 h** d'inactivité.

### Via le dashboard (le plus simple)
1. **https://app.koyeb.com** → Sign up (GitHub).
2. **Create App** → **GitHub** → repo `tunnel-vpn`.
3. Build : choisissez **Dockerfile** et précisez le chemin `proxy/Dockerfile`.
4. Instance : **Free** · Region : **Frankfurt** · Port : **3001**.
5. **Deploy** → vous obtenez `https://tunnel-vpn-proxy-<votre-org>.koyeb.app`.

### Via le CLI
```bash
brew install koyeb  # ou voir https://www.koyeb.com/docs/cli/installation
koyeb login

koyeb app create tunnel-vpn-backup
koyeb service create tunnel-vpn-backup \
  --git github.com/hamzayacine1/tunnel-vpn \
  --git-branch main \
  --dockerfile proxy/Dockerfile \
  --instance-type free \
  --regions fra \
  --ports 3001:http \
  --env PORT=3001
```

### Connecter le backup au keep-alive
1. GitHub → repo `tunnel-vpn` → **Settings** → **Secrets and variables** → **Actions** → **Variables**.
2. Ajoutez : `KOYEB_URL` = `https://tunnel-vpn-proxy-<org>.koyeb.app`.
3. Le workflow pingera aussi Koyeb → il reste chaud lui aussi.

---

## Étape 5 — Vérification complète

1. Ouvrez `https://tunnel-vpn.onrender.com` → section **« Accès Proxy »** → **Générer mon accès**.
2. L'écran affiche serveur / utilisateur / mot de passe / URL PAC.
3. **Test curl** (sur votre machine) :
   ```bash
   curl -x https://tunnel-vpn-proxy.onrender.com -U tunnel:TOKEN https://api.ipify.org
   # → renvoie une IP de datacenter (≠ votre IP) : le tunnel fonctionne
   ```
4. **Test PAC** : collez l'URL PAC dans les réglages proxy de votre OS → naviguez → vérifiez sur https://api.ipify.org que l'IP a changé.

---

## Dépannage

| Problème | Cause probable | Solution |
|---|---|---|
| Le site répond mais la génération échoue (401) | `PROXY_ADMIN_KEY` active mais `NEXT_PUBLIC_PROXY_KEY` manquante sur le site | Ajoutez la variable sur `tunnel-vpn` et redéployez |
| `curl -x https://…` ne fonctionne pas | Ancien curl (< 7.62) | Utilisez le site web, ou l'URL PAC dans le navigateur |
| Le proxy met 30-60 s à répondre | Render free qui se réveille | Attendez que le workflow keep-alive tourne (vérifiez Actions) |
| 407 sur le tunnel | Token expiré (1 h) ou erroné | Régénérez un accès sur la page |
| Netflix/Disney+ refusent | IP de datacenter | Normal : ce proxy n'est pas fait pour le streaming géobloqué |
| Le service est « down » dans Actions | Pas encore déployé ou URL différente | Vérifiez les URLs exactes de vos services |

---

## Rappel des limites (honnêteté avant tout)

- **Proxy HTTP/HTTPS uniquement** (pas d'UDP → pas de jeux en ligne / VoIP via le tunnel).
- Render free : 512 Mo, 0,1 vCPU, **100 Go/mois** de bande passante.
- Koyeb free : 512 Mo, 0,1 vCPU, Frankfurt/DC uniquement.
- Usage **personnel et authentifié** — un proxy ouvert = suspension de compte.
- Pour un vrai VPN système (UDP, tous les protocoles) : Oracle Cloud gratuit ou VPS ~1-4 €/mois.
