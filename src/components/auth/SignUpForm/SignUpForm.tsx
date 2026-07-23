'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { RegisterSchema } from '@shared/types';
import { Button } from '../../ui/Button';

export function SignUpForm() {
  const { register, loading, error: apiError, clearError } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    const result = RegisterSchema.safeParse({ name, email, password });
    if (!result.success) {
      const formatted = result.error.format();
      setFieldErrors({
        name: formatted.name?._errors[0],
        email: formatted.email?._errors[0],
        password: formatted.password?._errors[0],
      });
      return;
    }

    try {
      await register({ name, email, password });
    } catch (err) {
      // API error handled by store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 animate-shake">
          {apiError}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1.5">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder="John Doe"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 bg-dark-900 text-dark-50 placeholder-dark-300 ${
            fieldErrors.name
              ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/10'
              : 'border-dark-500 focus:border-accent-500 focus:ring-accent-500/10'
          }`}
          disabled={loading}
        />
        {fieldErrors.name && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
          }}
          placeholder="name@example.com"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 bg-dark-900 text-dark-50 placeholder-dark-300 ${
            fieldErrors.email
              ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/10'
              : 'border-dark-500 focus:border-accent-500 focus:ring-accent-500/10'
          }`}
          disabled={loading}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1.5">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }}
          placeholder="Minimum 8 characters"
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 bg-dark-900 text-dark-50 placeholder-dark-300 ${
            fieldErrors.password
              ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/10'
              : 'border-dark-500 focus:border-accent-500 focus:ring-accent-500/10'
          }`}
          disabled={loading}
        />
        {fieldErrors.password && (
          <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        loading={loading}
        className="py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
      >
        Create Account
      </Button>
    </form>
  );
}
