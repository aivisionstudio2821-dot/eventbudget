import React from 'react';
import {
  Sparkles,
  Palette,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Star
} from 'lucide-react';
import { EventState, DecorTheme, DecorItem } from '../../types';
import { DECOR_THEMES, DECOR_ITEMS } from '../../data/initialData';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateDecorTotal } from '../../utils/budgetCalculations';

interface DecorationPlannerProps {
  event: EventState;
  onUpdateEvent: (updated: EventState) => void;
}

export const DecorationPlanner: React.FC<DecorationPlannerProps> = ({
  event,
  onUpdateEvent,
}) => {
  const decorAllocated = event.allocations.decoration || 0;
  const currentDecorTotal = calculateDecorTotal(event);
  const diff = decorAllocated - currentDecorTotal;
  const isOver = diff < 0;

  const currentTheme = DECOR_THEMES.find(t => t.id === event.selectedThemeId) || DECOR_THEMES[0];

  const handleSelectTheme = (theme: DecorTheme) => {
    // Auto-select recommended items for this theme
    const newItems: Record<string, boolean> = { ...(event.selectedDecorItems || {}) };
    theme.suggestedItemIds.forEach(id => {
      newItems[id] = true;
    });

    const updated: EventState = {
      ...event,
      selectedThemeId: theme.id,
      selectedDecorItems: newItems,
    };
    onUpdateEvent(updated);
  };

  const toggleDecorItem = (itemId: string) => {
    const isSelected = !!event.selectedDecorItems?.[itemId];
    const updated: EventState = {
      ...event,
      selectedDecorItems: {
        ...(event.selectedDecorItems || {}),
        [itemId]: !isSelected,
      },
    };
    onUpdateEvent(updated);
  };

  const basicItems = DECOR_ITEMS.filter(d => d.tier === 'basic');
  const premiumItems = DECOR_ITEMS.filter(d => d.tier === 'premium');

  return (
    <div className="space-y-6">
      
      {/* Header & Overview */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h3 className="text-xl font-extrabold text-white font-heading">Decoration & Theme Planner</h3>
          </div>
          <p className="text-xs text-slate-400">
            Select aesthetic themes, stage setups, floral arches and photo booth corners.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800 self-start md:self-auto">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Decor Budget</p>
            <p className="text-base font-black text-white font-mono-num">{formatINR(decorAllocated)}</p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Selected Spend</p>
            <p className={`text-base font-black font-mono-num ${isOver ? 'text-rose-400' : 'text-pink-400'}`}>
              {formatINR(currentDecorTotal)}
            </p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Theme</p>
            <p className="text-xs font-bold text-purple-300 truncate max-w-[100px]">{currentTheme.name}</p>
          </div>
        </div>
      </div>

      {/* Pricing Disclaimer Note */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Estimated Market Range:</span> Final pricing depends on vendor, event date, venue dimensions, flower seasonality, and custom fabrication.
        </div>
      </div>

      {/* Theme Selector Carousel / Grid */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-pink-400" />
              1. Choose Event Theme & Aesthetic
            </h4>
            <p className="text-xs text-slate-400">Theme influences suggested decoration props and backdrop elements.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {DECOR_THEMES.map((theme) => {
            const isSelected = event.selectedThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleSelectTheme(theme)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-pink-950/30 border-pink-500 ring-1 ring-pink-500 shadow-lg'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <span className="text-2xl mb-1 block">{theme.icon}</span>
                  <p className={`text-xs font-bold ${isSelected ? 'text-pink-300' : 'text-slate-200'}`}>
                    {theme.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {theme.description}
                  </p>
                </div>
                {isSelected && (
                  <span className="mt-2 text-[10px] font-bold text-pink-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active Theme
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Basic Decor Grid */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <span>🎈 Basic Decor Essentials</span>
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {basicItems.map((item) => {
            const isSelected = !!event.selectedDecorItems?.[item.id];
            const customPrice = event.customDecorPrices?.[item.id];
            const price = customPrice !== undefined ? customPrice : item.defaultPrice;
            const isSuggested = currentTheme.suggestedItemIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleDecorItem(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-pink-950/20 border-pink-500 ring-1 ring-pink-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {item.name}
                    </h5>
                    <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-pink-600 border-pink-500 text-white' : 'border-slate-700 bg-slate-950'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Est. Range: ₹{item.priceMin.toLocaleString('en-IN')} – ₹{item.priceMax.toLocaleString('en-IN')}
                  </p>
                  {isSuggested && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      ★ Recommended for {currentTheme.name}
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-pink-300">
                    {formatINR(price)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {isSelected ? '✓ Added' : '+ Add to Setup'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium Decor Grid */}
      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
          <Star className="w-4 h-4 text-purple-400" />
          <span>✨ Premium & Experiential Decor</span>
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {premiumItems.map((item) => {
            const isSelected = !!event.selectedDecorItems?.[item.id];
            const customPrice = event.customDecorPrices?.[item.id];
            const price = customPrice !== undefined ? customPrice : item.defaultPrice;
            const isSuggested = currentTheme.suggestedItemIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleDecorItem(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-950/20 border-purple-500 ring-1 ring-purple-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {item.name}
                    </h5>
                    <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-700 bg-slate-950'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Est. Range: ₹{item.priceMin.toLocaleString('en-IN')} – ₹{item.priceMax.toLocaleString('en-IN')}
                  </p>
                  {isSuggested && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      ★ Recommended for {currentTheme.name}
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">
                    {formatINR(price)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {isSelected ? '✓ Added' : '+ Add to Setup'}
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
