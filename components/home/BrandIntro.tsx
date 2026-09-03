"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { TeselandoLogo } from "@/components/brand/TeselandoLogo";

const nameLetters = "Teselando".split("");

export function BrandIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setVisible(false), reducedMotion ? 180 : 4300);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return <div aria-hidden="true" className="brand-intro"><div className="brand-intro__mark"><span className="brand-intro__piece brand-intro__piece--ice" /><span className="brand-intro__piece brand-intro__piece--cyan-left" /><span className="brand-intro__piece brand-intro__piece--blue" /><span className="brand-intro__piece brand-intro__piece--cyan-right" /><span className="brand-intro__piece brand-intro__piece--deep" /><TeselandoLogo className="brand-intro__logo" priority /><span className="brand-intro__water-wave" /></div><span className="brand-intro__name">{nameLetters.map((letter, index) => <span key={`${letter}-${index}`} style={{ "--letter-index": index } as CSSProperties}>{letter}</span>)}</span></div>;
}
