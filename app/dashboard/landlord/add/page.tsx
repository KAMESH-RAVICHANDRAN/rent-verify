'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, useAuth, OperationType, handleFirestoreError } from '@/firebase';
import { Property } from '@/types';
import { 
  ArrowLeft, 
  Upload, 
  MapPin, 
  Home, 
  IndianRupee, 
  Info, 
  CheckCircle2,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { Button, Card, Input } from '@/components/ui-base';
import Image from 'next/image';

const FACILITIES_OPTIONS = [
  'Water Supply', 'Power Backup', 'Security', 'Parking', 'Gym', 'Garden', 
  'Elevator', 'Swimming Pool', 'Club House', 'Intercom', 'Gas Pipeline'
];

const PROPERTY_TYPES = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Studio', 'Penthouse', 'Villa'];

export default function AddPropertyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    area: '',
    pincode: '',
    rent: '',
    deposit: '',
    type: '2 BHK',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleFacility = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) 
        ? prev.filter(f => f !== facility) 
        : [...prev, facility]
    );
  };

  const handleAddImage = () => {
    const url = prompt('Enter image URL (for demo purposes)');
    if (url) setImages(prev => [...prev, url]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const propertyData: Partial<Property> = {
        landlordId: user.uid,
        title: formData.title,
        description: formData.description,
        address: formData.address,
        area: formData.area,
        pincode: formData.pincode,
        rent: Number(formData.rent),
        deposit: Number(formData.deposit),
        type: formData.type,
        images: images.length > 0 ? images : [`https://picsum.photos/seed/${Date.now()}/800/600`],
        facilities: selectedFacilities,
        rating: 4.5,
        isVerified: true,
        status: 'Vacant',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'properties'), propertyData);
      router.push('/dashboard/landlord');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'properties');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary pb-20">
      <nav className="bg-white border-b border-card-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors font-bold text-sm">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <h1 className="font-bold text-lg">List New Property</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" /> Basic Information
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary">Property Title</label>
                <Input 
                  name="title"
                  placeholder="e.g. Modern 2BHK with Balcony" 
                  required 
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary">Description</label>
                <textarea 
                  name="description"
                  className="w-full min-h-[120px] p-4 rounded-xl border border-card-border bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Describe your property, nearby landmarks, etc."
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Property Type</label>
                  <select 
                    name="type"
                    className="w-full h-12 px-4 rounded-xl border border-card-border bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Monthly Rent (₹)</label>
                  <Input 
                    name="rent"
                    type="number" 
                    placeholder="25000" 
                    required 
                    value={formData.rent}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Location Details
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary">Full Address</label>
                <Input 
                  name="address"
                  placeholder="House No, Street, Landmark" 
                  required 
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Area / Locality</label>
                  <Input 
                    name="area"
                    placeholder="e.g. Indiranagar" 
                    required 
                    value={formData.area}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Pincode</label>
                  <Input 
                    name="pincode"
                    placeholder="560038" 
                    maxLength={6} 
                    required 
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Facilities */}
          <Card className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" /> Facilities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FACILITIES_OPTIONS.map(facility => (
                <button
                  key={facility}
                  type="button"
                  onClick={() => toggleFacility(facility)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium ${
                    selectedFacilities.includes(facility)
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-white border-card-border text-text-secondary hover:border-primary/30'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    selectedFacilities.includes(facility) ? 'bg-primary border-primary text-white' : 'border-zinc-300'
                  }`}>
                    {selectedFacilities.includes(facility) && <Plus className="w-3 h-3" />}
                  </div>
                  {facility}
                </button>
              ))}
            </div>
          </Card>

          {/* Images */}
          <Card className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" /> Property Images
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((url, i) => (
                <div key={i} className="aspect-square rounded-2xl relative overflow-hidden group border border-card-border">
                  <Image src={url} alt="Property" fill className="object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddImage}
                className="aspect-square rounded-2xl border-2 border-dashed border-card-border flex flex-col items-center justify-center gap-2 text-text-muted hover:border-primary hover:text-primary transition-all bg-bg-primary"
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs font-bold">Add Image URL</span>
              </button>
            </div>
          </Card>

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-14 rounded-2xl"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-[2] h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Publish Property'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
