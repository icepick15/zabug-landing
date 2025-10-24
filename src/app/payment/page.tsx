'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const plans = {
  'template': {
    name: 'Template Only',
    price: 120000,
    originalPrice: 180000,
    priceFormatted: '₦120,000',
    originalPriceFormatted: '₦180,000',
    description: 'Complete Next.js e-commerce template source code'
  },
  'template-setup': {
    name: 'Template + Full Setup',
    price: 200000,
    originalPrice: 350000,
    priceFormatted: '₦200,000',
    originalPriceFormatted: '₦350,000',
    description: 'Template + complete deployment and configuration'
  }
};

function PaymentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [planId, setPlanId] = useState<string>('template');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan && plans[plan as keyof typeof plans]) {
      setPlanId(plan);
    }
  }, [searchParams]);

  const selectedPlan = plans[planId as keyof typeof plans];
  
  const finalPrice = appliedCoupon ? appliedCoupon.finalPrice : selectedPlan.price;

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponMessage('');

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          planId,
          email: formData.email || undefined,
        }),
      });

      const data = await response.json();

      if (data.status) {
        setAppliedCoupon(data.data);
        setCouponMessage(data.message);
      } else {
        setCouponMessage(data.message);
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponMessage('Failed to validate coupon');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s+()-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Initialize Paystack payment
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          amount: finalPrice * 100, // Paystack expects amount in kobo
          metadata: {
            fullName: formData.fullName,
            phone: formData.phone,
            plan: planId,
            planName: selectedPlan.name,
            couponCode: appliedCoupon?.code || null,
            originalPrice: selectedPlan.price,
            discount: appliedCoupon ? appliedCoupon.discount : 0,
            finalPrice: finalPrice
          }
        })
      });
      
      const data = await response.json();
      
      if (data.status && data.data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error(data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Complete Your Purchase</h1>
          <p className="mt-2 text-slate-600">Secure payment powered by Paystack</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Order Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-xl font-semibold text-slate-900">Order Summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{selectedPlan.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{selectedPlan.description}</p>
                </div>
              </div>
              
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Original Price</span>
                  <span className="text-slate-400 line-through">{selectedPlan.originalPriceFormatted}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Current Price</span>
                  <span className="font-semibold text-slate-900">{selectedPlan.priceFormatted}</span>
                </div>
                {appliedCoupon && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600">Coupon Discount ({appliedCoupon.code})</span>
                      <span className="font-semibold text-green-600">-₦{appliedCoupon.discount.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2" />
                  </>
                )}
                <div className="flex items-center justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span>₦{finalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Change Plan */}
            <div className="mt-6 rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Change Plan</p>
              <div className="mt-3 space-y-2">
                {Object.entries(plans).map(([key, plan]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setPlanId(key);
                      setAppliedCoupon(null);
                      setCouponCode('');
                      setCouponMessage('');
                    }}
                    className={`w-full rounded-lg border-2 p-3 text-left text-sm transition ${
                      planId === key
                        ? 'border-sky-600 bg-sky-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">{plan.name}</span>
                      <div className="text-right">
                        <span className="block text-xs text-slate-400 line-through">{plan.originalPriceFormatted}</span>
                        <span className="font-semibold text-slate-900">{plan.priceFormatted}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-xl font-semibold text-slate-900">Your Information</h2>
            <p className="mt-2 text-sm text-slate-600">We'll send your purchase details to this email</p>
            
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-lg border px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 ${
                    errors.fullName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500'
                  }`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-lg border px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  Mobile Number (WhatsApp preferred) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-lg border px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500'
                  }`}
                  placeholder="+234 800 000 0000"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Coupon Code Section */}
              <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4">
                <label htmlFor="coupon" className="block text-sm font-medium text-slate-700">
                  Have a coupon code?
                </label>
                {!appliedCoupon ? (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="block flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-900 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="LAUNCH50"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={couponLoading}
                      className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                    >
                      {couponLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-green-900">{appliedCoupon.code} applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponMessage && (
                  <p className={`mt-2 text-sm ${appliedCoupon ? 'text-green-600' : 'text-red-600'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-sky-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Pay ₦${finalPrice.toLocaleString()}`}
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure payment with Paystack
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <PaymentForm />
    </Suspense>
  );
}
