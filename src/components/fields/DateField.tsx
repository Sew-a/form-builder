import React from 'react';
import { FormField } from '@shared/types';
import { BaseInput, Label, commonInputClasses } from './BaseInput';

interface DateFieldProps {
  field: FormField;
  preview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function DateField({ field, preview = false, value, onChange }: DateFieldProps) {
  return (
    <div style={{ width: field.width || '100%' }}>
      <Label>
        {field.label}
        {field.required && <span className="ml-1 text-accent-400">*</span>}
      </Label>
      {preview ? (
        <BaseInput
          type="date"
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
        />
      ) : (
        <div className={`${commonInputClasses} bg-dark-700/50 cursor-default flex items-center gap-2`}>
          <svg className="h-4 w-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-dark-300">Pick a date...</span>
        </div>
      )}
    </div>
  );
}