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
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          placeholder="Search area or locality…"
          className="bg-transparent outline-none text-sm font-semibold w-full cursor-pointer text-text-primary placeholder:text-zinc-300"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onClick={(e) => e.stopPropagation()}
        />
        {selectedArea ? (
          <X 
            className="w-4 h-4 text-text-muted hover:text-error transition-colors ml-1 flex-shrink-0" 
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
          />
        ) : (
          <ChevronDown className={cn("w-4 h-4 text-zinc-300 transition-transform flex-shrink-0", isOpen && "rotate-180")} />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-card-border z-50 overflow-hidden max-h-64 overflow-y-auto"
          >
            {filteredAreas.length > 0 ? (
              <div className="p-2">
                {filteredAreas.map((area) => (
                  <div
                    key={area.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors"
                    onClick={() => handleSelect(area)}
                  >
                    <div>
                      <p className="text-sm font-bold text-text-primary">{area.name}</p>
                      <p className="text-xs text-text-muted">{area.pincode}</p>
                    </div>
                    {selectedArea?.id === area.id && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                <p className="text-sm text-text-muted">No areas found</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
