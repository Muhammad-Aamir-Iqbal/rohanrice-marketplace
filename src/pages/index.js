'use client';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const riceVarieties = [
    {
      id: 1,
      name: 'Premium Basmati',
      image: '🌾',
      description: 'Superior long-grain basmati rice',
      price: '$1.20/kg',
      stock: '500+ tons',
      tag: 'Best Seller',
    },
    {
      id: 2,
      name: '1121 Basmati',
      image: '🌾',
      description: 'Extra-long grain basmati',
      price: '$1.35/kg',
      stock: '300+ tons',
      tag: 'Premium',
    },
    {
      id: 3,
      name: 'Super Kernel',
      image: '🌾',
      description: 'High-quality long-grain rice',
      price: '$0.95/kg',
      stock: '1000+ tons',
      tag: 'Popular',
    },
  ];

  const certifications = [
    { name: 'ISO 9001:2015', desc: 'Quality Management' },
    { name: 'FDA Approved', desc: 'Food Safety' },
    { name: 'FSSC 22000', desc: 'Food Safety System' },
    { name: 'Organic Certified', desc: 'Sustainable Farming' },
  ];

  return (
    <>
      <Head>
        <title>RohanRice - Premium Rice Export Marketplace | Global Reach</title>
        <meta name="description" content="Premium rice exporter connecting global markets with quality rice varieties. Certified, bulk orders, export-ready. From farms to international markets." />
        <meta name="keywords" content="basmati rice, premium rice exporter, global rice supplier, certified rice, rice export" />
        <meta name="og:title" content="RohanRice - Premium Rice Export Marketplace" />
        <meta name="og:description" content="Premium rice export marketplace with certified varieties and global reach." />
        <meta name="og:type" content="website" />
        <meta name="og:image" content="/rice-hero.jpg" />
      </Head>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-premium overflow-hidden">
        <div className="absolute inset-0 bg-rice-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 bg-rice-gold-100 text-rice-gold-700 rounded-full text-sm font-semibold">
              ✨ Premium Rice Export Marketplace
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-charcoal mb-6">
              From Farms to
              <span className="text-gradient"> International Markets</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              Premium rice export marketplace connecting certified rice with global buyers. Cultivating purity. Exporting excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="btn-primary px-8 py-4 text-lg">
                Browse Marketplace →
              </Link>
              <Link href="/contact" className="btn-secondary px-8 py-4 text-lg">
                Request Bulk Quote
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-rice-beige-200">
            {[
              { value: '50+ Years', label: 'Farming Heritage' },
              { value: '1000+ Tons', label: 'Annual Supply' },
              { value: '50+ Countries', label: 'Global Reach' },
              { value: '4.9/5', label: 'Customer Rating' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-serif font-bold text-rice-green-700 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Varieties */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-charcoal mb-4">Premium Rice Varieties</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Handpicked rice varieties from certified farms, quality-assured and export-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {riceVarieties.map((rice) => (
              <div key={rice.id} className="card-premium group hover:shadow-premium transition-all">
                <div className="mb-4">
                  <span className="badge badge-gold">{rice.tag}</span>
                </div>
                <div className="text-6xl mb-4 text-center">{rice.image}</div>
                <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">{rice.name}</h3>
                <p className="text-gray-600 mb-4">{rice.description}</p>
                <div className="space-y-2 mb-6 pb-6 border-b border-rice-beige-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per kg:</span>
                    <span className="font-bold text-rice-green-700">{rice.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Stock:</span>
                    <span className="font-bold text-rice-green-700">{rice.stock}</span>
                  </div>
                </div>
                <Link href="/shop" className="btn-primary w-full text-center">
                  View Details
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop" className="text-rice-green-700 hover:text-rice-green-900 font-semibold text-lg">
              View All Varieties →
            </Link>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 md:py-24 bg-rice-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-charcoal mb-4">Export Trust & Compliance</h2>
            <p className="text-gray-600 text-lg">Certified and compliant with international standards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {certifications.map((cert, idx) => (
              <div key={idx} className="card text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="font-bold text-rice-green-700 mb-2">{cert.name}</h3>
                <p className="text-gray-600 text-sm">{cert.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-rice text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-serif font-bold mb-3">Ready for Export</h3>
            <p className="mb-6">All rice is certified, quality-verified, and ready for international shipment.</p>
            <Link href="/contact" className="bg-white text-rice-green-700 hover:bg-rice-beige-50 font-semibold px-8 py-3 rounded-lg inline-block transition">
              Inquire Now
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌾',
                title: 'Sourced from Heritage Farms',
                desc: 'Over 50 years of farming expertise and sustainable practices.',
              },
              {
                icon: '✓',
                title: 'Quality Assured',
                desc: 'Each batch tested and verified for quality, purity, and safety.',
              },
              {
                icon: '🚀',
                title: 'Global Logistics',
                desc: 'Fast shipping to 50+ countries with export documentation.',
              },
            ].map((item, idx) => (
              <div key={idx} className="card">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-charcoal mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-rice text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold mb-6">Ready to Source Premium Rice?</h2>
          <p className="text-xl mb-8 opacity-95">
            Join 500+ international buyers sourcing from RohanRice. Certified, reliable, and ready for export.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="bg-white text-rice-green-700 hover:bg-rice-beige-50 font-semibold px-8 py-4 rounded-lg transition">
              Browse Marketplace
            </Link>
            <Link href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-rice-green-700 font-semibold px-8 py-4 rounded-lg transition">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
