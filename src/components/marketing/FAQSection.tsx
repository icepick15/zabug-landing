import React from 'react';

const faqs = [
  {
    question: 'What do I get with the template?',
    answer:
      'You get the complete Next.js source code, including product catalog, shopping cart, Paystack checkout, order dashboard, and full documentation to help you deploy and customize it.'
  },
  {
    question: 'Do I need a Paystack account?',
    answer:
      'Yes, you\'ll need a Paystack account to accept payments. We provide step-by-step documentation on how to set it up and integrate your API keys.'
  },
  {
    question: 'Can I customize the design?',
    answer:
      'Absolutely! The template is built with Tailwind CSS, making it super easy to change colors, fonts, layouts, and add your own branding.'
  },
  {
    question: 'Do I get updates?',
    answer:
      'Yes! Your purchase includes lifetime updates. We continuously improve the template and you\'ll get access to all future versions.'
  }
];

const FAQSection: React.FC = () => {
  return (
  <section id="faq" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 sm:px-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to know about the template.
          </p>
        </div>
        <dl className="mt-12 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <dt className="text-lg font-semibold text-slate-900">{faq.question}</dt>
              <dd className="mt-3 text-base text-slate-600">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default FAQSection;
