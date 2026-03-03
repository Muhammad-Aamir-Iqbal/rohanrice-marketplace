import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import Navigation from './Navigation';
import Footer from './Footer';
import AIHelpWidget from './AIHelpWidget';

export default function Layout({ children }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-rice-beige-200 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-10 h-10 bg-gradient-rice rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif text-rice-green-700">RohanRice</h1>
                <p className="text-xs text-rice-beige-600">Premium Rice Export</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className={`transition ${router.pathname === '/' ? 'text-rice-green-700 font-semibold' : 'text-gray-700 hover:text-rice-green-600'}`}>
                Home
              </Link>
              <Link href="/shop" className={`transition ${router.pathname === '/shop' ? 'text-rice-green-700 font-semibold' : 'text-gray-700 hover:text-rice-green-600'}`}>
                Marketplace
              </Link>
              <Link href="/goals" className={`transition ${router.pathname === '/goals' ? 'text-rice-green-700 font-semibold' : 'text-gray-700 hover:text-rice-green-600'}`}>
                Goals
              </Link>
              <Link href="/about" className={`transition ${router.pathname === '/about' ? 'text-rice-green-700 font-semibold' : 'text-gray-700 hover:text-rice-green-600'}`}>
                About
              </Link>
              <Link href="/contact" className={`transition ${router.pathname === '/contact' ? 'text-rice-green-700 font-semibold' : 'text-gray-700 hover:text-rice-green-600'}`}>
                Contact
              </Link>
            </nav>

            {/* Auth Section */}
            <div className="flex items-center gap-4">
              {session?.user ? (
                <div className="flex items-center gap-4">
                  {session.user.isAdmin && (
                    <Link href="/admin" className="btn-secondary text-sm">
                      Dashboard
                    </Link>
                  )}
                  <span className="text-sm text-gray-700">{session.user.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="btn-ghost text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="btn-primary text-sm">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-rice-green-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-2">
              <Link href="/" className="block px-4 py-2 hover:bg-rice-beige-50 rounded">Home</Link>
              <Link href="/shop" className="block px-4 py-2 hover:bg-rice-beige-50 rounded">Marketplace</Link>
              <Link href="/goals" className="block px-4 py-2 hover:bg-rice-beige-50 rounded">Goals</Link>
              <Link href="/about" className="block px-4 py-2 hover:bg-rice-beige-50 rounded">About</Link>
              <Link href="/contact" className="block px-4 py-2 hover:bg-rice-beige-50 rounded">Contact</Link>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* AI Help Widget */}
      <AIHelpWidget />

      {/* Footer */}
      <Footer />
    </div>
  );
}
