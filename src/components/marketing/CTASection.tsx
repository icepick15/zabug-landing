import React from 'react';

const CTASection: React.FC = () => {
    return (
        <section className="relative overflow-hidden bg-sky-600 py-20 text-white">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_65%)]" />
            <div className="mx-auto max-w-4xl px-6 text-center sm:px-12">
                <h2 className="text-3xl font-bold sm:text-5xl">Ready to Launch Your Store?</h2>
                <p className="mt-6 text-xl text-sky-50">
                    Get instant access to the complete e-commerce template and start selling today.
                </p>
                <a
                    href="#pricing"
                    className="mt-10 inline-flex items-center justify-center rounded-lg bg-white px-10 py-4 text-lg font-semibold text-sky-600 shadow-xl transition hover:bg-sky-50"
                >
                    Get Started - Only ₦120,000
                </a>
                <p className="mt-6 text-sm text-sky-100">
                    One-time payment • No sign-up required • Just name & email to get your template
                </p>
            </div>
        </section>
    );
};

export default CTASection;