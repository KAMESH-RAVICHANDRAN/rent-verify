'use client';

import { Home, FileText, Scale, AlertCircle } from 'lucide-react';
import { Button, Card } from '@/components/ui-base';
import Link from 'next/link';
import Image from 'next/image';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <nav className="sticky top-0 z-50 glass border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/1000130925-Photoroom.png" alt="RentVerify" width={32} height={32} className="rounded-lg object-contain" />
            <span className="font-blockat text-xl text-text-primary">RentVerify</span>
          </Link>
          <Link href="/auth">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Terms of Service</h1>
          <p className="text-text-secondary">Last updated: March 12, 2026</p>
        </div>

        <div className="space-y-8 text-text-secondary">
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using RentVerify, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">2. User Verification</h2>
            <p className="mb-4">To maintain the integrity of our marketplace, all users must undergo identity verification. You agree to provide accurate and complete information during this process.</p>
            <Card className="p-6 bg-warning/5 border-warning/20">
              <div className="flex gap-3 items-start">
                <AlertCircle className="text-warning w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">Providing false information or fraudulent documents will result in immediate account termination and potential legal action.</p>
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">3. Listing Guidelines</h2>
            <p>Landlords are responsible for the accuracy of their listings. Listings must not contain misleading information, discriminatory language, or unauthorized photos of properties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">4. Limitation of Liability</h2>
            <p>RentVerify provides a platform for connecting verified users but is not a party to any rental agreements. We are not responsible for disputes between landlords and tenants, though we provide tools to help resolve them.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">5. Modifications</h2>
            <p>RentVerify reserves the right to revise these terms at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these Terms of Service.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
