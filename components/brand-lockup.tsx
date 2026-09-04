import Image from "next/image";

type BrandLockupProps = {
  large?: boolean;
};

export function BrandLockup({ large = false }: BrandLockupProps) {
  return (
    <span className={`brand-lockup ${large ? "brand-lockup-large" : ""}`} aria-hidden="true">
      <span className="brand-word">
        <Image className="brand-symbol" src="/brand/logo-full.png" alt="" width={large ? 56 : 42} height={large ? 56 : 42} />
        <span className="brand-rest">eselando</span>
      </span>
      <span className="brand-sublabel">Academia especializada</span>
    </span>
  );
}
