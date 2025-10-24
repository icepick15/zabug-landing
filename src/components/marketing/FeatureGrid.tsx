import React from 'react';

const features = [
  {
    title: 'Beautiful Design',
    description: 'Modern, professional interface that converts visitors into customers. Fully responsive and optimized for mobile.',
    icon: '✨'
  },
  {
    title: 'Paystack Integration',
    description: 'Accept payments instantly. Just add your Paystack API keys and start selling within minutes.',
    icon: '💳'
  },
  {
    title: 'Easy Customization',
    description: 'Built with Next.js and Tailwind CSS. Change colors, add your logo, and customize everything easily.',
    icon: '🎨'
  },
  {
    title: 'Complete E-commerce',
    description: 'Product catalog, shopping cart, checkout, order management dashboard - everything you need to run your store.',
    icon: '�️'
  }
];

const FeatureGrid: React.FC = () => {
  return (
    <section id="features" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Everything You Need to Start Selling</h2>
          <p className="mt-4 text-lg text-slate-600">
            A complete e-commerce solution, ready to deploy and start making money.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center transition hover:shadow-lg"
            >
              <div className="text-5xl">{feature.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-base text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;