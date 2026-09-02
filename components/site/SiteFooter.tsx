import { footerNavigation } from "@/content/site-navigation";
import { TextLink } from "@/components/ui/TextLink";
import { PageContainer } from "@/components/ui/PageContainer";
import { CookiePreferencesTrigger } from "@/components/site/CookiePreferencesTrigger";

export function SiteFooter() {
  return <footer className="site-footer"><PageContainer className="site-footer__inner">
    {footerNavigation.map((group) => <section className="site-footer__group" key={group.label}><h2>{group.label}</h2><ul>{group.items.map((item) => <li key={item.label}>{item.label === "Preferencias de cookies" ? <CookiePreferencesTrigger /> : item.href ? <TextLink href={item.href}>{item.label}</TextLink> : <span>{item.label}</span>}</li>)}</ul></section>)}
  </PageContainer></footer>;
}
