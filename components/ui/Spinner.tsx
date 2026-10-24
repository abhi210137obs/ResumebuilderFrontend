import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <span role="status" className="inline-flex items-center">
      <Loader2 aria-hidden="true" className={cn("size-5 animate-spin", className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function FullPageSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-3 text-zinc-500">
      <Spinner className="size-8 text-indigo-600" label={label} />
      <p className="text-sm">{label}…</p>
    </div>
  );
}
