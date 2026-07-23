import { PublicLayout } from '@/components/layout/PublicLayout';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { STATS, FEATURES } from './constants';

export default function HomePage() {
  return (
    <PublicLayout>
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="mb-8 inline-flex items-center rounded-full bg-accent-500/10 px-4 py-2 text-sm font-medium text-accent-300 ring-1 ring-accent-500/20">
                <span className="mr-2 h-2 w-2 rounded-full bg-accent-500 animate-pulse"></span>
                Drag & Drop Form Builder
              </div>

              <h1 className="mx-auto max-w-4xl text-5xl font-logo font-bold tracking-tight text-dark-50 sm:text-7xl">
                Build forms{' '}
                <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                  without limits
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-xl text-dark-200 leading-relaxed">
                The most intuitive drag & drop form builder. Create, collaborate, and collect responses in real-time. No coding required.
              </p>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/dashboard"
                  className="group relative inline-flex items-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent-500/20 transition-all hover:bg-accent-600 hover:shadow-xl active:scale-95"
                >
                  Start Building Free
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-dark-500 bg-dark-800 px-8 py-4 text-base font-semibold text-dark-100 transition-all hover:border-dark-400 hover:bg-dark-700 active:scale-95"
                >
                  See How It Works
                </a>
              </div>

              {/* Stats */}
              <div className="mt-20 grid grid-cols-3 gap-8 border-t border-dark-500 pt-12">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-4xl font-bold text-accent-400">{stat.value}</div>
                    <div className="mt-2 text-sm font-medium text-dark-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-dark-800 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="text-4xl font-logo font-bold tracking-tight text-dark-50 sm:text-5xl">
                Everything you need to build amazing forms
              </h2>
              <p className="mt-4 text-xl text-dark-200">
                Powerful features wrapped in a simple, intuitive interface
              </p>
            </div>

            <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-accent-600 to-accent-800 py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-4xl font-logo font-bold tracking-tight text-white sm:text-5xl">
              Ready to build your first form?
            </h2>
            <p className="mt-6 text-xl text-accent-100">
              Join thousands of users already creating beautiful forms with FORM-BUILDER. No credit card required.
            </p>
            <div className="mt-12">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-accent-600 shadow-lg transition-all hover:bg-dark-50 hover:shadow-xl active:scale-95"
              >
                Get Started Now
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
