import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t border-dark-500 bg-dark-900 py-4 px-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-dark-300">
        <div>
          <span className="font-logo text-sm font-semibold text-dark-100">FORM-BUILDER</span>
          <span className="mx-2">&middot;</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-dark-100 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-dark-100 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-dark-100 transition-colors">Documentation</a>
        </div>
      </div>
    </footer>
  );
}
