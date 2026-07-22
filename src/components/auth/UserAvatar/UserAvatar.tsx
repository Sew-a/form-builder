'use client';

import React from 'react';
import { getDisplayInitials } from '../../../lib/avatarImage';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-20 w-20 text-2xl',
};

export function UserAvatar({ name, avatarUrl, size = 'sm', className = '' }: UserAvatarProps) {
  const sizeClass = sizeClasses[size];

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        className={`rounded-full object-cover bg-slate-100 shadow-inner ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 font-semibold text-white shadow-inner ${sizeClass} ${className}`}
      aria-hidden
    >
      {getDisplayInitials(name)}
    </div>
  );
}
