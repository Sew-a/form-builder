'use client';

import React from 'react';
import { FormField } from '@shared/types';

interface FieldRendererProps {
  field: FormField;
  preview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function FieldRenderer({ field, preview = false, value, onChange }: FieldRendererProps) {
  const commonInputClasses = "w-full rounded-lg border border-dark-500 bg-dark-800 px-3 py-2.5 text-sm text-dark-50 placeholder-dark-300 transition-all focus:outline-none focus:ring-2 focus:border-accent-500 focus:ring-accent-500/10";

  const renderLabel = () => (
    <label className="block text-sm font-medium text-dark-100 mb-1.5">
      {field.label}
      {field.required && <span className="ml-1 text-accent-400">*</span>}
    </label>
  );

  if (field.type === 'section') {
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

  if (field.type === 'text' || field.type === 'email' || field.type === 'number') {
    return (
      <div style={{ width: field.width || '100%' }}>
        {renderLabel()}
        {preview ? (
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className={commonInputClasses}
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

  if (field.type === 'textarea') {
    return (
      <div style={{ width: field.width || '100%' }}>
        {renderLabel()}
        {preview ? (
          <textarea
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className={`${commonInputClasses} min-h-[100px] resize-y`}
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

  if (field.type === 'dropdown') {
    return (
      <div style={{ width: field.width || '100%' }}>
        {renderLabel()}
        {preview ? (
          <select
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className={commonInputClasses}
          >
            <option value="">Select an option...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <select disabled className={`${commonInputClasses} bg-dark-700/50 cursor-default`}>
            <option>{field.options?.[0] || 'Select...'}</option>
          </select>
        )}
      </div>
    );
  }

  if (field.type === 'radio') {
    return (
      <div style={{ width: field.width || '100%' }}>
        {renderLabel()}
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

  if (field.type === 'checkbox') {
    return (
      <div style={{ width: field.width || '100%' }}>
        {renderLabel()}
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

  if (field.type === 'date') {
    return (
      <div style={{ width: field.width || '100%' }}>
        {renderLabel()}
        {preview ? (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className={commonInputClasses}
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

  if (field.type === 'file') {
    return (
      <div style={{ width: field.width || '100%' }}>
        {renderLabel()}
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

  if (field.type === 'rating') {
    const max = field.maxRating || 5;
    return (
      <div style={{ width: field.width || '100%' }}>
        {renderLabel()}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
