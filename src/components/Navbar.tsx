"use client";

import { useState } from "react";
import { Logo, Menu, Close, Download } from "./icons";

const links = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#serveurs", label: "Serveurs" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-night-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-lg font-bold text-white">
            Tunnel<span className="text-mint-400">VPN</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-400 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href="#tarifs"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-mint-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-night-950 shadow-lg shadow-mint-500/25 transition hover:brightness-110"
          >
            <Download className="h-4 w-4" />
            Télécharger
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-300 hover:bg-white/5 md:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-night-950/95 px-4 pb-6 pt-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#tarifs"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-mint-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-night-950 shadow-lg shadow-mint-500/25"
            >
              <Download className="h-4 w-4" />
              Télécharger
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
