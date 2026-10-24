"use client";

import { ScaledResume } from "@/components/templates/ScaledResume";
import { getTemplateName, isResumeEmpty, prepareResume } from "@/lib/resume";
import { useEditorStore } from "@/store/editorStore";

export function ResumePreview() {
  const resume = useEditorStore((state) => state.resume);
  if (!resume) return null;
  const empty = isResumeEmpty(prepareResume(resume));

  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>
          Live preview · <span className="font-medium text-zinc-700">{getTemplateName(resume.template)}</span> template
        </span>
        <span>A4 · 210 × 297 mm</span>
      </div>
      {empty && (
        <p className="rounded-lg bg-indigo-50 px-3 py-2 text-center text-sm text-indigo-700">
          Start filling in the form and your resume will appear here instantly.
        </p>
      )}
      <ScaledResume resume={resume} />
    </div>
  );
}
