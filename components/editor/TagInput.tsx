"use client";

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, X } from "lucide-react";
import { useId, useState, type KeyboardEvent, type PointerEventHandler } from "react";
import { fieldClasses } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

function Chip({ tag, onRemove }: { tag: string; onRemove: () => void }) {
  const { setNodeRef, listeners, transform, transition, isDragging } = useSortable({ id: tag });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition, zIndex: isDragging ? 10 : undefined }}
      className="relative"
    >
      <button
        type="button"
        onClick={onRemove}
        onPointerDown={listeners?.onPointerDown as PointerEventHandler<HTMLButtonElement> | undefined}
        aria-label={`Remove ${tag}`}
        title="Click to remove, drag to reorder"
        className={cn(
          "group inline-flex max-w-full cursor-pointer touch-none items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 py-1 pr-2 pl-3 text-sm text-indigo-800 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-indigo-600",
          isDragging && "cursor-grabbing shadow-md",
        )}
      >
        <span className="truncate">{tag}</span>
        <X className="size-3.5 shrink-0 opacity-60 group-hover:opacity-100" aria-hidden="true" />
      </button>
    </li>
  );
}

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  maxLength?: number;
  error?: string;
}

export function TagInput({ label, value, onChange, placeholder, maxItems = 100, maxLength = 50, error }: TagInputProps) {
  const inputId = useId();
  const dndId = useId();
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const atLimit = value.length >= maxItems;

  const addTags = (raw: string) => {
    const candidates = raw
      .split(",")
      .map((item) => item.trim().slice(0, maxLength))
      .filter(Boolean);
    if (candidates.length === 0) return;
    const next = [...value];
    let duplicate: string | null = null;
    for (const candidate of candidates) {
      if (next.length >= maxItems) break;
      if (next.some((item) => item.toLowerCase() === candidate.toLowerCase())) duplicate = candidate;
      else next.push(candidate);
    }
    setNotice(duplicate ? `"${duplicate}" is already in the list.` : next.length >= maxItems ? `Maximum of ${maxItems} reached.` : null);
    if (next.length !== value.length) onChange(next);
    setDraft("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTags(draft);
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = value.indexOf(String(active.id));
    const to = value.indexOf(String(over.id));
    if (from !== -1 && to !== -1) onChange(arrayMove(value, from, to));
  };

  const hintId = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          value={draft}
          maxLength={maxLength * 3}
          disabled={atLimit}
          placeholder={atLimit ? `Maximum of ${maxItems} reached` : placeholder}
          aria-describedby={hintId}
          aria-invalid={error ? true : undefined}
          onChange={(event) => {
            setDraft(event.target.value);
            setNotice(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => draft.trim() && addTags(draft)}
          className={fieldClasses(Boolean(error))}
        />
        <button
          type="button"
          onClick={() => addTags(draft)}
          disabled={atLimit || !draft.trim()}
          aria-label={`Add to ${label}`}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p id={hintId} className={cn("text-xs", error || notice ? "text-amber-700" : "text-zinc-500")} aria-live="polite">
        {error ?? notice ?? "Press Enter or comma to add. Click an item to remove it, drag to reorder."}
      </p>
      {value.length > 0 && (
        <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={value} strategy={rectSortingStrategy}>
            <ul className="mt-1 flex flex-wrap gap-2" aria-label={`${label} list`}>
              {value.map((tag, index) => (
                <Chip key={tag} tag={tag} onRemove={() => onChange(value.filter((_, i) => i !== index))} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
