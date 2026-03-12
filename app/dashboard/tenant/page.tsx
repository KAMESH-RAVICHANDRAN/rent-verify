'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  ChevronDown, 
  Home, 
  ArrowLeft, 
  LayoutGrid, 
  Map as MapIcon, 
  Plus, 
  Mic, 
  MessageSquare, 
  ArrowUp, 
  Camera, 
  Github, 
  Upload, 
  Settings, 
  LayoutTemplate, 
  Layers, 
  Link as LinkIcon, 
  Check, 
  Star, 
  Heart, 
  ShieldCheck, 
  Bell, 
  LogOut,
  Loader2,
  ClipboardList
} from 'lucide-react';
import { Button, Card, Badge, Input } from '@/components/ui-base';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import PropertyCard from '@/components/PropertyCard';
import { useAuth, db, OperationType, handleFirestoreError } from '@/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { Property } from '@/types';
import SearchableAreaSelect from '@/components/SearchableAreaSelect';
import MyApplications from '@/components/MyApplications';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-bg-secondary animate-pulse rounded-3xl" />
});

export default function TenantDashboard() {
  const { user, userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('explore');
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState('');
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (activeTab !== 'explore') return;

    let q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'), limit(20));

    if (pincode) {
      q = query(collection(db, 'properties'), where('pincode', '==', pincode), orderBy('createdAt', 'desc'), limit(20));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const props = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      setProperties(props);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'properties');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pincode, activeTab]);

  const handleNearby = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Nearby location:", position.coords.latitude, position.coords.longitude);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/5 hidden xl:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Home className="text-black w-6 h-6" />
          </div>
          <span className="font-black text-xl tracking-tighter">RentVerify</span>
        </div>

        <div className="space-y-8 flex-1">
          {/* Profile Card */}
          <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {user?.displayName?.[0] || 'T'}
              </div>
              <div>
                <p className="font-bold">{user?.displayName || 'Tenant'}</p>
                <Badge variant="success" className="text-[10px] py-0">Verified</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 p-3 rounded-2xl text-center">
                <p className="text-[10px] text-zinc-500 font-bold uppercase">Applications</p>
                <p className="text-lg font-bold">3</p>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl text-center">
                <p className="text-[10px] text-zinc-500 font-bold uppercase">Favorites</p>
                <p className="text-lg font-bold">12</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {[
              { id: 'explore', label: 'Explore Houses', icon: <Search className="w-5 h-5" /> },
              { id: 'applications', label: 'My Applications', icon: <ClipboardList className="w-5 h-5" /> },
              { id: 'saved', label: 'Saved Homes', icon: <Heart className="w-5 h-5" /> },
              { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:bg-white/5'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Smart Match Section */}
          <div className="bg-gradient-to-br from-primary/20 to-transparent p-6 rounded-3xl border border-primary/20">
            <ShieldCheck className="w-8 h-8 text-primary mb-4" />
            <h4 className="font-bold mb-2">Smart Match AI</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              We found 5 properties that match your profile and budget perfectly.
            </p>
            <Button size="sm" className="w-full rounded-xl font-bold">View Matches</Button>
          </div>
        </div>

        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 p-4 text-zinc-500 hover:text-white transition-colors font-bold"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header Search Area */}
        <header className="p-6 sticky top-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3 bg-white/5 rounded-full p-2 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2 px-4 border-r border-white/10">
                  <MapPin className="w-4 h-4 text-primary" />
                  <input 
                    type="text" 
                    placeholder="Pincode" 
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-20 bg-transparent border-none outline-none text-sm font-bold placeholder:text-zinc-600"
                  />
                </div>
                <SearchableAreaSelect 
                  onSelect={(area) => {
                    setSelectedArea(area);
                    if (area) setPincode(area.pincode);
                  }}
                  className="flex-1 bg-transparent border-none shadow-none text-white"
                />
                <button 
                  onClick={handleNearby}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${isLocating ? 'bg-primary/20 text-primary' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
                >
                  {isLocating ? 'Locating...' : 'Nearby'}
                </button>
                <Button size="sm" className="rounded-full px-6 h-10 font-bold">Search</Button>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-[#0A0A0A]"></span>
                </button>
                <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                  <button 
                    onClick={() => setView('grid')}
                    className={`p-2 rounded-full transition-all ${view === 'grid' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setView('map')}
                    className={`p-2 rounded-full transition-all ${view === 'map' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                  >
                    <MapIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Button variant="outline" size="sm" className="rounded-full border-white/10 bg-white/5 text-xs font-bold shrink-0">
                <SlidersHorizontal className="w-3 h-3 mr-2" /> All Filters
              </Button>
              {['Under ₹20k', '2 BHK', 'Family Only', 'With Parking', 'Verified Only'].map((filter) => (
                <button key={filter} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-zinc-400 hover:border-white/20 hover:text-white transition-all shrink-0">
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'explore' && (
              <>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                    <p className="text-zinc-500 font-bold">Curating verified homes for you...</p>
                  </div>
                ) : properties.length > 0 ? (
                  view === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {properties.map((prop) => (
                        <PropertyCard key={prop.id} property={prop} />
                      ))}
                    </div>
                  ) : (
                    <div className="h-[calc(100vh-320px)] rounded-3xl overflow-hidden border border-white/10">
                      <MapComponent properties={properties} />
                    </div>
                  )
                ) : (
                  <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-zinc-700" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">No properties found</h3>
                    <p className="text-zinc-500">Try searching in a different area or pincode.</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'applications' && <MyApplications />}
            
            {(activeTab === 'saved' || activeTab === 'messages' || activeTab === 'settings') && (
              <div className="flex flex-col items-center justify-center py-40 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Settings className="w-10 h-10 text-zinc-700" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon</h3>
                <p className="text-zinc-500">We are working hard to bring this feature to you.</p>
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center gap-2 shadow-2xl">
            <div className="flex items-center gap-2 px-4 border-r border-white/10">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-zinc-400">AI Assistant Online</span>
            </div>
            
            <div className="flex items-center gap-1">
              <button className="p-3 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                <Mic className="w-5 h-5" />
              </button>
              <button className="p-3 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                <Camera className="w-5 h-5" />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                  className={`p-3 rounded-full transition-all ${isPlusMenuOpen ? 'bg-primary text-white rotate-45' : 'bg-white text-black hover:scale-110'}`}
                >
                  <Plus className="w-6 h-6" />
                </button>
                
                <AnimatePresence>
                  {isPlusMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: -20, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      className="absolute bottom-full right-0 mb-4 w-64 bg-zinc-900 border border-white/10 rounded-[2.5rem] p-4 shadow-2xl"
                    >
                      <div className="space-y-2">
                        {[
                          { icon: <LayoutTemplate className="w-4 h-4" />, label: 'Use Template' },
                          { icon: <Layers className="w-4 h-4" />, label: 'Import Code' },
                          { icon: <LinkIcon className="w-4 h-4" />, label: 'Connect URL' },
                          { icon: <Github className="w-4 h-4" />, label: 'Sync Github' },
                        ].map((item, i) => (
                          <button key={i} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors text-sm font-medium text-zinc-400 hover:text-white">
                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                              {item.icon}
                            </div>
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 border-l border-white/10">
              <input 
                type="text" 
                placeholder="Ask AI to find houses..." 
                className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-zinc-600"
              />
              <button className="p-2 bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
