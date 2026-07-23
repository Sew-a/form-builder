"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/useAuthStore";
import { UserAvatar } from "../../auth/UserAvatar";
import { ROUTES } from "../../../lib/routes";
import { DROPDOWN_LINKS } from "./constants";
import { Button } from "../../ui/Button";

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`h-4 w-4 text-dark-200 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export function Header() {
  const router = useRouter();
  const { user, setAuthModalOpen, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.nickname || user?.name || "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-500 bg-dark-900/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href={ROUTES.home} className="flex items-center group">
          <span className="font-logo text-2xl font-bold tracking-tight text-dark-50 transition-all group-hover:text-accent-400">
            FORM-BUILDER
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative flex items-center gap-1" ref={dropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(ROUTES.settings.profile)}
                className="flex items-center space-x-3 rounded-full py-1.5 pl-2 pr-2 hover:bg-dark-700 border border-transparent hover:border-dark-500 focus:outline-none"
                aria-label="Profile settings"
              >
                <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="sm" />
                <div className="hidden text-left md:block max-w-[140px]">
                  <p className="text-xs font-semibold text-dark-50 line-clamp-1">{displayName}</p>
                  <p className="text-[10px] text-dark-200 line-clamp-1">{user.email}</p>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="rounded-full border border-transparent hover:border-dark-500"
                aria-label="Account menu"
                aria-expanded={dropdownOpen}
                icon={<ChevronIcon open={dropdownOpen} />}
              />

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 origin-top-right rounded-xl bg-dark-800 p-1 shadow-lg ring-1 ring-dark-500 border border-dark-500 focus:outline-none animate-scaleIn">
                  <div className="px-3 py-2 border-b border-dark-600 md:hidden">
                    <p className="text-sm font-semibold text-dark-50">{displayName}</p>
                    <p className="text-xs text-dark-200">{user.email}</p>
                  </div>
                  {DROPDOWN_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-dark-100 hover:bg-dark-700 hover:text-dark-50 transition-all"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Button
                    variant="ghostDanger"
                    size="md"
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="w-full justify-start rounded-lg px-3 py-2 text-sm font-medium"
                  >
                    Log Out
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAuthModalOpen(true, "signin")}
                className="text-sm font-medium text-dark-100 hover:text-dark-50"
              >
                Sign In
              </Button>
              <Link
                href={ROUTES.dashboard}
                className="px-4 py-1.8 text-sm font-semibold text-dark-100 hover:text-dark-50 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
