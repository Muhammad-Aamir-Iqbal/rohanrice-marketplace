import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navigation() {
  const router = useRouter();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Marketplace', href: '/shop' },
    { name: 'Goals', href: '/goals' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="flex items-center gap-8">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={`transition ${
            router.pathname === link.href
              ? 'text-rice-green-700 font-semibold'
              : 'text-gray-700 hover:text-rice-green-600'
          }`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}

