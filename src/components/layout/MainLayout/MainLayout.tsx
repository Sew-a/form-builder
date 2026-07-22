'use client';

import React, { useEffect } from 'react';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { Footer } from '../Footer';
import { AuthModal } from '../../auth/AuthModal';
import { useAuthStore } from '../../../store/useAuthStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const checkUser = useAuthStore((s) => s.checkUser);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Footer />
      <AuthModal />
    </div>
  );
}
