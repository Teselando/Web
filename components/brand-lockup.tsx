import Image from "next/image";
import { sitePath } from "@/lib/site-path";

type BrandLockupProps = {
  large?: boolean;
};

export function BrandLockup({ large = false }: BrandLockupProps) {
  return (
    <span className={`brand-lockup ${large ? "brand-lockup-large" : ""}`} aria-hidden="true">
      <span className="brand-word">
        <Image className="brand-symbol" src={sitePath("/brand/logo-full.png")} alt="" width={large ? 56 : 42} height={large ? 56 : 42} unoptimized />
        <span className="brand-rest">eselando</span>
      </span>
      <span className="brand-sublabel">Academia especializada</span>
    </span>
  );
}
