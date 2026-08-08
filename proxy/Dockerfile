# Tunnel VPN Proxy — image Docker minimale (zéro dépendance)
# Utilisable sur Koyeb (et n'importe quel PaaS Docker : Railway, Fly.io…)

FROM node:20-alpine

WORKDIR /app

# server.js est en Node pur : pas de npm install nécessaire
COPY server.js package.json ./

ENV PORT=3001
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/healthz || exit 1

CMD ["node", "server.js"]
