'use client';

import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { SignInForm } from '../SignInForm';
import { SignUpForm } from '../SignUpForm';
import { Button } from '../../ui/Button';

export function AuthModal() {
  const { authModalOpen, authModalTab, setAuthModalOpen } = useAuthStore();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAuthModalOpen(false);
    };
    if (authModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, setAuthModalOpen]);

  if (!authModalOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setAuthModalOpen(false);
    }
  };

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-dark-800 p-6 shadow-xl border border-dark-500 transition-all duration-300 transform scale-100 animate-scaleIn"
      >
        <div className="flex items-center justify-between border-b border-dark-600 pb-4 mb-5">
          <div className="flex space-x-6 text-sm font-semibold">
            <button
              onClick={() => setAuthModalOpen(true, 'signin')}
              className={`pb-4 transition-all relative ${
                authModalTab === 'signin'
                  ? 'text-accent-400 font-bold'
                  : 'text-dark-300 hover:text-dark-100'
              }`}
            >
              Sign In
              {authModalTab === 'signin' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500 rounded-full animate-slideIn" />
              )}
            </button>
            <button
              onClick={() => setAuthModalOpen(true, 'signup')}
              className={`pb-4 transition-all relative ${
                authModalTab === 'signup'
                  ? 'text-accent-400 font-bold'
                  : 'text-dark-300 hover:text-dark-100'
              }`}
            >
              Sign Up
              {authModalTab === 'signup' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500 rounded-full animate-slideIn" />
              )}
            </button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAuthModalOpen(false)}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
          />
        </div>

        <div className="space-y-4">
          {authModalTab === 'signin' ? <SignInForm /> : <SignUpForm />}
        </div>
      </div>
    </div>
  );
}
