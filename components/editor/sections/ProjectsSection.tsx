"use client";

import { FolderGit2 } from "lucide-react";
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { emptyProject } from "@/lib/resume";
import type { ResumeData } from "@/lib/types";
import { EditorSection } from "../EditorSection";
import { AddEntryButton, EmptyEntries, EntryCard } from "../EntryCard";
import { SortableList, type DragHandleProps } from "../SortableList";
import { TagInput } from "../TagInput";

const MAX_ENTRIES = 30;

function ProjectItem({ index, handle, onRemove }: { index: number; handle: DragHandleProps; onRemove: () => void }) {
  const { register, control, formState: { errors } } = useFormContext<ResumeData>();
  const name = useWatch({ control, name: `projects.${index}.name` });
  const error = errors.projects?.[index];

  return (
    <EntryCard title={name?.trim() || `Project ${index + 1}`} handle={handle} onRemove={onRemove}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Project name" placeholder="Resume Builder" maxLength={100} error={error?.name?.message} {...register(`projects.${index}.name`)} />
        <Input
          label="Link"
          type="url"
          inputMode="url"
          placeholder="github.com/you/project"
          maxLength={500}
          error={error?.link?.message}
          {...register(`projects.${index}.link`)}
        />
        <Textarea
          label="Description"
          rows={3}
          maxLength={1000}
          placeholder="What it does, your role and the impact"
          wrapperClassName="sm:col-span-2"
          error={error?.description?.message}
          {...register(`projects.${index}.description`)}
        />
        <div className="sm:col-span-2">
          <Controller
            control={control}
            name={`projects.${index}.techStack`}
            render={({ field }) => (
              <TagInput
                label="Tech stack"
                value={field.value ?? []}
                onChange={field.onChange}
                placeholder="e.g. React"
                maxItems={30}
                maxLength={50}
                error={error?.techStack?.message}
              />
            )}
          />
        </div>
      </div>
    </EntryCard>
  );
}

export function ProjectsSection() {
  const { control } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "projects" });

  return (
    <EditorSection title="Projects" icon={FolderGit2} description="Side projects, open source and portfolio work" count={fields.length}>
      {fields.length > 0 ? (
        <SortableList
          items={fields}
          onMove={move}
          renderItem={(field, index, handle) => <ProjectItem key={field.id} index={index} handle={handle} onRemove={() => remove(index)} />}
        />
      ) : (
        <EmptyEntries>No projects added yet.</EmptyEntries>
      )}
      <AddEntryButton onClick={() => append(emptyProject())} disabled={fields.length >= MAX_ENTRIES}>
        Add project
      </AddEntryButton>
    </EditorSection>
  );
}
