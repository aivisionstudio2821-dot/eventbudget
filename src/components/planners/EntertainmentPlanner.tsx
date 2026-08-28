import React from 'react';
import {
  Music,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Radio,
  Volume2,
  Mic2,
  Tv
} from 'lucide-react';
import { EventState, EntertainmentItem } from '../../types';
import { ENTERTAINMENT_ITEMS } from '../../data/initialData';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateDJTotal } from '../../utils/budgetCalculations';

interface EntertainmentPlannerProps {
  event: EventState;
  onUpdateEvent: (updated: EventState) => void;
}

export const EntertainmentPlanner: React.FC<EntertainmentPlannerProps> = ({
  event,
  onUpdateEvent,
}) => {
  const djAllocated = event.allocations.dj || 0;
  const currentDJTotal = calculateDJTotal(event);
  const diff = djAllocated - currentDJTotal;
  const isOver = diff < 0;

  const toggleItem = (itemId: string) => {
    const isSelected = !!event.selectedEntertainment?.[itemId];
    const updated: EventState = {
      ...event,
      selectedEntertainment: {
        ...(event.selectedEntertainment || {}),
        [itemId]: !isSelected,
      },
    };
    onUpdateEvent(updated);
  };

  const djSetups = ENTERTAINMENT_ITEMS.filter(e => e.type === 'dj' && !e.isAdditional);
  const addOnPerformers = ENTERTAINMENT_ITEMS.filter(e => e.isAdditional);

  return (
    <div className="space-y-6">
      
      {/* Header & Overview */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Music className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-extrabold text-white font-heading">DJ, Sound & Entertainment Planner</h3>
          </div>
          <p className="text-xs text-slate-400">
            Select DJ console setups, concert sound, Punjabi/Gujarati Dhol, live anchors and special FX.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800 self-start md:self-auto">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">DJ Budget</p>
            <p className="text-base font-black text-white font-mono-num">{formatINR(djAllocated)}</p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Selected Spend</p>
            <p className={`text-base font-black font-mono-num ${isOver ? 'text-rose-400' : 'text-purple-400'}`}>
              {formatINR(currentDJTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Disclaimer Note */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Estimated Market Range:</span> Final pricing depends on hours of playback, sound wattage needed for guest size, generator requirements, and event night rush.
        </div>
      </div>

      {/* Main DJ Packages */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-purple-400" />
          <span>Core DJ & Sound Setup</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {djSetups.map((item) => {
            const isSelected = !!event.selectedEntertainment?.[item.id];
            const customPrice = event.customEntertainmentPrices?.[item.id];
            const price = customPrice !== undefined ? customPrice : item.defaultPrice;

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-950/25 border-purple-500 ring-1 ring-purple-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h5 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {item.name}
                    </h5>
                    <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-700 bg-slate-950'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Est. Range: ₹{item.priceMin.toLocaleString('en-IN')} – ₹{item.priceMax.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-sm font-black text-purple-300 font-mono-num">
                    {formatINR(price)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {isSelected ? '✓ Selected' : '+ Select Setup'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add-on Artists, Lights & Special FX */}
      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Add-on Lighting, Live Artists & Stage FX</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {addOnPerformers.map((item) => {
            const isSelected = !!event.selectedEntertainment?.[item.id];
            const customPrice = event.customEntertainmentPrices?.[item.id];
            const price = customPrice !== undefined ? customPrice : item.defaultPrice;

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {item.name}
                    </h5>
                    <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold' : 'border-slate-700 bg-slate-950'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Est. Range: ₹{item.priceMin.toLocaleString('en-IN')} – ₹{item.priceMax.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 font-mono-num">
                    {formatINR(price)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {isSelected ? '✓ Added' : '+ Add Performer / FX'}
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
