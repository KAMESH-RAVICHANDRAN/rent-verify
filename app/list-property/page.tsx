'use client';

import { Home, Upload, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui-base';
import Link from 'next/link';

export default function ListPropertyPage() {
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">List Your Property</h1>
          <p className="text-xl text-text-secondary">Join thousands of verified landlords and find the perfect tenant today.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">Get Verified</h3>
            <p className="text-text-secondary mb-6">Complete our government-backed verification process to build trust with potential tenants.</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle2 className="w-4 h-4 text-success" /> PAN Verification
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle2 className="w-4 h-4 text-success" /> EB Bill Validation
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle2 className="w-4 h-4 text-success" /> Property Ownership Check
              </li>
            </ul>
          </Card>

          <Card className="p-8">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-6">
              <Upload className="text-success w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">Easy Listing</h3>
            <p className="text-text-secondary mb-6">Upload photos, set your preferences, and start receiving applications in minutes.</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle2 className="w-4 h-4 text-success" /> High-quality Photo Gallery
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle2 className="w-4 h-4 text-success" /> Smart Tenant Matching
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle2 className="w-4 h-4 text-success" /> Secure Document Handling
              </li>
            </ul>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/auth?role=LANDLORD">
            <Button size="lg" className="px-12 py-6 text-lg rounded-2xl">
              Start Listing Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
