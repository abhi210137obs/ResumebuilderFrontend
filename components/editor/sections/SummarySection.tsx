"use client";

import { AlignLeft } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import type { ResumeData } from "@/lib/types";
import { EditorSection } from "../EditorSection";

const MAX = 2000;

export function SummarySection() {
  const { register, control, formState: { errors } } = useFormContext<ResumeData>();
  const summary = useWatch({ control, name: "summary" }) ?? "";

  return (
    <EditorSection title="Summary" icon={AlignLeft} description="A short pitch about who you are">
      <Textarea
        label="Professional summary"
        rows={5}
        maxLength={MAX}
        placeholder="Full-stack engineer with 6 years of experience building fast, accessible web products…"
        hint={`${summary.length}/${MAX} characters. 2–4 sentences work best.`}
        error={errors.summary?.message}
        {...register("summary")}
      />
    </EditorSection>
  );
}
