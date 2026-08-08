import { Download, ArrowRight, Shield } from "./icons";

const stats = [
  { value: "3 500+", label: "Serveurs" },
  { value: "94", label: "Pays" },
  { value: "12 M+", label: "Utilisateurs" },
  { value: "0", label: "Journal conservé" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
      {/* Décor */}
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-mint-500/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute top-40 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Texte */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-mint-400/30 bg-mint-500/10 px-4 py-1.5 text-xs font-medium text-mint-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-400" />
            </span>
            Protocole WireGuard® nouvelle génération
          </div>

          <h1 className="font-display mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-6xl">
            Votre Internet,{" "}
            <span className="text-gradient">enfin libre.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            Naviguez en toute confidentialité, contournez les restrictions et
            protégez vos données avec un chiffrement militaire. Une seule
            connexion, une tranquillité totale.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#tarifs"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-mint-500 to-cyan-500 px-7 py-3.5 font-semibold text-night-950 shadow-xl shadow-mint-500/25 transition hover:brightness-110"
            >
              <Download className="h-5 w-5" />
              Télécharger l'application
            </a>
            <a
              href="#tarifs"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
            >
              Voir les tarifs
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <p className="mt-5 text-xs text-slate-500">
            Windows · macOS · iOS · Android · Linux —{" "}
            <span className="text-slate-400">Garantie 30 jours satisfait ou remboursé</span>
          </p>

          {/* Statistiques */}
          <dl className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="order-2 text-xs font-medium text-slate-500">
                  {stat.label}
                </dt>
                <dd className="font-display text-3xl font-bold text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Mockup de l'application */}
        <div className="relative hidden lg:block">
          <div
            className="absolute inset-0 -z-10 rounded-3xl bg-mint-500/10 blur-2xl"
            aria-hidden="true"
          />
          <div className="animate-float rounded-3xl border border-white/10 bg-night-900/90 p-6 shadow-2xl shadow-black/50 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-mint-400">
                  <span className="h-full w-full animate-ping rounded-full bg-mint-400 opacity-60" />
                </span>
                <span className="text-sm font-semibold text-white">Protégé</span>
              </div>
              <span className="text-xs text-slate-500">Tunnel VPN</span>
            </div>

            <div className="mt-6 rounded-2xl border border-white/5 bg-night-950/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Votre adresse IP</p>
                  <p className="mt-1 font-mono text-sm text-white">92.184.105.4</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Localisation</p>
                  <p className="mt-1 text-sm text-white">🇩🇿 Algérie</p>
                </div>
                <span className="rounded-full bg-mint-500/15 px-3 py-1 text-xs font-semibold text-mint-300">
                  Masquée
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/5 bg-night-950/70 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇫🇷</span>
                  <div>
                    <p className="text-sm font-semibold text-white">Paris · FR</p>
                    <p className="text-xs text-slate-500">Ping : 12 ms</p>
                  </div>
                </div>
                <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-300">
                  Connecté
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-4/5 rounded-full bg-linear-to-r from-mint-500 to-cyan-400" />
              </div>
              <p className="mt-1.5 text-right text-[11px] text-slate-500">Charge : 78 %</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/5 bg-night-950/70 p-4">
                <p className="text-xs text-slate-500">Téléchargement</p>
                <p className="mt-1 font-display text-2xl font-bold text-white">
                  342 <span className="text-sm text-slate-500">Mb/s</span>
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-3/4 rounded-full bg-mint-400" />
                </div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-night-950/70 p-4">
                <p className="text-xs text-slate-500">Envoi</p>
                <p className="mt-1 font-display text-2xl font-bold text-white">
                  287 <span className="text-sm text-slate-500">Mb/s</span>
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-2/3 rounded-full bg-cyan-400" />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-mint-500 to-cyan-500 py-3 font-semibold text-night-950 shadow-lg shadow-mint-500/25">
              <Shield className="h-5 w-5" />
              Connexion sécurisée active
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
