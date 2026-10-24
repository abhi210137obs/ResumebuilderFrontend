"use client";

import { Award } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { emptyCertification } from "@/lib/resume";
import type { ResumeData } from "@/lib/types";
import { EditorSection } from "../EditorSection";
import { AddEntryButton, EmptyEntries, EntryCard } from "../EntryCard";
import { SortableList, type DragHandleProps } from "../SortableList";

const MAX_ENTRIES = 30;

function CertificationItem({ index, handle, onRemove }: { index: number; handle: DragHandleProps; onRemove: () => void }) {
  const { register, control, formState: { errors } } = useFormContext<ResumeData>();
  const name = useWatch({ control, name: `certifications.${index}.name` });
  const error = errors.certifications?.[index];

  return (
    <EntryCard title={name?.trim() || `Certification ${index + 1}`} handle={handle} onRemove={onRemove}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Certification name"
          placeholder="AWS Certified Developer"
          maxLength={150}
          wrapperClassName="sm:col-span-2"
          error={error?.name?.message}
          {...register(`certifications.${index}.name`)}
        />
        <Input label="Issuer" placeholder="Amazon Web Services" maxLength={150} error={error?.issuer?.message} {...register(`certifications.${index}.issuer`)} />
        <Input label="Date" placeholder="2023-06 or Jun 2023" maxLength={30} error={error?.date?.message} {...register(`certifications.${index}.date`)} />
      </div>
    </EntryCard>
  );
}

export function CertificationsSection() {
  const { control } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "certifications" });

  return (
    <EditorSection title="Certifications" icon={Award} description="Licenses and certificates" count={fields.length}>
      {fields.length > 0 ? (
        <SortableList
          items={fields}
          onMove={move}
          renderItem={(field, index, handle) => (
            <CertificationItem key={field.id} index={index} handle={handle} onRemove={() => remove(index)} />
          )}
        />
      ) : (
        <EmptyEntries>No certifications added yet.</EmptyEntries>
      )}
      <AddEntryButton onClick={() => append(emptyCertification())} disabled={fields.length >= MAX_ENTRIES}>
        Add certification
      </AddEntryButton>
    </EditorSection>
  );
}
