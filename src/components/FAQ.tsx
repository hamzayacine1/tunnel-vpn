"use client";

import { useState } from "react";
import { ChevronDown } from "./icons";

const faqs = [
  {
    question: "Tunnel VPN conserve-t-il des journaux de connexion ?",
    answer:
      "Non. Notre politique No-Log est stricte et vérifiée de manière indépendante : nous ne stockons ni votre historique de navigation, ni votre adresse IP réelle, ni les sites que vous visitez. Votre activité en ligne ne nous regarde pas.",
  },
  {
    question: "Puis-je utiliser Tunnel VPN sur plusieurs appareils ?",
    answer:
      "Oui. L'offre Essentiel couvre 5 appareils simultanés, Premium 10 appareils, et l'offre Famille comprend 6 comptes indépendants. Des applications natives sont disponibles pour Windows, macOS, iOS, Android et Linux.",
  },
  {
    question: "Quels protocoles sont pris en charge ?",
    answer:
      "Tunnel VPN prend en charge WireGuard®, le protocole le plus rapide et le plus moderne, ainsi qu'OpenVPN et IKEv2/IPsec pour la compatibilité maximale avec les réseaux d'entreprise et les pays où la censure est forte.",
  },
  {
    question: "Le streaming fonctionne-t-il avec Tunnel VPN ?",
    answer:
      "Absolument. Nos serveurs optimisés streaming vous permettent de débloquer Netflix, Disney+, YouTube et bien d'autres plateformes, avec une vitesse suffisante pour la 4K sans mise en mémoire tampon.",
  },
  {
    question: "Tunnel VPN fonctionne-t-il dans les pays où Internet est censuré ?",
    answer:
      "Oui. Nos protocoles furtifs (obfuscation) déguisent le trafic VPN en trafic HTTPS classique, ce qui permet de contourner les pare-feux et les restrictions d'accès imposées dans certains pays.",
  },
  {
    question: "Comment annuler mon abonnement ?",
    answer:
      "En deux clics depuis votre espace client, à tout moment et sans frais. De plus, vous bénéficiez d'une garantie de 30 jours : si vous n'êtes pas satisfait, nous vous remboursons intégralement.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-widest text-mint-400 uppercase">
            FAQ
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Questions <span className="text-gradient">fréquentes</span>
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = open === index;
            return (
              <div
                key={faq.question}
                className={`rounded-2xl border transition ${
                  isOpen ? "border-mint-400/40 bg-night-900" : "border-white/8 bg-night-900/60 hover:border-white/15"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-mint-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm leading-relaxed text-slate-400">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
