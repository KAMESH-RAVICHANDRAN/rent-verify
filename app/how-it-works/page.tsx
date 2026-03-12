'use client';

import { Home, UserPlus, Search, FileText, Key, ArrowRight } from 'lucide-react';
import { Button, Card } from '@/components/ui-base';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <nav className="sticky top-0 z-50 glass border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-text-primary">RentVerify</span>
          </Link>
          <Link href="/auth">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-primary mb-4">How RentVerify Works</h1>
          <p className="text-xl text-text-secondary">Your journey to a verified home in four simple steps.</p>
        </div>

        <div className="space-y-24">
          {[
            {
              step: "01",
              icon: <UserPlus className="w-12 h-12 text-primary" />,
              title: "Create Your Verified Profile",
              desc: "Sign up as a tenant or landlord. Complete your identity verification using PAN or Aadhaar. This one-time process builds the foundation of trust for all your future interactions."
            },
            {
              step: "02",
              icon: <Search className="w-12 h-12 text-success" />,
              title: "Smart Search & Discovery",
              desc: "Use our advanced filters or AI chat to find properties that match your exact needs. Every property you see has been ownership-verified by our system."
            },
            {
              step: "03",
              icon: <FileText className="w-12 h-12 text-warning" />,
              title: "Secure Application & Review",
              desc: "Apply to your favorite homes with your verified credentials. Landlords can review applications knowing the tenant's background is already checked."
            },
            {
              step: "04",
              icon: <Key className="w-12 h-12 text-info" />,
              title: "Digital Agreement & Move-In",
              desc: "Once matched, finalize the details and sign the digital rental agreement. Move into your new home with the peace of mind that everything is verified."
            }
          ].map((item, i) => (
            <div key={i} className={`flex flex-col md:flex-row gap-12 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className="text-6xl font-black text-primary/10 mb-6">{item.step}</div>
                <div className="mb-6">{item.icon}</div>
                <h2 className="text-3xl font-bold mb-4 text-text-primary">{item.title}</h2>
                <p className="text-lg text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
              <div className="flex-1 w-full aspect-video bg-bg-tertiary rounded-[2.5rem] border border-card-border flex items-center justify-center">
                <span className="text-text-muted font-medium">Visual Illustration for Step {item.step}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <Link href="/auth">
            <Button size="lg" className="px-12 py-6 text-lg rounded-2xl">
              Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
