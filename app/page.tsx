'use client';

import Link from 'next/link';
import { Shield, Lock, Activity, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-light text-slate-900 selection:bg-primary-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-surface-light/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                SecureGuard
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/auth/signin"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-all hover:shadow-lg hover:shadow-primary-500/30"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-primary-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-primary-50 to-primary-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-primary-100 text-primary-700 text-sm font-medium mb-8 animate-fade-in-up shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Live Fraud Detection System
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-slate-900">
              Secure Your Digital <br />
              <span className="text-primary-600">Infrastructure</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Advanced AI-powered fraud detection that protects your business in real-time. 
              Stop threats before they happen with our military-grade security platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary-500/30 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-surface-light text-slate-900 rounded-xl font-semibold transition-all border border-slate-200 shadow-sm"
              >
                View Features
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/50 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-surface-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: "Real-time Monitoring",
                description: "Continuous surveillance of your transactions with sub-millisecond latency."
              },
              {
                icon: Shield,
                title: "AI Protection",
                description: "Machine learning models that adapt to new threats and patterns instantly."
              },
              {
                icon: Lock,
                title: "Bank-Grade Security",
                description: "Enterprise-level encryption and compliance with global security standards."
              }
            ].map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all group">
                <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-primary-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">How SecureGuard Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our advanced platform integrates seamlessly with your existing infrastructure to provide immediate protection.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10" />

            {[
              {
                step: "01",
                title: "Connect Your Data",
                description: "Integrate via our secure API or use our pre-built connectors for major financial platforms."
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our models analyze transaction patterns in real-time to identify anomalies and potential threats."
              },
              {
                step: "03",
                title: "Instant Protection",
                description: "Suspicious activities are flagged or blocked instantly, keeping your assets secure."
              }
            ].map((item, index) => (
              <div key={index} className="relative bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary-200 transition-colors shadow-sm">
                <div className="w-12 h-12 bg-surface-light rounded-full border border-slate-200 flex items-center justify-center text-xl font-bold text-primary-600 mb-6 mx-auto md:mx-0 z-10 relative shadow-sm">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-surface-light border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-900">
                Trusted by industry leaders worldwide
              </h2>
              <p className="text-slate-600 text-lg mb-8">
                Join thousands of companies that rely on SecureGuard to protect their financial data and customer trust.
              </p>
              <div className="space-y-4">
                {[
                  "99.99% Uptime Guarantee",
                  "24/7 Dedicated Support",
                  "GDPR & SOC2 Compliant"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary-100/50 blur-3xl rounded-full" />
              <div className="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-12 rounded-full bg-slate-100" />
                  <div>
                    <div className="h-4 w-32 bg-slate-100 rounded mb-2" />
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-full bg-slate-100 rounded" />
                  <div className="h-3 w-5/6 bg-slate-100 rounded" />
                  <div className="h-3 w-4/6 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">Trusted by Security Experts</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              See what industry leaders are saying about SecureGuard's fraud detection capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "SecureGuard reduced our fraud incidents by 94% in the first month. The ROI was immediate.",
                author: "Sarah Chen",
                role: "CTO, FinTech Global",
                image: "SC"
              },
              {
                quote: "The real-time monitoring capabilities are unmatched. It's like having a dedicated security team 24/7.",
                author: "Marcus Rodriguez",
                role: "Head of Security, BankCorp",
                image: "MR"
              },
              {
                quote: "Implementation was smooth and the support team is incredible. Highly recommended for any financial institution.",
                author: "David Kim",
                role: "VP of Engineering, PayFlow",
                image: "DK"
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.author}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-slate-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-surface-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How long does integration take?",
                a: "Most clients are up and running within 24-48 hours. Our API is designed for developer ease."
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. We use military-grade encryption and are SOC2 Type II compliant."
              },
              {
                q: "Can I try it before buying?",
                a: "Yes, we offer a 14-day free trial with full access to all features."
              }
            ].map((faq, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-primary-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/20 via-slate-900 to-slate-900" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">Ready to secure your business?</h2>
          <p className="text-xl text-slate-300 mb-10">
            Join the network of protected businesses today. No credit card required for trial.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all hover:shadow-[0_0_30px_-5px_rgba(27,53,188,0.4)]"
            >
              Get Started Now
            </Link>
            <Link
              href="#"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-700"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary-500" />
            <span className="text-lg font-bold text-white">SecureGuard</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2024 SecureGuard Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}