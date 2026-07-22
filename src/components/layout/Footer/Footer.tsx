import React from 'react';
import { FOOTER_BRAND, FOOTER_LINKS } from './constants';

export function Footer() {
  return (
    <footer className="w-full border-t border-dark-500 bg-dark-900 py-4 px-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-dark-300">
        <div>
          <span className="font-logo text-sm font-semibold text-dark-100">{FOOTER_BRAND}</span>
          <span className="mx-2">&middot;</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex space-x-4">
          {FOOTER_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-dark-100 transition-colors">{link.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
