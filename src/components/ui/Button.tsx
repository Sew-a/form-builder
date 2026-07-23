'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'dangerSolid' | 'ghost' | 'ghostDanger';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'iconSm';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent-500 text-white hover:bg-accent-600 shadow-sm hover:shadow-md font-semibold',
  secondary: 'border border-dark-500 text-dark-200 hover:bg-dark-700 font-medium',
  danger: 'border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-semibold',
  dangerSolid: 'bg-red-600 text-white hover:bg-red-500 font-semibold',
  ghost: 'text-dark-300 hover:bg-dark-700 hover:text-dark-100',
  ghostDanger: 'text-dark-300 hover:text-red-400 hover:bg-red-500/10',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs rounded',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
  icon: 'p-1.5 rounded-lg h-8 w-8',
  iconSm: 'p-1 rounded h-6 w-6',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
}
