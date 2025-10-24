'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const WaitlistPage = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status) {
        setStatus('success');
        setMessage('🎉 You\'re on the list! We\'ll notify you when the referral program launches.');
        setFormData({ fullName: '', email: '', phone: '' });
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to join waitlist. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-slate-900">
            E-commerce Template
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <div className="text-center">
          <div className="mb-6 text-6xl">🚀</div>
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Join the Referral Program Waitlist
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Be the first to know when our affiliate program launches. Earn 20% commission on every sale!
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
            <div className="text-3xl">💰</div>
            <h3 className="mt-3 font-semibold text-slate-900">20% Commission</h3>
            <p className="mt-2 text-sm text-slate-600">Earn ₦24,000 per template sale</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
            <div className="text-3xl">🔗</div>
            <h3 className="mt-3 font-semibold text-slate-900">Unique Link</h3>
            <p className="mt-2 text-sm text-slate-600">Get your personal referral link</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
            <div className="text-3xl">📊</div>
            <h3 className="mt-3 font-semibold text-slate-900">Live Dashboard</h3>
            <p className="mt-2 text-sm text-slate-600">Track your earnings in real-time</p>
          </div>
        </div>

        {/* Form */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          {status === 'success' ? (
            <div className="text-center">
              <div className="text-5xl">✅</div>
              <p className="mt-4 text-lg font-medium text-green-700">{message}</p>
              <Link
                href="/"
                className="mt-6 inline-block rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  Mobile Number (WhatsApp preferred)
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="+234 800 000 0000"
                />
              </div>

              {message && status === 'error' && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-lg bg-sky-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
              >
                {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          We'll send you an email when the program launches. No spam, we promise! 🤝
        </p>
      </main>
    </div>
  );
};

export default WaitlistPage;
