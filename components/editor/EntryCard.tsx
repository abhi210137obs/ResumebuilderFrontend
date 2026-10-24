"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { DragHandle, type DragHandleProps } from "./SortableList";

interface EntryCardProps {
  title: string;
  subtitle?: string;
  handle: DragHandleProps;
  onRemove: () => void;
  children: ReactNode;
}

export function EntryCard({ title, subtitle, handle, onRemove, children }: EntryCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 sm:p-4">
      <div className="mb-3 flex items-center gap-2">
        <DragHandle handle={handle} label={`Reorder ${title}`} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-800">{title}</p>
          {subtitle && <p className="truncate text-xs text-zinc-500">{subtitle}</p>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          aria-label={`Remove ${title}`}
          title="Remove"
          className="text-zinc-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </div>
      {children}
    </div>
  );
}

export function AddEntryButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Plus className="size-4" aria-hidden="true" />
      {children}
    </button>
  );
}

export function EmptyEntries({ children }: { children: ReactNode }) {
  return <p className="rounded-lg bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">{children}</p>;
}
