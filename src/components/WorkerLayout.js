import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/context/AppStoreContext';

export default function WorkerLayout({ children }) {
  const { currentUser, logout } = useAppStore();

  return (
    <div className="min-h-screen bg-rice-beige-50">
      <header className="bg-white border-b border-rice-beige-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-rice-green-700">Rohan Rice</p>
            <h1 className="text-lg font-serif">Worker Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600 hidden sm:block">{currentUser?.name || 'Worker'}</p>
            <Link href="/" className="btn-ghost text-sm px-3 py-2">
              Website
            </Link>
            <button type="button" onClick={logout} className="btn-primary text-sm px-4 py-2">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
    </div>
  );
}
