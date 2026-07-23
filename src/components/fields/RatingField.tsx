import React from 'react';
import { FormField } from '@shared/types';

interface RatingFieldProps {
  field: FormField;
  preview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function RatingField({ field, preview = false, value, onChange }: RatingFieldProps) {
  const max = field.maxRating || 5;
  return (
    <div style={{ width: field.width || '100%' }}>
      <label className="block text-sm font-medium text-dark-100 mb-1.5">
        {field.label}
        {field.required && <span className="ml-1 text-accent-400">*</span>}
      </label>
      <div className="flex gap-1.5 mt-1">
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const isFilled = preview && value && Number(value) >= starValue;
          return (
            <button
              key={i}
              type="button"
              onClick={() => preview && onChange?.(starValue)}
              className={`transition-all ${preview ? 'cursor-pointer hover:scale-110' : 'cursor-default'} ${isFilled ? 'text-amber-400' : 'text-dark-500'}`}
            >
              <svg className="h-7 w-7" fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674a1 1 0 00.95-.69l1.519-4.674z" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}