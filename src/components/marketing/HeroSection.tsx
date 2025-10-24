import React from 'react';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center sm:px-12 sm:py-32">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
          Launch Your E-commerce Store
          <span className="mt-2 block bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            in Minutes, Not Months
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
          Ready-to-use Next.js e-commerce template with Paystack integration. 
          Beautiful design, mobile responsive, and easy to customize.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="#pricing"
            className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-sky-700"
          >
            Get Started - Only ₦120,000
          </Link>
          <Link
            href="/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border-2 border-sky-600 bg-white px-8 py-4 text-lg font-semibold text-sky-600 transition hover:bg-sky-50"
          >
            View Live Demo
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-900 transition hover:border-slate-400"
          >
            See What's Included
          </Link>
        </div>
        <div className="mx-auto mt-12 flex max-w-xl flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Next.js 14
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Paystack Ready
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Lifetime Updates
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
