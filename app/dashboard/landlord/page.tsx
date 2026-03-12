'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Home, 
  ClipboardList, 
  MessageSquare, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  ChevronRight,
  TrendingUp,
  Users,
  IndianRupee,
  ShieldCheck,
  LogOut,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui-base';
import { useAuth, db, OperationType, handleFirestoreError } from '@/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Property, RentalApplication } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import TenantRequests from '@/components/TenantRequests';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LandlordDashboard() {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const propertiesQuery = query(
      collection(db, 'properties'),
      where('landlordId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const applicationsQuery = query(
      collection(db, 'applications'),
      where('landlordId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubProperties = onSnapshot(propertiesQuery, (snapshot) => {
      const props = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      setProperties(props);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'properties'));

    const unsubApplications = onSnapshot(applicationsQuery, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RentalApplication));
      setApplications(apps);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'applications'));

    return () => {
      unsubProperties();
      unsubApplications();
    };
  }, [user]);

  const stats = [
    { label: 'Total Properties', value: properties.length, icon: <Home className="w-5 h-5" />, color: 'bg-blue-500' },
    { label: 'Active Requests', value: applications.filter(a => a.status === 'PENDING').length, icon: <ClipboardList className="w-5 h-5" />, color: 'bg-amber-500' },
    { label: 'Monthly Revenue', value: `₹${properties.reduce((acc, p) => acc + (p.status === 'Occupied' ? p.rent : 0), 0).toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-emerald-500' },
    { label: 'Total Tenants', value: properties.filter(p => p.status === 'Occupied').length, icon: <Users className="w-5 h-5" />, color: 'bg-violet-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-card-border hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-card-border">
          <div className="flex items-center gap-3 mb-6">
            <Image src="/1000130925-Photoroom.png" alt="RentVerify" width={40} height={40} className="rounded-xl object-contain" />
            <span className="font-blockat text-xl tracking-tighter">RentVerify</span>
          </div>
          
          <div className="bg-bg-secondary p-4 rounded-2xl border border-card-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                {user?.displayName?.[0] || 'L'}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate">{user?.displayName || 'Landlord'}</p>
                <Badge variant="success" className="text-[10px] py-0 px-1.5">
                  <ShieldCheck className="w-2.5 h-2.5 mr-1" /> Verified
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
            { id: 'properties', label: 'My Properties', icon: <Home className="w-5 h-5" /> },
            { id: 'requests', label: 'Tenant Requests', icon: <ClipboardList className="w-5 h-5" />, count: applications.filter(a => a.status === 'PENDING').length },
            { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-text-secondary hover:bg-bg-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-bold text-sm">{item.label}</span>
              </div>
              {item.count ? (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                  {item.count}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-card-border">
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-error hover:bg-error/5 transition-all font-bold text-sm"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-card-border flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search properties, tenants..." 
              className="w-full h-11 bg-bg-secondary border-none rounded-xl pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 bg-bg-secondary rounded-xl text-text-secondary hover:text-primary transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <Link href="/dashboard/landlord/add">
              <Button className="rounded-xl font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add Property
              </Button>
            </Link>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <Card key={i} className="relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 -mr-8 -mt-8 rounded-full group-hover:scale-110 transition-transform`}></div>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-2xl flex items-center justify-center text-white`}>
                        <div className={stat.color.replace('bg-', 'text-')}>{stat.icon}</div>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted font-bold uppercase tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-black text-text-primary">{stat.value}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Properties */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">My Properties</h2>
                    <button onClick={() => setActiveTab('properties')} className="text-sm font-bold text-primary hover:underline flex items-center">
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {properties.slice(0, 4).map((prop) => (
                      <PropertyCard key={prop.id} property={prop} />
                    ))}
                    {properties.length === 0 && (
                      <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-card-border">
                        <Home className="w-12 h-12 text-text-muted mx-auto mb-4" />
                        <p className="text-text-secondary font-bold">No properties listed yet.</p>
                        <Link href="/dashboard/landlord/add">
                          <Button variant="outline" className="mt-4">Add your first property</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Requests */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Recent Requests</h2>
                    <button onClick={() => setActiveTab('requests')} className="text-sm font-bold text-primary hover:underline">View All</button>
                  </div>
                  <div className="space-y-3">
                    {applications.slice(0, 5).map((app) => (
                      <div key={app.id} className="bg-white p-4 rounded-2xl border border-card-border flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center font-bold text-text-secondary">
                            {app.tenantName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{app.tenantName}</p>
                            <p className="text-[10px] text-text-muted truncate max-w-[120px]">{app.propertyName}</p>
                          </div>
                        </div>
                        <Badge variant={app.status === 'PENDING' ? 'warning' : app.status === 'APPROVED' ? 'success' : 'error'} className="text-[10px]">
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <div className="py-10 text-center bg-bg-secondary rounded-2xl border border-dashed border-card-border">
                        <p className="text-xs text-text-muted">No requests yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">All Properties</h2>
                <Link href="/dashboard/landlord/add">
                  <Button className="rounded-xl font-bold">
                    <Plus className="w-4 h-4 mr-2" /> Add New
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TenantRequests />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
