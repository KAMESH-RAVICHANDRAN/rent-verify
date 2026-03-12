'use client';

import { Home, Users, Heart, ShieldCheck, Globe } from 'lucide-react';
import { Button, Card } from '@/components/ui-base';
import Link from 'next/link';

export default function AboutUsPage() {
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-primary mb-4">About RentVerify</h1>
          <p className="text-xl text-text-secondary">Redefining trust in the rental marketplace.</p>
        </div>

        <div className="prose prose-lg max-w-none text-text-secondary space-y-8">
          <p>
            RentVerify was founded with a simple mission: to make the house rental process safe, transparent, and efficient for everyone. In a market often plagued by fake listings, fraudulent landlords, and unreliable tenants, we saw an opportunity to build a platform where trust is the foundation.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-12 not-prose">
            <Card className="p-8">
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <ShieldCheck className="text-primary w-5 h-5" /> Our Vision
              </h3>
              <p>To become the most trusted rental marketplace in India, where every listing is verified and every user is authenticated.</p>
            </Card>
            <Card className="p-8">
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <Heart className="text-error w-5 h-5" /> Our Values
              </h3>
              <p>Transparency, security, and user privacy are at the core of everything we build. We believe in technology that serves people.</p>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-text-primary">Why We Started</h2>
          <p>
            The traditional rental process is broken. Tenants spend weeks visiting properties that don&apos;t match descriptions, while landlords struggle to find reliable tenants who will respect their property. RentVerify uses modern technology and government-backed APIs to solve these problems at the root.
          </p>

          <h2 className="text-2xl font-bold text-text-primary">Our Team</h2>
          <p>
            We are a team of engineers, designers, and real estate experts dedicated to creating a better rental experience. Based in Bangalore, we understand the unique challenges of the Indian rental market and are building solutions that work for our community.
          </p>
        </div>
      </main>
    </div>
  );
}
