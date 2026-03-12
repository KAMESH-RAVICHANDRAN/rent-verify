'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button, Card, Badge, Input } from '@/components/ui-base';
import { ShieldCheck, CheckCircle2, Home, Github, ArrowRight, Heart, Eye, EyeOff, Facebook, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

function AuthContent() {
  const { user, userProfile, signIn, loading } = useAuth();
  const [step, setStep] = useState<'login' | 'role' | 'success'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') as 'LANDLORD' | 'TENANT' | null;

  useEffect(() => {
    if (user && !loading) {
      const nextStep = userProfile ? 'success' : 'role';
      if (step !== nextStep) {
        const timer = setTimeout(() => setStep(nextStep), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [user, userProfile, loading, step]);

  const handleGoogleLogin = async () => {
    await signIn(initialRole || 'TENANT');
  };

  const handleRoleSelect = async (selectedRole: 'LANDLORD' | 'TENANT') => {
    setStep('success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D6D9E4] p-4 sm:p-8">
      <div className="max-w-6xl w-full bg-[#F8F9FD] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        {/* Left Side: Auth Form */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12">
          <div className="max-w-sm w-full mx-auto">
            <AnimatePresence mode="wait">
              {step === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-8">Hello Again!</h1>
                    <p className="text-zinc-800 text-xs font-bold text-left mb-4">Let&apos;s get started with your 30 days trial</p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-14 bg-white border-none rounded-xl px-6 text-sm shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-zinc-400"
                      />
                    </div>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-14 bg-white border-none rounded-xl px-6 text-sm shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-zinc-400"
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <button className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 transition-colors">Recovery Password</button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Button 
                      className="w-full h-14 text-base font-bold rounded-xl bg-[#9D7676] hover:bg-[#8D6666] text-white shadow-xl shadow-[#9D7676]/20 transition-all active:scale-[0.98]"
                    >
                      Sign In
                    </Button>
                    
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-200"></div>
                      </div>
                      <span className="relative px-4 bg-[#F8F9FD] text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Or continue with</span>
                    </div>

                    <div className="flex items-center justify-center gap-6">
                      <button 
                        onClick={handleGoogleLogin}
                        className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center hover:shadow-md transition-all active:scale-95"
                      >
                        <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={24} height={24} />
                      </button>
                      <button className="w-14 h-14 bg-white rounded-2xl shadow-md border border-zinc-100 flex items-center justify-center hover:shadow-lg transition-all active:scale-95">
                        <svg className="w-6 h-6 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.96.95-2.04 1.9-3.3 1.9-1.23 0-1.63-.75-3.1-.75-1.46 0-1.92.73-3.1.75-1.23.02-2.45-1.05-3.4-2.42-1.96-2.8-3.44-7.92-1.42-11.42 1-1.73 2.78-2.83 4.73-2.86 1.48-.03 2.88 1 3.8 1 .9 0 2.62-1.23 4.4-1.05 1.76.08 3.12.72 4.08 2.12-3.4 2-2.85 6.13.55 7.52-1.02 2.53-2.3 5.06-3.24 6.21zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.2 2.4-1.9 4.4-3.74 4.25z"/>
                        </svg>
                      </button>
                      <button className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center hover:shadow-md transition-all active:scale-95">
                        <Facebook className="w-6 h-6 text-[#1877F2] fill-current" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'role' && (
                <motion.div
                  key="role"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-zinc-900">Choose your role</h2>
                    <p className="text-zinc-500 mt-2">How do you want to use RentVerify?</p>
                  </div>
                  <div className="grid gap-4">
                    <button 
                      onClick={() => handleRoleSelect('TENANT')}
                      className="p-6 bg-white rounded-2xl text-left hover:border-primary hover:bg-primary/5 transition-all group shadow-sm hover:shadow-md border border-transparent"
                    >
                      <h3 className="font-bold text-lg group-hover:text-primary">I&apos;m a Tenant</h3>
                      <p className="text-sm text-zinc-500 mt-1">Search for verified houses and apply securely.</p>
                    </button>
                    <button 
                      onClick={() => handleRoleSelect('LANDLORD')}
                      className="p-6 bg-white rounded-2xl text-left hover:border-primary hover:bg-primary/5 transition-all group shadow-sm hover:shadow-md border border-transparent"
                    >
                      <h3 className="font-bold text-lg group-hover:text-primary">I&apos;m a Landlord</h3>
                      <p className="text-sm text-zinc-500 mt-1">List your property and find verified tenants.</p>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-success w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900">Welcome, {user?.displayName?.split(' ')[0]}!</h2>
                  <p className="text-zinc-500 mt-2 mb-8">You are successfully logged in as a {userProfile?.role?.toLowerCase()}.</p>
                  <Button 
                    className="w-full h-14 text-lg font-bold rounded-xl bg-[#9D7676] hover:bg-[#8D6666] text-white shadow-lg" 
                    size="lg" 
                    onClick={() => router.push(userProfile?.role === 'LANDLORD' ? '/dashboard/landlord' : '/dashboard/tenant')}
                  >
                    Go to Dashboard
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Scenic Illustration */}
        <div className="hidden lg:block w-[55%] p-4">
          <div className="w-full h-full rounded-[2.5rem] relative overflow-hidden group">
            <Image 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200" 
              alt="Scenic Sunset" 
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-16 left-12 right-12">
              <h2 className="text-white text-2xl font-medium leading-tight mb-8">
                Finally, all your work in one place.
              </h2>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
