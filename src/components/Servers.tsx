import { Globe } from "./icons";

const servers = [
  { flag: "🇫🇷", country: "France", city: "Paris", ping: "12 ms", load: 78, popular: true },
  { flag: "🇩🇪", country: "Allemagne", city: "Francfort", ping: "18 ms", load: 64, popular: false },
  { flag: "🇳🇱", country: "Pays-Bas", city: "Amsterdam", ping: "21 ms", load: 55, popular: false },
  { flag: "🇨🇭", country: "Suisse", city: "Zurich", ping: "24 ms", load: 41, popular: false },
  { flag: "🇬🇧", country: "Royaume-Uni", city: "Londres", ping: "28 ms", load: 72, popular: true },
  { flag: "🇺🇸", country: "États-Unis", city: "New York", ping: "89 ms", load: 83, popular: false },
  { flag: "🇨🇦", country: "Canada", city: "Toronto", ping: "96 ms", load: 47, popular: false },
  { flag: "🇸🇬", country: "Singapour", city: "Singapour", ping: "175 ms", load: 58, popular: false },
  { flag: "🇯🇵", country: "Japon", city: "Tokyo", ping: "210 ms", load: 39, popular: false },
  { flag: "🇧🇷", country: "Brésil", city: "São Paulo", ping: "142 ms", load: 51, popular: false },
];

function LoadBar({ load }: { load: number }) {
  const color =
    load < 50 ? "bg-mint-400" : load < 75 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${load}%` }} />
    </div>
  );
}

export default function Servers() {
  return (
    <section id="serveurs" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-mint-400 uppercase">
            Serveurs
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Un serveur <span className="text-gradient">près de chez vous</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Plus de 3 500 serveurs dans 94 pays. Sélectionnez une localisation
            et connectez-vous en un clic.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {servers.map((server) => (
            <div
              key={server.city}
              className="group relative rounded-2xl border border-white/8 bg-night-900/60 p-5 transition hover:border-mint-400/40 hover:bg-night-900"
            >
              {server.popular && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-linear-to-r from-mint-500 to-cyan-500 px-2.5 py-0.5 text-[10px] font-bold text-night-950">
                  POPULAIRE
                </span>
              )}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{server.flag}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{server.country}</p>
                  <p className="text-xs text-slate-500">{server.city}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  {server.ping}
                </span>
                <span>{server.load} %</span>
              </div>
              <div className="mt-2">
                <LoadBar load={server.load} />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Et bien plus encore : 3 500+ serveurs répartis dans 94 pays, dont
          l'Afrique du Sud, l'Égypte et les Émirats.
        </p>
      </div>
    </section>
  );
}
