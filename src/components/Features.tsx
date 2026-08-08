import { Shield, Lock, Eye, Zap, Sliders, Devices } from "./icons";

const features = [
  {
    icon: Lock,
    title: "Chiffrement AES-256-GCM",
    description:
      "Vos données sont protégées par le même niveau de cryptage que celui utilisé par les banques et les gouvernements.",
  },
  {
    icon: Eye,
    title: "Politique No-Log stricte",
    description:
      "Nous ne conservons aucun journal de votre activité. Ce que vous faites en ligne ne regarde que vous.",
  },
  {
    icon: Zap,
    title: "Kill Switch automatique",
    description:
      "Si la connexion VPN tombe, votre accès Internet est coupé instantanément. Aucune fuite de données possible.",
  },
  {
    icon: Sliders,
    title: "Split Tunneling",
    description:
      "Choisissez quelles applications passent par le VPN et lesquelles utilisent votre connexion directe.",
  },
  {
    icon: Shield,
    title: "Vitesse illimitée",
    description:
      "Aucune limite de débit ni de données. Streaming 4K, gaming et téléchargements sans ralentissement.",
  },
  {
    icon: Devices,
    title: "10 appareils simultanés",
    description:
      "Un seul compte pour protéger votre PC, votre téléphone, votre tablette et même votre routeur.",
  },
];

export default function Features() {
  return (
    <section id="fonctionnalites" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-mint-400 uppercase">
            Fonctionnalités
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Une protection complète, <span className="text-gradient">sans compromis</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Tout ce dont vous avez besoin pour naviguer en toute liberté,
            pensé pour la vitesse et la simplicité.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-white/8 bg-night-900/60 p-7 transition hover:border-mint-400/40 hover:bg-night-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-mint-500/20 to-cyan-500/20 text-mint-300 ring-1 ring-mint-400/25 transition group-hover:from-mint-500/30 group-hover:to-cyan-500/30">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-5 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
