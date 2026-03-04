import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Shop() {
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [filterStock, setFilterStock] = useState('all');

  const riceData = [
    {
      id: 1,
      name: 'Premium Basmati',
      category: 'Basmati',
      price: 1.20,
      stock: 500,
      rating: 4.9,
      image: '🌾',
      description: 'Superior long-grain basmati rice with exceptional aroma and delicate texture.',
      specifications: {
        length: '8.3 mm',
        moisture: '12%',
        protein: '8.2%',
        broken: '< 2%',
      },
      origin: 'Punjab, India',
      packaging: '1kg, 5kg, 25kg, 50kg',
      certifications: ['ISO 9001', 'FDA Approved'],
      minOrder: 100,
    },
    {
      id: 2,
      name: '1121 Basmati',
      category: 'Basmati',
      price: 1.35,
      stock: 300,
      rating: 4.8,
      image: '🌾',
      description: 'Extra-long grain basmati rice, premium quality with distinct aroma.',
      specifications: {
        length: '8.8 mm',
        moisture: '11.5%',
        protein: '8.5%',
        broken: '< 2%',
      },
      origin: 'Punjab, India',
      packaging: '1kg, 5kg, 25kg, 50kg',
      certifications: ['ISO 9001', 'FDA Approved', 'FSSC 22000'],
      minOrder: 100,
    },
    {
      id: 3,
      name: 'Super Kernel',
      category: 'Long Grain',
      price: 0.95,
      stock: 1000,
      rating: 4.7,
      image: '🌾',
      description: 'High-quality long-grain rice, versatile for various cuisines.',
      specifications: {
        length: '7.5 mm',
        moisture: '12.5%',
        protein: '8.0%',
        broken: '< 3%',
      },
      origin: 'Haryana, India',
      packaging: '1kg, 5kg, 25kg, 50kg',
      certifications: ['ISO 9001', 'FDA Approved'],
      minOrder: 50,
    },
    {
      id: 4,
      name: 'IRRI-6 Rice',
      category: 'Long Grain',
      price: 0.75,
      stock: 800,
      rating: 4.6,
      image: '🌾',
      description: 'Economical long-grain rice, excellent for bulk export.',
      specifications: {
        length: '6.8 mm',
        moisture: '13%',
        protein: '7.8%',
        broken: '< 4%',
      },
      origin: 'Andhra Pradesh, India',
      packaging: '5kg, 25kg, 50kg',
      certifications: ['ISO 9001', 'FDA Approved'],
      minOrder: 100,
    },
    {
      id: 5,
      name: 'Sella Rice',
      category: 'Parboiled',
      price: 0.85,
      stock: 600,
      rating: 4.5,
      image: '🌾',
      description: 'Parboiled rice, golden color with unique taste.',
      specifications: {
        length: '7.2 mm',
        moisture: '12%',
        protein: '8.1%',
        broken: '< 3%',
      },
      origin: 'Bihar, India',
      packaging: '5kg, 25kg, 50kg',
      certifications: ['ISO 9001', 'FDA Approved'],
      minOrder: 100,
    },
    {
      id: 6,
      name: 'Brown Rice',
      category: 'Organic',
      price: 1.10,
      stock: 400,
      rating: 4.8,
      image: '🌾',
      description: 'Organic brown rice, nutrient-rich and sustainable.',
      specifications: {
        length: '7.5 mm',
        moisture: '12%',
        protein: '8.3%',
        broken: '< 2%',
      },
      origin: 'Uttarakhand, India',
      packaging: '1kg, 5kg, 25kg',
      certifications: ['Organic Certified', 'ISO 9001', 'FDA Approved'],
      minOrder: 50,
    },
  ];

  const filteredRice = riceData
    .filter(rice => filterStock === 'all' || (filterStock === 'in-stock' && rice.stock > 0) || (filterStock === 'high' && rice.stock > 500))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.stock - a.stock; // popularity
    });

  return (
    <>
      <Head>
        <title>Rice Marketplace | RohanRice - Premium Rice Varieties</title>
        <meta name="description" content="Browse premium rice varieties from RohanRice. Basmati, long-grain, organic rice. Bulk orders, competitive pricing, export-ready." />
        <meta name="keywords" content="buy rice online, basmati rice, rice exporter, bulk rice orders, wholesale rice" />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-premium py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-4">Rice Marketplace</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Browse our premium rice collection. Direct pricing, real-time stock, bulk inquiry ready.
          </p>
        </div>
      </section>

      {/* Filters & Sort */}
      <section className="bg-white border-b border-rice-beige-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-wrap">
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="input-field px-4 py-2 text-sm"
              >
                <option value="all">All Stock</option>
                <option value="in-stock">In Stock</option>
                <option value="high">High Stock (500+)</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field px-4 py-2 text-sm"
              >
                <option value="popularity">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredRice.length} varieties
            </div>
          </div>
        </div>
      </section>

      {/* Rice Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRice.map((rice) => (
              <div
                key={rice.id}
                onClick={() => setSelectedVariety(rice)}
                className="card-premium cursor-pointer group hover:shadow-premium transition-all"
              >
                {/* Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2 flex-wrap">
                    <span className="badge badge-primary">In Stock</span>
                    {rice.rating >= 4.8 && <span className="badge badge-gold">Top Rated</span>}
                  </div>
                  <span className="text-2xl">{rice.image}</span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">{rice.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{rice.description}</p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 mb-6 pb-6 border-b border-rice-beige-200">
                  <div className="text-sm">
                    <div className="text-gray-600">Price</div>
                    <div className="font-bold text-rice-green-700">${rice.price}/kg</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-600">Stock</div>
                    <div className="font-bold text-rice-green-700">{rice.stock} tons</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-600">Rating</div>
                    <div className="font-bold text-rice-green-700">⭐ {rice.rating}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-600">Min Order</div>
                    <div className="font-bold text-rice-green-700">{rice.minOrder}kg</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedVariety(rice);
                      setShowBulkForm(true);
                    }}
                    className="btn-primary w-full text-center"
                  >
                    Bulk Inquiry
                  </button>
                  <button
                    onClick={() => setSelectedVariety(rice)}
                    className="btn-secondary w-full text-center"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedVariety && !showBulkForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-auto">
            <div className="p-8">
              <button
                onClick={() => setSelectedVariety(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <div className="flex gap-8 mb-8">
                <div className="text-6xl">{selectedVariety.image}</div>
                <div className="flex-1">
                  <h2 className="text-3xl font-serif font-bold text-charcoal mb-2">
                    {selectedVariety.name}
                  </h2>
                  <div className="flex gap-2 mb-4">
                    {selectedVariety.certifications.map((cert, idx) => (
                      <span key={idx} className="text-xs bg-rice-beige-100 text-rice-beige-900 px-2 py-1 rounded">
                        {cert}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">{selectedVariety.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-gray-600 text-sm">Price per kg</div>
                      <div className="font-bold text-rice-green-700 text-xl">${selectedVariety.price}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm">Available Stock</div>
                      <div className="font-bold text-rice-green-700 text-xl">{selectedVariety.stock} tons</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm">Origin</div>
                      <div className="font-bold text-charcoal">{selectedVariety.origin}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm">Packaging</div>
                      <div className="font-bold text-charcoal">{selectedVariety.packaging}</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-charcoal mb-3">Specifications</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {Object.entries(selectedVariety.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBulkForm(true)}
                    className="btn-primary w-full"
                  >
                    Request Bulk Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Form Modal */}
      {showBulkForm && selectedVariety && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
            <div className="bg-gradient-rice text-white p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold">Bulk Order Inquiry</h3>
              <button
                onClick={() => setShowBulkForm(false)}
                className="text-white hover:opacity-80"
              >
                ✕
              </button>
            </div>

            <form className="p-6 space-y-4">
              <div>
                <label className="block font-semibold text-charcoal mb-2">Selected Rice</label>
                <input
                  type="text"
                  value={selectedVariety.name}
                  disabled
                  className="input-field bg-gray-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-2">Quantity (kg)</label>
                <input
                  type="number"
                  placeholder={`Min. ${selectedVariety.minOrder}kg`}
                  className="input-field"
                  min={selectedVariety.minOrder}
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-2">Company Name</label>
                <input type="text" placeholder="Your company" className="input-field" />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-2">Email</label>
                <input type="email" placeholder="your@email.com" className="input-field" />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-2">Message</label>
                <textarea
                  placeholder="Additional requirements..."
                  className="input-field resize-none h-24"
                />
              </div>

              <div className="border-t border-rice-beige-200 pt-4">
                <button
                  type="submit"
                  className="btn-primary w-full mb-2"
                >
                  Submit Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkForm(false)}
                  className="btn-secondary w-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
