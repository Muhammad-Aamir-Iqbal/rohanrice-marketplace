import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/context/AppStoreContext';

export default function WorkerLoginPage() {
  const router = useRouter();
  const { isWorker, loginWorker } = useAppStore();
  const [phone, setPhone] = useState('+92');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isWorker) {
      router.replace('/worker');
    }
  }, [isWorker, router]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await loginWorker({ phone, password });
    setStatus(response.message || '');
    if (response.success) {
      router.push('/worker');
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Worker Login | Rohan Rice</title>
      </Head>

      <div className="min-h-screen bg-charcoal px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-premium p-6">
          <h1 className="text-3xl font-serif font-bold text-charcoal text-center">Worker Login</h1>
          <p className="text-sm text-gray-600 text-center mt-2">Access assigned deliveries and payment collection actions.</p>

          {status && (
            <div className="mt-4 rounded-md px-3 py-2 bg-rice-beige-50 border border-rice-beige-200 text-sm text-rice-green-800">
              {status}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Phone (+92)</label>
              <input className="input-field" value={phone} onChange={(event) => setPhone(event.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input type="password" className="input-field" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
