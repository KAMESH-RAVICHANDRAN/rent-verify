'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, ChevronDown, Home, ArrowLeft, LayoutGrid, Map as MapIcon, Loader2 } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui-base';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import MapComponent from '@/components/MapComponent';
import SearchableAreaSelect from '@/components/SearchableAreaSelect';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/firebase';
import { Property } from '@/types';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState(searchParams.get('pincode') || '');
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
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
  }, [pincode]);

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

  return (
    <div className="min-h-screen bg-[#FDFDFB]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Home className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">RentVerify</span>
          </Link>

          {/* Compact Search Bar */}
          <div className="flex-1 max-w-3xl flex flex-col sm:flex-row items-center gap-2 bg-zinc-100 rounded-2xl sm:rounded-full px-2 py-1.5 border border-black/5 shadow-inner">
            <div className="relative w-full sm:w-32">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Pincode" 
                maxLength={6}
                className="w-full bg-transparent border-none outline-none pl-8 pr-2 text-xs font-bold text-zinc-800 placeholder:text-zinc-400"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div className="h-4 w-px bg-zinc-300 hidden sm:block" />
            <SearchableAreaSelect 
              onSelect={(area) => {
                setSelectedArea(area);
                if (area) setPincode(area.pincode);
              }}
              className="flex-1 w-full bg-transparent border-none shadow-none"
            />
            <Button size="sm" className="rounded-full px-4 py-1 h-8 text-xs font-bold">
              Search
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex rounded-full border-black/5">
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
            </Button>
            <div className="flex bg-zinc-100 p-1 rounded-full border border-black/5">
              <button 
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-full transition-all ${view === 'grid' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setView('map')}
                className={`p-1.5 rounded-full transition-all ${view === 'map' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Modern Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative group">
            <button className="px-4 py-2 rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm font-bold text-zinc-700">
              Property Type <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-black/5 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {['Apartment', 'Villa', 'Studio', 'Penthouse'].map((type) => (
                <button key={type} className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="relative group">
            <button className="px-4 py-2 rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm font-bold text-zinc-700">
              Price Range <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-black/5 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {['Under ₹20k', '₹20k - ₹50k', '₹50k - ₹1L', 'Above ₹1L'].map((range) => (
                <button key={range} className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="relative group">
            <button className="px-4 py-2 rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm font-bold text-zinc-700">
              Bedrooms <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-2xl shadow-xl border border-black/5 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map((bhk) => (
                <button key={bhk} className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                  {bhk}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-text-secondary font-bold">Finding best properties for you...</p>
          </div>
        ) : properties.length > 0 ? (
          view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="h-[calc(100vh-280px)] w-full">
              <MapComponent properties={properties} />
            </div>
          )
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-card-border">
            <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-xl font-bold mb-2">No properties found</h3>
            <p className="text-text-secondary">Try searching in a different area or pincode.</p>
          </div>
        )}
      </main>
    </div>
  );
}
