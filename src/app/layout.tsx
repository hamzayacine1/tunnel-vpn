import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tunnel VPN — Votre Internet, enfin libre",
  description:
    "Naviguez en toute confidentialité avec Tunnel VPN : chiffrement AES-256, politique no-log stricte, 3 500+ serveurs dans 94 pays. Windows, macOS, iOS, Android et Linux.",
  keywords: [
    "VPN",
    "Tunnel VPN",
    "confidentialité",
    "sécurité",
    "chiffrement",
    "no-log",
    "serveurs",
  ],
  openGraph: {
    title: "Tunnel VPN — Votre Internet, enfin libre",
    description:
      "Protégez votre vie privée en ligne avec le VPN le plus rapide au monde. Garantie 30 jours satisfait ou remboursé.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
