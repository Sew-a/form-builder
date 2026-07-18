import { create } from 'zustand';
import type { FormField } from '@shared/types';

interface FormBuilderState {
  formId: string | null;
  title: string;
  fields: FormField[];
  setForm: (formId: string, title: string, fields: FormField[]) => void;
  addField: (field: FormField) => void;
  updateField: (fieldId: string, changes: Partial<FormField>) => void;
  removeField: (fieldId: string) => void;
  reorderFields: (orderedIds: string[]) => void;
}

// This store holds the client-side source of truth for the field list
// while the builder is open. Local edits are applied immediately here
// (optimistic UI), then emitted over the socket — see useSocket.ts.
export const useFormStore = create<FormBuilderState>((set, get) => ({
  formId: null,
  title: '',
  fields: [],

  setForm: (formId, title, fields) => set({ formId, title, fields }),

  addField: (field) => set({ fields: [...get().fields, field] }),

  updateField: (fieldId, changes) =>
    set({
      fields: get().fields.map((f) => (f.id === fieldId ? { ...f, ...changes } : f)),
    }),

  removeField: (fieldId) =>
    set({ fields: get().fields.filter((f) => f.id !== fieldId) }),

  reorderFields: (orderedIds) => {
    const byId = new Map(get().fields.map((f) => [f.id, f]));
    const reordered = orderedIds
      .map((id, index) => {
        const field = byId.get(id);
        return field ? { ...field, order: index } : undefined;
      })
      .filter((f): f is FormField => Boolean(f));
    set({ fields: reordered });
  },
}));
