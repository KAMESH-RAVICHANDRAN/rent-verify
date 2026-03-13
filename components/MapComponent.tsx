'use client';

import React, { useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { Property } from '@/types';

interface MapComponentProps {
  properties: Property[];
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function MapComponent({ properties }: MapComponentProps) {
  const [popupInfo, setPopupInfo] = useState<Property | null>(null);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-medium p-8 text-center">
        Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment variables to enable the map.
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-black/5 shadow-inner relative">
      <Map
        initialViewState={{
          latitude: 12.9716, // Default to Bangalore
          longitude: 77.5946,
          zoom: 11
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />
        
        {properties.map((prop) => (
          <Marker
            key={prop.id}
            longitude={prop.longitude || 77.5946}
            latitude={prop.latitude || 12.9716}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(prop);
            }}
          >
            <div className="cursor-pointer group">
              <div className="bg-white px-2 py-1 rounded-full shadow-lg border border-black/5 text-xs font-bold text-zinc-800 group-hover:bg-zinc-900 group-hover:text-white transition-all transform group-hover:scale-110">
                ₹{prop.rent?.toLocaleString()}
              </div>
              <MapPin className="w-5 h-5 text-primary fill-primary/20 -mt-1 mx-auto" />
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.longitude || 77.5946}
            latitude={popupInfo.latitude || 12.9716}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
            className="rounded-2xl overflow-hidden shadow-2xl border-none"
          >
            <div className="p-0 max-w-[200px]">
              <div className="relative w-full h-24">
                <Image 
                  src={popupInfo.images?.[0] || `https://picsum.photos/seed/${popupInfo.id}/800/600`} 
                  alt={popupInfo.title} 
                  fill
                  className="object-cover rounded-t-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm text-zinc-900 line-clamp-1">{popupInfo.title}</h3>
                <p className="text-xs text-zinc-500 mt-1">{popupInfo.area}, {popupInfo.pincode}</p>
                <p className="text-sm font-bold text-primary mt-2">₹{popupInfo.rent?.toLocaleString()}</p>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
