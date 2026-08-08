import { Download, Shield } from "./icons";

export default function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-mint-400/25 bg-night-900 px-8 py-16 text-center sm:px-16 sm:py-20">
          <div
            className="absolute -top-32 left-1/2 h-72 w-[560px] -translate-x-1/2 rounded-full bg-mint-500/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-mint-500 to-cyan-500 shadow-lg shadow-mint-500/30">
              <Shield className="h-7 w-7 text-night-950" />
            </div>

            <h2 className="font-display mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Prêt à surfer <span className="text-gradient">sans limites</span> ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              Rejoignez plus de 12 millions d'utilisateurs qui protègent leur
              vie privée chaque jour avec Tunnel VPN.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#tarifs"
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-mint-500 to-cyan-500 px-8 py-4 font-semibold text-night-950 shadow-xl shadow-mint-500/25 transition hover:brightness-110"
              >
                <Download className="h-5 w-5" />
                Commencer maintenant
              </a>
              <a
                href="#faq"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
              >
                Poser une question
              </a>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              🔒 Garantie 30 jours satisfait ou remboursé — Sans engagement
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
