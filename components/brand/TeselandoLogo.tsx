import Image from "next/image";

type TeselandoLogoProps = { className?: string; priority?: boolean };

export function TeselandoLogo({ className, priority = false }: TeselandoLogoProps) {
  return <Image alt="Teselando" className={className} height={1971} priority={priority} src="/brand/Logo.png" width={1980} />;
}
