"use client";

import { GraduationCap } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { emptyEducation, formatDateRange } from "@/lib/resume";
import type { ResumeData } from "@/lib/types";
import { EditorSection } from "../EditorSection";
import { AddEntryButton, EmptyEntries, EntryCard } from "../EntryCard";
import { SortableList, type DragHandleProps } from "../SortableList";

const MAX_ENTRIES = 20;

function EducationItem({ index, handle, onRemove }: { index: number; handle: DragHandleProps; onRemove: () => void }) {
  const { register, control, formState: { errors } } = useFormContext<ResumeData>();
  const [school, degree, startDate, endDate] = useWatch({
    control,
    name: [`education.${index}.school`, `education.${index}.degree`, `education.${index}.startDate`, `education.${index}.endDate`],
  });
  const error = errors.education?.[index];
  const title = school?.trim() || degree?.trim() || `Education ${index + 1}`;

  return (
    <EntryCard title={title} subtitle={formatDateRange(startDate ?? "", endDate ?? "")} handle={handle} onRemove={onRemove}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="School"
          placeholder="TU Berlin"
          maxLength={150}
          wrapperClassName="sm:col-span-2"
          error={error?.school?.message}
          {...register(`education.${index}.school`)}
        />
        <Input label="Degree" placeholder="B.Sc." maxLength={100} error={error?.degree?.message} {...register(`education.${index}.degree`)} />
        <Input label="Field of study" placeholder="Computer Science" maxLength={100} error={error?.field?.message} {...register(`education.${index}.field`)} />
        <Input label="Start date" placeholder="2015" maxLength={30} error={error?.startDate?.message} {...register(`education.${index}.startDate`)} />
        <Input label="End date" placeholder="2019" maxLength={30} error={error?.endDate?.message} {...register(`education.${index}.endDate`)} />
        <Input label="Grade" placeholder="1.7 / GPA 3.8" maxLength={30} error={error?.grade?.message} {...register(`education.${index}.grade`)} />
      </div>
    </EntryCard>
  );
}

export function EducationSection() {
  const { control } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "education" });

  return (
    <EditorSection title="Education" icon={GraduationCap} description="Degrees, schools and courses" count={fields.length}>
      {fields.length > 0 ? (
        <SortableList
          items={fields}
          onMove={move}
          renderItem={(field, index, handle) => <EducationItem key={field.id} index={index} handle={handle} onRemove={() => remove(index)} />}
        />
      ) : (
        <EmptyEntries>No education added yet.</EmptyEntries>
      )}
      <AddEntryButton onClick={() => append(emptyEducation())} disabled={fields.length >= MAX_ENTRIES}>
        Add education
      </AddEntryButton>
    </EditorSection>
  );
}
