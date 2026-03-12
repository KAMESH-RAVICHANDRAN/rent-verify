'use client';

import { ShieldCheck, Users, Star, Home, Zap, MessageSquare, MapPin, Wallet } from 'lucide-react';
import { Button, Card } from '@/components/ui-base';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturesPage() {
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Platform Features</h1>
          <p className="text-xl text-text-secondary">Everything you need for a secure and seamless rental experience.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheck className="w-8 h-8 text-success" />,
              title: "PAN Verified Landlords",
              desc: "Every landlord is verified using government APIs to prevent fake listings and fraud."
            },
            {
              icon: <Users className="w-8 h-8 text-primary" />,
              title: "Smart Tenant Matching",
              desc: "Our algorithm matches tenants based on occupation, family size, and budget preferences."
            },
            {
              icon: <Star className="w-8 h-8 text-warning" />,
              title: "Secure Documents",
              desc: "ID proofs are encrypted and automatically deleted after 30 days for your privacy."
            },
            {
              icon: <Zap className="w-8 h-8 text-info" />,
              title: "Instant Applications",
              desc: "Apply to multiple verified properties with a single click using your verified profile."
            },
            {
              icon: <MessageSquare className="w-8 h-8 text-primary" />,
              title: "AI-Powered Chat",
              desc: "Get instant answers about properties and neighborhoods from our intelligent assistant."
            },
            {
              icon: <MapPin className="w-8 h-8 text-error" />,
              title: "Neighborhood Insights",
              desc: "Detailed information about local amenities, schools, and transport for every listing."
            }
          ].map((feature, i) => (
            <Card key={i} className="p-8 hover:shadow-lg transition-shadow">
              <div className="mb-6 p-4 bg-bg-primary rounded-2xl w-fit">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
