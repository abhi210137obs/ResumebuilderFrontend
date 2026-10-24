"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { fieldClasses } from "@/components/ui/Input";

interface BulletListInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  maxItems?: number;
  maxLength?: number;
}

export function BulletListInput({ label, value, onChange, maxItems = 20, maxLength = 500 }: BulletListInputProps) {
  const groupId = useId();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const focusIndex = useRef<number | null>(null);

  useEffect(() => {
    if (focusIndex.current === null) return;
    inputs.current[focusIndex.current]?.focus();
    focusIndex.current = null;
  });

  const update = (index: number, text: string) => onChange(value.map((item, i) => (i === index ? text : item)));

  const insertAt = (index: number) => {
    if (value.length >= maxItems) return;
    focusIndex.current = index;
    onChange([...value.slice(0, index), "", ...value.slice(index)]);
  };

  const removeAt = (index: number) => {
    focusIndex.current = Math.max(0, index - 1);
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Enter") {
      event.preventDefault();
      insertAt(index + 1);
    } else if (event.key === "Backspace" && value[index] === "" && value.length > 1) {
      event.preventDefault();
      removeAt(index);
    }
  };

  return (
    <div role="group" aria-labelledby={groupId} className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span id={groupId} className="text-sm font-medium text-zinc-700">
          {label}
        </span>
        <span className="text-xs text-zinc-500">
          {value.length}/{maxItems}
        </span>
      </div>
      {value.length > 0 && (
        <ol className="flex flex-col gap-2">
          {value.map((bullet, index) => (
            <li key={index} className="flex items-center gap-2">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-zinc-400" />
              <label htmlFor={`${groupId}-${index}`} className="sr-only">
                {`${label} ${index + 1}`}
              </label>
              <input
                id={`${groupId}-${index}`}
                ref={(element) => {
                  inputs.current[index] = element;
                }}
                value={bullet}
                maxLength={maxLength}
                placeholder="Describe an achievement, ideally with a measurable result"
                onChange={(event) => update(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={fieldClasses(false)}
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-400 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-indigo-600"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
      )}
      <button
        type="button"
        onClick={() => insertAt(value.length)}
        disabled={value.length >= maxItems}
        className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="size-4" aria-hidden="true" />
        Add bullet point
      </button>
    </div>
  );
}
