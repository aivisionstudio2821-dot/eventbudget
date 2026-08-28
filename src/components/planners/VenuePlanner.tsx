import React from 'react';
import {
  Building,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Shield,
  Zap,
  Wind
} from 'lucide-react';
import { EventState, VenueType, VenueAddon } from '../../types';
import { VENUE_TYPES, VENUE_ADDONS } from '../../data/initialData';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateVenueTotal } from '../../utils/budgetCalculations';

interface VenuePlannerProps {
  event: EventState;
  onUpdateEvent: (updated: EventState) => void;
}

export const VenuePlanner: React.FC<VenuePlannerProps> = ({
  event,
  onUpdateEvent,
}) => {
  const venueAllocated = event.allocations.venue || 0;
  const currentVenueTotal = calculateVenueTotal(event);
  const diff = venueAllocated - currentVenueTotal;
  const isOver = diff < 0;

  const handleSelectVenue = (venue: VenueType) => {
    const updated: EventState = {
      ...event,
      selectedVenueId: venue.id,
      customVenuePrice: venue.defaultPrice,
    };
    onUpdateEvent(updated);
  };

  const toggleAddon = (addonId: string) => {
    const isSelected = !!event.selectedVenueAddons?.[addonId];
    const updated: EventState = {
      ...event,
      selectedVenueAddons: {
        ...(event.selectedVenueAddons || {}),
        [addonId]: !isSelected,
      },
    };
    onUpdateEvent(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Overview */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-extrabold text-white font-heading">Venue & Amenities Planner</h3>
          </div>
          <p className="text-xs text-slate-400">
            Choose hall type and essential infrastructure add-ons like AC power, generator, and parking.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800 self-start md:self-auto">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Venue Budget</p>
            <p className="text-base font-black text-white font-mono-num">{formatINR(venueAllocated)}</p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Selected Spend</p>
            <p className={`text-base font-black font-mono-num ${isOver ? 'text-rose-400' : 'text-blue-400'}`}>
              {formatINR(currentVenueTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Disclaimer Note */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Estimated Market Range:</span> Venue charges vary widely by peak season dates (Aso/Kartik/Maha months), weekend vs weekday slots, and catering exclusivity rules.
        </div>
      </div>

      {/* Venue Types Grid */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          1. Select Venue Type
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {VENUE_TYPES.map((venue) => {
            const isSelected = event.selectedVenueId === venue.id;
            const price = venue.defaultPrice;

            return (
              <div
                key={venue.id}
                onClick={() => handleSelectVenue(venue)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/25 border-blue-500 ring-1 ring-blue-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h5 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {venue.name}
                    </h5>
                    <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-500 border-blue-400 text-slate-950 font-bold' : 'border-slate-700 bg-slate-950'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-semibold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 mb-2">
                    👥 {venue.capacity}
                  </span>

                  <p className="text-xs text-slate-400 leading-relaxed mb-2">
                    {venue.description}
                  </p>
                  
                  <p className="text-[11px] text-slate-500">
                    Est. Range: ₹{venue.priceMin.toLocaleString('en-IN')} – ₹{venue.priceMax.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-sm font-black text-blue-300 font-mono-num">
                    {price === 0 ? '₹0 (Free / Self-Owned)' : formatINR(price)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {isSelected ? '✓ Selected Venue' : 'Select Venue'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Venue Add-ons Grid */}
      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>2. Venue Facility Add-Ons & Utilities</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VENUE_ADDONS.map((addon) => {
            const isSelected = !!event.selectedVenueAddons?.[addon.id];
            const customPrice = event.customVenueAddonPrices?.[addon.id];
            const price = customPrice !== undefined ? customPrice : addon.defaultPrice;

            return (
              <div
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/20 border-cyan-500 ring-1 ring-cyan-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {addon.name}
                    </h5>
                    <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold' : 'border-slate-700 bg-slate-950'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Est. Range: ₹{addon.priceMin.toLocaleString('en-IN')} – ₹{addon.priceMax.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 font-mono-num">
                    {formatINR(price)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {isSelected ? '✓ Added' : '+ Add Utility'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
