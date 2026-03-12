export type UserRole = 'LANDLORD' | 'TENANT';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  panVerified?: boolean;
  phone?: string;
  profession?: string;
  bio?: string;
}

export interface Property {
  id: string;
  landlordId: string;
  title: string;
  description: string;
  address: string;
  pincode: string;
  area: string;
  rent: number;
  deposit: number;
  type: string; // e.g., '2 BHK', 'Studio'
  images: string[];
  facilities: string[];
  rating: number;
  isVerified: boolean;
  status: 'Vacant' | 'Occupied';
  createdAt: any;
  latitude?: number;
  longitude?: number;
}

export interface RentalApplication {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  message?: string;
  createdAt: any;
  tenantName?: string;
  tenantEmail?: string;
  propertyName?: string;
}
