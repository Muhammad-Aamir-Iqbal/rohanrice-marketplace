import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppStore } from '@/context/AppStoreContext';

const navGroups = [
  {
    id: 'overview',
    label: 'Overview',
    links: [
      { href: '/admin', label: 'Dashboard' },
      { href: '/admin/orders', label: 'Orders' },
      { href: '/admin/payments', label: 'Payments' },
      { href: '/admin/workers', label: 'Workers' },
      { href: '/admin/stock', label: 'Stock' },
      { href: '/admin/ledger', label: 'Ledger' },
      { href: '/admin/fraud-alerts', label: 'Fraud Alerts' },
    ],
  },
  {
    id: 'catalog',
    label: 'Catalog',
    links: [
      { href: '/admin/products', label: 'Products' },
      { href: '/admin/categories', label: 'Categories' },
      { href: '/admin/blog', label: 'Blog Manager' },
      { href: '/admin/reviews', label: 'Reviews' },
    ],
  },
  {
    id: 'users',
    label: 'Users & Insights',
    links: [
      { href: '/admin/customers', label: 'Customers' },
      { href: '/admin/analytics', label: 'Visitor Analytics' },
      { href: '/admin/messages', label: 'Contact Messages' },
      { href: '/admin/settings', label: 'Settings' },
    ],
  },
];

const collectAllLinks = () => navGroups.flatMap((group) => group.links);

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { currentUser, logout } = useAppStore();

  const [expanded, setExpanded] = useState({
    overview: true,
    catalog: true,
    users: true,
  });

  const allLinks = useMemo(() => collectAllLinks(), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rice-beige-50 to-rice-green-50">
      <div className="flex min-h-screen">
        <aside className="hidden lg:block w-72 border-r border-rice-beige-200 bg-white/95 backdrop-blur-sm p-5 shadow-soft">
          <p className="text-rice-green-700 text-xs uppercase tracking-[0.2em] font-semibold">Rohan Rice</p>
          <h1 className="mt-1 text-2xl font-serif text-charcoal">Admin Console</h1>
          <p className="text-xs text-gray-500 mt-1">Visual operations only. No terminal required.</p>

          <nav className="mt-6 space-y-3">
            {navGroups.map((group) => (
              <div key={group.id} className="rounded-lg border border-rice-beige-200 bg-white">
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => ({ ...prev, [group.id]: !prev[group.id] }))}
                  className="w-full px-3 py-2 flex items-center justify-between text-left text-sm font-semibold text-rice-green-800 hover:bg-rice-green-50 rounded-lg"
                >
                  <span>{group.label}</span>
                  <span className={`transition-transform ${expanded[group.id] ? 'rotate-90' : 'rotate-0'}`} aria-hidden="true">
                    ›
                  </span>
                </button>
                {expanded[group.id] && (
                  <div className="px-2 pb-2 space-y-1">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-3 py-2 rounded-md text-sm ${
                          router.pathname === link.href
                            ? 'bg-rice-green-600 text-white shadow-soft'
                            : 'hover:bg-rice-beige-100 text-rice-green-900'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-8 rounded-lg bg-rice-green-50 border border-rice-green-100 p-3 text-xs text-rice-green-900">
            <p className="font-semibold">{currentUser?.name || 'Admin'}</p>
            <p>{currentUser?.email || '-'}</p>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="border-b border-rice-beige-200 bg-white/95 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif text-charcoal">Admin Dashboard</h2>
              <p className="text-xs text-rice-green-700">Secure order, payments, stock, worker and ledger control.</p>
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
              {allLinks.map((link) => (
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
