import Image, { type ImageProps } from "next/image";
import type { ReactNode } from "react";

type GeometryProps = { className?: string; decorative?: boolean };

export function Plane({ className, decorative = true }: GeometryProps) {
  return <div aria-hidden={decorative || undefined} className={["geometry-plane", className].filter(Boolean).join(" ")} />;
}

export function Tessera({ className, decorative = true }: GeometryProps) {
  return <div aria-hidden={decorative || undefined} className={["geometry-tessera", className].filter(Boolean).join(" ")} />;
}

export function Stack({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={["geometry-stack", className].filter(Boolean).join(" ")}>{children}</div>;
}

type PhotoFrameProps = {
  alt?: string;
  className?: string;
  image?: Omit<ImageProps, "alt" | "fill">;
};

export function PhotoFrame({ alt = "", className, image }: PhotoFrameProps) {
  return (
    <figure className={["photo-frame", className].filter(Boolean).join(" ")}>
      {image ? <Image alt={alt} fill sizes="(max-width: 48rem) 100vw, 50vw" {...image} /> : <div aria-label="Espacio reservado para una fotografía" className="photo-frame__placeholder" role="img" />}
    </figure>
  );
}
