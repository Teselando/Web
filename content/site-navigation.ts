export type FooterNavigationItem = {
  label: string;
  href?: string;
};

export type FooterNavigationGroup = {
  label: string;
  items: FooterNavigationItem[];
};

// Routes remain intentionally inactive until their approved content exists.
// The footer can activate an item simply by supplying its public href here.
export const footerNavigation: FooterNavigationGroup[] = [
  {
    label: "Teselando",
    items: [
      { label: "Cómo funciona", href: "/como-funciona/" },
      { label: "Precios", href: "/precios/" },
      { label: "Sobre Teselando", href: "/sobre-teselando/" },
      { label: "Contacto", href: "/contacto/" },
    ],
  },
  { label: "Recursos", items: [{ label: "Recursos", href: "/recursos/" }] },
  {
    label: "Legal",
    items: [
      { label: "Aviso legal", href: "/legal/aviso-legal/" },
      { label: "Privacidad", href: "/legal/privacidad/" },
      { label: "Cookies", href: "/legal/cookies/" },
      { label: "Preferencias de cookies" },
    ],
  },
];
