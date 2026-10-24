"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { TEMPLATES } from "@/lib/resume";
import { createResumeSchema, type CreateResumeValues } from "@/lib/validators";

interface CreateResumeModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (values: CreateResumeValues) => Promise<void>;
}

const defaultValues: CreateResumeValues = { title: "", template: "classic" };

export function CreateResumeModal({ open, onClose, onCreate }: CreateResumeModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateResumeValues>({ resolver: zodResolver(createResumeSchema), defaultValues });
  const selected = useWatch({ control, name: "template" });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create a new resume"
      description="Give it a name and pick a starting template. You can change both later."
      size="lg"
      dismissible={!isSubmitting}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="create-resume-form" loading={isSubmitting}>
            Create resume
          </Button>
        </>
      }
    >
      <form id="create-resume-form" onSubmit={handleSubmit(onCreate)} noValidate className="flex flex-col gap-5">
        <Input
          label="Resume title"
          placeholder="e.g. Senior Frontend Engineer"
          data-autofocus
          maxLength={100}
          error={errors.title?.message}
          {...register("title")}
        />
        <fieldset>
          <legend className="text-sm font-medium text-zinc-700">Template</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {TEMPLATES.map((template) => (
              <label
                key={template.id}
                className={cn(
                  "relative flex cursor-pointer flex-col rounded-xl border p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500",
                  selected === template.id ? "border-indigo-500 bg-indigo-50/60" : "border-zinc-200 hover:border-zinc-300",
                )}
              >
                <input type="radio" value={template.id} className="sr-only" {...register("template")} />
                <span className="flex items-center justify-between text-sm font-semibold text-zinc-900">
                  {template.name}
                  {selected === template.id && <Check className="size-4 text-indigo-600" aria-hidden="true" />}
                </span>
                <span className="mt-1 text-xs leading-5 text-zinc-600">{template.description}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
