import Head from 'next/head';
import { useState } from 'react';
import { useAppStore } from '@/context/AppStoreContext';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export default function ContactPage() {
  const { submitContactMessage, data } = useAppStore();
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState('');
  const whatsappNumber = data.settings?.whatsappNumber || data.settings?.phone || '';
  const whatsappDigits = String(whatsappNumber || '').replace(/\D/g, '');
  const whatsappIntl = whatsappDigits.startsWith('0')
    ? `92${whatsappDigits.slice(1)}`
    : whatsappDigits.startsWith('92')
      ? whatsappDigits
      : `92${whatsappDigits}`;
  const whatsappUrl = `https://wa.me/${whatsappIntl}`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await submitContactMessage(formData);
    setStatus(response.message);
    if (response.success) {
      setFormData(initialForm);
    }
    setTimeout(() => setStatus(''), 2500);
  };

  return (
    <>
      <Head>
        <title>Contact Us | Rohan Rice</title>
        <meta name="description" content="Contact Rohan Rice in Narowal, Punjab, Pakistan for products, orders, and service support." />
      </Head>

      <section className="bg-gradient-premium py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-charcoal">Contact Us</h1>
          <p className="text-gray-700 mt-3 max-w-3xl">
            We are always happy to hear from our customers. If you have questions about our products, orders, or services, please feel free to contact us.
            Our team will respond as quickly as possible to assist you.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          <article className="card-premium">
            <h2 className="text-2xl font-serif font-bold">Contact Information</h2>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p><span className="font-semibold">Business Name:</span> {data.settings.businessName}</p>
              <p><span className="font-semibold">Location:</span> {data.settings.location}</p>
              <p><span className="font-semibold">Owner:</span> {data.settings.ownerName}</p>
              <p><span className="font-semibold">Phone:</span> {data.settings.phone}</p>
              <p><span className="font-semibold">Email:</span> {data.settings.email}</p>
            </div>
            {whatsappDigits ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-rice-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rice-green-700"
              >
                Contact on WhatsApp
              </a>
            ) : (
              <p className="mt-4 text-xs text-gray-500">WhatsApp is not configured in settings.</p>
            )}
            <p className="mt-4 text-rice-green-800 font-semibold">Your satisfaction is our priority.</p>
          </article>

          <article className="card-premium">
            <h2 className="text-2xl font-serif font-bold">Send Message</h2>

            {status && (
              <div className="mt-4 rounded-md px-3 py-2 bg-rice-green-50 border border-rice-green-200 text-rice-green-800 text-sm">
                {status}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={formData.email}
                  onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Phone</label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="+92XXXXXXXXXX"
                  value={formData.phone}
                  onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Message</label>
                <textarea
                  className="input-field"
                  rows={5}
                  value={formData.message}
                  onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </article>
        </div>
      </section>
    </>
  );
}

