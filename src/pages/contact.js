import React, { useState } from 'react';
import Head from 'next/head';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', company: '', email: '', phone: '', subject: 'general', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact RohanRice - Bulk Export Inquiries</title>
        <meta name="description" content="Contact RohanRice for bulk rice orders, export inquiries, and wholesale pricing. International buyers welcome." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-premium py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-serif font-bold text-charcoal mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Bulk inquiries, export orders, or partnership opportunities. Our team responds within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            {/* Contact Info */}
            <div className="space-y-8">
              {[
                {
                  icon: '📍',
                  title: 'Address',
                  content: 'RohanRice Export House\nPunjab, India',
                },
                {
                  icon: '📱',
                  title: 'Phone',
                  content: '+91-191-XXXX-XXXX\n+91-XXXX-XXXX-XXX',
                },
                {
                  icon: '✉',
                  title: 'Email',
                  content: 'exports@rohanrice.com\nsales@rohanrice.com',
                },
                {
                  icon: '🕒',
                  title: 'Business Hours',
                  content: 'Mon - Fri: 9 AM - 6 PM IST\nSat: 10 AM - 4 PM IST',
                },
              ].map((item, idx) => (
                <div key={idx} className="card">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-charcoal mb-2">{item.title}</h3>
                  <p className="text-gray-600 whitespace-pre-line text-sm">{item.content}</p>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card-premium">
                <h2 className="text-3xl font-serif font-bold text-charcoal mb-8">Send us a Message</h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-rice-green-50 border border-rice-green-200 text-rice-green-700 rounded-lg">
                    ✓ Message sent successfully! We'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your company"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91-XXXX-XXXX-XXX"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="bulk-order">Bulk Order Request</option>
                      <option value="pricing">Pricing & Quotation</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="investor">Investor Relations</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your rice requirements, quantity, timeline, etc."
                      rows="6"
                      className="input-field resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Inquiry'}
                  </button>

                  <p className="text-xs text-gray-500">
                    We typically respond within 24 hours. For urgent issues, please call us directly.
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="border-t border-rice-beige-200 pt-16">
            <h2 className="text-3xl font-serif font-bold text-charcoal mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  q: 'What is the minimum order quantity?',
                  a: 'Minimum order varies by rice variety (50-100 kg bags) but we accept bulk orders starting from 5 tons for wholesale pricing.',
                },
                {
                  q: 'Do you offer samples?',
                  a: 'Yes! We provide free samples for your testing before placing bulk orders. Shipping charges may apply.',
                },
                {
                  q: 'What payment terms do you accept?',
                  a: 'We accept LC (Letter of Credit), TT (Telegraphic Transfer), and pre-payment for bulk orders. Custom terms available.',
                },
                {
                  q: 'How do you handle export documentation?',
                  a: 'All export paperwork, certificates, and compliance documents are handled by our experienced team. We ensure smooth customs clearance.',
                },
              ].map((item, idx) => (
                <div key={idx} className="card">
                  <h3 className="font-bold text-charcoal mb-3">{item.q}</h3>
                  <p className="text-gray-600 text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 md:py-24 bg-rice-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-charcoal mb-8 text-center">
            We Export to 50+ Countries
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm">
            {[
              'USA', 'UK', 'Italy', 'Germany', 'France',
              'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman',
              'Singapore', 'Malaysia', 'Japan', 'Australia', 'Canada',
            ].map((country, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-rice-gold-200">
                <p className="font-semibold text-rice-green-700">{country}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
