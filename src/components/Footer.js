import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/context/AppStoreContext';

export default function Footer() {
  const { data } = useAppStore();

  const settings = data.settings || {};

  return (
    <footer className="bg-charcoal text-rice-beige-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif text-rice-gold-400 mb-2">{settings.businessName || 'Rohan Rice'}</h3>
            <p className="text-sm text-rice-beige-200">
              Rohan Rice is a trusted rice supplier based in Narowal, Punjab, Pakistan, dedicated to delivering premium rice products with quality and reliability.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-rice-gold-400 mb-2">Quick Links</h4>
            <div className="space-y-1 text-sm">
              <Link href="/shop" className="block hover:text-white">Shop</Link>
              <Link href="/blog" className="block hover:text-white">Blog</Link>
              <Link href="/about" className="block hover:text-white">About Us</Link>
              <Link href="/contact" className="block hover:text-white">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-rice-gold-400 mb-2">Business Line</h4>
            <p className="text-sm text-rice-beige-200">{settings.footerTagline || 'Premium Rice. Trusted Quality.'}</p>
            <p className="text-xs mt-4 text-rice-beige-300">Owner: {settings.ownerName || 'Zeeshan Ali'}</p>
            <p className="text-xs text-rice-beige-300">Location: {settings.location || 'Narowal, Punjab, Pakistan'}</p>
            <p className="text-xs mt-3 text-rice-beige-300">
              {settings.founderCredit || 'This platform was founded and built by the founder.'}
            </p>
            <p className="text-xs text-rice-beige-300">
              {settings.techRights || 'All technical architecture, source code, and platform rights are reserved by the founder.'}
            </p>
          </div>
        </div>

        <div className="border-t border-rice-beige-900/30 mt-8 pt-5 text-xs text-rice-beige-300 flex flex-col md:flex-row gap-3 md:justify-between">
          <p>© {new Date().getFullYear()} {settings.businessName || 'Rohan Rice'}. All rights reserved.</p>
          <p>Pure Grains. Honest Trade. Trusted Quality.</p>
        </div>
      </div>
    </footer>
  );
}

