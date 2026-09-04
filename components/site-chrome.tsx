"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/content";

export function SiteChrome() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0.08,
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`site-header ${visible ? "is-visible" : ""}`} aria-hidden={!visible}>
      <Link href="/" className="brand-link" tabIndex={visible ? 0 : -1} aria-label="Teselando, inicio">
        <Image src="/brand/logo-full.png" alt="" width={42} height={42} priority />
        <span>TESELANDO ACADEMIA ESPECIALIZADA</span>
      </Link>
      <Link className="button button-small" href="/#contacto" tabIndex={visible ? 0 : -1}>
        {site.primaryCta}
      </Link>
    </header>
  );
}
