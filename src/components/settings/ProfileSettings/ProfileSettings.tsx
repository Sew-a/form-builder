'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { fileToAvatarDataUrl } from '../../../lib/avatarImage';
import {
  UpdateProfileSchema,
  ChangePasswordSchema,
  DeleteAccountSchema,
} from '@shared/types';
import { ProfilePicture } from './ProfilePicture';
import { ProfileForm } from './ProfileForm';
import { PasswordForm } from './PasswordForm';
import { DeleteAccountSection } from './DeleteAccountSection';

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

      <ProfilePicture
        user={user!}
        loading={loading}
        avatarUploading={avatarUploading}
        avatarError={avatarError}
        onAvatarChange={handleAvatarChange}
        onRemoveAvatar={handleRemoveAvatar}
      />

      <ProfileForm
        name={name}
        nickname={nickname}
        loading={loading}
        profileSaved={profileSaved}
        profileErrors={profileErrors}
        email={user!.email}
        onNameChange={setName}
        onNicknameChange={setNickname}
        onSubmit={handleProfileSubmit}
        getInputClass={inputClass}
      />

      <PasswordForm
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        loading={loading}
        passwordSaved={passwordSaved}
        passwordErrors={passwordErrors}
        onCurrentPasswordChange={setCurrentPassword}
        onNewPasswordChange={setNewPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onSubmit={handlePasswordSubmit}
        getInputClass={inputClass}
      />

      <DeleteAccountSection
        deleteConfirmOpen={deleteConfirmOpen}
        deletePassword={deletePassword}
        deleteError={deleteError}
        loading={loading}
        onDeleteClick={() => {
          setDeleteConfirmOpen(true);
          setDeletePassword('');
          setDeleteError(null);
        }}
        onPasswordChange={setDeletePassword}
        onCancel={() => setDeleteConfirmOpen(false)}
        onSubmit={handleDeleteAccount}
        getInputClass={inputClass}
      />
    </div>
  );
}
