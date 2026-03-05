import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/context/AppStoreContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdmin, login } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      router.replace('/admin');
    }
  }, [isAdmin, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await login({ role: 'admin', email, password });
    setStatus(response.message || (response.success ? 'Login successful.' : 'Login failed.'));

    if (response.success) {
      router.push('/admin');
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Admin Login | Rohan Rice</title>
      </Head>

      <div className="min-h-screen bg-charcoal px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-premium p-6">
          <h1 className="text-3xl font-serif font-bold text-charcoal text-center">Admin Login</h1>
          <p className="text-sm text-gray-600 text-center mt-2">Secure access for Zeeshan Ali dashboard management.</p>

          {status && (
            <div className="mt-4 rounded-md px-3 py-2 bg-rice-beige-50 border border-rice-beige-200 text-sm text-rice-green-800">
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Admin Email</label>
              <input type="email" className="input-field" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input type="password" className="input-field" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Login as Admin'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-5">
            No admin account?{' '}
            <Link href="/admin/signup" className="text-rice-green-700 font-semibold hover:text-rice-green-900">
              Create admin account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

