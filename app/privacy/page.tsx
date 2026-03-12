'use client';

import { Home, Shield, Lock, EyeOff, Trash2 } from 'lucide-react';
import { Button, Card } from '@/components/ui-base';
import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold text-text-primary mb-4">Privacy Policy</h1>
          <p className="text-text-secondary">Last updated: March 12, 2026</p>
        </div>

        <div className="space-y-8 text-text-secondary">
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect information that you provide directly to us when you create an account, list a property, or apply for a rental. This includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Identity information (Name, Email, Phone Number)</li>
              <li>Verification data (PAN, Aadhaar details for API verification)</li>
              <li>Property details and photos</li>
              <li>Communication history between users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Verify the identity of landlords and tenants</li>
              <li>Validate property ownership and authenticity</li>
              <li>Facilitate communication and applications</li>
              <li>Improve our platform and prevent fraud</li>
            </ul>
          </section>

          <Card className="p-8 bg-primary/5 border-primary/20">
            <div className="flex gap-4 items-start">
              <Trash2 className="text-primary w-6 h-6 shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Automatic Data Deletion</h3>
                <p>To protect your privacy, all sensitive identity documents (like PAN/Aadhaar photos) are automatically deleted from our servers 30 days after successful verification.</p>
              </div>
            </div>
          </Card>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data, including end-to-end encryption for sensitive information and secure API connections for government verification services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@rentverify.com.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
