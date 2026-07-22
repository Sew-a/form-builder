'use client';

import React, { useEffect } from 'react';
import { Header } from '../Header';
import { AuthModal } from '../../auth/AuthModal';
import { useAuthStore } from '../../../store/useAuthStore';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const checkUser = useAuthStore((s) => s.checkUser);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Header />
      <main className="flex-1">{children}</main>
      <AuthModal />
    </div>
  );
}