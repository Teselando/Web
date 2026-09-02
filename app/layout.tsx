import type { Metadata } from "next";
import { Figtree, Gabarito } from "next/font/google";
import "./globals.css";

const gabarito = Gabarito({ variable: "--font-gabarito", subsets: ["latin"] });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Teselando",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${gabarito.variable} ${figtree.variable}`}>
      <body>
        <a className="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
        {children}
      </body>
    </html>
  );
}
