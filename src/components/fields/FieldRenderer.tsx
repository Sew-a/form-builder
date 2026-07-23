'use client';

import React from 'react';
import { FormField } from '@shared/types';
import { TextField } from './TextField';
import { TextAreaField } from './TextAreaField';
import { DropdownField } from './DropdownField';
import { RadioField } from './RadioField';
import { CheckboxField } from './CheckboxField';
import { DateField } from './DateField';
import { FileField } from './FileField';
import { RatingField } from './RatingField';
import { SectionField } from './SectionField';

interface FieldRendererProps {
  field: FormField;
  preview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function FieldRenderer({ field, preview = false, value, onChange }: FieldRendererProps) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
      return <TextField field={field} preview={preview} value={value} onChange={onChange} />;
    case 'textarea':
      return <TextAreaField field={field} preview={preview} value={value} onChange={onChange} />;
    case 'dropdown':
      return <DropdownField field={field} preview={preview} value={value} onChange={onChange} />;
    case 'radio':
      return <RadioField field={field} preview={preview} value={value} onChange={onChange} />;
    case 'checkbox':
      return <CheckboxField field={field} preview={preview} value={value} onChange={onChange} />;
    case 'date':
      return <DateField field={field} preview={preview} value={value} onChange={onChange} />;
    case 'file':
      return <FileField field={field} preview={preview} value={value} onChange={onChange} />;
    case 'rating':
      return <RatingField field={field} preview={preview} value={value} onChange={onChange} />;
    case 'section':
      return <SectionField field={field} preview={preview} value={value} onChange={onChange} />;
    default:
      return null;
  }
}
