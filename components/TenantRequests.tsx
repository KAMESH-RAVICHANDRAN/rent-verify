'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, useAuth, handleFirestoreError, OperationType } from '@/firebase';
import { Card, Button, Badge } from '@/components/ui-base';
import { Check, X, Loader2 } from 'lucide-react';

interface Application {
  id: string;
  tenantId: string;
  propertyId: string;
  landlordId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  tenant?: any;
  property?: any;
}

export default function TenantRequests() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    const q = query(
      collection(db, 'applications'),
      where('landlordId', '==', user.uid)
    );

    const unsubscribeSnapshot = onSnapshot(q, async (snapshot) => {
      try {
        const appsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Application[];

        // Fetch tenant and property details for each application
        const enrichedApps = await Promise.all(
          appsData.map(async (app) => {
            let tenant = null;
            let property = null;

            try {
              const tenantDoc = await getDoc(doc(db, 'users', app.tenantId));
              if (tenantDoc.exists()) tenant = tenantDoc.data();
            } catch (e) {
              console.error("Error fetching tenant", e);
            }

            try {
              const propertyDoc = await getDoc(doc(db, 'properties', app.propertyId));
              if (propertyDoc.exists()) property = propertyDoc.data();
            } catch (e) {
              console.error("Error fetching property", e);
            }

            return { ...app, tenant, property };
          })
        );

        // Sort by createdAt descending
        enrichedApps.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });

        setApplications(enrichedApps);
        setLoading(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'applications');
        setLoading(false);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'applications');
      setLoading(false);
    });

    return () => unsubscribeSnapshot();
  }, [user]);

  const handleUpdateStatus = async (applicationId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status: newStatus
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${applicationId}`);
    }
  };

  if (loading) {
    return (
      <Card className="p-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (applications.length === 0) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-bg-primary rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-text-muted" />
        </div>
        <h3 className="text-xl font-bold mb-2">No pending requests</h3>
        <p className="text-text-secondary">You don&apos;t have any tenant applications at the moment.</p>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-6 border-b border-card-border">
        <h2 className="text-xl font-bold">Tenant Requests</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-bg-primary text-text-muted text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">Tenant</th>
              <th className="px-6 py-4 font-bold">Property</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {applications.map((req) => (
              <tr key={req.id} className="hover:bg-bg-primary transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {req.tenant?.displayName?.[0] || 'T'}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{req.tenant?.displayName || 'Unknown Tenant'}</p>
                      <p className="text-xs text-text-muted">{req.tenant?.email || 'No email'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {req.property?.title || 'Unknown Property'}
                </td>
                <td className="px-6 py-4">
                  <Badge 
                    variant={
                      req.status === 'APPROVED' ? 'success' : 
                      req.status === 'REJECTED' ? 'error' : 
                      'warning'
                    }
                  >
                    {req.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {req.status === 'PENDING' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-error hover:text-error hover:bg-error/10"
                        onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                      >
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                      >
                        <Check className="w-4 h-4 mr-1" /> Accept
                      </Button>
                    </>
                  )}
                  {req.status !== 'PENDING' && (
                    <span className="text-sm text-text-muted italic">
                      {req.status === 'APPROVED' ? 'Accepted' : 'Rejected'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
