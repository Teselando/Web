import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./motion.css";
import "./homepage.css";
import "./art-direction.css";
import { BrandLoader } from "@/components/brand-loader";
import { SiteChrome } from "@/components/site-chrome";
import { ConsentBanner } from "@/components/consent-banner";

const figtree = localFont({ src: "../public/fonts/figtree-latin.woff2", weight: "300 900", variable: "--font-body", display: "swap" });
const gabarito = localFont({ src: "../public/fonts/gabarito-latin.woff2", weight: "400 900", variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://teselando.es"),
  title: { default: "Teselando", template: "%s | Teselando" },
  description: "Academia online de clases particulares con profesores previamente seleccionados.",
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${figtree.variable} ${gabarito.variable}`}>
      <body>
        <BrandLoader />
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        <SiteChrome />
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
