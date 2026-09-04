"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const pieces = ["north-west", "north-east", "south-west", "south-east"];

export function BrandLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("is-loading");
    const leaveTimer = window.setTimeout(() => setLeaving(true), reduced ? 220 : 1900);
    const removeTimer = window.setTimeout(() => {
      document.body.classList.remove("is-loading");
      setVisible(false);
    }, reduced ? 480 : 2450);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
      document.body.classList.remove("is-loading");
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`brand-loader ${leaving ? "is-leaving" : ""}`} role="status" aria-label="Cargando Teselando">
      <div className="loader-mark" aria-hidden="true">
        {pieces.map((piece) => <Image key={piece} className={`loader-piece loader-piece-${piece}`} src="/brand/logo-full.png" alt="" width={180} height={180} priority />)}
      </div>
      <span className="loader-name">Teselando</span>
    </div>
  );
}
