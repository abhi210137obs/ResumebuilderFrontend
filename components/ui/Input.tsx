"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export const fieldClasses = (hasError: boolean, className?: string) =>
  cn(
    "block w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition-colors",
    "placeholder:text-zinc-400 focus:outline-none focus:ring-2",
    "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500/20",
    className,
  );

interface FieldWrapperProps {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
}

export function FieldWrapper({ id, label, error, hint, hideLabel, className, children }: FieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-sm font-medium text-zinc-700", hideLabel && "sr-only")}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-zinc-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const describedBy = (id: string, error?: string, hint?: ReactNode) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

interface InputProps extends ComponentProps<"input"> {
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  hideLabel?: boolean;
  wrapperClassName?: string;
}

export function Input({ label, error, hint, hideLabel, wrapperClassName, className, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <FieldWrapper id={inputId} label={label} error={error} hint={hint} hideLabel={hideLabel} className={wrapperClassName}>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, error, hint)}
        className={fieldClasses(Boolean(error), className)}
        {...props}
      />
    </FieldWrapper>
  );
}
