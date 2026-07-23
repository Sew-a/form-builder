import React from 'react';
import { FormField } from '@shared/types';

interface FileFieldProps {
  field: FormField;
  preview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function FileField({ field, preview = false, value, onChange }: FileFieldProps) {
  return (
    <div style={{ width: field.width || '100%' }}>
      <label className="block text-sm font-medium text-dark-100 mb-1.5">
        {field.label}
        {field.required && <span className="ml-1 text-accent-400">*</span>}
      </label>
      {preview ? (
        <div className="border-2 border-dashed border-dark-500 rounded-lg p-6 text-center hover:border-dark-400 transition-all cursor-pointer">
          <svg className="mx-auto h-8 w-8 text-dark-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-dark-300">Click to upload or drag and drop</p>
        </div>
      ) : (
        <div className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center bg-dark-700/30">
          <svg className="mx-auto h-8 w-8 text-dark-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-dark-400">File upload area</p>
        </div>
      )}
    </div>
  );
}