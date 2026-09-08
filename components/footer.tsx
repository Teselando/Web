import Link from "next/link";
import { BrandLockup } from "@/components/brand-lockup";
import { CookiePreferencesButton } from "@/components/cookie-preferences-button";
import { PlatformMark } from "@/components/platform-mark";
import { externalResources, mainLinks } from "@/lib/content";

const externalProps = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Footer() {
  return <footer className="footer"><div className="footer-brand"><BrandLockup large /></div><div><h2>Teselando</h2>{mainLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</div><div><h2>Recursos</h2><Link href="/recursos/">Recursos</Link><a href={externalResources.library} {...externalProps}>Biblioteca de recursos <span aria-hidden="true">↗</span></a><a href={externalResources.community} {...externalProps}><PlatformMark name="whatsapp" />Comunidad de WhatsApp <span aria-hidden="true">↗</span></a></div><div><h2>Social</h2><a href={externalResources.instagram} {...externalProps}><PlatformMark name="instagram" />Instagram <span aria-hidden="true">↗</span></a><a href={externalResources.trustpilot} {...externalProps}><PlatformMark name="trustpilot" />Trustpilot <span aria-hidden="true">↗</span></a></div><div><h2>Legal</h2><Link href="/legal/aviso-legal/">Aviso legal</Link><Link href="/legal/privacidad/">Privacidad</Link><Link href="/legal/cookies/">Cookies</Link><CookiePreferencesButton className="footer-cookie-button" /></div></footer>;
}
