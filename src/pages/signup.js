import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAppStore } from '@/context/AppStoreContext';

const initialSignup = {
  name: '',
  email: '',
  phone: '+92',
  password: '',
};

export default function CustomerSignupPage() {
  const router = useRouter();
  const { registerAccount, verifyAccountOtp } = useAppStore();

  const [formData, setFormData] = useState(initialSignup);
  const [otpData, setOtpData] = useState({ emailOtp: '', phoneOtp: '' });
  const [otpSessionId, setOtpSessionId] = useState('');
  const [otpHints, setOtpHints] = useState({ email: '', phone: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignupSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const response = await registerAccount({ role: 'customer', ...formData });
    setStatus(response.message);

    if (response.success) {
      setOtpSessionId(response.otpSessionId);
      setOtpHints({
        email: response.debugEmailOtp,
        phone: response.debugPhoneOtp,
      });
    }

    setLoading(false);
  };

  const onVerifySubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const response = await verifyAccountOtp({
      otpSessionId,
      emailOtp: otpData.emailOtp,
      phoneOtp: otpData.phoneOtp,
    });

    setStatus(response.message);

    if (response.success) {
      router.push('/shop');
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Customer Signup | Rohan Rice</title>
      </Head>

      <div className="min-h-screen bg-gradient-rice px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-premium p-6">
          <h1 className="text-3xl font-serif font-bold text-charcoal text-center">Customer Signup</h1>
          <p className="text-sm text-gray-600 text-center mt-2">
            Create your customer account. Activation requires email OTP and phone OTP verification.
          </p>

          {status && (
            <div className="mt-4 rounded-md px-3 py-2 bg-rice-beige-50 border border-rice-beige-200 text-sm text-rice-green-800">
              {status}
            </div>
          )}

          {!otpSessionId ? (
            <form onSubmit={onSignupSubmit} className="mt-5 space-y-3">
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
                <label className="block text-sm font-semibold mb-1">Phone (+92 format)</label>
                <input
                  type="tel"
                  className="input-field"
                  value={formData.phone}
                  onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Password</label>
                <input
                  type="password"
                  className="input-field"
                  value={formData.password}
                  onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                  required
                  minLength={6}
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account & Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={onVerifySubmit} className="mt-5 space-y-3">
              <div className="rounded-md px-3 py-2 bg-rice-gold-50 border border-rice-gold-200 text-sm text-rice-gold-900">
                <p className="font-semibold">OTP sent to your email and phone.</p>
                <p className="text-xs mt-1">Demo OTP (Email): {otpHints.email} | Demo OTP (Phone): {otpHints.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Email OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  className="input-field"
                  value={otpData.emailOtp}
                  onChange={(event) => setOtpData((prev) => ({ ...prev, emailOtp: event.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Phone OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  className="input-field"
                  value={otpData.phoneOtp}
                  onChange={(event) => setOtpData((prev) => ({ ...prev, phoneOtp: event.target.value }))}
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP & Activate'}
              </button>
            </form>
          )}

          <div className="mt-5 text-sm text-center text-gray-600 space-y-1">
            <p>
              Already registered?{' '}
              <Link href="/login" className="text-rice-green-700 font-semibold hover:text-rice-green-900">
                Login
              </Link>
            </p>
            <p>
              Admin signup?{' '}
              <Link href="/admin/signup" className="text-rice-green-700 font-semibold hover:text-rice-green-900">
                Admin account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

