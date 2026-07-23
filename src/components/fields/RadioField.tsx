import React from 'react';
import { FormField } from '@shared/types';

interface RadioFieldProps {
  field: FormField;
  preview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function RadioField({ field, preview = false, value, onChange }: RadioFieldProps) {
  return (
    <div style={{ width: field.width || '100%' }}>
      <label className="block text-sm font-medium text-dark-100 mb-1.5">
        {field.label}
        {field.required && <span className="ml-1 text-accent-400">*</span>}
      </label>
      <div className="space-y-2 mt-1">
        {field.options?.map((opt) => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
              preview && value === opt ? 'border-accent-500 bg-accent-500' : 'border-dark-400 group-hover:border-dark-300'
            }`}>
              {preview && value === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className="text-sm text-dark-200">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}