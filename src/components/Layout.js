import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Footer from './Footer';
import { useAppStore } from '@/context/AppStoreContext';

const publicLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Layout({ children }) {
  const router = useRouter();
  const {
    isAuthenticated,
    isAdmin,
    isCustomer,
    currentUser,
    cartCount,
    logout,
    logVisitorEvent,
    data,
  } = useAppStore();

  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    if (!router.asPath) return;
    logVisitorEvent({
      page: router.asPath,
      action: 'page_visit',
    });
  }, [logVisitorEvent, router.asPath]);

  const businessName = data.settings?.businessName || 'Rohan Rice';

  return (
    <div className="min-h-screen bg-rice-beige-50 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-rice-beige-200 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-gradient-rice text-white flex items-center justify-center font-bold">
                RR
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-rice-green-800 leading-none">{businessName}</p>
                <p className="text-xs text-gray-500">Narowal, Punjab, Pakistan</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-5">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition ${
                    router.pathname === link.href
                      ? 'text-rice-green-700'
                      : 'text-gray-700 hover:text-rice-green-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <Link href="/cart" className="relative btn-ghost" aria-label="Open cart">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2m0 0L7 13h10l2-8H5.4zM7 13l-1 5h13M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
                {isCustomer && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 text-xs rounded-full bg-rice-green-700 text-white flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="btn-secondary text-sm px-4 py-2">
                      Admin Dashboard
                    </Link>
                  )}
                  {!isAdmin && (
                    <>
                      <Link href="/orders" className="btn-ghost text-sm px-3 py-2">
                        My Orders
                      </Link>
                      <Link href="/profile" className="btn-ghost text-sm px-3 py-2">
                        {currentUser?.name?.split(' ')[0] || 'Profile'}
                      </Link>
                    </>
                  )}
                  <button onClick={logout} className="btn-primary text-sm px-4 py-2">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost text-sm px-3 py-2">
                    Login
                  </Link>
                  <Link href="/signup" className="btn-primary text-sm px-4 py-2">
                    Register
                  </Link>
                  <Link href="/admin/login" className="btn-secondary text-sm px-4 py-2">
                    Admin
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className="md:hidden btn-ghost"
              onClick={() => setOpenMobile((state) => !state)}
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {openMobile && (
            <div className="md:hidden border-t border-rice-beige-200 py-3 space-y-2">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-2 py-2 rounded hover:bg-rice-beige-100"
                  onClick={() => setOpenMobile(false)}
                >
                  {link.label}
                </Link>
              ))}

              <Link href="/cart" className="block px-2 py-2 rounded hover:bg-rice-beige-100" onClick={() => setOpenMobile(false)}>
                Cart {isCustomer ? `(${cartCount})` : ''}
              </Link>

              {isAuthenticated ? (
                <>
                  {!isAdmin && (
                    <>
                      <Link href="/orders" className="block px-2 py-2 rounded hover:bg-rice-beige-100" onClick={() => setOpenMobile(false)}>
                        My Orders
                      </Link>
                      <Link href="/profile" className="block px-2 py-2 rounded hover:bg-rice-beige-100" onClick={() => setOpenMobile(false)}>
                        Profile
                      </Link>
                    </>
                  )}
                  {isAdmin && (
                    <Link href="/admin" className="block px-2 py-2 rounded hover:bg-rice-beige-100" onClick={() => setOpenMobile(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setOpenMobile(false);
                    }}
                    className="block w-full text-left px-2 py-2 rounded hover:bg-rice-beige-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-2 py-2 rounded hover:bg-rice-beige-100" onClick={() => setOpenMobile(false)}>
                    Login
                  </Link>
                  <Link href="/signup" className="block px-2 py-2 rounded hover:bg-rice-beige-100" onClick={() => setOpenMobile(false)}>
                    Register
                  </Link>
                  <Link href="/admin/login" className="block px-2 py-2 rounded hover:bg-rice-beige-100" onClick={() => setOpenMobile(false)}>
                    Admin Login
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}

