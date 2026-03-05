import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppStore } from '@/context/AppStoreContext';

const adminLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/blog', label: 'Blog Manager' },
  { href: '/admin/analytics', label: 'Visitor Analytics' },
  { href: '/admin/messages', label: 'Contact Messages' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { currentUser, logout } = useAppStore();

  return (
    <div className="min-h-screen bg-rice-beige-50">
      <div className="flex min-h-screen">
        <aside className="hidden lg:block w-64 bg-charcoal text-rice-beige-100 p-5">
          <p className="text-rice-gold-400 text-sm uppercase tracking-wide">Rohan Rice</p>
          <h1 className="mt-1 text-xl font-serif">Admin Panel</h1>

          <nav className="mt-6 space-y-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-sm ${
                  router.pathname === link.href
                    ? 'bg-rice-green-700 text-white'
                    : 'hover:bg-rice-beige-900/20 text-rice-beige-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 border-t border-rice-beige-900/30 pt-4 text-xs text-rice-beige-300">
            <p>{currentUser?.name || 'Admin'}</p>
            <p>{currentUser?.email || '-'}</p>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="border-b border-rice-beige-200 bg-white px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif text-charcoal">Admin Dashboard</h2>
              <p className="text-xs text-gray-500">Manage your complete rice business visually</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="btn-ghost text-sm px-3 py-2">
                View Website
              </Link>
              <button type="button" onClick={logout} className="btn-primary text-sm px-4 py-2">
                Logout
              </button>
            </div>
          </header>

          <div className="lg:hidden bg-white border-b border-rice-beige-200 px-4 py-2 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded text-sm ${
                    router.pathname === link.href
                      ? 'bg-rice-green-700 text-white'
                      : 'bg-rice-beige-100 text-rice-green-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

