import type { ComponentPropsWithoutRef } from "react";

type PageContainerProps = ComponentPropsWithoutRef<"div">;

export function PageContainer({ className, ...props }: PageContainerProps) {
  const classes = ["page-container", "page-shell", className].filter(Boolean).join(" ");
  return <div className={classes} {...props} />;
}
