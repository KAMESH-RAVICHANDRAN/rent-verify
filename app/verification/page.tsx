'use client';

import { ShieldCheck, Lock, FileCheck, UserCheck, Home, ArrowRight } from 'lucide-react';
import { Button, Card } from '@/components/ui-base';
import Link from 'next/link';

export default function VerificationProcessPage() {
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
          <h1 className="text-4xl font-bold text-text-primary mb-4">Our Verification Process</h1>
          <p className="text-xl text-text-secondary">Building trust through secure, government-backed verification.</p>
        </div>

        <div className="space-y-12">
          {[
            {
              icon: <UserCheck className="w-8 h-8 text-primary" />,
              title: "Identity Verification",
              desc: "We verify the identity of every user using PAN and Aadhaar APIs. This ensures that everyone on the platform is who they say they are, reducing the risk of fraud."
            },
            {
              icon: <FileCheck className="w-8 h-8 text-success" />,
              title: "Property Validation",
              desc: "For landlords, we cross-reference property details with EB bills and property tax records to confirm ownership and authenticity of the listing."
            },
            {
              icon: <Lock className="w-8 h-8 text-warning" />,
              title: "Data Privacy & Security",
              desc: "Your sensitive documents are encrypted and stored securely. We automatically delete ID proofs after 30 days of verification to ensure your long-term privacy."
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-info" />,
              title: "Continuous Monitoring",
              desc: "Our system continuously monitors for suspicious activity and fake listings, maintaining a safe and reliable marketplace for everyone."
            }
          ].map((item, i) => (
            <Card key={i} className="p-8 flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 bg-bg-primary rounded-2xl shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-text-secondary leading-relaxed text-lg">{item.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/auth">
            <Button size="lg" className="px-12 py-6 text-lg rounded-2xl">
              Get Verified Today <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
