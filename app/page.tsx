'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Home, ShieldCheck, Users, ArrowRight, Star, Menu, X, LogOut, Plus, SlidersHorizontal, Wallet, MessageSquare, Mic, ArrowUp, ChevronDown, Camera, Github, Upload, Settings, LayoutTemplate, Layers, Link as LinkIcon, Check, ArrowUpRight, ChevronRight, Globe, Heart } from 'lucide-react';
import { Button, Card, Input, Badge } from '@/components/ui-base';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import SearchableAreaSelect from '@/components/SearchableAreaSelect';

export default function LandingPage() {
  const [isLocating, setIsLocating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [pincode, setPincode] = useState('');
  const [selectedArea, setSelectedArea] = useState<any>(null);

  const handleNearby = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Nearby accurate location:", position.coords.latitude, position.coords.longitude);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        }
      );
    }
  };
  const [isDesignSystemsOpen, setIsDesignSystemsOpen] = useState(false);
  const { user, userProfile, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading && userProfile) {
      router.push(userProfile.role === 'LANDLORD' ? '/dashboard/landlord' : '/dashboard/tenant');
    }
  }, [user, userProfile, loading, router]);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Image src="/1000130925-Photoroom.png" alt="RentVerify" width={32} height={32} className="rounded-lg object-contain" />
              <span className="font-blockat text-xl text-text-primary">RentVerify</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-text-secondary hover:text-primary transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-text-secondary hover:text-primary transition-colors">How it Works</Link>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href={userProfile?.role === 'LANDLORD' ? '/dashboard/landlord' : '/dashboard/tenant'}>
                    <Button variant="outline" size="sm">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => logout()}>
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="outline" size="sm" className="mr-2">Login</Button>
                  </Link>
                  <Link href="/auth">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-card border-b border-card-border overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col">
                <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-text-secondary font-medium">Features</Link>
                <Link href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-text-secondary font-medium">How it Works</Link>
                <Link href="/auth" className="w-full">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/auth" className="w-full">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="info">Verified Marketplace</Badge>
              <h1 className="mt-6 text-5xl md:text-7xl font-extrabold text-text-primary leading-tight">
                Rent with <span className="text-primary">Confidence</span>, Not Guesswork.
              </h1>
              <p className="mt-6 text-xl text-text-secondary">
                The only platform connecting verified landlords and tenants with PAN verification, EB bill checks, and smart matching.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-10 w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-4 shadow-2xl border border-black/5 flex flex-col md:flex-row items-center gap-4"
            >
              <div className="flex-1 w-full flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-48">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input 
                    type="text"
                    placeholder="Pincode"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-bg-primary border border-black/5 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold outline-none focus:border-primary/30 transition-all"
                  />
                </div>
                
                <SearchableAreaSelect 
                  onSelect={(area) => {
                    setSelectedArea(area);
                    if (area) setPincode(area.pincode);
                  }}
                  className="flex-1 w-full"
                />
              </div>

              <Link href={`/search?pincode=${pincode}&area=${selectedArea?.name || ''}`} className="w-full md:w-auto">
                <Button className="w-full md:w-auto rounded-2xl px-8 py-3 h-auto font-bold shadow-lg shadow-primary/20">
                  <Search className="w-4 h-4 mr-2" /> Search Properties
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-terracotta rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary">Why Choose RentVerify?</h2>
            <p className="text-text-secondary mt-4">Built for trust, security, and speed.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
              }
            ].map((feature, i) => (
              <Card key={i} className="group">
                <div className="mb-4 p-3 bg-bg-primary rounded-xl w-fit group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary">How it Works</h2>
            <p className="text-text-secondary mt-4">Simple steps to your new verified home.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {[
              { step: "01", title: "Create Profile", desc: "Sign up and complete your verification profile." },
              { step: "02", title: "Smart Search", desc: "Find houses that match your preferences and budget." },
              { step: "03", title: "Apply Securely", desc: "Send applications with your verified credentials." },
              { step: "04", title: "Move In", desc: "Sign the agreement and get your keys with confidence." }
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="text-5xl font-black text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
                {i < 3 && <div className="hidden md:block absolute top-10 -right-4 w-8 h-[2px] bg-card-border" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-primary rounded-[2rem] p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">Ready to find your next home?</h2>
              <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of verified landlords and tenants today. Secure, fast, and transparent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth?role=TENANT">
                  <Button variant="secondary" size="lg">I&apos;m a Tenant</Button>
                </Link>
                <Link href="/auth?role=LANDLORD">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">I&apos;m a Landlord</Button>
                </Link>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-tertiary py-12 border-t border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/1000130925-Photoroom.png" alt="RentVerify" width={24} height={24} className="rounded object-contain" />
              <span className="font-blockat text-lg">RentVerify</span>
            </div>
            <p className="text-text-muted max-w-sm">
              The next generation of house rental verification. Secure, verified, and smart.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li><Link href="/search" className="hover:text-primary transition-colors">Search Houses</Link></li>
              <li><Link href="/list-property" className="hover:text-primary transition-colors">List Property</Link></li>
              <li><Link href="/verification" className="hover:text-primary transition-colors">Verification Process</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
