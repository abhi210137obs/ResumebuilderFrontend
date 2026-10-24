"use client";

import { Sparkles } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { ResumeData } from "@/lib/types";
import { EditorSection } from "../EditorSection";
import { TagInput } from "../TagInput";

export function SkillsSection() {
  const { control, formState: { errors } } = useFormContext<ResumeData>();
  const skills = useWatch({ control, name: "skills" }) ?? [];

  return (
    <EditorSection title="Skills" icon={Sparkles} description="Tools, languages and strengths" count={skills.length}>
      <Controller
        control={control}
        name="skills"
        render={({ field }) => (
          <TagInput
            label="Skills"
            value={field.value ?? []}
            onChange={field.onChange}
            placeholder="e.g. TypeScript"
            maxItems={100}
            maxLength={50}
            error={errors.skills?.message}
          />
        )}
      />
    </EditorSection>
  );
}
