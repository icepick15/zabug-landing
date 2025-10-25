import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Waitlist', href: '/waitlist' },
  { label: 'FAQ', href: '#faq' },
];

const MarketingNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:px-12 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/zabug.png" 
              alt="Zabug" 
              width={200} 
              height={80}
              className="h-18 w-auto"
              priority
            />
          </Link>
          <Link
            href="#pricing"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 md:hidden"
          >
            View Pricing
          </Link>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end md:gap-6">
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 md:gap-6">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            View Demo
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MarketingNavbar;
