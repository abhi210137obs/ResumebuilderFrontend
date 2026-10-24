import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StateMessageProps {
  icon: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  tone?: "neutral" | "error";
  className?: string;
}

export function StateMessage({ icon: Icon, title, description, action, tone = "neutral", className }: StateMessageProps) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-16 text-center",
        tone === "error" ? "border-red-200 bg-red-50/50" : "border-zinc-300 bg-white",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-12 items-center justify-center rounded-full",
          tone === "error" ? "bg-red-100 text-red-600" : "bg-indigo-50 text-indigo-600",
        )}
      >
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-zinc-900">{title}</h2>
      {description && <p className="mt-1 max-w-sm text-sm text-zinc-600">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
