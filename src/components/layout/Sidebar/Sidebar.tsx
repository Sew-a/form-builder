'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { NAV_ITEMS, SIDEBAR_LOCKED_ICON } from './constants';
import { Button } from '../../ui/Button';

interface SidebarProps {
  showNavigation?: boolean;
}

export function Sidebar({ showNavigation = true }: SidebarProps) {
  const pathname = usePathname();
  const { user, setAuthModalOpen } = useAuthStore();
  const navItems = NAV_ITEMS;

  const renderNavItem = (item: typeof navItems[number]) => {
    const isActive = pathname === item.href;
    const isLocked = item.requireAuth && !user;

    if (isLocked) {
      return (
        <Button
          key={item.name}
          variant="ghost"
          size="md"
          onClick={() => setAuthModalOpen(true, 'signin')}
          className="w-full justify-between rounded-xl px-3 py-2.5 text-sm text-dark-300 text-left"
        >
          <div className="flex items-center space-x-3">
            {item.icon}
            <span>{item.name}</span>
          </div>
          {SIDEBAR_LOCKED_ICON}
        </Button>
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
  };

  const sidebarContent = (
    <>
      {showNavigation && (
        <>
          <div className="px-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-dark-300">Navigation</h2>
          </div>
          <nav className="space-y-1">
            {navItems.map(renderNavItem)}
          </nav>
        </>
      )}
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
          <Button
            variant="primary"
            size="sm"
            fullWidth
            className="rounded-lg py-1.5 shadow-sm hover:shadow-md active:scale-95"
            onClick={() => setAuthModalOpen(true, 'signin')}
          >
            Sign In Now
          </Button>
        </div>
      )}
    </>
  );

  return (
    <aside className="w-64 border-r border-dark-500 bg-dark-900 p-4 hidden md:flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-6">
        {sidebarContent}
      </div>
    </aside>
  );
}
