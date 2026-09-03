import Link from "next/link";
import Image from "next/image";
import { mainLinks } from "@/lib/content";

export function Footer() {
  return <footer className="footer"><div className="footer-brand"><Image src="/brand/logo.svg" alt="" width={54} height={54} /><strong>TESELANDO</strong></div><div><h2>Teselando</h2>{mainLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</div><div><h2>Recursos</h2><Link href="/recursos/">Recursos</Link></div><div><h2>Legal</h2><Link href="/legal/aviso-legal/">Aviso legal</Link><Link href="/legal/privacidad/">Privacidad</Link><Link href="/legal/cookies/">Cookies</Link></div></footer>;
}
