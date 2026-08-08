"use client";

import { useState } from "react";
import { Check } from "./icons";

const plans = [
  {
    name: "Essentiel",
    monthly: 9.99,
    yearly: 4.99,
    description: "Pour une protection individuelle au quotidien.",
    features: [
      "5 appareils simultanés",
      "Serveurs dans 94 pays",
      "Chiffrement AES-256-GCM",
      "Kill Switch",
      "Support par e-mail",
    ],
    popular: false,
  },
  {
    name: "Premium",
    monthly: 12.99,
    yearly: 6.99,
    description: "La vitesse maximale, sans aucun compromis.",
    features: [
      "10 appareils simultanés",
      "Tous les serveurs + vitesse maximale",
      "Split Tunneling",
      "Serveurs optimisés streaming",
      "Support prioritaire 24/7",
    ],
    popular: true,
  },
  {
    name: "Famille",
    monthly: 19.99,
    yearly: 10.99,
    description: "Protégez toute la famille avec 6 comptes.",
    features: [
      "6 comptes indépendants",
      "Tout l'abonnement Premium",
      "Gestion centralisée des comptes",
      "Facturation unique",
      "Assistance dédiée",
    ],
    popular: false,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="tarifs" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-mint-400 uppercase">
            Tarifs
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Des offres simples, <span className="text-gradient">sans surprise</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Annulez à tout moment. Garantie 30 jours satisfait ou remboursé.
          </p>

          <div className="mt-8 inline-flex items-center rounded-full border border-white/10 bg-night-900 p-1.5">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                !yearly ? "bg-linear-to-r from-mint-500 to-cyan-500 text-night-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                yearly ? "bg-linear-to-r from-mint-500 to-cyan-500 text-night-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Annuel <span className={yearly ? "text-night-900" : "text-mint-400"}>−40 %</span>
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                plan.popular
                  ? "border-mint-400/50 bg-night-900 shadow-2xl shadow-mint-500/10 lg:-my-4 lg:py-12"
                  : "border-white/8 bg-night-900/60"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-mint-500 to-cyan-500 px-4 py-1 text-xs font-bold text-night-950">
                  LE PLUS POPULAIRE
                </span>
              )}

              <h3 className="font-display text-lg font-semibold text-white">
                {plan.name}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-bold text-white">
                  {yearly ? plan.yearly.toFixed(2) : plan.monthly.toFixed(2)} €
                </span>
                <span className="text-sm text-slate-500">/mois</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {yearly
                  ? `Facturé annuellement (${(plan.yearly * 12).toFixed(2)} €/an)`
                  : "Sans engagement, annulable à tout moment"}
              </p>

              <ul className="mt-8 flex-1 space-y-3.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        plan.popular ? "bg-mint-500/25 text-mint-300" : "bg-white/8 text-slate-400"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-linear-to-r from-mint-500 to-cyan-500 text-night-950 shadow-lg shadow-mint-500/25 hover:brightness-110"
                    : "border border-white/10 bg-white/5 text-white hover:border-white/25 hover:bg-white/10"
                }`}
              >
                Choisir {plan.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
