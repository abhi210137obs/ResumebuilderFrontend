"use client";

import { User } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { emptyLink } from "@/lib/resume";
import type { ResumeData } from "@/lib/types";
import { EditorSection } from "../EditorSection";
import { AddEntryButton, EntryCard } from "../EntryCard";
import { SortableList, type DragHandleProps } from "../SortableList";

const MAX_LINKS = 10;

function LinkItem({ index, handle, onRemove }: { index: number; handle: DragHandleProps; onRemove: () => void }) {
  const { register, control, formState: { errors } } = useFormContext<ResumeData>();
  const label = useWatch({ control, name: `personal.links.${index}.label` });
  const error = errors.personal?.links?.[index];
  return (
    <EntryCard title={label?.trim() || `Link ${index + 1}`} handle={handle} onRemove={onRemove}>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Input label="Label" placeholder="LinkedIn" maxLength={50} error={error?.label?.message} {...register(`personal.links.${index}.label`)} />
        <Input
          label="URL"
          type="url"
          inputMode="url"
          placeholder="linkedin.com/in/janedoe"
          maxLength={500}
          error={error?.url?.message}
          {...register(`personal.links.${index}.url`)}
        />
      </div>
    </EntryCard>
  );
}

export function PersonalSection() {
  const { register, control, formState: { errors } } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "personal.links" });
  const personalErrors = errors.personal;

  return (
    <EditorSection title="Personal Info" icon={User} description="Your name and how employers can reach you">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Jane Doe"
          maxLength={100}
          wrapperClassName="sm:col-span-2"
          error={personalErrors?.fullName?.message}
          {...register("personal.fullName")}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="jane@example.com"
          error={personalErrors?.email?.message}
          {...register("personal.email")}
        />
        <Input
          label="Phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 555 123 4567"
          maxLength={30}
          error={personalErrors?.phone?.message}
          {...register("personal.phone")}
        />
        <Input
          label="Location"
          placeholder="Berlin, Germany"
          maxLength={100}
          wrapperClassName="sm:col-span-2"
          error={personalErrors?.location?.message}
          {...register("personal.location")}
        />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-zinc-800">Links</h3>
        <p className="mb-3 text-xs text-zinc-500">Portfolio, LinkedIn, GitHub or any other relevant profile.</p>
        {fields.length > 0 && (
          <SortableList
            items={fields}
            onMove={move}
            renderItem={(field, index, handle) => <LinkItem key={field.id} index={index} handle={handle} onRemove={() => remove(index)} />}
          />
        )}
        <AddEntryButton onClick={() => append(emptyLink())} disabled={fields.length >= MAX_LINKS}>
          Add link
        </AddEntryButton>
      </div>
    </EditorSection>
  );
}
