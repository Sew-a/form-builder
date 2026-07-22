'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { UserAvatar } from '../../auth/UserAvatar';
import { fileToAvatarDataUrl } from '../../../lib/avatarImage';
import {
  UpdateProfileSchema,
  ChangePasswordSchema,
  DeleteAccountSchema,
} from '@shared/types';

export function ProfileSettings() {
  const router = useRouter();
  const {
    user,
    loading,
    error: apiError,
    clearError,
    setAuthModalOpen,
    updateProfile,
    changePassword,
    updateAvatar,
    deleteAccount,
  } = useAuthStore();

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileErrors, setProfileErrors] = useState<{ name?: string; nickname?: string }>({});

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setNickname(user.nickname ?? '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="rounded-2xl border border-dark-600 bg-dark-800 p-10 text-center space-y-4">
        <p className="text-dark-300">Sign in to manage your account settings.</p>
        <button
          type="button"
          onClick={() => setAuthModalOpen(true, 'signin')}
          className="rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-600 transition-all"
        >
          Sign In
        </button>
      </div>
    );
  }

  const inputClass = (hasError: boolean) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm text-dark-50 bg-dark-900 transition-all focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10'
        : 'border-dark-500 focus:border-accent-500 focus:ring-accent-500/10'
    }`;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setProfileSaved(false);
    setProfileErrors({});

    const result = UpdateProfileSchema.safeParse({
      name,
      nickname: nickname.trim() === '' ? '' : nickname.trim(),
    });
    if (!result.success) {
      const formatted = result.error.format();
      setProfileErrors({
        name: formatted.name?._errors[0],
        nickname: formatted.nickname?._errors[0],
      });
      return;
    }

    try {
      await updateProfile(result.data);
      setProfileSaved(true);
    } catch {
      // store handles apiError
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setPasswordSaved(false);
    setPasswordErrors({});

    if (newPassword !== confirmPassword) {
      setPasswordErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    const result = ChangePasswordSchema.safeParse({ currentPassword, newPassword });
    if (!result.success) {
      const formatted = result.error.format();
      setPasswordErrors({
        currentPassword: formatted.currentPassword?._errors[0],
        newPassword: formatted.newPassword?._errors[0],
      });
      return;
    }

    try {
      await changePassword(result.data);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSaved(true);
    } catch {
      // store handles apiError
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setAvatarError(null);
    setAvatarUploading(true);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      await updateAvatar(dataUrl);
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarError(null);
    setAvatarUploading(true);
    try {
      await updateAvatar('');
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Could not remove photo');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);

    const result = DeleteAccountSchema.safeParse({ password: deletePassword });
    if (!result.success) {
      setDeleteError(result.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    try {
      await deleteAccount(result.data);
      setDeleteConfirmOpen(false);
      router.push('/');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Could not delete account');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">Profile settings</h1>
        <p className="mt-1 text-sm text-dark-300">
          Update your profile, password, and account preferences.
        </p>
      </div>

      {apiError && (
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
          {apiError}
        </div>
      )}

      {/* Profile picture */}
      <section className="rounded-2xl border border-dark-600 bg-dark-800 p-6">
        <h2 className="text-sm font-semibold text-dark-100">Profile picture</h2>
        <p className="mt-1 text-xs text-dark-400">JPEG, PNG, or WebP. Images are resized automatically.</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="md" />
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              disabled={loading || avatarUploading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50 transition-all"
            >
              {avatarUploading ? 'Uploading…' : 'Upload photo'}
            </button>
            {user.avatarUrl && (
              <button
                type="button"
                disabled={loading || avatarUploading}
                onClick={handleRemoveAvatar}
                className="rounded-lg border border-dark-500 px-4 py-2 text-sm font-medium text-dark-200 hover:bg-dark-700 disabled:opacity-50 transition-all"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        {avatarError && <p className="mt-2 text-xs text-red-400">{avatarError}</p>}
      </section>

      {/* Name & nickname */}
      <section className="rounded-2xl border border-dark-600 bg-dark-800 p-6">
        <h2 className="text-sm font-semibold text-dark-100">Profile</h2>
        <form onSubmit={handleProfileSubmit} className="mt-4 space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1.5">
              Display name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass(!!profileErrors.name)}
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
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Optional — letters, numbers, _ and -"
              className={inputClass(!!profileErrors.nickname)}
              disabled={loading}
            />
            {profileErrors.nickname && (
              <p className="mt-1 text-xs text-red-400">{profileErrors.nickname}</p>
            )}
          </div>
          <p className="text-xs text-dark-400">Email: {user.email}</p>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50 transition-all"
            >
              Save profile
            </button>
            {profileSaved && (
              <span className="text-xs font-medium text-emerald-400">Saved</span>
            )}
          </div>
        </form>
      </section>

      {/* Password */}
      <section className="rounded-2xl border border-dark-600 bg-dark-800 p-6">
        <h2 className="text-sm font-semibold text-dark-100">Change password</h2>
        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300 mb-1.5">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass(!!passwordErrors.currentPassword)}
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
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass(!!passwordErrors.newPassword)}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass(!!passwordErrors.confirmPassword)}
              disabled={loading}
              autoComplete="new-password"
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-400">{passwordErrors.confirmPassword}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50 transition-all"
            >
              Update password
            </button>
            {passwordSaved && (
              <span className="text-xs font-medium text-emerald-400">Password updated</span>
            )}
          </div>
        </form>
      </section>

      {/* Delete account */}
      <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-sm font-semibold text-red-400">Delete account</h2>
        <p className="mt-1 text-xs text-dark-300 max-w-lg">
          Permanently delete your account and all forms you own. This cannot be undone.
        </p>
        {!deleteConfirmOpen ? (
          <button
            type="button"
            onClick={() => {
              setDeleteConfirmOpen(true);
              setDeletePassword('');
              setDeleteError(null);
            }}
            className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-all"
          >
            Delete my account
          </button>
        ) : (
          <form onSubmit={handleDeleteAccount} className="mt-4 max-w-md space-y-3">
            <p className="text-xs text-red-400 font-medium">Enter your password to confirm.</p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Your password"
              className={inputClass(!!deleteError)}
              disabled={loading}
              autoComplete="current-password"
            />
            {deleteError && <p className="text-xs text-red-400">{deleteError}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                Confirm delete
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => setDeleteConfirmOpen(false)}
                className="rounded-lg border border-dark-500 px-4 py-2 text-sm font-medium text-dark-200 hover:bg-dark-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
