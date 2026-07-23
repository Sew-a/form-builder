'use client';
import React from 'react';
import { Button } from '../../ui/Button';

interface PasswordFormProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  loading: boolean;
  passwordSaved: boolean;
  passwordErrors: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  getInputClass: (hasError: boolean) => string;
}

export function PasswordForm({
  currentPassword,
  newPassword,
  confirmPassword,
  loading,
  passwordSaved,
  passwordErrors,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  getInputClass,
}: PasswordFormProps) {
  return (
    <section className="rounded-2xl border border-dark-600 bg-dark-800 p-6">
      <h2 className="text-sm font-semibold text-dark-100">Change password</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4 max-w-md">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1.5">
            Current password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => onCurrentPasswordChange(e.target.value)}
            className={getInputClass(!!passwordErrors.currentPassword)}
            disabled={loading}
            autoComplete="current-password"
          />
          {passwordErrors.currentPassword && (
            <p className="mt-1 text-xs text-red-400">{passwordErrors.currentPassword}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1.5">
            New password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            className={getInputClass(!!passwordErrors.newPassword)}
            disabled={loading}
            autoComplete="new-password"
          />
          {passwordErrors.newPassword && (
            <p className="mt-1 text-xs text-red-400">{passwordErrors.newPassword}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1.5">
            Confirm new password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            className={getInputClass(!!passwordErrors.confirmPassword)}
            disabled={loading}
            autoComplete="new-password"
          />
          {passwordErrors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">{passwordErrors.confirmPassword}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={loading}
          >
            Update password
          </Button>
          {passwordSaved && (
            <span className="text-xs font-medium text-emerald-400">Password updated</span>
          )}
        </div>
      </form>
    </section>
  );
}