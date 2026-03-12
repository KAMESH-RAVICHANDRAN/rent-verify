'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface Area {
  id: string;
  name: string;
  pincode: string;
}

const AREAS: Area[] = [
  { id: '1', name: 'Indiranagar', pincode: '560038' },
  { id: '2', name: 'Koramangala', pincode: '560034' },
  { id: '3', name: 'HSR Layout', pincode: '560102' },
  { id: '4', name: 'Whitefield', pincode: '560066' },
  { id: '5', name: 'Jayanagar', pincode: '560041' },
  { id: '6', name: 'Electronic City', pincode: '560100' },
  { id: '7', name: 'BTM Layout', pincode: '560076' },
  { id: '8', name: 'Marathahalli', pincode: '560037' },
  { id: '9', name: 'JP Nagar', pincode: '560078' },
  { id: '10', name: 'Malleshwaram', pincode: '560003' },
  { id: '11', name: 'Hebbal', pincode: '560024' },
  { id: '12', name: 'Banashankari', pincode: '560050' },
  { id: '13', name: 'Rajajinagar', pincode: '560010' },
  { id: '14', name: 'Basavanagudi', pincode: '560004' },
  { id: '15', name: 'Frazer Town', pincode: '560005' },
];

interface SearchableAreaSelectProps {
  onSelect: (area: Area | null) => void;
  className?: string;
}

export default function SearchableAreaSelect({ onSelect, className }: SearchableAreaSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredAreas = AREAS.filter(area => 
    area.name.toLowerCase().includes(search.toLowerCase()) ||
    area.pincode.includes(search)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (area: Area) => {
    setSelectedArea(area);
    setSearch(area.name);
    setIsOpen(false);
    onSelect(area);
  };

  const clearSelection = () => {
    setSelectedArea(null);
    setSearch('');
    onSelect(null);
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div 
        className="flex items-center bg-white/5 rounded-xl border border-white/10 px-3 py-2 cursor-pointer hover:border-primary/30 transition-all shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MapPin className="w-4 h-4 text-text-muted mr-2" />
        <input
          type="text"
          placeholder="Select Area..."
          className="bg-transparent outline-none text-sm font-medium w-full cursor-pointer text-white placeholder:text-zinc-600"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onClick={(e) => e.stopPropagation()}
        />
        {selectedArea ? (
          <X 
            className="w-4 h-4 text-text-muted hover:text-error transition-colors ml-2" 
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
          />
        ) : (
          <ChevronDown className={cn("w-4 h-4 text-text-muted transition-transform", isOpen && "rotate-180")} />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden max-h-64 overflow-y-auto"
          >
            {filteredAreas.length > 0 ? (
              <div className="p-2">
                {filteredAreas.map((area) => (
                  <div
                    key={area.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                    onClick={() => handleSelect(area)}
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{area.name}</p>
                      <p className="text-xs text-zinc-500">{area.pincode}</p>
                    </div>
                    {selectedArea?.id === area.id && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-zinc-700 mx-auto mb-2 opacity-20" />
                <p className="text-sm text-zinc-500">No areas found</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
