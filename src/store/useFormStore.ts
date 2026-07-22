import { create } from 'zustand';
import type { FormField, FormDTO } from '@shared/types';
import { api } from '../lib/api';

interface FormBuilderState {
  formId: string | null;
  title: string;
  fields: FormField[];
  setForm: (formId: string, title: string, fields: FormField[]) => void;
  addField: (field: FormField) => void;
  updateField: (fieldId: string, changes: Partial<FormField>) => void;
  removeField: (fieldId: string) => void;
  reorderFields: (orderedIds: string[]) => void;

  // Dashboard state
  forms: FormDTO[];
  formsLoading: boolean;
  loadForms: () => Promise<void>;
  createForm: (title: string, description?: string) => Promise<FormDTO>;
  deleteForm: (formId: string) => Promise<void>;
}

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

  // Dashboard
  forms: [],
  formsLoading: false,

  loadForms: async () => {
    set({ formsLoading: true });
    try {
      const raw = await api.get<any[]>('/api/forms');
      const forms: FormDTO[] = raw.map((f) => ({ ...f, id: f.id || String(f._id) }));
      set({ forms, formsLoading: false });
    } catch {
      set({ formsLoading: false });
    }
  },

  createForm: async (title, description) => {
    const raw = await api.post<any>('/api/forms', { title, description });
    // Ensure `id` is a string (server returns it, but guard against _id fallback)
    const form: FormDTO = { ...raw, id: raw.id || String(raw._id) };
    set({ forms: [...get().forms, form] });
    return form;
  },

  deleteForm: async (formId) => {
    await api.delete<void>(`/api/forms/${formId}`);
    set({ forms: get().forms.filter((f) => f.id !== formId) });
  },
}));
