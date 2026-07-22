'use client';

import React from 'react';
import { FieldType } from '@shared/types';

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
}

interface FieldOption {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
  category: string;
}

const FIELD_OPTIONS: FieldOption[] = [
  { type: 'text', label: 'Text Input', category: 'Basic', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
  { type: 'email', label: 'Email', category: 'Basic', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  { type: 'number', label: 'Number', category: 'Basic', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg> },
  { type: 'textarea', label: 'Text Area', category: 'Basic', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg> },
  { type: 'dropdown', label: 'Dropdown', category: 'Choice', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg> },
  { type: 'radio', label: 'Radio Button', category: 'Choice', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { type: 'checkbox', label: 'Checkbox', category: 'Choice', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { type: 'date', label: 'Date Picker', category: 'Advanced', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  { type: 'file', label: 'File Upload', category: 'Advanced', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> },
  { type: 'rating', label: 'Rating', category: 'Advanced', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
  { type: 'section', label: 'Content Block', category: 'Layout', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg> },
];

const CATEGORIES = ['Basic', 'Choice', 'Advanced', 'Layout'];

export function FieldPalette({ onAddField }: FieldPaletteProps) {
  return (
    <div className="w-64 border-r border-dark-500 bg-dark-900 p-4 overflow-y-auto">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-dark-300 mb-4">Add Fields</h3>

      {CATEGORIES.map((category) => {
        const fields = FIELD_OPTIONS.filter((f) => f.category === category);
        if (fields.length === 0) return null;

        return (
          <div key={category} className="mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-400 mb-2 px-1">{category}</p>
            <div className="space-y-1">
              {fields.map((field) => (
                <button
                  key={field.type}
                  onClick={() => onAddField(field.type)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-dark-200 hover:bg-dark-700 hover:text-dark-50 transition-all text-left group"
                >
                  <span className="text-dark-400 group-hover:text-accent-400 transition-colors">{field.icon}</span>
                  <span className="font-medium">{field.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
