import React from 'react';

export const commonInputClasses = "w-full rounded-lg border border-dark-500 bg-dark-800 px-3 py-2.5 text-sm text-dark-50 placeholder-dark-300 transition-all focus:outline-none focus:ring-2 focus:border-accent-500 focus:ring-accent-500/10";

export function BaseInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${commonInputClasses} ${className || ''}`} {...props} />;
}

export function BaseTextArea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`${commonInputClasses} min-h-[100px] resize-y ${className || ''}`}
      {...props}
    />
  );
}

export function BaseSelect({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${commonInputClasses} ${className || ''}`} {...props}>
      {children}
    </select>
  );
}

export function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`block text-sm font-medium text-dark-100 mb-1.5 ${className}`}>
      {children}
    </label>
  );
}