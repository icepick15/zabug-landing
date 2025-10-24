import React from 'react';
import Link from 'next/link';

const tiers = [
  {
    id: 'template',
    name: 'Template Only',
    price: '₦120,000',
    originalPrice: '₦180,000',
    priceValue: 120000,
    cadence: 'one-time payment',
    description: 'Perfect for developers who want to customize and deploy the template themselves.',
    perks: [
      'Complete Next.js e-commerce template source code',
      'Product catalog, cart, and checkout pages',
      'Paystack payment integration with documentation',
      'Order management dashboard',
      'Mobile responsive design with Tailwind CSS',
      'Setup and deployment guide included',
      'Lifetime updates'
    ],
    cta: 'Get Template',
    href: '/payment?plan=template'
  },
  {
    id: 'template-setup',
    name: 'Template + Full Setup',
    price: '₦200,000',
    originalPrice: '₦350,000',
    priceValue: 200000,
    cadence: 'one-time payment',
    description: 'Let us handle everything - from deployment to configuration, so you can start selling immediately.',
    perks: [
      'Everything in Template Only plan',
      'Complete deployment to your Vercel account',
      'Custom domain setup with SSL certificate',
      'Paystack account configuration and testing',
      'Product upload assistance (up to 20 products)',
      'Brand customization (logo, colors, fonts)',
      '1 hour training session on how to manage your store',
      '30 days of technical support'
    ],
    featured: true,
    cta: 'Get Started',
    href: '/payment?plan=template-setup'
  },
  {
    id: 'affiliate',
    name: 'Affiliate Program',
    price: 'Coming Soon',
    originalPrice: '',
    priceValue: 0,
    cadence: '',
    description: 'Promote this template and earn generous commissions on every sale you refer.',
    perks: [
      'Generous commission rates on all sales',
      'Real-time referral tracking dashboard',
      'Marketing materials and banners provided',
      'Automated commission payouts',
      'Performance bonuses',
      'Dedicated affiliate support'
    ],
    cta: 'Join Waitlist',
    href: '/waitlist'
  }
];

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-slate-600">
            Choose the package that fits your needs. One-time payment, no monthly fees.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            No sign-up required. Just provide your name and email to get started.
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <article
              key={tier.id}
              className={`relative flex flex-col rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                tier.featured ? 'ring-2 ring-sky-500' : ''
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-6 inline-flex items-center rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow">
                  Most popular
                </div>
              )}
              <header>
                <h3 className="text-xl font-semibold text-slate-900">{tier.name}</h3>
                <p className="mt-3 text-sm text-slate-600">{tier.description}</p>
              </header>
              <div className="mt-8">
                {tier.originalPrice && (
                  <div className="mb-2">
                    <span className="text-xl text-slate-400 line-through">{tier.originalPrice}</span>
                  </div>
                )}
                <div className="flex items-baseline gap-2 text-slate-900">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{tier.cadence}</span>
                </div>
              </div>
              <ul className="mt-8 flex-1 space-y-3 text-sm text-slate-600">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link
                  href={tier.href}
                  className={`inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    tier.featured
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400 focus:ring-sky-500'
                      : 'border border-slate-300 text-slate-900 hover:border-slate-900 focus:ring-slate-900'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
