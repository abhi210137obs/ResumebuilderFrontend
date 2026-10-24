"use client";

import { Copy, Download, FileText, PencilLine, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatRelativeTime, getTemplateName } from "@/lib/resume";
import type { ResumeSummary } from "@/lib/types";

const accents: Record<string, string> = {
  classic: "from-amber-50 to-orange-100 text-amber-700",
  modern: "from-indigo-50 to-sky-100 text-indigo-700",
  minimal: "from-zinc-50 to-zinc-200 text-zinc-700",
};

interface ResumeCardProps {
  resume: ResumeSummary;
  busy?: "duplicate" | "download" | "delete";
  onDuplicate: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export function ResumeCard({ resume, busy, onDuplicate, onDownload, onDelete }: ResumeCardProps) {
  const href = `/editor/${resume.id}`;
  const updated = formatRelativeTime(resume.updatedAt);

  return (
    <li className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={href}
        className={cn(
          "relative flex h-32 items-center justify-center bg-gradient-to-br focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600",
          accents[resume.template] ?? accents.classic,
        )}
        aria-label={`Open ${resume.title}`}
      >
        <div className="flex h-24 w-[68px] flex-col gap-1.5 rounded-sm bg-white p-2 shadow-md transition-transform group-hover:-translate-y-1">
          <FileText className="size-3.5 opacity-70" aria-hidden="true" />
          <span className="h-1 w-3/4 rounded bg-current opacity-40" />
          <span className="h-1 w-full rounded bg-zinc-200" />
          <span className="h-1 w-5/6 rounded bg-zinc-200" />
          <span className="h-1 w-full rounded bg-zinc-200" />
          <span className="h-1 w-2/3 rounded bg-zinc-200" />
        </div>
        <span className="absolute top-3 right-3 rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium">
          {getTemplateName(resume.template)}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="truncate font-semibold text-zinc-900" title={resume.title}>
          {resume.title}
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">{updated ? `Updated ${updated}` : "\u00a0"}</p>
        <div className="mt-4 flex items-center gap-1">
          <ButtonLink href={href} size="sm" className="mr-auto">
            <PencilLine className="size-4" aria-hidden="true" />
            Open
          </ButtonLink>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDuplicate}
            loading={busy === "duplicate"}
            disabled={Boolean(busy)}
            aria-label={`Duplicate ${resume.title}`}
            title="Duplicate"
          >
            {busy !== "duplicate" && <Copy className="size-4" aria-hidden="true" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDownload}
            loading={busy === "download"}
            disabled={Boolean(busy)}
            aria-label={`Download ${resume.title} as PDF`}
            title="Download PDF"
          >
            {busy !== "download" && <Download className="size-4" aria-hidden="true" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            disabled={Boolean(busy)}
            aria-label={`Delete ${resume.title}`}
            title="Delete"
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </li>
  );
}
