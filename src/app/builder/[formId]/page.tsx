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
import { FieldPalette } from '../../../components/builder/FieldPalette';
import { BuilderCanvas } from '../../../components/builder/BuilderCanvas';
import { PropertyPanel } from '../../../components/builder/PropertyPanel';

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
          <Link href="/dashboard" className="text-sm font-semibold text-accent-400 hover:text-accent-300">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-dark-950">
      <header className="flex h-14 items-center justify-between border-b border-dark-600 bg-dark-800/80 backdrop-blur-md px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-dark-300 hover:text-dark-100 transition-colors"
          >
            Dashboard
          </Link>
          <svg className="h-4 w-4 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {titleEditing ? (
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => { if (e.key === 'Enter') handleTitleSave(); }}
              autoFocus
              className="rounded-lg border border-dark-500 bg-dark-900 px-2 py-1 text-sm font-bold text-dark-50 focus:outline-none focus:ring-2 focus:border-accent-500 focus:ring-accent-500/10"
            />
          ) : (
            <h1
              onClick={() => setTitleEditing(true)}
              className="text-sm font-bold text-dark-100 cursor-pointer hover:text-accent-400 transition-colors"
              title="Click to rename"
            >
              {localTitle}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          {saving && (
            <span className="text-xs text-dark-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              Saving...
            </span>
          )}
          {fields.length > 0 && (
            <span className="text-xs text-dark-400">
              {fields.length} field{fields.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </header>

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
