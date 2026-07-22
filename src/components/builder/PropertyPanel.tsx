'use client';

import React, { useState, useEffect } from 'react';
import { FormField, COLOR_OPTIONS, BORDER_COLOR_OPTIONS, BORDER_RADIUS_OPTIONS, WIDTH_OPTIONS } from '@shared/types';

interface PropertyPanelProps {
  field: FormField | null;
  onUpdate: (fieldId: string, updates: Partial<FormField>) => void;
  onDelete: () => void;
}

export function PropertyPanel({ field, onUpdate, onDelete }: PropertyPanelProps) {
  const [label, setLabel] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [content, setContent] = useState('');
  const [options, setOptions] = useState('');
  const [required, setRequired] = useState(false);
  const [maxLength, setMaxLength] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [maxRating, setMaxRating] = useState('5');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [borderColor, setBorderColor] = useState('');
  const [borderRadius, setBorderRadius] = useState('');
  const [width, setWidth] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [textColor, setTextColor] = useState('');

  useEffect(() => {
    if (!field) return;
    setLabel(field.label || '');
    setPlaceholder(field.placeholder || '');
    setContent(field.content || '');
    setOptions(field.options?.join(', ') || '');
    setRequired(field.required || false);
    setMaxLength(String(field.maxLength || ''));
    setMinValue(String(field.minValue ?? ''));
    setMaxValue(String(field.maxValue ?? ''));
    setMaxRating(String(field.maxRating || '5'));
    setBackgroundColor(field.backgroundColor || '');
    setBorderColor(field.borderColor || '');
    setBorderRadius(field.borderRadius || '');
    setWidth(field.width || '');
    setFontSize(String(field.fontSize || ''));
    setTextColor(field.color || '');
  }, [field?.id]);

  const handleBlur = (key: string, value: any) => {
    if (!field) return;
    if (key === 'options') {
      const parsed = value.split(',').map((o: string) => o.trim()).filter(Boolean);
      onUpdate(field.id, { options: parsed.length > 0 ? parsed : undefined });
    } else if (key === 'maxLength') {
      onUpdate(field.id, { maxLength: value ? Number(value) : undefined });
    } else if (key === 'minValue') {
      onUpdate(field.id, { minValue: value !== '' ? Number(value) : undefined });
    } else if (key === 'maxValue') {
      onUpdate(field.id, { maxValue: value !== '' ? Number(value) : undefined });
    } else if (key === 'maxRating') {
      onUpdate(field.id, { maxRating: Number(value) || 5 });
    } else if (key === 'fontSize') {
      onUpdate(field.id, { fontSize: value ? Number(value) : undefined });
    } else {
      onUpdate(field.id, { [key]: value || undefined });
    }
  };

  const renderInput = (label: string, key: string, value: string, onChange: (v: string) => void, placeholder?: string, type = 'text') => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => handleBlur(key, value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-dark-500 bg-dark-900 px-3 py-2 text-sm text-dark-50 placeholder-dark-300 transition-all focus:outline-none focus:ring-2 focus:border-accent-500 focus:ring-accent-500/10"
      />
    </div>
  );

  const renderSelect = (label: string, key: string, value: string, onChange: (v: string) => void, options: { value: string; label: string }[]) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => { onChange(e.target.value); handleBlur(key, e.target.value); }}
        className="w-full rounded-lg border border-dark-500 bg-dark-900 px-3 py-2 text-sm text-dark-50 transition-all focus:outline-none focus:ring-2 focus:border-accent-500 focus:ring-accent-500/10"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );

  if (!field) {
    return (
      <div className="w-72 border-l border-dark-500 bg-dark-900 p-6 flex flex-col items-center justify-center text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-dark-700 text-dark-400 mb-3">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm text-dark-300 font-medium">Select a field to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="w-72 border-l border-dark-500 bg-dark-900 overflow-y-auto">
      <div className="p-4 border-b border-dark-600">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-dark-100">Field Properties</h3>
          <button
            onClick={onDelete}
            className="rounded-md p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Delete field"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {renderInput('Label', 'label', label, setLabel, 'Field label')}
        {(field.type === 'text' || field.type === 'textarea' || field.type === 'email' || field.type === 'number') &&
          renderInput('Placeholder', 'placeholder', placeholder, setPlaceholder, 'Placeholder text')}

        {field.type === 'section' && renderInput('Content', 'content', content, setContent, 'Block text content')}

        {(field.type === 'dropdown' || field.type === 'radio' || field.type === 'checkbox') &&
          renderInput('Options (comma-separated)', 'options', options, setOptions, 'Option 1, Option 2, Option 3')}

        {(field.type === 'text' || field.type === 'textarea') &&
          renderInput('Max Length', 'maxLength', maxLength, setMaxLength, 'No limit', 'number')}

        {field.type === 'number' && (
          <>
            {renderInput('Min Value', 'minValue', minValue, setMinValue, 'No min', 'number')}
            {renderInput('Max Value', 'maxValue', maxValue, setMaxValue, 'No max', 'number')}
          </>
        )}

        {field.type === 'rating' && renderInput('Max Rating', 'maxRating', maxRating, setMaxRating, '5', 'number')}

        {field.type !== 'section' && (
          <div className="flex items-center justify-between py-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-dark-300">Required</label>
            <button
              onClick={() => { setRequired(!required); handleBlur('required', !required); }}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${required ? 'bg-accent-500' : 'bg-dark-600'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${required ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        )}

        <div className="pt-3 border-t border-dark-600">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-400 mb-3">Appearance</p>
          <div className="space-y-3">
            {field.type === 'section' && (
              <>
                {renderSelect('Background', 'backgroundColor', backgroundColor, setBackgroundColor, COLOR_OPTIONS)}
                {renderSelect('Border Color', 'borderColor', borderColor, setBorderColor, BORDER_COLOR_OPTIONS)}
              </>
            )}
            {renderSelect('Border Radius', 'borderRadius', borderRadius, setBorderRadius, BORDER_RADIUS_OPTIONS)}
            {renderSelect('Width', 'width', width, setWidth, [...WIDTH_OPTIONS])}
            {renderInput('Font Size (px)', 'fontSize', fontSize, setFontSize, 'Default', 'number')}
            {field.type === 'section' && renderInput('Text Color', 'textColor', textColor, setTextColor, '#ffffff')}
          </div>
        </div>
      </div>
    </div>
  );
}
