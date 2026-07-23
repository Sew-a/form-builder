'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { FieldType, FormField, FormDTO } from '@shared/types';
import { api } from '../lib/api';
import { useFormStore } from '../store/useFormStore';
import { useAuthStore } from '../store/useAuthStore';
import { useSocket } from './useSocket';

export function useFormBuilder(formId: string) {
  const { user } = useAuthStore();
  const {
    formId: storeFormId,
    title,
    fields,
    setForm,
    addField,
    updateField,
    removeField,
    reorderFields,
  } = useFormStore();

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState('');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedRef = useRef(false);

  const { emitFieldAdd, emitFieldUpdate, emitFieldDelete, emitFieldReorder } = useSocket(
    formId,
    user?.name,
  );

  useEffect(() => {
    if (!formId || formId === 'undefined') {
      setError('Invalid form ID. Please go back to the dashboard and try again.');
      setLoading(false);
      return;
    }
    const loadForm = async () => {
      try {
        const form = await api.get<FormDTO>(`/api/forms/${formId}`);
        setForm(form.id, form.title, form.fields);
        setLocalTitle(form.title);
        hasLoadedRef.current = true;
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form');
        setLoading(false);
      }
    };
    loadForm();
  }, [formId, setForm]);

  const debouncedSave = useCallback(
    (updatedFields: FormField[], updatedTitle?: string) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        setSaving(true);
        try {
          await api.patch(`/api/forms/${formId}`, {
            fields: updatedFields,
            ...(updatedTitle !== undefined ? { title: updatedTitle } : {}),
          });
        } catch (err) {
          console.error('Auto-save failed:', err);
        } finally {
          setSaving(false);
        }
      }, 800);
    },
    [formId],
  );

  useEffect(() => {
    if (hasLoadedRef.current && storeFormId) {
      debouncedSave(fields);
    }
  }, [fields, debouncedSave, storeFormId]);

  const handleAddField = useCallback(
    (type: FieldType) => {
      const newField: FormField = {
        id: uuid(),
        type,
        label: type === 'section' ? 'Content Block' : `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
        placeholder: type === 'section' ? undefined : `Enter ${type}...`,
        required: false,
        options: ['dropdown', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
        order: fields.length,
        content: type === 'section' ? 'Edit this content block...' : undefined,
        width: 'full',
      };
      addField(newField);
      emitFieldAdd(newField);
      setSelectedFieldId(newField.id);
    },
    [fields.length, addField, emitFieldAdd],
  );

  const handleUpdateField = useCallback(
    (fieldId: string, changes: Partial<FormField>) => {
      updateField(fieldId, changes);
      emitFieldUpdate(fieldId, changes);
    },
    [updateField, emitFieldUpdate],
  );

  const handleDeleteField = useCallback(
    (fieldId: string) => {
      removeField(fieldId);
      emitFieldDelete(fieldId);
      if (selectedFieldId === fieldId) setSelectedFieldId(null);
    },
    [selectedFieldId, removeField, emitFieldDelete],
  );

  const handleReorder = useCallback(
    (orderedIds: string[]) => {
      reorderFields(orderedIds);
      emitFieldReorder(orderedIds);
    },
    [reorderFields, emitFieldReorder],
  );

  const handleTitleSave = useCallback(() => {
    setTitleEditing(false);
    if (localTitle.trim() && localTitle !== title) {
      setForm(storeFormId || formId, localTitle.trim(), fields);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        try {
          await api.patch(`/api/forms/${formId}`, { title: localTitle.trim() });
        } catch (err) {
          console.error('Title save failed:', err);
        }
      }, 300);
    }
  }, [localTitle, title, storeFormId, formId, fields, setForm]);

  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  return {
    loading,
    error,
    saving,
    fields,
    title,
    localTitle,
    titleEditing,
    selectedField,
    selectedFieldId,
    setSelectedFieldId,
    setLocalTitle,
    setTitleEditing,
    handleAddField,
    handleUpdateField,
    handleDeleteField,
    handleReorder,
    handleTitleSave,
  };
}
