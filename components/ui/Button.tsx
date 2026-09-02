import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonTone = "primary" | "secondary";

type SharedButtonProps = {
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  tone?: ButtonTone;
};

type ButtonAsButtonProps = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type ButtonAsLinkProps = SharedButtonProps & Omit<ComponentPropsWithoutRef<typeof Link>, "children" | "className" | "href"> & {
  href: string;
};

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

function classNames(tone: ButtonTone, className?: string) {
  return ["button", `button--${tone}`, className].filter(Boolean).join(" ");
}

export function Button({ children, className, href, isLoading = false, tone = "primary", ...props }: ButtonProps) {
  const classes = classNames(tone, className);
  const content = <span className="button__label">{children}</span>;

  if (href) {
    const linkProps = props as ButtonAsLinkProps;
    return (
      <Link {...linkProps} aria-busy={isLoading || undefined} className={classes} href={href}>
        {content}
      </Link>
    );
  }

  const { disabled, type, ...buttonProps } = props as ButtonAsButtonProps;
  return (
    <button
      aria-busy={isLoading || undefined}
      className={classes}
      disabled={disabled || isLoading}
      type={type ?? "button"}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

export function PrimaryButton(props: ButtonProps) {
  return <Button {...props} tone="primary" />;
}

export function SecondaryButton(props: ButtonProps) {
  return <Button {...props} tone="secondary" />;
}
