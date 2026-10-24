"use client";

import { ChevronDown } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { describedBy, FieldWrapper, fieldClasses } from "./Input";

interface SelectProps extends ComponentProps<"select"> {
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  hideLabel?: boolean;
  wrapperClassName?: string;
}

export function Select({ label, error, hint, hideLabel, wrapperClassName, className, id, children, ...props }: SelectProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <FieldWrapper id={inputId} label={label} error={error} hint={hint} hideLabel={hideLabel} className={wrapperClassName}>
      <div className="relative">
        <select
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, error, hint)}
          className={fieldClasses(Boolean(error), cn("cursor-pointer appearance-none pr-9", className))}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-500"
        />
      </div>
    </FieldWrapper>
  );
}
