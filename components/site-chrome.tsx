"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useState } from "react";
import { BrandLockup } from "@/components/brand-lockup";
import { site } from "@/lib/content";

export function SiteChrome() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const diagnosticMode = pathname.startsWith("/solicitud");
  const shouldShow = visible && !diagnosticMode;

  const goToContact = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (window.location.pathname !== "/") return;
    const target = document.getElementById("contacto");
    if (!target) return;
    event.preventDefault();
    if (window.location.hash !== "#contacto") window.history.pushState(null, "", "#contacto");
    target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (diagnosticMode) {
      const frame = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(frame);
    }
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [diagnosticMode, pathname]);

  return (
    <header className={`site-header ${shouldShow ? "is-visible" : ""}`} aria-hidden={!shouldShow}>
      <Link href="/" className="brand-link" tabIndex={shouldShow ? 0 : -1} aria-label="Teselando, inicio">
        <BrandLockup />
      </Link>
      <Link className="button button-small" href="/#contacto" tabIndex={shouldShow ? 0 : -1} onClick={goToContact}>
        {site.primaryCta}
      </Link>
    </header>
  );
}
