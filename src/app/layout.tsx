import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Form Builder',
  description: 'Collaborative drag & drop form builder',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-900 text-dark-50 font-body">{children}</body>
    </html>
  );
}
