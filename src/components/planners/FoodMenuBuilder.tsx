import React, { useState } from 'react';
import {
  Utensils,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Coffee,
  IceCream,
  Wine,
  HelpCircle,
  TrendingDown,
  Info,
  Layers,
  Zap,
  ArrowRight
} from 'lucide-react';
import { EventState, FoodItem, FoodPackage } from '../../types';
import { FOOD_ITEMS, FOOD_PACKAGES } from '../../data/initialData';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateFoodTotal, getSmartAlternatives } from '../../utils/budgetCalculations';

interface FoodMenuBuilderProps {
  event: EventState;
  onUpdateEvent: (updated: EventState) => void;
}

export const FoodMenuBuilder: React.FC<FoodMenuBuilderProps> = ({
  event,
  onUpdateEvent,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'starters' | 'main_course' | 'live_counters' | 'desserts' | 'drinks'>('all');

  const guestCount = Math.max(1, event.guestCount || 1);
  const foodAllocated = event.allocations.food || 0;
  const currentFoodTotal = calculateFoodTotal(event);
  const foodDiff = foodAllocated - currentFoodTotal;
  const isFoodOverBudget = foodDiff < 0;

  // Food items selection toggle
  const toggleFoodItem = (itemId: string) => {
    const isCurrentlySelected = !!event.selectedFoodItems?.[itemId];
    const updated: EventState = {
      ...event,
      selectedFoodItems: {
        ...(event.selectedFoodItems || {}),
        [itemId]: !isCurrentlySelected,
      },
    };
    onUpdateEvent(updated);
  };

  // Custom price adjustment
  const updateFoodPrice = (itemId: string, price: number) => {
    const updated: EventState = {
      ...event,
      customFoodPrices: {
        ...(event.customFoodPrices || {}),
        [itemId]: Math.max(0, price),
      },
    };
    onUpdateEvent(updated);
  };

  // Apply Food Package
  const applyPackage = (pkg: FoodPackage) => {
    const newSelected: Record<string, boolean> = {};
    pkg.itemIds.forEach((id) => {
      newSelected[id] = true;
    });

    const updated: EventState = {
      ...event,
      selectedFoodPackageId: pkg.id,
      selectedFoodItems: newSelected,
    };
    onUpdateEvent(updated);
  };

  // Replace Paneer Tikka with French Fries
  const handleSwapPaneerToFries = () => {
    const updated: EventState = {
      ...event,
      selectedFoodItems: {
        ...event.selectedFoodItems,
        starter_paneer_tikka: false,
        starter_french_fries: true,
      },
    };
    onUpdateEvent(updated);
  };

  // Remove Mocktails
  const handleRemoveMocktails = () => {
    const updated: EventState = {
      ...event,
      selectedFoodItems: {
        ...event.selectedFoodItems,
        drink_mocktails: false,
        drink_soft_drinks: true,
      },
    };
    onUpdateEvent(updated);
  };

  const filteredItems = activeTab === 'all'
    ? FOOD_ITEMS
    : FOOD_ITEMS.filter((item) => item.category === activeTab);

  const selectedCount = Object.values(event.selectedFoodItems || {}).filter(Boolean).length;
  const perPersonCost = Math.round(currentFoodTotal / guestCount);

  return (
    <div className="space-y-6">
      
      {/* Header & Overview */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Utensils className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-extrabold text-white font-heading">Food Menu & Catering Builder</h3>
          </div>
          <p className="text-xs text-slate-400">
            Select items for <strong className="text-white">{guestCount} Guests</strong>. Dynamic calculation multiplied by guest count.
          </p>
        </div>

        {/* Food Budget Pill */}
        <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800 self-start md:self-auto">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Food Allocation</p>
            <p className="text-base font-black text-white font-mono-num">{formatINR(foodAllocated)}</p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Menu Total ({selectedCount} items)</p>
            <p className={`text-base font-black font-mono-num ${isFoodOverBudget ? 'text-rose-400' : 'text-amber-400'}`}>
              {formatINR(currentFoodTotal)}
            </p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Per Plate</p>
            <p className="text-sm font-black text-purple-300 font-mono-num">₹{perPersonCost}/guest</p>
          </div>
        </div>
      </div>

      {/* Pricing Disclaimer Note */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Pricing Disclaimer:</span> Estimated market range — actual vendor quotation may vary. Final pricing depends on vendor, event date, quantity, location and customization.
        </div>
      </div>

      {/* Over-budget Warning & Cheaper Alternatives */}
      {isFoodOverBudget && (
        <div className="p-5 rounded-3xl bg-rose-950/25 border border-rose-500/40 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-rose-300 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
              <span>🔴 {formatINR(Math.abs(foodDiff))} OVER FOOD ALLOCATION</span>
            </div>
            <span className="text-xs text-rose-400 font-semibold">
              Earmarked: {formatINR(foodAllocated)} &nbsp;|&nbsp; Menu: {formatINR(currentFoodTotal)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Cheaper Alternatives (Instant Savings):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {event.selectedFoodItems?.starter_paneer_tikka && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Replace Paneer Tikka with French Fries</p>
                    <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                      Save ₹{50 * guestCount} (₹50/guest)
                    </p>
                  </div>
                  <button
                    onClick={handleSwapPaneerToFries}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all active:scale-95 shrink-0"
                  >
                    Swap & Save
                  </button>
                </div>
              )}

              {event.selectedFoodItems?.drink_mocktails && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Switch Mocktails to Chilled Soft Drinks</p>
                    <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                      Save ₹{55 * guestCount} (₹55/guest)
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveMocktails}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all active:scale-95 shrink-0"
                  >
                    Switch & Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Food Packages Generator (1-Click Presets) */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Suggested 1-Click Food Packages
            </h4>
            <p className="text-xs text-slate-400">Click any package to auto-populate the menu, then customize freely.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FOOD_PACKAGES.map((pkg) => {
            const isSelectedPkg = event.selectedFoodPackageId === pkg.id;
            const packageTotal = pkg.pricePerPerson * guestCount;

            return (
              <div
                key={pkg.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelectedPkg
                    ? 'bg-purple-950/30 border-purple-500 shadow-lg ring-1 ring-purple-500'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-bold text-white">{pkg.name}</h5>
                    {pkg.popular && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">{pkg.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Estimated Total:</span>
                    <span className="text-base font-extrabold text-white font-mono-num">
                      {formatINR(packageTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-purple-300 font-semibold">
                    <span>Rate: ~₹{pkg.pricePerPerson}/person</span>
                    <span>For {guestCount} guests</span>
                  </div>

                  <button
                    onClick={() => applyPackage(pkg)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isSelectedPkg
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {isSelectedPkg ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                    <span>{isSelectedPkg ? 'Package Applied' : 'Select Package'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-800 pb-3">
        {[
          { key: 'all', label: 'All Food Items' },
          { key: 'starters', label: '🍢 Starters' },
          { key: 'main_course', label: '🍛 Main Course' },
          { key: 'live_counters', label: '🔥 Live Counters' },
          { key: 'desserts', label: '🍨 Desserts' },
          { key: 'drinks', label: '🍹 Drinks & Water' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Food Items Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isSelected = !!event.selectedFoodItems?.[item.id];
          const customPrice = event.customFoodPrices?.[item.id];
          const currentPrice = customPrice !== undefined ? customPrice : item.defaultPrice;
          const itemTotal = currentPrice * guestCount;

          return (
            <div
              key={item.id}
              onClick={() => toggleFoodItem(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-950/20 border-purple-500 shadow-md ring-1 ring-purple-500/50'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h5 className={`text-sm font-bold transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {item.name}
                  </h5>
                  <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-700 bg-slate-950'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">
                  Estimated Range: ₹{item.priceMin}–₹{item.priceMax} / {item.unit}
                </p>
              </div>

              {/* Price Row & Calculation */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-300">
                    ₹{currentPrice}/{item.unit}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    × {guestCount} guests
                  </span>
                </div>

                <div className="text-right">
                  <span className={`text-sm font-extrabold font-mono-num ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                    {formatINR(itemTotal)}
                  </span>
                  <span className="text-[10px] text-purple-400 block font-semibold">
                    {isSelected ? '✓ Selected' : '+ Click to add'}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
