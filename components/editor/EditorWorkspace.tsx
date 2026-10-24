"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, PencilLine } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAutosave } from "@/hooks/useAutosave";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import { cn } from "@/lib/cn";
import { normalizeResume } from "@/lib/resume";
import type { ResumeData } from "@/lib/types";
import { resumeSchema } from "@/lib/validators";
import { useEditorStore } from "@/store/editorStore";
import { EditorHeader } from "./EditorHeader";
import { ResumePreview } from "./ResumePreview";
import { CertificationsSection } from "./sections/CertificationsSection";
import { EducationSection } from "./sections/EducationSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { PersonalSection } from "./sections/PersonalSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { SummarySection } from "./sections/SummarySection";

type Tab = "edit" | "preview";

const TABS: { id: Tab; label: string; icon: typeof Eye }[] = [
  { id: "edit", label: "Edit", icon: PencilLine },
  { id: "preview", label: "Preview", icon: Eye },
];

export function EditorWorkspace({ resumeId, initialResume }: { resumeId: string; initialResume: ResumeData }) {
  const methods = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialResume,
    mode: "onChange",
  });
  const setResume = useEditorStore((state) => state.setResume);
  const isDirty = useEditorStore((state) => state.isDirty);
  const saveStatus = useEditorStore((state) => state.saveStatus);
  const saveError = useEditorStore((state) => state.saveError);
  const { saveNow } = useAutosave(resumeId);
  const [tab, setTab] = useState<Tab>("edit");
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ edit: null, preview: null });

  useBeforeUnload(isDirty || saveStatus === "saving");

  const { subscribe } = methods;
  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        callback: ({ values }) => setResume(normalizeResume(values)),
      }),
    [subscribe, setResume],
  );

  useEffect(() => {
    if (saveStatus === "error" && saveError) toast.error(saveError, { id: "autosave-error" });
    else toast.dismiss("autosave-error");
  }, [saveStatus, saveError]);

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next: Tab = tab === "edit" ? "preview" : "edit";
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <FormProvider {...methods}>
      <div className="flex h-dvh flex-col overflow-hidden bg-zinc-50">
        <EditorHeader resumeId={resumeId} saveNow={saveNow} />

        <div role="tablist" aria-label="Editor view" className="flex border-b border-zinc-200 bg-white px-3 lg:hidden">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              ref={(element) => {
                tabRefs.current[id] = element;
              }}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              tabIndex={tab === id ? 0 : -1}
              onClick={() => setTab(id)}
              onKeyDown={onTabKeyDown}
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-center gap-2 border-b-2 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600",
                tab === id ? "border-indigo-600 text-indigo-700" : "border-transparent text-zinc-500 hover:text-zinc-800",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex min-h-0 flex-1">
          <section
            id="panel-edit"
            role="tabpanel"
            aria-labelledby="tab-edit"
            aria-label="Resume form"
            className={cn(
              "min-h-0 w-full overflow-y-auto lg:block lg:w-1/2 lg:max-w-[720px] lg:border-r lg:border-zinc-200",
              tab !== "edit" && "hidden",
            )}
          >
            <div className="mx-auto flex max-w-3xl flex-col gap-4 p-3 pb-16 sm:p-5">
              <PersonalSection />
              <SummarySection />
              <ExperienceSection />
              <EducationSection />
              <SkillsSection />
              <ProjectsSection />
              <CertificationsSection />
            </div>
          </section>

          <section
            id="panel-preview"
            role="tabpanel"
            aria-labelledby="tab-preview"
            aria-label="Resume preview"
            className={cn("min-h-0 flex-1 overflow-y-auto bg-zinc-200/70 p-4 sm:p-6 lg:block lg:p-8", tab !== "preview" && "hidden")}
          >
            <ResumePreview />
          </section>
        </div>
      </div>
    </FormProvider>
  );
}
