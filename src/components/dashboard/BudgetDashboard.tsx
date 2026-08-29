import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingDown,
  ShieldCheck,
  Users,
  Activity,
  PlusCircle,
  Sparkles,
  RefreshCw,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { EventState, CategoryKey, CategoryAllocations } from '../../types';
import { formatINR } from '../../utils/currencyFormatter';
import {
  calculateTotalPlanned,
  calculateCategoryTotals,
  rebalanceEventAllocations
} from '../../utils/budgetCalculations';
import { calculateEventHealthScore } from '../../utils/eventScoring';
import { BudgetDonutChart } from './BudgetDonutChart';
import { CategoryCards } from './CategoryCards';
import { InteractiveBudgetEditor } from './InteractiveBudgetEditor';
import { WhatCanIGet } from './WhatCanIGet';
import { CanIAddThisModal } from './CanIAddThisModal';
import { HealthScoreModal } from './HealthScoreModal';
import {
  FOOD_ITEMS,
  DECOR_ITEMS,
  ENTERTAINMENT_ITEMS,
  PHOTOGRAPHY_ITEMS,
  VENUE_TYPES,
  VENUE_ADDONS,
} from '../../data/initialData';

interface BudgetDashboardProps {
  event: EventState;
  onUpdateEvent: (updated: EventState) => void;
  onSelectCategory: (key: CategoryKey) => void;
}

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({
  event,
  onUpdateEvent,
  onSelectCategory,
}) => {
  const [showCanIAddModal, setShowCanIAddModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const totalBudget = event.totalBudget || 0;
  const guestCount = Math.max(1, event.guestCount || 1);
  const plannedSpend = calculateTotalPlanned(event);
  const bufferAllocated = event.allocations.buffer || 0;
  const totalCommitted = plannedSpend + bufferAllocated;

  const remainingBudget = totalBudget - plannedSpend;
  const netCushion = totalBudget - totalCommitted;

  const isOverBudget = netCushion < 0;
  const overAmount = Math.abs(netCushion);
  const costPerGuest = Math.round(plannedSpend / guestCount);

  const healthData = calculateEventHealthScore(event);

  // Trigger celebratory confetti when in healthy budget state
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#10b981', '#fbbf24'],
    });
  };

  // Rebalance Auto Fix
  const handleFixMyBudget = () => {
  if (overAmount <= 0) return;

  const { newAllocations } = rebalanceEventAllocations(event, overAmount);

  let updated: EventState = {
    ...event,
    allocations: newAllocations,
    customFoodPrices: { ...event.customFoodPrices },
    customDecorPrices: { ...event.customDecorPrices },
    customEntertainmentPrices: { ...event.customEntertainmentPrices },
    customPhotographyPrices: { ...event.customPhotographyPrices },
    customVenueAddonPrices: { ...event.customVenueAddonPrices },
    miscItems: (event.miscItems || []).map(item => ({ ...item })),
  };

  let remaining =
    calculateTotalPlanned(updated) +
    (updated.allocations.buffer || 0) -
    totalBudget;

  const reduceItems = (
    selected: Record<string, boolean>,
    prices: Record<string, number>,
    items: Array<{ id: string; defaultPrice: number }>
  ) => {
    for (const [id, isSelected] of Object.entries(selected || {})) {
      if (!isSelected || remaining <= 0) continue;

      const item = items.find(x => x.id === id);

      const currentPrice =
        prices[id] !== undefined
          ? prices[id]
          : item?.defaultPrice || 0;

      const reduction = Math.min(currentPrice, remaining);

      prices[id] = currentPrice - reduction;
      remaining -= reduction;
    }
  };

  // Miscellaneous expenses first
  for (const item of updated.miscItems || []) {
    if (remaining <= 0) break;
    if (item.selected === false || item.price <= 0) continue;

    const reduction = Math.min(item.price, remaining);
    item.price -= reduction;
    remaining -= reduction;
  }

  // Flexible categories
  reduceItems(
    updated.selectedPhotography,
    updated.customPhotographyPrices,
    PHOTOGRAPHY_ITEMS
  );

  reduceItems(
    updated.selectedDecorItems,
    updated.customDecorPrices,
    DECOR_ITEMS
  );

  reduceItems(
    updated.selectedEntertainment,
    updated.customEntertainmentPrices,
    ENTERTAINMENT_ITEMS
  );

  // Venue add-ons
  reduceItems(
    updated.selectedVenueAddons,
    updated.customVenueAddonPrices,
    VENUE_ADDONS
  );

  // Venue itself
  if (remaining > 0 && updated.selectedVenueId) {
    const venue = VENUE_TYPES.find(
      v => v.id === updated.selectedVenueId
    );

    const currentVenuePrice =
      updated.customVenuePrice !== undefined
        ? updated.customVenuePrice
        : venue?.defaultPrice || 0;

    const reduction = Math.min(currentVenuePrice, remaining);

    updated.customVenuePrice =
      currentVenuePrice - reduction;

    remaining -= reduction;
  }

  // Food is reduced last
  if (remaining > 0) {
    const guests = Math.max(1, updated.guestCount || 1);

    for (const [id, isSelected] of Object.entries(
      updated.selectedFoodItems || {}
    )) {
      if (!isSelected || remaining <= 0) continue;

      const item = FOOD_ITEMS.find(x => x.id === id);

      const perGuest =
        updated.customFoodPrices[id] !== undefined
          ? updated.customFoodPrices[id]
          : item?.defaultPrice || 0;

      const totalItemCost = perGuest * guests;
      const reduction = Math.min(totalItemCost, remaining);

      updated.customFoodPrices[id] = Math.max(
        0,
        perGuest - reduction / guests
      );

      remaining -= reduction;
    }
  }

  onUpdateEvent(updated);

  const finalCommitted =
    calculateTotalPlanned(updated) +
    (updated.allocations.buffer || 0);

  if (finalCommitted <= totalBudget + 1) {
    triggerConfetti();
  }
};

  // Curated preset apply
  const handleApplyCuratedPackage = () => {
    const updated: EventState = {
      ...event,
      selectedFoodItems: {
        starter_paneer_tikka: true,
        main_punjabi: true,
        drink_soft_drinks: true,
        dessert_ice_cream: true,
      },
      selectedDecorItems: {
        decor_balloon: true,
        decor_backdrop: true,
        decor_welcome_board: true,
      },
      selectedEntertainment: {
        ent_basic_dj: true,
      },
      selectedPhotography: {
        photo_basic: true,
      },
      selectedVenueId: 'venue_society_hall',
    };
    onUpdateEvent(updated);
    triggerConfetti();
  };

  // Simulate upgrade in DJ to trigger overbudget demo flow
  const handleSimulateUpgrade = () => {
    const updated: EventState = {
      ...event,
      selectedEntertainment: {
        ent_basic_dj: true,
        ent_dj_lights: true, // +₹4,000 to ₹5,000
      },
      customEntertainmentPrices: {
        ...event.customEntertainmentPrices,
        ent_basic_dj: 6000,
        ent_dj_lights: 4000,
      }
    };
    onUpdateEvent(updated);
  };

  const handleAddCustomExpense = (name: string, price: number) => {
    const newItem = {
      id: `custom_${Date.now()}`,
      name,
      price,
      isCustom: true,
      selected: true,
    };
    const updated: EventState = {
      ...event,
      miscItems: [...(event.miscItems || []), newItem],
    };
    onUpdateEvent(updated);
  };

  const handleUpdateAllocations = (newAllocations: CategoryAllocations) => {
    onUpdateEvent({
      ...event,
      allocations: newAllocations,
      isCustomAllocation: true,
    });
  };

  return (
    <section id="dashboard-section" className="py-8 sm:py-12 space-y-8">
      
      {/* Event Details Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl">🎉</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-white font-heading">{event.title}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {event.eventType}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              📍 {event.city} &nbsp;•&nbsp; 👥 {event.guestCount} Guests &nbsp;•&nbsp; 📅 {new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} &nbsp;•&nbsp; ⭐ Priority: <strong className="text-purple-300">{event.priority}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowCanIAddModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5 active:scale-95 shadow"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>“Can I Add This?”</span>
          </button>

          <button
            onClick={() => setShowEditor(!showEditor)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showEditor ? 'Hide Sliders' : 'Edit Budget Sliders'}</span>
          </button>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Budget */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800/90 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Budget</span>
            <Wallet className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white font-mono-num">
            {formatINR(totalBudget)}
          </p>
          <p className="text-[10px] text-slate-400">Fixed target cap</p>
        </div>

        {/* Planned Amount */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800/90 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Planned Spend</span>
            <TrendingDown className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-pink-300 font-mono-num">
            {formatINR(plannedSpend)}
          </p>
          <p className="text-[10px] text-slate-400">Selected services</p>
        </div>

        {/* Remaining Budget */}
        <div className={`p-4 sm:p-5 rounded-2xl border space-y-1 shadow-md transition-all ${
          remainingBudget < 0
            ? 'bg-rose-950/20 border-rose-500/50'
            : 'bg-[#0f172a]/90 border-slate-800/90'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Remaining</span>
            <CheckCircle2 className={`w-4 h-4 ${remainingBudget < 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
          </div>
          <p className={`text-xl sm:text-2xl font-black font-mono-num ${
            remainingBudget < 0 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            {formatINR(remainingBudget)}
          </p>
          <p className="text-[10px] text-slate-400">
            {remainingBudget >= 0 ? 'Available balance' : 'Over allocation'}
          </p>
        </div>

        {/* Emergency Buffer */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800/90 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Safety Buffer</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-indigo-300 font-mono-num">
            {formatINR(bufferAllocated)}
          </p>
          <p className="text-[10px] text-slate-400">
            {((bufferAllocated / (totalBudget || 1)) * 100).toFixed(0)}% contingency
          </p>
        </div>

        {/* Cost Per Guest */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800/90 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Cost / Guest</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-300 font-mono-num">
            {formatINR(costPerGuest)}
          </p>
          <p className="text-[10px] text-slate-400">For {guestCount} guests</p>
        </div>

        {/* Event Health Score */}
        <div
          onClick={() => setShowHealthModal(true)}
          className="p-4 sm:p-5 rounded-2xl bg-[#0f172a]/90 border border-purple-500/30 hover:border-purple-500 hover:bg-slate-900 cursor-pointer transition-all space-y-1 shadow-md group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Health Score</span>
            <Activity className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-xl sm:text-2xl font-black font-mono-num" style={{ color: healthData.statusColor }}>
              {healthData.overallScore}
            </p>
            <span className="text-xs text-slate-400 font-bold">/100</span>
          </div>
          <p className="text-[10px] font-semibold flex items-center gap-1" style={{ color: healthData.statusColor }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: healthData.statusColor }} />
            <span>{healthData.status} (Details →)</span>
          </p>
        </div>

      </div>

      {/* Live Status Banner & Rebalance Bar */}
      <div>
        {isOverBudget ? (
          <div className="p-4 sm:p-5 rounded-3xl bg-rose-950/30 border border-rose-500/40 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  🔴 {formatINR(overAmount)} OVER EVENT BUDGET
                </h3>
                <p className="text-xs text-rose-300/90 mt-0.5">
                  Your planned selections exceed total budget. Let our smart engine automatically trim non-priority areas.
                </p>
              </div>
            </div>

            <button
              onClick={handleFixMyBudget}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 animate-pulse"
            >
              <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>⚡ FIX MY BUDGET</span>
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  🎉 YOUR EVENT FITS YOUR BUDGET!
                </h3>
                <p className="text-xs text-emerald-300/90 mt-0.5">
                  All selections fit within {formatINR(totalBudget)} with {formatINR(bufferAllocated)} safe rainy-day buffer secured.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={triggerConfetti}
                className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
              >
                ✨ Celebrate!
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Budget Editor (Collapsible) */}
      {showEditor && (
        <InteractiveBudgetEditor
          event={event}
          onUpdateAllocations={handleUpdateAllocations}
        />
      )}

      {/* Donut Chart & Category Breakdown */}
      <BudgetDonutChart event={event} />

      {/* Smart "What Can I Get in My Budget" Generator */}
      <WhatCanIGet
        event={event}
        onApplyPresetPackage={handleApplyCuratedPackage}
        onSimulateOverbudgetUpgrade={handleSimulateUpgrade}
        onFixMyBudget={handleFixMyBudget}
        isOverBudget={isOverBudget}
        overAmount={overAmount}
      />

      {/* Responsive Category Cards */}
      <CategoryCards
        event={event}
        onSelectCategory={onSelectCategory}
      />

      {/* Modals */}
      <CanIAddThisModal
        isOpen={showCanIAddModal}
        onClose={() => setShowCanIAddModal(false)}
        event={event}
        onAddCustomExpense={handleAddCustomExpense}
      />

      <HealthScoreModal
        isOpen={showHealthModal}
        onClose={() => setShowHealthModal(false)}
        event={event}
      />

    </section>
  );
};
