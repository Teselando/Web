import type { Metadata } from "next";
import { Figtree, Gabarito } from "next/font/google";
import "./globals.css";
import { BrandLoader } from "@/components/brand-loader";
import { SiteChrome } from "@/components/site-chrome";
import { ConsentBanner } from "@/components/consent-banner";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const gabarito = Gabarito({ subsets: ["latin"], variable: "--font-display", display: "swap" });

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
