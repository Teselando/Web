import Link from "next/link";
import { TeselandoLogo } from "@/components/brand/TeselandoLogo";
import { LeadCaptureTrigger } from "@/components/site/LeadCaptureTrigger";
import { PageContainer } from "@/components/ui/PageContainer";

export function SiteHeader() {
  return <header className="site-header"><PageContainer className="site-header__inner"><Link aria-label="Teselando, inicio" className="site-header__logo" href="/"><TeselandoLogo priority /></Link><LeadCaptureTrigger label="Buscar profesor" targetId="captacion-telefono" /></PageContainer></header>;
}
