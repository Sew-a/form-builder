'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

interface BuilderHeaderProps {
  localTitle: string;
  titleEditing: boolean;
  saving: boolean;
  fieldsCount: number;
  onTitleClick: () => void;
  onTitleSave: () => void;
  onTitleChange: (value: string) => void;
  onTitleKeyDown: (e: React.KeyboardEvent) => void;
}

export function BuilderHeader({
  localTitle,
  titleEditing,
  saving,
  fieldsCount,
  onTitleClick,
  onTitleSave,
  onTitleChange,
  onTitleKeyDown,
}: BuilderHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex h-14 items-center justify-between border-b border-dark-600 bg-dark-800/80 backdrop-blur-md px-4">
      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.dashboard}
          className="text-sm font-medium text-dark-300 hover:text-dark-100 transition-colors"
        >
          Dashboard
        </Link>
        <svg className="h-4 w-4 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {titleEditing ? (
          <input
            type="text"
            value={localTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={onTitleSave}
            onKeyDown={onTitleKeyDown}
            autoFocus
            className="rounded-lg border border-dark-500 bg-dark-900 px-2 py-1 text-sm font-bold text-dark-50 focus:outline-none focus:ring-2 focus:border-accent-500 focus:ring-accent-500/10"
          />
        ) : (
          <h1
            onClick={onTitleClick}
            className="text-sm font-bold text-dark-100 cursor-pointer hover:text-accent-400 transition-colors"
            title="Click to rename"
          >
            {localTitle}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {saving && (
          <span className="text-xs text-dark-400 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            Saving...
          </span>
        )}
        {fieldsCount > 0 && (
          <span className="text-xs text-dark-400">
            {fieldsCount} field{fieldsCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </header>
  );
}