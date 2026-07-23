'use client';

import React from 'react';
import { FieldType, FIELD_TYPES } from '@shared/types';
import { FIELD_CATEGORIES, FIELD_ICONS, FIELD_LABELS, FIELD_CATEGORIES_MAP } from './constants';
import { Button } from '../ui/Button';

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
}

export function FieldPalette({ onAddField }: FieldPaletteProps) {
  return (
    <div className="w-64 border-r border-dark-500 bg-dark-900 p-4 overflow-y-auto">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-dark-300 mb-4">Add Fields</h3>

      {FIELD_CATEGORIES.map((category) => {
        const fields = FIELD_TYPES.filter((type) => FIELD_CATEGORIES_MAP[type] === category);
        if (fields.length === 0) return null;

        return (
          <div key={category} className="mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-400 mb-2 px-1">{category}</p>
            <div className="space-y-1">
              {fields.map((type) => (
                <Button
                  key={type}
                  variant="ghost"
                  size="md"
                  fullWidth
                  className="justify-start rounded-lg px-3 py-2 text-left group"
                  onClick={() => onAddField(type)}
                >
                  <span className="text-dark-400 group-hover:text-accent-400 transition-colors">{FIELD_ICONS[type]}</span>
                  <span className="font-medium">{FIELD_LABELS[type]}</span>
                </Button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
