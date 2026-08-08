import { Logo, XSocial, Instagram, Telegram, Youtube } from "./icons";

const columns = [
  {
    title: "Produit",
    links: ["Télécharger", "Fonctionnalités", "Serveurs", "Tarifs", "Applications"],
  },
  {
    title: "Entreprise",
    links: ["À propos", "Blog", "Presse", "Carrières", "Contact"],
  },
  {
    title: "Ressources",
    links: ["Centre d'aide", "Tutoriels", "Statut des serveurs", "Programme d'affiliation"],
  },
  {
    title: "Légal",
    links: ["Confidentialité", "Conditions d'utilisation", "Cookies", "Transparence"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-night-900/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5">
              <Logo id="logo-footer" />
              <span className="font-display text-lg font-bold text-white">
                Tunnel<span className="text-mint-400">VPN</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Votre Internet, enfin libre. Protection de la vie privée,
              vitesse maximale et liberté totale, où que vous soyez.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: XSocial, label: "X (Twitter)" },
                { icon: Instagram, label: "Instagram" },
                { icon: Telegram, label: "Telegram" },
                { icon: Youtube, label: "YouTube" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-mint-400/40 hover:text-mint-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold tracking-wide text-white">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 transition hover:text-mint-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-slate-600">
            © 2026 Tunnel VPN. Tous droits réservés.
          </p>
          <p className="text-xs text-slate-600">
            WireGuard® est une marque déposée de Jason A. Donenfeld.
          </p>
        </div>
      </div>
    </footer>
  );
}
