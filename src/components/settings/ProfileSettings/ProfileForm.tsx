'use client';
import React from 'react';
import { Button } from '../../ui/Button';

interface ProfileFormProps {
  name: string;
  nickname: string;
  loading: boolean;
  profileSaved: boolean;
  profileErrors: { name?: string; nickname?: string };
  email: string;
  onNameChange: (value: string) => void;
  onNicknameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  getInputClass: (hasError: boolean) => string;
}

export function ProfileForm({
  name,
  nickname,
  loading,
  profileSaved,
  profileErrors,
  email,
  onNameChange,
  onNicknameChange,
  onSubmit,
  getInputClass,
}: ProfileFormProps) {
  return (
    <section className="rounded-2xl border border-dark-600 bg-dark-800 p-6">
      <h2 className="text-sm font-semibold text-dark-100">Profile</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4 max-w-md">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1.5">
            Display name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className={getInputClass(!!profileErrors.name)}
            disabled={loading}
          />
          {profileErrors.name && (
            <p className="mt-1 text-xs text-red-400">{profileErrors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1.5">
            Nickname
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            placeholder="Optional — letters, numbers, _ and -"
            className={getInputClass(!!profileErrors.nickname)}
            disabled={loading}
          />
          {profileErrors.nickname && (
            <p className="mt-1 text-xs text-red-400">{profileErrors.nickname}</p>
          )}
        </div>
        <p className="text-xs text-dark-400">Email: {email}</p>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={loading}
          >
            Save profile
          </Button>
          {profileSaved && (
            <span className="text-xs font-medium text-emerald-400">Saved</span>
          )}
        </div>
      </form>
    </section>
  );
}