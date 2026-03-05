import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAppStore } from '@/context/AppStoreContext';
import { fileToDataUrl } from '@/utils/appHelpers';

const initialForm = {
  name: '',
  email: '',
  phone: '+92',
  password: '',
};

export default function AdminSignupPage() {
  const router = useRouter();
  const { registerAccount, verifyAccountOtp } = useAppStore();

  const [formData, setFormData] = useState(initialForm);
  const [profileImage, setProfileImage] = useState('');
  const [otpSessionId, setOtpSessionId] = useState('');
  const [otpData, setOtpData] = useState({ emailOtp: '', phoneOtp: '' });
  const [otpHints, setOtpHints] = useState({ email: '', phone: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const onImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setProfileImage(dataUrl);
  };

  const onSignupSubmit = async (event) => {
    event.preventDefault();

    if (!profileImage) {
      setStatus('Profile image is required for admin signup.');
      return;
    }

    setLoading(true);

    const response = await registerAccount({
      role: 'admin',
      ...formData,
      profileImage,
    });

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
      router.push('/admin');
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Admin Signup | Rohan Rice</title>
      </Head>

      <div className="min-h-screen bg-charcoal px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-premium p-6">
          <h1 className="text-3xl font-serif font-bold text-charcoal text-center">Admin Signup</h1>
          <p className="text-sm text-gray-600 text-center mt-2">Create admin account with email OTP and phone OTP verification.</p>

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

              <div>
                <label className="block text-sm font-semibold mb-1">Profile Image</label>
                <input type="file" accept="image/*" className="input-field" onChange={onImageChange} required />
                {profileImage && (
                  <img src={profileImage} alt="Admin profile preview" className="mt-2 w-16 h-16 rounded-full object-cover border" />
                )}
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Admin & Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={onVerifySubmit} className="mt-5 space-y-3">
              <div className="rounded-md px-3 py-2 bg-rice-gold-50 border border-rice-gold-200 text-sm text-rice-gold-900">
                <p className="font-semibold">OTP sent to admin email and phone.</p>
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
                {loading ? 'Verifying...' : 'Verify OTP & Activate Admin'}
              </button>
            </form>
          )}

          <p className="text-sm text-center text-gray-600 mt-5">
            Already admin?{' '}
            <Link href="/admin/login" className="text-rice-green-700 font-semibold hover:text-rice-green-900">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

