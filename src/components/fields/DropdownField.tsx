import React from 'react';
import { FormField } from '@shared/types';
import { BaseSelect, Label, commonInputClasses } from './BaseInput';

interface DropdownFieldProps {
  field: FormField;
  preview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function DropdownField({ field, preview = false, value, onChange }: DropdownFieldProps) {
  return (
    <div style={{ width: field.width || '100%' }}>
      <Label>
        {field.label}
        {field.required && <span className="ml-1 text-accent-400">*</span>}
      </Label>
      {preview ? (
        <BaseSelect
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
        >
          <option value="">Select an option...</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </BaseSelect>
      ) : (
        <select disabled className={`${commonInputClasses} bg-dark-700/50 cursor-default`}>
          <option>{field.options?.[0] || 'Select...'}</option>
        </select>
      )}
    </div>
  );
}