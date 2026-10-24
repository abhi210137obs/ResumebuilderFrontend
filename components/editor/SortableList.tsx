"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface DragHandleProps {
  activator: (element: HTMLElement | null) => void;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
}

export function DragHandle({ handle, label }: { handle: DragHandleProps; label: string }) {
  const { activator, attributes, listeners } = handle;
  return (
    <button
      type="button"
      ref={activator}
      {...attributes}
      {...listeners}
      aria-label={label}
      title="Drag to reorder"
      className="flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-indigo-600 active:cursor-grabbing"
    >
      <GripVertical className="size-4" aria-hidden="true" />
    </button>
  );
}

function SortableItem({ id, children }: { id: string; children: (handle: DragHandleProps) => ReactNode }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition, position: "relative", zIndex: isDragging ? 20 : undefined }}
      className={cn(isDragging && "opacity-90 shadow-xl")}
    >
      {children({ activator: setActivatorNodeRef, attributes, listeners })}
    </li>
  );
}

interface SortableListProps<T extends { id: string }> {
  items: T[];
  onMove: (from: number, to: number) => void;
  renderItem: (item: T, index: number, handle: DragHandleProps) => ReactNode;
  className?: string;
}

export function SortableList<T extends { id: string }>({ items, onMove, renderItem, className }: SortableListProps<T>) {
  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((item) => item.id === active.id);
    const to = items.findIndex((item) => item.id === over.id);
    if (from !== -1 && to !== -1) onMove(from, to);
  };

  return (
    <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <ul className={cn("flex flex-col gap-3", className)}>
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id}>
              {(handle) => renderItem(item, index, handle)}
            </SortableItem>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
