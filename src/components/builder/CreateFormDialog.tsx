'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';

interface CreateFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

const CloseIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export function CreateFormDialog({ open, onClose, onSubmit }: CreateFormDialogProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a form name');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit(trimmed);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-md rounded-2xl bg-dark-800 p-6 shadow-xl border border-dark-500 animate-scaleIn">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-dark-50">Create New Form</h2>
          <Button variant="ghost" size="icon" icon={CloseIcon} onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1.5">
              Form Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Customer Feedback Survey"
              className="w-full rounded-lg border border-dark-500 bg-dark-900 px-3 py-2.5 text-sm text-dark-50 placeholder-dark-300 transition-all focus:outline-none focus:ring-2 focus:border-accent-500 focus:ring-accent-500/10"
              disabled={loading}
              maxLength={150}
            />
            {error && <p className="mt-1 text-xs text-accent-400">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={loading} loading={loading}>
              {loading ? 'Creating...' : 'Create Form'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
