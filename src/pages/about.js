import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About RohanRice - Premium Rice Exporter</title>
        <meta name="description" content="RohanRice: 50+ years of farming heritage, sustainable practices, certified export-ready rice with global reach to 50+ countries." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-premium py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-serif font-bold text-charcoal mb-6">
            About RohanRice
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            50+ years of farming heritage. Certified quality. Global reach. Investor-credible rice exporter connecting farms to world markets.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Mission */}
            <div className="card-premium">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To provide world-class, certified premium rice to global markets through sustainable farming practices, rigorous quality control, and transparent business practices that honor both farmers and consumers.
              </p>
            </div>

            {/* Vision */}
            <div className="card-premium">
              <div className="text-5xl mb-4">🌍</div>
              <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To become the world's most trusted rice export marketplace—connecting certified farmers with international buyers through technology, transparency, and trust.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mt-12 pt-12 border-t border-rice-beige-200">
            <h2 className="text-3xl font-serif font-bold text-charcoal mb-8 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: '🌾', title: 'Authenticity', desc: 'True farming heritage, honest practices' },
                { icon: '✓', title: 'Quality', desc: 'Certified, tested, never compromised' },
                { icon: '🤝', title: 'Trust', desc: 'Transparent dealings with all partners' },
                { icon: '🌍', title: 'Sustainability', desc: 'Farm to table, responsibly sourced' },
              ].map((value, idx) => (
                <div key={idx} className="card text-center">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="font-bold text-rice-green-700 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Heritage */}
      <section className="py-16 md:py-24 bg-rice-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-charcoal mb-12 text-center">
            50+ Years of Farming Heritage
          </h2>

          <div className="space-y-12">
            {/* Timeline */}
            {[
              {
                year: '1975',
                title: 'Heritage Begins',
                desc: 'Established family farming operations across Punjab and Haryana regions.',
              },
              {
                year: '1995',
                title: 'Modernization',
                desc: 'Introduced advanced farming techniques while maintaining traditional quality standards.',
              },
              {
                year: '2010',
                title: 'Export Excellence',
                desc: 'Achieved ISO 9001 and FDA certifications. Began exporting to international markets.',
              },
              {
                year: '2020',
                title: 'Digital Marketplace',
                desc: 'Launched RohanRice marketplace to connect farmers directly with global buyers.',
              },
              {
                year: '2026',
                title: 'Global Leader',
                desc: 'Serving 50+ countries with 1000+ tons annual supply of certified premium rice.',
              },
            ].map((event, idx) => (
              <div key={idx} className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-rice text-white font-bold text-lg">
                    {event.year.slice(-2)}
                  </div>
                </div>
                <div className="flex-grow pt-2">
                  <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">{event.title}</h3>
                  <p className="text-gray-700">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance & Certifications */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-charcoal mb-12 text-center">
            Compliance & Certifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              {
                cert: 'ISO 9001:2015',
                title: 'Quality Management System',
                desc: 'International standards for consistent quality production and continuous improvement.',
              },
              {
                cert: 'FDA Approved',
                title: 'Food Safety',
                desc: 'All rice meets US Food and Drug Administration safety standards.',
              },
              {
                cert: 'FSSC 22000',
                title: 'Food Safety System',
                desc: 'Comprehensive food safety management certification for export.',
              },
              {
                cert: 'Organic Certified',
                title: 'Sustainable Farming',
                desc: 'Selected varieties produced using certified organic farming methods.',
              },
            ].map((item, idx) => (
              <div key={idx} className="card">
                <div className="text-rice-gold-500 font-bold text-sm mb-2 uppercase">
                  {item.cert}
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Export Ready */}
          <div className="bg-gradient-rice text-white rounded-lg p-12 text-center">
            <h3 className="text-3xl font-serif font-bold mb-4">Export-Ready Infrastructure</h3>
            <p className="text-lg mb-8 opacity-95">
              Complete supply chain compliance with international standards, documentation, and logistics support.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="font-bold mb-2">Quality Testing</div>
                <p className="opacity-90">Every batch tested in certified labs</p>
              </div>
              <div>
                <div className="font-bold mb-2">Documentation</div>
                <p className="opacity-90">Complete export paperwork and certificates</p>
              </div>
              <div>
                <div className="font-bold mb-2">Logistics</div>
                <p className="opacity-90">Global shipping & customs clearance support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Network */}
      <section className="py-16 md:py-24 bg-rice-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-charcoal mb-12 text-center">
            Our Sourcing Network
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                region: 'Punjab',
                farms: '500+ Certified Farms',
                specialty: 'Basmati & Premium Varieties',
                production: '600 tons/year',
              },
              {
                region: 'Haryana',
                farms: '300+ Certified Farms',
                specialty: 'Super Kernel & Long Grain',
                production: '300 tons/year',
              },
              {
                region: 'Andhra Pradesh',
                farms: '200+ Certified Farms',
                specialty: 'IRRI Varieties & Sella Rice',
                production: '200 tons/year',
              },
            ].map((source, idx) => (
              <div key={idx} className="card-premium">
                <div className="text-4xl mb-4">🚜</div>
                <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">{source.region}</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Certified Farms: </span>
                    <span className="font-bold text-rice-green-700">{source.farms}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Specialty: </span>
                    <span className="font-bold text-rice-green-700">{source.specialty}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Annual Production: </span>
                    <span className="font-bold text-rice-green-700">{source.production}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold text-charcoal mb-6">Leadership Team</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Combining 50+ years of farming expertise with modern export practices.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rajesh Kumar', title: 'Founder & Chairman', expertise: '50 years farming' },
              { name: 'Priya Singh', title: 'CEO & Export Director', expertise: '20 years international trade' },
              { name: 'Suresh Patel', title: 'Quality Manager', expertise: 'ISO & FDA Certifications' },
            ].map((member, idx) => (
              <div key={idx} className="card">
                <div className="w-20 h-20 bg-gradient-rice rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                  👤
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-1">{member.name}</h3>
                <p className="text-rice-green-700 font-semibold text-sm mb-2">{member.title}</p>
                <p className="text-gray-600 text-sm">{member.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-rice text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold mb-6">Ready to Source Premium Rice?</h2>
          <p className="text-xl mb-8 opacity-95">
            Join 500+ international buyers. Certified. Trusted. Export-Ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="bg-white text-rice-green-700 hover:bg-rice-beige-50 font-semibold px-8 py-4 rounded-lg transition">
              Browse Marketplace
            </Link>
            <Link href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-rice-green-700 font-semibold px-8 py-4 rounded-lg transition">
              Contact Sales Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
