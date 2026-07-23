import React from 'react';
import { FormField } from '@shared/types';

interface CheckboxFieldProps {
  field: FormField;
  preview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function CheckboxField({ field, preview = false, value, onChange }: CheckboxFieldProps) {
  return (
    <div style={{ width: field.width || '100%' }}>
      <label className="block text-sm font-medium text-dark-100 mb-1.5">
        {field.label}
        {field.required && <span className="ml-1 text-accent-400">*</span>}
      </label>
      <div className="space-y-2 mt-1">
        {field.options?.map((opt) => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              preview && Array.isArray(value) && value.includes(opt) ? 'border-accent-500 bg-accent-500' : 'border-dark-400 group-hover:border-dark-300'
            }`}>
              {preview && Array.isArray(value) && value.includes(opt) && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm text-dark-200">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}