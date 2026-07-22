import { PublicLayout } from '@/components/layout/PublicLayout';
import { FeatureCard } from '@/components/ui/FeatureCard';

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
                <div>
                  <div className="text-4xl font-bold text-accent-400">10K+</div>
                  <div className="mt-2 text-sm font-medium text-dark-200">Active Users</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-accent-400">50K+</div>
                  <div className="mt-2 text-sm font-medium text-dark-200">Forms Created</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-accent-400">1M+</div>
                  <div className="mt-2 text-sm font-medium text-dark-200">Responses Collected</div>
                </div>
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
              <FeatureCard
                icon={<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>}
                title="Drag & Drop Builder"
                description="Intuitive visual editor with drag-and-drop functionality. Add fields, reorder elements, and customize your form in seconds."
              />
              <FeatureCard
                icon={<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                title="Real-time Collaboration"
                description="Work together with your team. See changes instantly as collaborators edit, add, or reorder fields in real-time."
              />
              <FeatureCard
                icon={<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>}
                title="Easy Sharing"
                description="Share your forms with a single link. Collect responses from anyone, anywhere. No login required for respondents."
              />
              <FeatureCard
                icon={<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                title="Secure & Reliable"
                description="Enterprise-grade security with JWT authentication, encrypted data, and reliable MongoDB persistence."
              />
              <FeatureCard
                icon={<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>}
                title="Smart Field Types"
                description="Text, textarea, checkboxes, radio buttons, dropdowns, dates, and more. Customize with labels, placeholders, and validation."
              />
              <FeatureCard
                icon={<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                title="Lightning Fast"
                description="Built on Next.js with optimized performance. Instant saves, real-time sync, and smooth interactions throughout."
              />
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

