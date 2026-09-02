import type { InputHTMLAttributes } from "react";

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function TextInput({ className, invalid = false, ...props }: TextInputProps) {
  return <input aria-invalid={invalid || undefined} className={["text-input", className].filter(Boolean).join(" ")} {...props} />;
}
