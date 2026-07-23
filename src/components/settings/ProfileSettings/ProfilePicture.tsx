'use client';
import React, { useRef } from 'react';
import { UserAvatar } from '../../auth/UserAvatar';
import { Button } from '../../ui/Button';

interface ProfilePictureProps {
  user: {
    name: string;
    avatarUrl?: string;
  };
  loading: boolean;
  avatarUploading: boolean;
  avatarError: string | null;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
}

export function ProfilePicture({
  user,
  loading,
  avatarUploading,
  avatarError,
  onAvatarChange,
  onRemoveAvatar,
}: ProfilePictureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-2xl border border-dark-600 bg-dark-800 p-6">
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
            onChange={onAvatarChange}
          />
          <Button
            variant="primary"
            size="md"
            disabled={loading || avatarUploading}
            loading={avatarUploading}
            onClick={handleButtonClick}
          >
            {avatarUploading ? 'Uploading…' : 'Upload photo'}
          </Button>
          {user.avatarUrl && (
            <Button
              variant="secondary"
              size="md"
              disabled={loading || avatarUploading}
              onClick={onRemoveAvatar}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
      {avatarError && <p className="mt-2 text-xs text-red-400">{avatarError}</p>}
    </div>
  );
}