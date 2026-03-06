import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';

export default function AdminSettingsPage() {
  const { data, updateSettings, resetDemoData } = useAppStore();

  const [formData, setFormData] = useState(data.settings);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setFormData(data.settings);
  }, [data.settings]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const response = await updateSettings(formData);
    setStatus(response.message);
    setTimeout(() => setStatus(''), 2200);
  };

  const handleResetDemoData = async () => {
    const response = await resetDemoData();
    setStatus(response.message);
    setTimeout(() => setStatus(''), 2200);
  };

  return (
    <AdminRouteGuard>
      <Head>
        <title>Settings | Rohan Rice Admin</title>
      </Head>

      <section className="grid lg:grid-cols-2 gap-6">
        <article className="card-premium">
          <h1 className="text-2xl font-serif font-bold">Business Settings</h1>

          {status && (
            <div className="mt-4 rounded-md px-3 py-2 bg-rice-green-50 border border-rice-green-200 text-rice-green-800 text-sm">
              {status}
            </div>
          )}

          <form className="mt-4 space-y-3" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-1">Business Name</label>
              <input
                className="input-field"
                value={formData.businessName || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, businessName: event.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Owner Name</label>
              <input
                className="input-field"
                value={formData.ownerName || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, ownerName: event.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                value={formData.email || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Phone</label>
              <input
                className="input-field"
                value={formData.phone || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">WhatsApp Number</label>
              <input
                className="input-field"
                value={formData.whatsappNumber || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, whatsappNumber: event.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">EasyPaisa Number</label>
              <input
                className="input-field"
                value={formData.easyPaisaNumber || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, easyPaisaNumber: event.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">JazzCash Number</label>
              <input
                className="input-field"
                value={formData.jazzCashNumber || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, jazzCashNumber: event.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">EasyPaisa QR Image URL/Base64</label>
              <input
                className="input-field"
                value={formData.easyPaisaQrImage || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, easyPaisaQrImage: event.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">JazzCash QR Image URL/Base64</label>
              <input
                className="input-field"
                value={formData.jazzCashQrImage || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, jazzCashQrImage: event.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Location</label>
              <input
                className="input-field"
                value={formData.location || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Hero Tagline</label>
              <input
                className="input-field"
                value={formData.heroTagline || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, heroTagline: event.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Footer Tagline</label>
              <input
                className="input-field"
                value={formData.footerTagline || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, footerTagline: event.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Founder Credit Line</label>
              <input
                className="input-field"
                value={formData.founderCredit || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, founderCredit: event.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Technical Rights Line</label>
              <textarea
                rows={3}
                className="input-field"
                value={formData.techRights || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, techRights: event.target.value }))}
              />
            </div>

            <button type="submit" className="btn-primary">Save Settings</button>
          </form>
        </article>

        <article className="card-premium">
          <h2 className="text-2xl font-serif font-bold">System Control</h2>
          <p className="text-sm text-gray-600 mt-2">
            Use this only when you want to reset all demo website data including products, users, orders, reviews, and analytics.
          </p>

          <button
            type="button"
            className="mt-5 px-4 py-2 text-sm rounded bg-red-50 text-red-700 border border-red-200"
            onClick={() => {
              void handleResetDemoData();
            }}
          >
            Reset Complete Demo Data
          </button>
        </article>
      </section>
    </AdminRouteGuard>
  );
}

