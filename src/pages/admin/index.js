import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data
  const metrics = {
    totalRevenue: '$2.5M',
    totalOrders: 1254,
    activeStocks: 6,
    pendingOrders: 12,
  };

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'Global Foods Ltd',
      variety: 'Premium Basmati',
      quantity: '500kg',
      value: '$600',
      status: 'pending',
      date: '2026-02-26',
    },
    {
      id: 'ORD-002',
      customer: 'Middle East Traders',
      variety: '1121 Basmati',
      quantity: '2000kg',
      value: '$2,700',
      status: 'confirmed',
      date: '2026-02-25',
    },
    {
      id: 'ORD-003',
      customer: 'European Imports',
      variety: 'Super Kernel',
      quantity: '1000kg',
      value: '$950',
      status: 'shipped',
      date: '2026-02-24',
    },
  ];

  const stockData = [
    { variety: 'Premium Basmati', current: 500, minThreshold: 100, price: '$1.20' },
    { variety: '1121 Basmati', current: 300, minThreshold: 100, price: '$1.35' },
    { variety: 'Super Kernel', current: 1000, minThreshold: 200, price: '$0.95' },
    { variety: 'IRRI-6 Rice', current: 800, minThreshold: 100, price: '$0.75' },
    { variety: 'Sella Rice', current: 600, minThreshold: 100, price: '$0.85' },
    { variety: 'Brown Rice', current: 400, minThreshold: 100, price: '$1.10' },
  ];

  const ledgerData = [
    { date: '2026-02-26', type: 'Sale', amount: '$600', customer: 'Global Foods Ltd', status: 'pending' },
    { date: '2026-02-25', type: 'Sale', amount: '$2,700', customer: 'Middle East Traders', status: 'confirmed' },
    { date: '2026-02-24', type: 'Refund', amount: '-$950', customer: 'European Imports', status: 'processed' },
    { date: '2026-02-23', type: 'Sale', amount: '$1,500', customer: 'Asian Buyers', status: 'delivered' },
  ];

  return (
    <>
      <Head>
        <title>Admin Dashboard - RohanRice</title>
      </Head>

      <div className="min-h-screen bg-rice-beige-50">
        {/* Header */}
        <header className="bg-white border-b border-rice-beige-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold text-charcoal">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm">RohanRice Marketplace Management</p>
            </div>
            <Link href="/" className="btn-ghost">
              ← Back to Site
            </Link>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Revenue', value: metrics.totalRevenue, icon: '💰' },
              { label: 'Total Orders', value: metrics.totalOrders, icon: '📦' },
              { label: 'Active Stocks', value: metrics.activeStocks, icon: '📊' },
              { label: 'Pending Orders', value: metrics.pendingOrders, icon: '⏳' },
            ].map((metric, idx) => (
              <div key={idx} className="card bg-gradient-to-br from-rice-beige-50 to-white">
                <div className="text-4xl mb-3">{metric.icon}</div>
                <div className="text-gray-600 text-sm mb-1">{metric.label}</div>
                <div className="text-3xl font-bold text-rice-green-700">{metric.value}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-soft border border-rice-beige-200 overflow-hidden">
            <div className="flex border-b border-rice-beige-200">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'orders', label: 'Orders' },
                { id: 'stock', label: 'Stock Management' },
                { id: 'ledger', label: 'Ledger' },
                { id: 'messages', label: 'Messages' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold transition flex-1 text-center ${
                    activeTab === tab.id
                      ? 'text-rice-green-700 border-b-2 border-rice-green-700'
                      : 'text-gray-600 hover:text-rice-green-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-charcoal mb-6">Recent Orders</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b border-rice-beige-200">
                          <tr>
                            <th className="text-left py-3 px-4 font-semibold text-charcoal">Order ID</th>
                            <th className="text-left py-3 px-4 font-semibold text-charcoal">Customer</th>
                            <th className="text-left py-3 px-4 font-semibold text-charcoal">Variety</th>
                            <th className="text-left py-3 px-4 font-semibold text-charcoal">Quantity</th>
                            <th className="text-left py-3 px-4 font-semibold text-charcoal">Value</th>
                            <th className="text-left py-3 px-4 font-semibold text-charcoal">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="border-b border-rice-beige-100 hover:bg-rice-beige-50 transition">
                              <td className="py-3 px-4 font-semibold text-rice-green-700">{order.id}</td>
                              <td className="py-3 px-4">{order.customer}</td>
                              <td className="py-3 px-4">{order.variety}</td>
                              <td className="py-3 px-4">{order.quantity}</td>
                              <td className="py-3 px-4 font-semibold">{order.value}</td>
                              <td className="py-3 px-4">
                                <span className={`badge ${
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                  'bg-rice-green-100 text-rice-green-700'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-charcoal mb-6">Stock Status</h2>
                    <div className="space-y-4">
                      {stockData.slice(0, 3).map((stock, idx) => (
                        <div key={idx} className="bg-rice-beige-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <h3 className="font-semibold text-charcoal">{stock.variety}</h3>
                              <p className="text-sm text-gray-600">{stock.current} tons available</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-rice-green-700">{stock.current} / {stock.current + stock.minThreshold}</p>
                              <p className="text-xs text-gray-500">Min: {stock.minThreshold} tons</p>
                            </div>
                          </div>
                          <div className="w-full bg-rice-beige-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-rice h-full"
                              style={{
                                width: `${(stock.current / (stock.current + stock.minThreshold)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-charcoal mb-6">All Orders</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-rice-beige-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                          <th className="text-left py-3 px-4 font-semibold">Customer</th>
                          <th className="text-left py-3 px-4 font-semibold">Date</th>
                          <th className="text-left py-3 px-4 font-semibold">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                          <th className="text-left py-3 px-4 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-b border-rice-beige-100 hover:bg-rice-beige-50">
                            <td className="py-3 px-4 font-semibold text-rice-green-700">{order.id}</td>
                            <td className="py-3 px-4">{order.customer}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                            <td className="py-3 px-4 font-bold">{order.value}</td>
                            <td className="py-3 px-4">
                              <span className="badge badge-primary text-xs">{order.status}</span>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="text-rice-green-700 hover:text-rice-green-900 font-semibold text-sm"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Stock Tab */}
              {activeTab === 'stock' && (
                <div>
                  <h2 className="text-2xl font-bold text-charcoal mb-6">Stock Management</h2>
                  <div className="space-y-4">
                    {stockData.map((stock, idx) => (
                      <div key={idx} className="card-premium flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-charcoal mb-2">{stock.variety}</h3>
                          <div className="text-sm text-gray-600">
                            <p>Current: <span className="font-semibold">{stock.current} tons</span></p>
                            <p>Price: <span className="font-semibold text-rice-green-700">{stock.price}/kg</span></p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="w-32 bg-rice-beige-200 rounded-full h-3 mb-3 overflow-hidden">
                            <div
                              className="bg-gradient-rice h-full"
                              style={{
                                width: `${Math.min((stock.current / (stock.current + 200)) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <button className="btn-secondary text-sm px-4">Update Stock</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ledger Tab */}
              {activeTab === 'ledger' && (
                <div>
                  <h2 className="text-2xl font-bold text-charcoal mb-6">Financial Ledger</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-rice-beige-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold">Date</th>
                          <th className="text-left py-3 px-4 font-semibold">Type</th>
                          <th className="text-left py-3 px-4 font-semibold">Customer / Ref</th>
                          <th className="text-left py-3 px-4 font-semibold">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ledgerData.map((entry, idx) => (
                          <tr key={idx} className="border-b border-rice-beige-100 hover:bg-rice-beige-50">
                            <td className="py-3 px-4 text-sm">{entry.date}</td>
                            <td className="py-3 px-4 font-semibold text-charcoal">{entry.type}</td>
                            <td className="py-3 px-4 text-sm">{entry.customer}</td>
                            <td className={`py-3 px-4 font-bold ${entry.amount.includes('-') ? 'text-red-600' : 'text-rice-green-700'}`}>
                              {entry.amount}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`badge ${entry.status === 'processed' || entry.status === 'delivered' ? 'badge-primary' : 'bg-yellow-100 text-yellow-700'} text-xs`}>
                                {entry.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div>
                  <h2 className="text-2xl font-bold text-charcoal mb-6">Messages & Inquiries</h2>
                  <div className="space-y-4">
                    {[
                      { id: 1, sender: 'john@globalfoods.com', subject: 'Bulk Basmati Order', date: '2026-02-26', unread: true },
                      { id: 2, sender: 'fatima@middleeast.ae', subject: 'Pricing Inquiry', date: '2026-02-25', unread: false },
                      { id: 3, sender: 'contact@euroimports.eu', subject: 'Product Samples Request', date: '2026-02-24', unread: false },
                    ].map((msg) => (
                      <div key={msg.id} className={`p-4 rounded-lg border cursor-pointer transition ${msg.unread ? 'bg-rice-gold-50 border-rice-gold-200' : 'bg-rice-beige-50 border-rice-beige-200'} hover:shadow-soft`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-semibold text-charcoal mb-1">{msg.subject}</div>
                            <div className="text-sm text-gray-600">{msg.sender}</div>
                          </div>
                          <div className="text-right text-sm text-gray-500">{msg.date}</div>
                        </div>
                        {msg.unread && <div className="mt-2 inline-block badge badge-gold text-xs">New</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
