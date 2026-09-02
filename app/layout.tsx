import type { Metadata } from "next";
import { Figtree, Gabarito } from "next/font/google";
import { PublicSiteShell } from "@/components/site/PublicSiteShell";
import { ConsentProvider } from "@/components/site/ConsentProvider";
import "./globals.css";

const gabarito = Gabarito({ variable: "--font-gabarito", subsets: ["latin"] });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://teselando.es"),
  alternates: { canonical: "/" },
  openGraph: { siteName: "Teselando", type: "website" },
  title: "Teselando",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${gabarito.variable} ${figtree.variable}`}>
      <body>
        <a className="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
        <ConsentProvider><PublicSiteShell>{children}</PublicSiteShell></ConsentProvider>
      </body>
    </html>
  );
}
