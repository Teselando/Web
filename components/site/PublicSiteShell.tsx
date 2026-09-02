import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export function PublicSiteShell({ children }: { children: ReactNode }) {
  return <div className="public-site-shell"><SiteHeader /><main id="contenido-principal" tabIndex={-1}>{children}</main><SiteFooter /><div aria-hidden="true" className="layer-host layer-host--rail" /><div aria-hidden="true" className="layer-host layer-host--dialog" /><div aria-hidden="true" className="layer-host layer-host--cookie" /></div>;
}
