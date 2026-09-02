import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type TextLinkProps = ComponentPropsWithoutRef<typeof Link>;

export function TextLink({ className, ...props }: TextLinkProps) {
  return <Link className={["text-link", className].filter(Boolean).join(" ")} {...props} />;
}
