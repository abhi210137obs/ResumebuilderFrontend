"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EditorSectionProps {
  title: string;
  icon: LucideIcon;
  description?: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function EditorSection({ title, icon: Icon, description, count, defaultOpen = true, children }: EditorSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3.5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 font-semibold text-zinc-900">
              {title}
              {count !== undefined && count > 0 && (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">{count}</span>
              )}
            </span>
            {description && <span className="block truncate text-xs font-normal text-zinc-500">{description}</span>}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn("size-5 shrink-0 text-zinc-500 transition-transform", open && "rotate-180")}
          />
        </button>
      </h2>
      <div id={contentId} hidden={!open} className="border-t border-zinc-100 px-4 pt-4 pb-5">
        {children}
      </div>
    </section>
  );
}
