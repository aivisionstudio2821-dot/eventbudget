import React from 'react';
import {
  Camera,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Film,
  Video,
  Share2
} from 'lucide-react';
import { EventState, PhotographyItem } from '../../types';
import { PHOTOGRAPHY_ITEMS } from '../../data/initialData';
import { formatINR } from '../../utils/currencyFormatter';
import { calculatePhotoTotal } from '../../utils/budgetCalculations';

interface PhotographyPlannerProps {
  event: EventState;
  onUpdateEvent: (updated: EventState) => void;
}

export const PhotographyPlanner: React.FC<PhotographyPlannerProps> = ({
  event,
  onUpdateEvent,
}) => {
  const photoAllocated = event.allocations.photography || 0;
  const currentPhotoTotal = calculatePhotoTotal(event);
  const diff = photoAllocated - currentPhotoTotal;
  const isOver = diff < 0;

  const toggleItem = (itemId: string) => {
    const isSelected = !!event.selectedPhotography?.[itemId];
    const updated: EventState = {
      ...event,
      selectedPhotography: {
        ...(event.selectedPhotography || {}),
        [itemId]: !isSelected,
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
            <Camera className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-extrabold text-white font-heading">Photography & Cinematic Film Planner</h3>
          </div>
          <p className="text-xs text-slate-400">
            Select candid photographers, traditional videographers, 4K aerial drones and instant reels creators.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800 self-start md:self-auto">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Photo Budget</p>
            <p className="text-base font-black text-white font-mono-num">{formatINR(photoAllocated)}</p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Selected Spend</p>
            <p className={`text-base font-black font-mono-num ${isOver ? 'text-rose-400' : 'text-cyan-400'}`}>
              {formatINR(currentPhotoTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Disclaimer Note */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Estimated Market Range:</span> Final pricing depends on crew size, hours of event coverage, album printing, teaser delivery timeline, and raw footage hand-over.
        </div>
      </div>

      {/* Photography Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PHOTOGRAPHY_ITEMS.map((item) => {
          const isSelected = !!event.selectedPhotography?.[item.id];
          const customPrice = event.customPhotographyPrices?.[item.id];
          const price = customPrice !== undefined ? customPrice : item.defaultPrice;

          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/20 border-cyan-500 ring-1 ring-cyan-500/50 shadow-md'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h5 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {item.name}
                  </h5>
                  <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold' : 'border-slate-700 bg-slate-950'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </span>
                </div>

                <p className="text-xs text-cyan-300/90 font-medium mb-2">
                  📦 {item.deliverables}
                </p>

                <p className="text-[11px] text-slate-400">
                  Est. Range: ₹{item.priceMin.toLocaleString('en-IN')} – ₹{item.priceMax.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-sm font-black text-cyan-300 font-mono-num">
                  {formatINR(price)}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {isSelected ? '✓ Selected' : '+ Add Coverage'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
