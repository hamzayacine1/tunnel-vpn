"use client";

import { useState } from "react";
import { Shield, Check, Download } from "./icons";

const PROXY_URL =
  process.env.NEXT_PUBLIC_PROXY_URL || "https://tunnel-vpn-proxy.onrender.com";
const PROXY_KEY = process.env.NEXT_PUBLIC_PROXY_KEY || "";

type ProxyCreds = {
  host: string;
  port: number;
  protocol: string;
  username: string;
  password: string;
  expiresInMinutes: number;
  pacUrl: string;
  curl: string;
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard indisponible */
        }
      }}
      className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-mint-400/40 hover:text-mint-300"
    >
      {copied ? "✅ Copié" : label}
    </button>
  );
}

export default function ProxyAccess() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creds, setCreds] = useState<ProxyCreds | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${PROXY_URL}/generate${PROXY_KEY ? `?key=${encodeURIComponent(PROXY_KEY)}` : ""}`
      );
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || `Erreur ${res.status}`);
      setCreds(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Impossible de joindre le service proxy. Vérifiez qu'il est déployé et réveillé."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="acces-proxy" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-mint-400 uppercase">
            Accès Proxy
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Votre accès <span className="text-gradient">proxy sécurisé</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Ce site génère vos identifiants proxy : configurez-les dans votre
            navigateur et votre trafic passe par le tunnel sécurisé de Tunnel
            VPN.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/8 bg-night-900/60 p-8">
          {!creds ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-mint-500/20 to-cyan-500/20 text-mint-300 ring-1 ring-mint-400/25">
                <Shield className="h-7 w-7" />
              </div>
              <p className="mt-4 text-sm text-slate-400">
                Cliquez pour générer un accès valide 1 heure, utilisable une
                seule fois sur vos appareils.
              </p>
              <button
                onClick={generate}
                disabled={loading}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-mint-500 to-cyan-500 px-7 py-3.5 font-semibold text-night-950 shadow-lg shadow-mint-500/25 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
              >
                <Download className="h-5 w-5" />
                {loading ? "Génération…" : "Générer mon accès proxy"}
              </button>
              {error && (
                <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  {error}
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 rounded-xl border border-mint-400/30 bg-mint-500/10 px-4 py-3 text-sm font-medium text-mint-300">
                <Check className="h-4 w-4" />
                Accès généré — valide {creds.expiresInMinutes} minutes
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-night-950/70 p-4">
                  <span className="w-28 shrink-0 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    Serveur
                  </span>
                  <code className="flex-1 break-all font-mono text-sm text-white">
                    {creds.protocol}://{creds.host}:{creds.port}
                  </code>
                  <CopyButton text={`${creds.protocol}://${creds.host}:${creds.port}`} label="Copier" />
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-night-950/70 p-4">
                  <span className="w-28 shrink-0 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    Utilisateur
                  </span>
                  <code className="flex-1 break-all font-mono text-sm text-white">
                    {creds.username}
                  </code>
                  <CopyButton text={creds.username} label="Copier" />
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-night-950/70 p-4">
                  <span className="w-28 shrink-0 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    Mot de passe
                  </span>
                  <code className="flex-1 break-all font-mono text-sm text-mint-300">
                    {creds.password}
                  </code>
                  <CopyButton text={creds.password} label="Copier" />
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/8 bg-night-950/70 p-4">
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Test rapide (terminal)
                </p>
                <pre className="mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-mint-300">
                  {creds.curl}
                </pre>
                <CopyButton text={creds.curl} label="Copier la commande" />
              </div>

              <div className="mt-6 rounded-xl border border-white/8 bg-night-950/70 p-4">
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  ⚡ Astuce — Fichier PAC (config automatique sur tout l'appareil)
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Collez cette URL dans les réglages proxy de Windows / macOS /
                  Android / iOS : <b>tout l'appareil</b> (tous navigateurs, apps)
                  passera par le proxy, sans rien configurer d'autre. Le système
                  vous demandera vos identifiants (tunnel + mot de passe).
                </p>
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-white/8 bg-night-950/70 p-3">
                  <code className="flex-1 break-all font-mono text-xs text-mint-300">
                    {creds.pacUrl}
                  </code>
                  <CopyButton text={creds.pacUrl} label="Copier" />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/8 bg-night-950/70 p-4 text-sm">
                  <p className="font-semibold text-white">Chrome / Edge</p>
                  <p className="mt-2 leading-relaxed text-slate-400">
                    Paramètres → Réseau → Proxy → config manuelle : protocole{" "}
                    <b className="text-slate-300">HTTPS</b>, hôte{" "}
                    <b className="text-slate-300">{creds.host}</b>, port{" "}
                    <b className="text-slate-300">443</b>, puis identifiez-vous
                    avec <b className="text-slate-300">{creds.username}</b> et le mot de passe.
                  </p>
                </div>
                <div className="rounded-xl border border-white/8 bg-night-950/70 p-4 text-sm">
                  <p className="font-semibold text-white">Firefox</p>
                  <p className="mt-2 leading-relaxed text-slate-400">
                    Paramètres → Réseau → Paramètres de connexion → Configuration
                    manuelle → Proxy <b className="text-slate-300">HTTPS</b> :{" "}
                    {creds.host}:443, cochez « Utiliser aussi pour HTTP ».
                  </p>
                </div>
                <div className="rounded-xl border border-white/8 bg-night-950/70 p-4 text-sm">
                  <p className="font-semibold text-white">Windows</p>
                  <p className="mt-2 leading-relaxed text-slate-400">
                    Paramètres → Réseau et Internet → Proxy → Configuration
                    manuelle → serveur proxy : {creds.host} · port 443 →
                    Enregistrer. Identifiants demandés : {creds.username} + mot de passe.
                  </p>
                </div>
                <div className="rounded-xl border border-white/8 bg-night-950/70 p-4 text-sm">
                  <p className="font-semibold text-white">macOS</p>
                  <p className="mt-2 leading-relaxed text-slate-400">
                    Réglages Système → Réseau → Proxy → HTTPS : {creds.host}:443,
                    authentification : {creds.username} + mot de passe.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCreds(null)}
                className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
              >
                Régénérer un accès
              </button>
            </div>
          )}

          <div className="mt-8 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 text-xs leading-relaxed text-amber-200/90">
            <b>Limites à connaître :</b> proxy HTTP/HTTPS uniquement (pas de
            tunnel UDP : jeux en ligne et appels VoIP non routés) · le service
            Render free se met en veille après 15 min d'inactivité (30-60 s de
            réveil) · 100 Go de bande passante/mois · l'IP visible est une IP de
            datacenter (certains sites comme Netflix la bloquent) · usage
            personnel et authentifié uniquement.
          </div>
        </div>
      </div>
    </section>
  );
}
