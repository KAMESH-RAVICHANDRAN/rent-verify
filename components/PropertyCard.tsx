'use client';

import { MapPin, Star, Home, Users, Heart, ChevronRight, ShieldCheck } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui-base';
import Image from 'next/image';
import Link from 'next/link';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    address?: string;
    location?: string;
    rent?: number | string;
    price?: number | string;
    type: string;
    rating?: number | string;
    isVerified?: boolean;
    images?: string[];
    image?: string;
    status?: string;
  };
  onViewDetails?: (id: string) => void;
  isLandlordView?: boolean;
}

export default function PropertyCard({ property, onViewDetails, isLandlordView }: PropertyCardProps) {
  // Ensure rent is a number for formatting
  const rentValue = typeof property.rent === 'string' 
    ? parseInt(property.rent.replace(/\D/g, '')) 
    : property.rent || (typeof property.price === 'string' ? parseInt(property.price.replace(/\D/g, '')) : property.price);

  const cardContent = (
    <>
      <div className="h-56 bg-bg-tertiary relative overflow-hidden shrink-0">
        <Image 
          src={property.images?.[0] || property.image || `https://picsum.photos/seed/${property.id}/800/600`} 
          alt={property.title} 
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {!isLandlordView && (
            <button className="p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white text-text-muted hover:text-error transition-colors shadow-sm">
              <Heart className="w-5 h-5" />
            </button>
          )}
          {isLandlordView && property.status && (
            <Badge variant={property.status === 'Occupied' ? 'success' : 'warning'}>
              {property.status}
            </Badge>
          )}
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {property.isVerified !== false && (
            <Badge variant="success" className="shadow-lg backdrop-blur-md bg-success/90 text-white border-none px-3 py-1">
              <ShieldCheck className="w-3 h-3 mr-1 inline" /> Verified Landlord
            </Badge>
          )}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{property.title}</h3>
          <div className="flex items-center gap-1 text-warning font-bold shrink-0 bg-warning/5 px-2 py-0.5 rounded-lg border border-warning/10">
            <Star className="w-4 h-4 fill-current" /> {property.rating || '4.5'}
          </div>
        </div>
        <p className="text-text-secondary flex items-center text-sm mb-4 line-clamp-1">
          <MapPin className="w-4 h-4 mr-1 text-text-muted shrink-0" /> {property.address || property.location}
        </p>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-bold bg-bg-secondary px-2.5 py-1.5 rounded-xl border border-card-border">
            <Home className="w-3.5 h-3.5 text-primary" /> {property.type}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-bold bg-bg-secondary px-2.5 py-1.5 rounded-xl border border-card-border">
            <Users className="w-3.5 h-3.5 text-success" /> Family Friendly
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-card-border">
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-0.5">Monthly Rent</p>
            <p className="text-2xl font-bold text-text-primary">₹{rentValue?.toLocaleString()}</p>
          </div>
          <Button 
            size="sm" 
            className="rounded-xl px-5"
          >
            {isLandlordView ? 'Manage' : 'Details'} <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <Link href={`/property/${property.id}`} className="block h-full">
      <Card className="p-0 overflow-hidden group cursor-pointer border-card-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md h-full flex flex-col">
        {cardContent}
      </Card>
    </Link>
  );
}
