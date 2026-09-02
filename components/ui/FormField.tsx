import type { ReactNode } from "react";

export type FormFieldRenderProps = {
  inputId: string;
  describedBy?: string;
  invalid: boolean;
};

type FormFieldProps = {
  children: (props: FormFieldRenderProps) => ReactNode;
  error?: string;
  helperText?: string;
  id: string;
  label: string;
  optionalLabel?: string;
  required?: boolean;
  success?: string;
};

export function FormField({ children, error, helperText, id, label, optionalLabel, required, success }: FormFieldProps) {
  const helperId = helperText ? `${id}-help` : undefined;
  const feedback = error ?? success;
  const feedbackId = feedback ? `${id}-${error ? "error" : "success"}` : undefined;
  const describedBy = [helperId, feedbackId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="form-field" data-invalid={Boolean(error)} data-success={Boolean(success && !error)}>
      <label className="form-field__label" htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : optionalLabel ? <span className="form-field__optional"> {optionalLabel}</span> : null}
      </label>
      {children({ inputId: id, describedBy, invalid: Boolean(error) })}
      {helperText ? <p className="form-field__helper" id={helperId}>{helperText}</p> : null}
      {feedback ? <p className="form-field__feedback" id={feedbackId} role={error ? "alert" : "status"}>{error ? "Error: " : "Correcto: "}{feedback}</p> : null}
    </div>
  );
}
