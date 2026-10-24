"use client";

import { Briefcase } from "lucide-react";
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { emptyExperience, formatDateRange } from "@/lib/resume";
import type { ResumeData } from "@/lib/types";
import { BulletListInput } from "../BulletListInput";
import { EditorSection } from "../EditorSection";
import { AddEntryButton, EmptyEntries, EntryCard } from "../EntryCard";
import { SortableList, type DragHandleProps } from "../SortableList";

const MAX_ENTRIES = 30;

function ExperienceItem({ index, handle, onRemove }: { index: number; handle: DragHandleProps; onRemove: () => void }) {
  const { register, control, setValue, formState: { errors } } = useFormContext<ResumeData>();
  const [role, company, startDate, endDate, current] = useWatch({
    control,
    name: [
      `experience.${index}.role`,
      `experience.${index}.company`,
      `experience.${index}.startDate`,
      `experience.${index}.endDate`,
      `experience.${index}.current`,
    ],
  });
  const error = errors.experience?.[index];
  const title = [role?.trim(), company?.trim()].filter(Boolean).join(" at ") || `Position ${index + 1}`;

  return (
    <EntryCard title={title} subtitle={formatDateRange(startDate ?? "", endDate ?? "", current)} handle={handle} onRemove={onRemove}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Job title" placeholder="Senior Engineer" maxLength={100} error={error?.role?.message} {...register(`experience.${index}.role`)} />
        <Input label="Company" placeholder="Acme Corp" maxLength={100} error={error?.company?.message} {...register(`experience.${index}.company`)} />
        <Input
          label="Location"
          placeholder="Remote"
          maxLength={100}
          wrapperClassName="sm:col-span-2"
          error={error?.location?.message}
          {...register(`experience.${index}.location`)}
        />
        <Input
          label="Start date"
          placeholder="2021-03 or Mar 2021"
          maxLength={30}
          error={error?.startDate?.message}
          {...register(`experience.${index}.startDate`)}
        />
        <Controller
          control={control}
          name={`experience.${index}.endDate`}
          render={({ field }) => (
            <Input
              label="End date"
              placeholder={current ? "Present" : "2024-01 or Jan 2024"}
              maxLength={30}
              disabled={current}
              error={error?.endDate?.message}
              {...field}
              value={current ? "" : field.value}
            />
          )}
        />
        <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-zinc-700 sm:col-span-2">
          <input
            type="checkbox"
            className="size-4 cursor-pointer rounded border-zinc-300 accent-indigo-600"
            {...register(`experience.${index}.current`, {
              onChange: (event) => {
                if (event.target.checked) setValue(`experience.${index}.endDate`, "", { shouldDirty: true });
              },
            })}
          />
          I currently work here
        </label>
        <div className="sm:col-span-2">
          <Controller
            control={control}
            name={`experience.${index}.bullets`}
            render={({ field }) => (
              <BulletListInput label="Achievements" value={field.value ?? []} onChange={field.onChange} />
            )}
          />
        </div>
      </div>
    </EntryCard>
  );
}

export function ExperienceSection() {
  const { control } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "experience" });

  return (
    <EditorSection title="Experience" icon={Briefcase} description="Your work history, most recent first" count={fields.length}>
      {fields.length > 0 ? (
        <SortableList
          items={fields}
          onMove={move}
          renderItem={(field, index, handle) => <ExperienceItem key={field.id} index={index} handle={handle} onRemove={() => remove(index)} />}
        />
      ) : (
        <EmptyEntries>No experience added yet.</EmptyEntries>
      )}
      <AddEntryButton onClick={() => append(emptyExperience())} disabled={fields.length >= MAX_ENTRIES}>
        Add experience
      </AddEntryButton>
    </EditorSection>
  );
}
