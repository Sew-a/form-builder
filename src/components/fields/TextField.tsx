import React from 'react';
import { FormField } from '@shared/types';
import { BaseInput, Label, commonInputClasses } from './BaseInput';

interface TextFieldProps {
  field: FormField;
  preview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function TextField({ field, preview = false, value, onChange }: TextFieldProps) {
  return (
    <div style={{ width: field.width || '100%' }}>
      <Label>
        {field.label}
        {field.required && <span className="ml-1 text-accent-400">*</span>}
      </Label>
      {preview ? (
        <BaseInput
          type={field.type}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          maxLength={field.maxLength}
          min={field.minValue}
          max={field.maxValue}
        />
      ) : (
        <div className={`${commonInputClasses} bg-dark-700/50 cursor-default`}>
          <span className="text-dark-300">{field.placeholder || `Enter ${field.type}...`}</span>
        </div>
      )}
    </div>
  );
}