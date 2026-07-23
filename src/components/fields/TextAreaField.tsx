import React from 'react';
import { FormField } from '@shared/types';
import { BaseTextArea, Label, commonInputClasses } from './BaseInput';

interface TextAreaFieldProps {
  field: FormField;
  preview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function TextAreaField({ field, preview = false, value, onChange }: TextAreaFieldProps) {
  return (
    <div style={{ width: field.width || '100%' }}>
      <Label>
        {field.label}
        {field.required && <span className="ml-1 text-accent-400">*</span>}
      </Label>
      {preview ? (
        <BaseTextArea
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          maxLength={field.maxLength}
        />
      ) : (
        <div className={`${commonInputClasses} bg-dark-700/50 min-h-[80px] cursor-default`}>
          <span className="text-dark-300">{field.placeholder || 'Enter text...'}</span>
        </div>
      )}
    </div>
  );
}