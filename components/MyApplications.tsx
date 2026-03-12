'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, useAuth, handleFirestoreError, OperationType } from '@/firebase';
import { Card, Button, Badge } from '@/components/ui-base';
import { Clock, CheckCircle2, XCircle, Home, Calendar, IndianRupee, Loader2 } from 'lucide-react';
import { RentalApplication } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'applications'),
      where('tenantId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RentalApplication));
      
      // Sort by createdAt descending
      apps.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });

      setApplications(apps);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'applications');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-zinc-500 font-bold">Fetching your applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <Home className="w-10 h-10 text-zinc-700" />
        </div>
        <h3 className="text-2xl font-bold mb-2">No applications yet</h3>
        <p className="text-zinc-500 mb-6">Start exploring properties and apply for your dream home.</p>
        <Link href="/search">
          <Button className="rounded-full px-8 font-bold">Explore Properties</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">My Applications</h2>
      <div className="grid grid-cols-1 gap-4">
        {applications.map((app) => (
          <Card key={app.id} className="bg-white/5 border-white/10 p-6 hover:border-primary/30 transition-all group">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-32 bg-zinc-800 rounded-2xl overflow-hidden relative shrink-0">
                <Image 
                  src={`https://picsum.photos/seed/${app.propertyId}/400/300`} 
                  alt="Property" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{app.propertyTitle || 'Property Name'}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-zinc-400 flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" /> Applied on {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : 'Recently'}
                      </p>
                      <p className="text-sm text-primary font-bold flex items-center">
                        <IndianRupee className="w-4 h-4 mr-0.5" /> {app.rent?.toLocaleString()}/mo
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={
                        app.status === 'APPROVED' ? 'success' : 
                        app.status === 'REJECTED' ? 'error' : 
                        'warning'
                      }
                      className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    >
                      {app.status === 'PENDING' && <Clock className="w-3 h-3 mr-1.5" />}
                      {app.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3 mr-1.5" />}
                      {app.status === 'REJECTED' && <XCircle className="w-3 h-3 mr-1.5" />}
                      {app.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`/property/${app.propertyId}`}>
                    <Button variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5 text-xs font-bold">
                      View Property
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5 text-xs font-bold">
                    Message Landlord
                  </Button>
                  {app.status === 'APPROVED' && (
                    <Button size="sm" className="rounded-xl text-xs font-bold">
                      Proceed to Agreement
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
