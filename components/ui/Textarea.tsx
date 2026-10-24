"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { describedBy, FieldWrapper, fieldClasses } from "./Input";

interface TextareaProps extends ComponentProps<"textarea"> {
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  hideLabel?: boolean;
  wrapperClassName?: string;
}

export function Textarea({
  label,
  error,
  hint,
  hideLabel,
  wrapperClassName,
  className,
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <FieldWrapper id={inputId} label={label} error={error} hint={hint} hideLabel={hideLabel} className={wrapperClassName}>
      <textarea
        id={inputId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, error, hint)}
        className={fieldClasses(Boolean(error), `resize-y leading-relaxed ${className ?? ""}`)}
        {...props}
      />
    </FieldWrapper>
  );
}
