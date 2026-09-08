import Image from "next/image";
import { sitePath } from "@/lib/site-path";

export type PlatformBrand = "instagram" | "youtube" | "trustpilot" | "whatsapp" | "teselando";

export function PlatformMark({ name }: { name: PlatformBrand }) {
  const teselando = name === "teselando";
  return <span className={`platform-mark platform-mark-${name}`} aria-hidden="true">
    <Image src={sitePath(teselando ? "/brand/logo-full.png" : `/platforms/${name}.svg`)} alt="" width={24} height={24} unoptimized={teselando} />
  </span>;
}
