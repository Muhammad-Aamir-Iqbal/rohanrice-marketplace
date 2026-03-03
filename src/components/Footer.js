import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4 text-rice-gold-400">RohanRice</h3>
            <p className="text-gray-400 text-sm mb-4">
              Premium rice export marketplace connecting global buyers with premium rice varieties.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" className="text-gray-400 hover:text-rice-gold-400 transition">Twitter</a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-rice-gold-400 transition">LinkedIn</a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-rice-gold-400 transition">Facebook</a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-rice-gold-400">Product</h4>
            <nav className="space-y-3">
              <Link href="/shop" className="text-gray-400 hover:text-white transition text-sm">Marketplace</Link>
              <Link href="/shop#basmati" className="text-gray-400 hover:text-white transition text-sm">Basmati Rice</Link>
              <Link href="/shop#varieties" className="text-gray-400 hover:text-white transition text-sm">All Varieties</Link>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Certifications</a>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-rice-gold-400">Company</h4>
            <nav className="space-y-3">
              <Link href="/about" className="text-gray-400 hover:text-white transition text-sm">About Us</Link>
              <Link href="/goals" className="text-gray-400 hover:text-white transition text-sm">Our Goals</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition text-sm">Contact</Link>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Blog</a>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-rice-gold-400">Legal</h4>
            <nav className="space-y-3">
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Export Compliance</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Cookie Policy</a>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left */}
            <div className="text-gray-400 text-sm">
              <p>© 2026 RohanRice Marketplace. All rights reserved.</p>
              <p className="mt-2 text-xs">Premium rice export marketplace | Certified, Quality-assured, Global Reach</p>
            </div>

            {/* Right - Trust Badges */}
            <div className="flex gap-4 justify-end flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="text-rice-gold-400">✓</span> ISO Certified
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="text-rice-gold-400">✓</span> Export Ready
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="text-rice-gold-400">✓</span> Quality Assured
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
