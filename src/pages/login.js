import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState('email'); // 'email', 'google', 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else if (result?.ok) {
        const sessionRes = await fetch('/api/auth/session');
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData?.accessToken) {
            localStorage.setItem('token', sessionData.accessToken);
          }
        }
        router.push('/admin');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Login
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/backend/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setShowOTP(true);
        setError('');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Error requesting OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/backend/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        router.push('/admin');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - RohanRice Marketplace</title>
        <meta name="description" content="Secure login to RohanRice marketplace. Email, OTP, or Google authentication." />
      </Head>

      <div className="min-h-screen bg-gradient-rice flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-lg shadow-premium p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block mb-4 w-12 h-12 bg-gradient-rice rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌾</span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-charcoal mb-2">RohanRice</h1>
              <p className="text-gray-600">Premium Rice Export Marketplace</p>
            </div>

            {/* Login Tabs */}
            <div className="flex gap-1 mb-6 bg-rice-beige-100 p-1 rounded-lg">
              <button
                onClick={() => { setLoginMethod('email'); setShowOTP(false); setError(''); }}
                className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition ${
                  loginMethod === 'email'
                    ? 'bg-white text-rice-green-700 shadow-soft'
                    : 'text-gray-600 hover:text-rice-green-700'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => { setLoginMethod('otp'); setShowOTP(false); setError(''); }}
                className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition ${
                  loginMethod === 'otp'
                    ? 'bg-white text-rice-green-700 shadow-soft'
                    : 'text-gray-600 hover:text-rice-green-700'
                }`}
              >
                OTP
              </button>
              <button
                onClick={() => signIn('google')}
                className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition ${
                  loginMethod === 'google'
                    ? 'bg-white text-rice-green-700 shadow-soft'
                    : 'text-gray-600 hover:text-rice-green-700'
                }`}
              >
                Google
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email/Password Login */}
            {loginMethod === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <div className="text-center text-sm">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-rice-green-700 font-semibold hover:text-rice-green-900">
                      Create one
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {/* OTP Login */}
            {loginMethod === 'otp' && (
              <form onSubmit={showOTP ? handleOTPLogin : handleRequestOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-field"
                    disabled={showOTP}
                    required
                  />
                </div>

                {showOTP && (
                  <>
                    <div className="bg-rice-gold-50 border border-rice-gold-200 rounded-lg p-4 text-sm">
                      <p className="text-rice-gold-900 font-semibold">Check your email!</p>
                      <p className="text-rice-gold-700 text-xs mt-1">We sent a 6-digit code to {email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Enter OTP Code
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                        placeholder="000000"
                        maxLength="6"
                        className="input-field text-center text-2xl tracking-widest font-mono"
                        required
                      />
                    </div>

                    <div className="text-center text-sm text-gray-600">
                      Didn't receive code?{' '}
                      <button
                        type="button"
                        onClick={() => { setShowOTP(false); setOtp(''); }}
                        className="text-rice-green-700 font-semibold hover:text-rice-green-900"
                      >
                        Resend
                      </button>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : (showOTP ? 'Verify & Login' : 'Send OTP')}
                </button>
              </form>
            )}

            {/* Google Auth */}
            {loginMethod === 'google' && (
              <button
                onClick={() => signIn('google')}
                className="btn-primary w-full"
              >
                Sign In with Google
              </button>
            )}

            {/* Divider */}
            <div className="border-t border-rice-beige-200 mt-6 pt-6">
              <p className="text-xs text-gray-500 text-center">
                By signing in, you agree to our{' '}
                <a href="#" className="text-rice-green-700 hover:text-rice-green-900 font-semibold">
                  Terms
                </a>
                {' and '}
                <a href="#" className="text-rice-green-700 hover:text-rice-green-900 font-semibold">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-white">
            <p className="text-sm opacity-90">
              🏢 RohanRice Export Marketplace
            </p>
            <p className="text-xs opacity-75 mt-1">
              Premium Rice. Global Reach.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
