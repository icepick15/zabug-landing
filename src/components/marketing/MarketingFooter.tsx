import React from 'react';
import Link from 'next/link';

const year = new Date().getFullYear();

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'View Demo', href: '/demo' },
  { label: 'Join Waitlist', href: '/waitlist' },
];

const MarketingFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 py-16 text-slate-200">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link href="/" className="text-lg font-semibold text-white sm:text-xl">
              Premium E-commerce Template
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Launch a polished online store in days, not weeks. Built with Next.js, Paystack ready, and fully customisable for your brand.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Need Help?
            </h4>
            <p className="mt-4 text-sm text-slate-400">
              Have questions about the template or need a custom setup? Reach out and we'll get back to you quickly.
            </p>
            <a
              href="mailto:support@zabug.com"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:border-slate-500"
            >
              <span>support@zabug.com</span>
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-700 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Premium E-commerce Template. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="#pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/payment" className="hover:text-white">
              Buy Template
            </Link>
            <Link href="/waitlist" className="hover:text-white">
              Affiliate Waitlist
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
