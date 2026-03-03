import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Goals() {
  return (
    <>
      <Head>
        <title>Our Goals - RohanRice Export Vision</title>
        <meta name="description" content="RohanRice goals: Global expansion, sustainable farming, certified quality rice export to 100+ countries by 2030." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-premium py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-serif font-bold text-charcoal mb-6">
            Our Export Vision
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Strategic goals driving RohanRice toward becoming the world's leading certified rice exporter.
          </p>
        </div>
      </section>

      {/* 2026 Goals */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-charcoal mb-12 text-center">
            2026 Targets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '🌍',
                title: 'Expand to 75 Countries',
                desc: 'Establish export presence in all major rice-consuming nations across Asia, Europe, Africa, and Americas.',
                progress: 68,
              },
              {
                icon: '📊',
                title: '2500 Tons Annual Supply',
                desc: 'Scale production capacity while maintaining ISO certified quality standards.',
                progress: 40,
              },
              {
                icon: '🔬',
                title: 'Advanced Quality Labs',
                desc: 'Invest in state-of-the-art testing facilities for rice analysis and protein profiling.',
                progress: 75,
              },
              {
                icon: '💰',
                title: '₹500 Cr Annual Revenue',
                desc: 'Achieve significant revenue milestone through market expansion and direct export model.',
                progress: 35,
              },
            ].map((goal, idx) => (
              <div key={idx} className="card-premium">
                <div className="text-5xl mb-4">{goal.icon}</div>
                <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">{goal.title}</h3>
                <p className="text-gray-600 mb-6">{goal.desc}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-rice-beige-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-rice h-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2030 Vision */}
      <section className="py-16 md:py-24 bg-rice-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-charcoal mb-12 text-center">
            2030 Vision
          </h2>

          <div className="space-y-8">
            {[
              {
                goal: 'Global Market Leader',
                desc: 'Become top 3 rice exporter globally with operations in 100+ countries, serving millions of families daily.',
              },
              {
                goal: 'Sustainable Farming Network',
                desc: 'Partner with 1000+ certified organic farms using zero-waste, eco-friendly agricultural practices.',
              },
              {
                goal: 'Technology-Driven Export',
                desc: 'AI-powered quality control, blockchain-based supply chain transparency, and smart logistics.',
              },
              {
                goal: 'Farmer Prosperity Program',
                desc: 'Ensure farming community earns premium prices through direct export model, eliminating middlemen.',
              },
              {
                goal: 'International Standards',
                desc: 'Compliance with every major global food certification - Halal, Kosher, Vegan, GMO-Free, etc.',
              },
              {
                goal: 'Research & Development',
                desc: 'Invest in rice variety development optimized for climate resilience and nutritional value.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-rice text-white font-bold text-lg">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-charcoal mb-2">{item.goal}</h3>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Goals */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-charcoal mb-12 text-center">
            Social & Environmental Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                metric: '5000+ Farmers',
                desc: 'Direct partnerships providing fair-trade premium pricing',
                icon: '👨‍🌾',
              },
              {
                metric: '1M+ Families',
                desc: 'Daily supply of nutritious rice spanning across continents',
                icon: '👨‍👩‍👧‍👦',
              },
              {
                metric: '50% Carbon Neutral',
                desc: 'Target emissions reduction through sustainable farming by 2030',
                icon: '🌱',
              },
            ].map((impact, idx) => (
              <div key={idx} className="card text-center">
                <div className="text-5xl mb-4">{impact.icon}</div>
                <h3 className="text-2xl font-bold text-rice-green-700 mb-2">{impact.metric}</h3>
                <p className="text-gray-600">{impact.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Opportunity */}
      <section className="py-16 md:py-24 bg-gradient-rice text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 inline-block px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-semibold">
            💼 Investment Opportunity
          </div>
          <h2 className="text-4xl font-serif font-bold mb-6">
            Join the Rice Revolution
          </h2>
          <p className="text-xl mb-8 opacity-95">
            RohanRice is seeking investment for expansion, technology, and farmer partnerships. Join us in building the world's most trusted rice marketplace.
          </p>
           <Link href="/contact" className="bg-white text-rice-green-700 hover:bg-rice-beige-50 font-semibold px-8 py-4 rounded-lg inline-block transition">
            Investor Inquiry →
          </Link>
        </div>
      </section>
    </>
  );
}
