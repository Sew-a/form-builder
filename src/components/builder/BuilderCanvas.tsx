'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '@shared/types';
import { FieldRenderer } from '../fields/FieldRenderer';

interface BuilderCanvasProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
  onReorder: (orderedIds: string[]) => void;
  onDeleteField: (id: string) => void;
}

function SortableField({
  field,
  isSelected,
  onSelect,
  onDelete,
}: {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      className={`relative rounded-xl border-2 p-4 transition-all cursor-pointer group ${
        isSelected
          ? 'border-accent-500 bg-accent-500/5 shadow-md'
          : 'border-dark-600 bg-dark-800 hover:border-dark-400 hover:shadow-sm'
      }`}
    >
      <div className="absolute -top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="rounded-md bg-dark-700 border border-dark-500 p-1 text-dark-300 hover:text-red-400 hover:border-red-500/30 shadow-sm transition-all"
          title="Delete field"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div
        {...attributes}
        {...listeners}
        className="absolute -left-1 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className="flex flex-col gap-0.5 p-1">
          <div className="flex gap-0.5"><span className="h-1 w-1 rounded-full bg-dark-400"></span><span className="h-1 w-1 rounded-full bg-dark-400"></span></div>
          <div className="flex gap-0.5"><span className="h-1 w-1 rounded-full bg-dark-400"></span><span className="h-1 w-1 rounded-full bg-dark-400"></span></div>
          <div className="flex gap-0.5"><span className="h-1 w-1 rounded-full bg-dark-400"></span><span className="h-1 w-1 rounded-full bg-dark-400"></span></div>
        </div>
      </div>

      <FieldRenderer field={field} />
    </div>
  );
}

export function BuilderCanvas({
  fields,
  selectedFieldId,
  onSelectField,
  onReorder,
  onDeleteField,
}: BuilderCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    const newOrder = arrayMove(fields, oldIndex, newIndex).map((f) => f.id);
    onReorder(newOrder);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-8 bg-dark-950"
      onClick={() => onSelectField(null)}
    >
      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-dark-500 rounded-2xl">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-dark-700 text-dark-400">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-dark-200 font-medium">Your form is empty</p>
            <p className="text-sm text-dark-400">Add fields from the palette on the left to start building</p>
          </div>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            <div className="max-w-2xl mx-auto space-y-3">
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  isSelected={selectedFieldId === field.id}
                  onSelect={() => onSelectField(field.id)}
                  onDelete={() => onDeleteField(field.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
