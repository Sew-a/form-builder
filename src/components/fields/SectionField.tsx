import React from 'react';
import { FormField } from '@shared/types';

interface SectionFieldProps {
  field: FormField;
  preview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function SectionField({ field }: SectionFieldProps) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: field.backgroundColor || '#292a2e',
        borderRadius: field.borderRadius || '12px',
        width: field.width || '100%',
      }}
    >
      <p
        className="whitespace-pre-wrap"
        style={{
          color: field.color || '#d1d5db',
          fontSize: field.fontSize ? `${field.fontSize}px` : undefined,
        }}
      >
        {field.content || 'Content block'}
      </p>
    </div>
  );
}