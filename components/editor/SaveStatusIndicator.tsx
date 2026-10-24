"use client";

import { AlertCircle, CheckCircle2, CircleDot, RotateCw } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { formatRelativeTime } from "@/lib/resume";
import { useEditorStore } from "@/store/editorStore";

export function SaveStatusIndicator({ onRetry }: { onRetry: () => void }) {
  const status = useEditorStore((state) => state.saveStatus);
  const error = useEditorStore((state) => state.saveError);
  const lastSavedAt = useEditorStore((state) => state.lastSavedAt);

  return (
    <div role="status" aria-live="polite" className="flex items-center gap-1.5 text-xs font-medium whitespace-nowrap">
      {status === "saving" && (
        <span className="flex items-center gap-1.5 text-zinc-600">
          <Spinner className="size-3.5" label="Saving" />
          Saving...
        </span>
      )}
      {status === "pending" && (
        <span className="flex items-center gap-1.5 text-amber-700">
          <CircleDot className="size-3.5" aria-hidden="true" />
          Unsaved changes
        </span>
      )}
      {(status === "saved" || status === "idle") && (
        <span
          className="flex items-center gap-1.5 text-emerald-700"
          title={lastSavedAt ? `Last saved ${formatRelativeTime(lastSavedAt)}` : undefined}
        >
          <CheckCircle2 className="size-3.5" aria-hidden="true" />
          Saved
        </span>
      )}
      {status === "error" && (
        <span className="flex items-center gap-1.5 text-red-600" title={error ?? undefined}>
          <AlertCircle className="size-3.5" aria-hidden="true" />
          Error saving
          <button
            type="button"
            onClick={onRetry}
            className="ml-0.5 inline-flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-red-700 underline-offset-2 hover:bg-red-50 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <RotateCw className="size-3" aria-hidden="true" />
            Retry
          </button>
        </span>
      )}
    </div>
  );
}
