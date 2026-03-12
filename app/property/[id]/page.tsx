'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Home, 
  ShieldCheck, 
  CheckCircle2, 
  Play, 
  MessageSquare, 
  Calendar,
  Share2,
  Heart,
  Info,
  Star,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui-base';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot, addDoc, collection, serverTimestamp, query, where } from 'firebase/firestore';
import { db, useAuth, OperationType, handleFirestoreError } from '@/firebase';
import { Property } from '@/types';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = onSnapshot(doc(db, 'properties', id as string), (docSnap) => {
      if (docSnap.exists()) {
        setProperty({ id: docSnap.id, ...docSnap.data() } as Property);
      } else {
        console.error("Property not found");
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `properties/${id}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (!id || !user) return;

    const q = query(
      collection(db, 'applications'),
      where('propertyId', '==', id),
      where('tenantId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setApplied(true);
      }
    });

    return () => unsubscribe();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (!property) return;

    setApplying(true);
    try {
      await addDoc(collection(db, 'applications'), {
        propertyId: property.id,
        tenantId: user.uid,
        landlordId: property.landlordId,
        status: 'pending',
        createdAt: serverTimestamp(),
        propertyTitle: property.title,
        tenantName: user.displayName,
        tenantEmail: user.email,
        rent: property.rent
      });
      setApplied(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'applications');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-text-secondary font-bold">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Property not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['https://picsum.photos/seed/prop/1200/800'];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-bg-secondary rounded-full transition-colors"><Share2 className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-bg-secondary rounded-full transition-colors"><Heart className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Media & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-bg-tertiary relative">
                <Image src={images[activeImage]} alt={property.title} fill className="object-cover" referrerPolicy="no-referrer" />
                <div className="absolute bottom-6 left-6 flex gap-2">
                  <Badge variant="success">Verified Property</Badge>
                  {property.facilities?.includes('Video Walkthrough') && <Badge variant="info">Video Available</Badge>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(i)}
                    className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all relative ${activeImage === i ? 'border-primary' : 'border-transparent'}`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold text-text-primary">{property.title}</h1>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-lg text-text-secondary flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-primary" /> {property.area}, {property.address} - {property.pincode}
                      </p>
                      <div className="flex items-center gap-1 text-warning font-bold bg-warning/5 px-2 py-1 rounded-lg border border-warning/10">
                        <Star className="w-4 h-4 fill-current" /> 4.8
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">₹{property.rent.toLocaleString()}<span className="text-sm text-text-muted font-normal">/month</span></p>
                    <p className="text-sm text-success font-medium mt-1">Available Immediately</p>
                  </div>
                </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Type', value: property.type, icon: <Home className="w-4 h-4" /> },
                  { label: 'Area', value: '1200 sqft', icon: <Info className="w-4 h-4" /> },
                  { label: 'Floor', value: '4th of 12', icon: <Info className="w-4 h-4" /> },
                  { label: 'Facing', value: 'East', icon: <Info className="w-4 h-4" /> },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-bg-secondary rounded-2xl flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-text-muted text-xs font-bold uppercase tracking-wider">
                      {item.icon} {item.label}
                    </div>
                    <p className="font-bold text-text-primary">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Description</h3>
                <p className="text-text-secondary leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Facilities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
                  {property.facilities?.map((facility, i) => (
                    <div key={i} className="flex items-center gap-2 text-text-secondary">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span className="text-sm font-medium">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Property Walkthrough</h3>
                <div className="aspect-video bg-bg-tertiary rounded-3xl flex items-center justify-center relative group cursor-pointer overflow-hidden">
                  <Image src="https://picsum.photos/seed/video/1200/800?blur=5" alt="Video Placeholder" fill className="object-cover opacity-50" referrerPolicy="no-referrer" />
                  <div className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="text-primary fill-current w-6 h-6 ml-1" />
                  </div>
                  <p className="absolute bottom-6 font-bold text-white">Watch Property Video</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Actions */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-accent-terracotta flex items-center justify-center text-white text-xl font-bold">
                  {property.landlordName?.[0] || 'L'}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{property.landlordName || 'Landlord'}</h4>
                  <div className="flex items-center gap-1 text-success text-xs font-bold uppercase">
                    <ShieldCheck className="w-3 h-3" /> Verified Landlord
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Security Deposit</span>
                  <span className="font-bold">₹{property.deposit?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Maintenance</span>
                  <span className="font-bold">₹3,500/mo</span>
                </div>
                <div className="pt-4 border-t border-card-border flex justify-between items-center">
                  <span className="text-text-primary font-bold">Total Monthly</span>
                  <span className="text-xl font-bold text-primary">₹{(property.rent + 3500).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleApply}
                  disabled={applying || applied}
                >
                  {applying ? <Loader2 className="w-5 h-5 animate-spin" /> : applied ? 'Application Sent' : 'Apply for House'}
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <MessageSquare className="w-5 h-5 mr-2" /> Message Landlord
                </Button>
              </div>

              <p className="text-xs text-text-muted text-center mt-6">
                By applying, you agree to share your verified profile with the landlord.
              </p>
            </Card>

            <Card className="bg-bg-secondary border-none">
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <h5 className="font-bold text-sm">Schedule a Visit</h5>
                  <p className="text-xs text-text-secondary mt-1">Landlord is available for visits on weekends between 10 AM - 4 PM.</p>
                  <button className="text-xs text-primary font-bold mt-2 hover:underline">Request Visit Slot</button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
