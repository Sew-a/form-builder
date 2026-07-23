'use client';
import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useFormBuilder } from '../../../hooks/useFormBuilder';
import { FieldPalette } from '@/components/builder/FieldPalette';
import { BuilderCanvas } from '@/components/builder/BuilderCanvas';
import { PropertyPanel } from '@/components/builder/PropertyPanel';
import { BuilderHeader } from '@/components/builder/BuilderHeader';

export default function BuilderPage({ params }: { params: { formId: string } }) {
  const {
    loading,
    error,
    saving,
    fields,
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
  } = useFormBuilder(params.formId);

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
