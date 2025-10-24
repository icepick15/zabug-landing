'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const reference = searchParams.get('reference');
    
    if (!reference) {
      router.push('/');
      return;
    }

    // Verify payment with backend
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/paystack/verify?reference=${reference}`);
        const data = await response.json();
        
        if (data.status && data.data.status === 'success') {
          setVerified(true);
          setOrderDetails(data.data);
        } else {
          // Payment not successful, redirect to failed page
          router.push('/payment/failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        router.push('/payment/failed');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="text-center text-slate-200">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-sky-500"></div>
          <p className="mt-4 text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!verified) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-6 text-slate-100">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-10 text-center shadow-xl backdrop-blur">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
            <svg className="h-10 w-10 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">Payment confirmed</h1>
          <p className="mt-3 text-base text-slate-300 sm:text-lg">
            Thanks for securing the Premium E-commerce Template. We are preparing your onboarding email right away.
          </p>

          {orderDetails && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-left">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Order summary</h2>
              <dl className="mt-4 space-y-4 text-sm sm:text-base">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-slate-400">Payment reference</dt>
                  <dd className="font-mono text-slate-100">{orderDetails.reference}</dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-slate-400">Amount paid</dt>
                  <dd className="font-semibold text-white">₦{(orderDetails.amount / 100).toLocaleString()}</dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-slate-400">Plan</dt>
                  <dd className="text-slate-100">{orderDetails.metadata?.planName ?? 'Premium Template + Setup'}</dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-slate-400">Receipt sent to</dt>
                  <dd className="text-slate-100">{orderDetails.customer.email}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-6 text-left">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Next steps</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-white">1</span>
                <span>Expect an email from support@zabug.com with your download link and onboarding checklist shortly.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-white">2</span>
                <span>If you booked the setup option, reply to that email with your brand assets and preferred launch timeline.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-white">3</span>
                <span>Need a copy now? Reach us immediately via the button below and we will send it over.</span>
              </li>
            </ul>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-sky-400"
            >
              Go back to the site
            </Link>
            <a
              href={`mailto:support@zabug.com?subject=Payment ${orderDetails?.reference ?? ''}`}
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-white/40"
            >
              Contact support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
