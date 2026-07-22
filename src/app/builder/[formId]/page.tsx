'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { v4 as uuid } from 'uuid';
import { FieldType, FormField, FormDTO } from '@shared/types';
import { api } from '../../../lib/api';
import { useFormStore } from '../../../store/useFormStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useSocket } from '../../../hooks/useSocket';
import { FieldPalette } from '@/components/builder/FieldPalette';
import { BuilderCanvas } from '@/components/builder/BuilderCanvas';
import { PropertyPanel } from '@/components/builder/PropertyPanel';
import { BuilderHeader } from '@/components/builder/BuilderHeader';
import { ROUTES } from '@/lib/routes';

export default function BuilderPage({ params }: { params: { formId: string } }) {
  const router = useRouter();
  const { user, setAuthModalOpen } = useAuthStore();
  const {
    formId,
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
    params.formId,
    user?.name,
  );

  useEffect(() => {
    if (!params.formId || params.formId === 'undefined') {
      setError('Invalid form ID. Please go back to the dashboard and try again.');
      setLoading(false);
      return;
    }
    const loadForm = async () => {
      try {
        const form = await api.get<FormDTO>(`/api/forms/${params.formId}`);
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
  }, [params.formId, setForm]);

  const debouncedSave = useCallback(
    (updatedFields: FormField[], updatedTitle?: string) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        setSaving(true);
        try {
          await api.patch(`/api/forms/${params.formId}`, {
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
    [params.formId],
  );

  useEffect(() => {
    if (hasLoadedRef.current && formId) {
      debouncedSave(fields);
    }
  }, [fields, debouncedSave, formId]);

  const handleAddField = (type: FieldType) => {
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
  };

  const handleUpdateField = (fieldId: string, changes: Partial<FormField>) => {
    updateField(fieldId, changes);
    emitFieldUpdate(fieldId, changes);
  };

  const handleDeleteField = (fieldId: string) => {
    removeField(fieldId);
    emitFieldDelete(fieldId);
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
  };

  const handleReorder = (orderedIds: string[]) => {
    reorderFields(orderedIds);
    emitFieldReorder(orderedIds);
  };

  const handleTitleSave = () => {
    setTitleEditing(false);
    if (localTitle.trim() && localTitle !== title) {
      setForm(formId || params.formId, localTitle.trim(), fields);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        try {
          await api.patch(`/api/forms/${params.formId}`, { title: localTitle.trim() });
        } catch (err) {
          console.error('Title save failed:', err);
        }
      }, 300);
    }
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-950">
        <div className="text-center space-y-3">
          <div className="animate-spin h-8 w-8 border-2 border-accent-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-dark-400">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-950">
        <div className="text-center space-y-4">
          <p className="text-dark-300">{error}</p>
          <Link href={ROUTES.dashboard} className="text-sm font-semibold text-accent-400 hover:text-accent-300">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-dark-950">
      <BuilderHeader
        localTitle={localTitle}
        titleEditing={titleEditing}
        saving={saving}
        fieldsCount={fields.length}
        onTitleClick={() => setTitleEditing(true)}
        onTitleSave={handleTitleSave}
        onTitleChange={setLocalTitle}
        onTitleKeyDown={(e) => { if (e.key === 'Enter') handleTitleSave(); }}
      />

      <div className="flex flex-1 overflow-hidden">
        <FieldPalette onAddField={handleAddField} />
        <BuilderCanvas
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelectField={setSelectedFieldId}
          onReorder={handleReorder}
          onDeleteField={handleDeleteField}
        />
        <PropertyPanel
          field={selectedField}
          onUpdate={handleUpdateField}
          onDelete={() => selectedFieldId && handleDeleteField(selectedFieldId)}
        />
      </div>
    </div>
  );
}
