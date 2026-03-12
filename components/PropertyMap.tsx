'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface Property {
  id: string;
  title: string;
  rent: number;
  latitude: number | null;
  longitude: number | null;
  address: string;
}

interface PropertyMapProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function PropertyMap({ properties, center = [12.9716, 77.5946], zoom = 12 }: PropertyMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return <div className="h-full w-full bg-bg-tertiary animate-pulse rounded-3xl" />;

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%', borderRadius: '1.5rem', zIndex: 0 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView center={center} zoom={zoom} />
      {properties.map((property) => (
        property.latitude && property.longitude && (
          <Marker key={property.id} position={[property.latitude, property.longitude]}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-sm">{property.title}</h3>
                <p className="text-xs text-text-secondary">{property.address}</p>
                <p className="text-primary font-bold mt-1">₹{property.rent.toLocaleString()}/mo</p>
                <a 
                  href={`/property/${property.id}`} 
                  className="text-[10px] text-primary hover:underline mt-2 block font-bold uppercase"
                >
                  View Details
                </a>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}
