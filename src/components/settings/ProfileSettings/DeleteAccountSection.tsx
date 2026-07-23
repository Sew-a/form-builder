'use client';
import React from 'react';
import { Button } from '../../ui/Button';

interface DeleteAccountSectionProps {
  deleteConfirmOpen: boolean;
  deletePassword: string;
  deleteError: string | null;
  loading: boolean;
  onDeleteClick: () => void;
  onPasswordChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  getInputClass: (hasError: boolean) => string;
}

export function DeleteAccountSection({
  deleteConfirmOpen,
  deletePassword,
  deleteError,
  loading,
  onDeleteClick,
  onPasswordChange,
  onCancel,
  onSubmit,
  getInputClass,
}: DeleteAccountSectionProps) {
  return (
    <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
      <h2 className="text-sm font-semibold text-red-400">Delete account</h2>
      <p className="mt-1 text-xs text-dark-300 max-w-lg">
        Permanently delete your account and all forms you own. This cannot be undone.
      </p>
      {!deleteConfirmOpen ? (
        <Button
          variant="danger"
          size="md"
          onClick={onDeleteClick}
          className="mt-4"
        >
          Delete my account
        </Button>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 max-w-md space-y-3">
          <p className="text-xs text-red-400 font-medium">Enter your password to confirm.</p>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Your password"
            className={getInputClass(!!deleteError)}
            disabled={loading}
            autoComplete="current-password"
          />
          {deleteError && <p className="text-xs text-red-400">{deleteError}</p>}
          <div className="flex gap-2">
            <Button
              variant="dangerSolid"
              size="md"
              type="submit"
              disabled={loading}
            >
              Confirm delete
            </Button>
            <Button
              variant="secondary"
              size="md"
              disabled={loading}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}