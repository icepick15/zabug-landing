'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function DemoPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const demoUrl = 'https://your-demo-store.vercel.app'; 
  const adminCredentials = {
    url: 'https://your-demo-store.vercel.app/admin',
    email: 'support@zabug.com',
    password: 'demo123'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/zabug.png" 
              alt="Zabug" 
              width={120} 
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-300 hover:text-white"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Hero Section */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
            </span>
            Live Demo Available
          </div>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Experience the Template Live
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Try the full e-commerce platform. Browse products, test checkout, and explore the admin dashboard.
          </p>
        </div>

        {/* Main Demo Button */}
        <div className="mt-12 rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-purple-500/10 p-8 text-center backdrop-blur">
          <h2 className="text-2xl font-semibold text-white">Launch Live Demo</h2>
          <p className="mt-2 text-slate-300">
            Opens in a new tab • Test mode enabled • No real charges
          </p>
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Live Demo
          </a>
        </div>

        {/* Admin Credentials */}
        <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-900/70 p-8 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Admin Dashboard Access</h3>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Use these credentials to access the admin panel and explore order management, product settings, and analytics.
          </p>
          
          <div className="mt-6 space-y-3">
            <div className="group relative rounded-lg border border-slate-700 bg-slate-950/50 p-4">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Admin URL</label>
              <div className="mt-2 flex items-center justify-between">
                <code className="font-mono text-sm text-slate-200">{adminCredentials.url}</code>
                <button
                  onClick={() => copyToClipboard(adminCredentials.url, 'url')}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700"
                >
                  {copied === 'url' ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            
            <div className="group relative rounded-lg border border-slate-700 bg-slate-950/50 p-4">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Email</label>
              <div className="mt-2 flex items-center justify-between">
                <code className="font-mono text-sm text-slate-200">{adminCredentials.email}</code>
                <button
                  onClick={() => copyToClipboard(adminCredentials.email, 'email')}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700"
                >
                  {copied === 'email' ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            
            <div className="group relative rounded-lg border border-slate-700 bg-slate-950/50 p-4">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Password</label>
              <div className="mt-2 flex items-center justify-between">
                <code className="font-mono text-sm text-slate-200">{adminCredentials.password}</code>
                <button
                  onClick={() => copyToClipboard(adminCredentials.password, 'password')}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700"
                >
                  {copied === 'password' ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-900/70 p-8 backdrop-blur">
          <h3 className="text-xl font-semibold text-white">What to Test in the Demo</h3>
          <p className="mt-2 text-sm text-slate-400">
            Explore these key features to see what you'll get with the template.
          </p>
          
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border border-slate-700/50 bg-slate-950/30 p-4">
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">Browse Product Catalog</h4>
                <p className="mt-1 text-sm text-slate-400">Check out the product listings, filters, and search</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-700/50 bg-slate-950/30 p-4">
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">Add Items to Cart</h4>
                <p className="mt-1 text-sm text-slate-400">Test the shopping cart and quantity updates</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-700/50 bg-slate-950/30 p-4">
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">Test Checkout Flow</h4>
                <p className="mt-1 text-sm text-slate-400">Experience the full payment process (test mode)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-700/50 bg-slate-950/30 p-4">
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">Login to Admin Dashboard</h4>
                <p className="mt-1 text-sm text-slate-400">Use credentials above to access the backend</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-700/50 bg-slate-950/30 p-4">
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">View Order Management</h4>
                <p className="mt-1 text-sm text-slate-400">Explore how orders are tracked and managed</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-700/50 bg-slate-950/30 p-4">
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">Mobile Responsive Design</h4>
                <p className="mt-1 text-sm text-slate-400">Check how it looks on different screen sizes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-amber-300">Demo Environment Notice</h4>
              <p className="mt-1 text-sm text-amber-200/80">
                This is a live demo environment. All data resets every hour. No real transactions will be processed—everything runs in test mode.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-3xl border border-slate-700 bg-slate-900/70 p-8 text-center backdrop-blur">
          <h3 className="text-2xl font-semibold text-white">Ready to Get Your Own?</h3>
          <p className="mt-2 text-slate-300">
            Purchase the template and launch your store in days, not months.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-sky-400"
            >
              View Pricing
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-600 px-8 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
