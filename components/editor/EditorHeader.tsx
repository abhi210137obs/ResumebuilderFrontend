"use client";

import { ArrowLeft, Download } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { getErrorMessage, resumeApi } from "@/lib/api";
import { cn } from "@/lib/cn";
import { TEMPLATES } from "@/lib/resume";
import type { ResumeData } from "@/lib/types";
import { useEditorStore } from "@/store/editorStore";
import { SaveStatusIndicator } from "./SaveStatusIndicator";

interface EditorHeaderProps {
  resumeId: string;
  saveNow: () => Promise<boolean>;
}

export function EditorHeader({ resumeId, saveNow }: EditorHeaderProps) {
  const { register, formState: { errors } } = useFormContext<ResumeData>();
  const [downloading, setDownloading] = useState(false);
  const titleError = errors.title?.message;

  const handleDownload = async () => {
    setDownloading(true);
    const toastId = toast.loading("Generating PDF…");
    try {
      if (useEditorStore.getState().isDirty && !(await saveNow())) {
        toast.error("Save your changes before downloading the PDF.", { id: toastId });
        return;
      }
      const title = useEditorStore.getState().resume?.title || "resume";
      await resumeApi.downloadPdf(resumeId, title);
      toast.success("PDF downloaded", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not generate the PDF."), { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <header className="z-20 border-b border-zinc-200 bg-white">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5 sm:px-4">
        <div className="flex min-w-[220px] flex-1 items-center gap-1">
          <ButtonLink href="/dashboard" variant="ghost" size="icon" aria-label="Back to dashboard" title="Back to dashboard">
            <ArrowLeft className="size-5" aria-hidden="true" />
          </ButtonLink>
          <div className="min-w-0 flex-1">
            <label htmlFor="resume-title" className="sr-only">
              Resume title
            </label>
            <input
              id="resume-title"
              maxLength={100}
              placeholder="Untitled Resume"
              aria-invalid={titleError ? true : undefined}
              aria-describedby={titleError ? "resume-title-error" : undefined}
              className={cn(
                "w-full truncate rounded-md border border-transparent bg-transparent px-2 py-1.5 text-base font-semibold text-zinc-900 transition-colors",
                "hover:bg-zinc-100 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none",
                titleError && "border-red-400",
              )}
              {...register("title")}
            />
            {titleError && (
              <p id="resume-title-error" role="alert" className="px-2 text-xs text-red-600">
                {titleError}
              </p>
            )}
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
          <div className="mr-auto sm:mr-1">
            <SaveStatusIndicator onRetry={() => void saveNow()} />
          </div>
          <Select label="Template" hideLabel wrapperClassName="w-32 sm:w-36" className="h-9 py-1.5" {...register("template")}>
            {TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </Select>
          <Button onClick={handleDownload} loading={downloading} aria-label="Download PDF" className="h-9">
            {!downloading && <Download className="size-4" aria-hidden="true" />}
            <span className="hidden sm:inline">Download PDF</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
