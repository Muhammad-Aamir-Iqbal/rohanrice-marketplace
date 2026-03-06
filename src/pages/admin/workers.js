import Head from 'next/head';
import { useState } from 'react';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { useAppStore } from '@/context/AppStoreContext';

const initialForm = {
  name: '',
  phone: '+92',
  email: '',
  password: '',
  notes: '',
};

export default function AdminWorkersPage() {
  const { data, addWorker, updateWorker } = useAppStore();
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState('');

  const handleCreateWorker = async (event) => {
    event.preventDefault();
    const response = await addWorker(formData);
    setStatus(response.message || '');
    if (response.success) {
      setFormData(initialForm);
    }
    setTimeout(() => setStatus(''), 1800);
  };

  const toggleWorkerStatus = async (worker) => {
    const nextStatus = worker.status === 'active' ? 'inactive' : 'active';
    const response = await updateWorker(worker.id, { status: nextStatus });
    setStatus(response.message || '');
    setTimeout(() => setStatus(''), 1800);
  };

  return (
    <AdminRouteGuard>
      <Head>
        <title>Workers | Rohan Rice Admin</title>
      </Head>

      <section className="grid xl:grid-cols-3 gap-5">
        <article className="card-premium xl:col-span-1">
          <h1 className="text-2xl font-serif font-bold">Add Worker</h1>
          <p className="text-sm text-gray-600 mt-1">Create delivery worker accounts with secure login credentials.</p>
          {status && (
            <div className="mt-4 rounded-md px-3 py-2 bg-rice-green-50 border border-rice-green-200 text-rice-green-800 text-sm">
              {status}
            </div>
          )}
          <form className="mt-4 space-y-3" onSubmit={handleCreateWorker}>
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input className="input-field" value={formData.name} onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Phone (+92 format)</label>
              <input className="input-field" value={formData.phone} onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email (optional)</label>
              <input type="email" className="input-field" value={formData.email} onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input type="password" className="input-field" value={formData.password} onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Notes</label>
              <textarea className="input-field" rows={3} value={formData.notes} onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))} />
            </div>
            <button type="submit" className="btn-primary w-full">Create Worker</button>
          </form>
        </article>

        <article className="card-premium xl:col-span-2">
          <h2 className="text-xl font-semibold">Worker Directory</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rice-beige-200 text-left">
                  <th className="py-2">Name</th>
                  <th className="py-2">Phone</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.workers.map((worker) => (
                  <tr key={worker.id} className="border-b border-rice-beige-100">
                    <td className="py-2 pr-3">{worker.name}</td>
                    <td className="py-2 pr-3">{worker.phone}</td>
                    <td className="py-2 pr-3">{worker.email || '-'}</td>
                    <td className="py-2 pr-3">
                      <span className={`px-2 py-1 text-xs rounded ${worker.status === 'active' ? 'bg-rice-green-100 text-rice-green-800' : 'bg-rice-beige-100 text-rice-beige-900'}`}>
                        {worker.status}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      <button
                        type="button"
                        className="px-3 py-1 rounded border border-rice-beige-200 hover:bg-rice-beige-100"
                        onClick={() => {
                          void toggleWorkerStatus(worker);
                        }}
                      >
                        {worker.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.workers.length && <p className="text-sm text-gray-500 py-4">No workers created yet.</p>}
          </div>
        </article>
      </section>
    </AdminRouteGuard>
  );
}
