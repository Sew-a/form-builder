'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';

export function Sidebar() {
  const pathname = usePathname();
  const { user, setAuthModalOpen } = useAuthStore();

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      requireAuth: false,
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      requireAuth: true,
    },
  ];

  return (
    <aside className="w-64 border-r border-dark-500 bg-dark-900 p-4 hidden md:flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-6">
        <div className="px-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-dark-300">Navigation</h2>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isLocked = item.requireAuth && !user;

            if (isLocked) {
              return (
                <button
                  key={item.name}
                  onClick={() => setAuthModalOpen(true, 'signin')}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-dark-300 hover:bg-dark-700 transition-all text-left"
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  <svg className="h-4 w-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent-500/10 text-accent-400'
                    : 'text-dark-100 hover:bg-dark-700 hover:text-dark-50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {!user && (
        <div className="rounded-2xl bg-dark-800 p-4 border border-dark-500 text-center space-y-3 animate-fadeIn">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent-500/10 text-accent-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-dark-50">Unlock Dashboard</p>
            <p className="text-[10px] text-dark-300 mt-0.5">Sign in to start creating dynamic, collaborative forms.</p>
          </div>
          <button
            onClick={() => setAuthModalOpen(true, 'signin')}
            className="w-full rounded-lg bg-accent-500 py-1.5 text-xs font-semibold text-white hover:bg-accent-600 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            Sign In Now
          </button>
        </div>
      )}
    </aside>
  );
}
