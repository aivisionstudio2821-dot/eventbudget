import React, { useState } from 'react';
import {
  PackageCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Zap,
  CheckCircle2,
  ChevronRight,
  Sliders
} from 'lucide-react';
import { EventState, CategoryKey } from '../../types';
import { formatINR } from '../../utils/currencyFormatter';

interface WhatCanIGetProps {
  event: EventState;
  onApplyPresetPackage: () => void;
  onSimulateOverbudgetUpgrade: () => void;
  onFixMyBudget: () => void;
  isOverBudget: boolean;
  overAmount: number;
}

export const WhatCanIGet: React.FC<WhatCanIGetProps> = ({
  event,
  onApplyPresetPackage,
  onSimulateOverbudgetUpgrade,
  onFixMyBudget,
  isOverBudget,
  overAmount,
}) => {
  const [selectedTab, setSelectedTab] = useState<'curated' | 'replaceSimulator'>('curated');

  // Replacement simulation state
  const [replaceCategory, setReplaceCategory] = useState<'dj' | 'decor' | 'food'>('dj');
  const [simulationApplied, setSimulationApplied] = useState(false);

  const budget = event.totalBudget;
  const guests = event.guestCount;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0e1628] via-[#10192e] to-[#121124] border border-purple-500/30 shadow-2xl relative overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-600/15 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Smart Synthesis Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            WHAT CAN I GET IN MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{formatINR(budget)}</span> BUDGET?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Curated realistic allocation tailored for <strong className="text-white">{guests} Guests</strong> in <strong className="text-white">{event.city}</strong> with <strong className="text-purple-300">{event.priority} Priority</strong>.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800 self-start md:self-auto shrink-0">
          <button
            onClick={() => setSelectedTab('curated')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTab === 'curated'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Curated Blueprint
          </button>
          <button
            onClick={() => setSelectedTab('replaceSimulator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedTab === 'replaceSimulator'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-3 h-3" />
            <span>Replace / Upgrade Demo</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Curated Blueprint */}
      {selectedTab === 'curated' && (
        <div className="mt-6 space-y-6 relative z-10">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Food Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 uppercase tracking-wider">🍽️ Food & Catering</span>
                <span className="font-extrabold text-white text-sm">
                  {formatINR(event.allocations.food || Math.round(budget * 0.44))}
                </span>
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                <li className="flex items-center gap-1.5">✓ Punjabi Main Course (Paneer + Dal Makhani)</li>
                <li className="flex items-center gap-1.5">✓ Paneer Tikka Crispy Starter</li>
                <li className="flex items-center gap-1.5">✓ Chilled Soft Drinks (Coke / Sprite)</li>
                <li className="flex items-center gap-1.5">✓ Premium Ice Cream</li>
              </ul>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                Avg ~{formatINR(Math.round((event.allocations.food || budget * 0.44) / guests))}/guest
              </p>
            </div>

            {/* Decor Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-pink-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-pink-400 uppercase tracking-wider">🎈 Decoration</span>
                <span className="font-extrabold text-white text-sm">
                  {formatINR(event.allocations.decoration || Math.round(budget * 0.14))}
                </span>
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                <li className="flex items-center gap-1.5">✓ Custom Theme Backdrop & Drapes</li>
                <li className="flex items-center gap-1.5">✓ Balloon Arch & Garland Setup</li>
                <li className="flex items-center gap-1.5">✓ Welcome Board with Easel</li>
              </ul>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                Aesthetic birthday photo corner included
              </p>
            </div>

            {/* DJ & Sound */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-400 uppercase tracking-wider">🎧 DJ & Music</span>
                <span className="font-extrabold text-white text-sm">
                  {formatINR(event.allocations.dj || Math.round(budget * 0.12))}
                </span>
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                <li className="flex items-center gap-1.5">✓ Basic DJ (Console + 2 Tops)</li>
                <li className="flex items-center gap-1.5">✓ Bollywood & Party Hits Mixing</li>
                <li className="flex items-center gap-1.5">✓ 4 Hours Non-stop Music</li>
              </ul>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                Ideal for 40–80 guests indoor party
              </p>
            </div>

            {/* Photography */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-400 uppercase tracking-wider">📸 Photography</span>
                <span className="font-extrabold text-white text-sm">
                  {formatINR(event.allocations.photography || Math.round(budget * 0.10))}
                </span>
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                <li className="flex items-center gap-1.5">✓ 1 Dedicated Event Photographer</li>
                <li className="flex items-center gap-1.5">✓ All High-Res Edited Digital Photos</li>
                <li className="flex items-center gap-1.5">✓ Family & Cake Cutting Coverage</li>
              </ul>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                150+ processed photos in 48h
              </p>
            </div>

            {/* Venue */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-400 uppercase tracking-wider">🏰 Venue & Space</span>
                <span className="font-extrabold text-white text-sm">
                  {formatINR(event.allocations.venue || Math.round(budget * 0.12))}
                </span>
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                <li className="flex items-center gap-1.5">✓ Residential Society / Community Hall</li>
                <li className="flex items-center gap-1.5">✓ Deep Sanitation & Cleaning Charge</li>
                <li className="flex items-center gap-1.5">✓ Basic Seating & Dining Area</li>
              </ul>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                Comfortable AC / Fan amenities
              </p>
            </div>

            {/* Misc & Buffer */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 uppercase tracking-wider">🛡️ Misc & Buffer</span>
                <span className="font-extrabold text-white text-sm">
                  {formatINR((event.allocations.misc || 0) + (event.allocations.buffer || 0))}
                </span>
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                <li className="flex items-center gap-1.5">✓ Designer 2 Kg Birthday Cake (₹2,000)</li>
                <li className="flex items-center gap-1.5">✓ Emergency Rainy-Day Buffer ({formatINR(event.allocations.buffer || 2000)})</li>
              </ul>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                Safety net for unexpected expenses
              </p>
            </div>

          </div>

          {/* Quick Apply CTA */}
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-purple-200">
              <span className="font-bold text-white">Love this balanced plan?</span> You can populate all category planners with this exact curated blueprint in 1-click.
            </div>
            <button
              onClick={onApplyPresetPackage}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md shadow-purple-600/30 transition-all flex items-center gap-2 shrink-0 active:scale-95"
            >
              <span>Apply Curated Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Tab 2: Replace / Upgrade Simulator (Shark Tank Demo Flow) */}
      {selectedTab === 'replaceSimulator' && (
        <div className="mt-6 space-y-5 relative z-10 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">
              Shark Tank Demo Step: Simulate An Item Upgrade & Auto-Rebalancing
            </h3>
            <p className="text-xs text-slate-400">
              Change a standard item to a premium option. Watch EventBudget detect the exact over-budget deficit and rebalance the event in 1 click.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            
            <div className="md:col-span-5 space-y-1">
              <span className="text-[11px] uppercase font-bold text-slate-400">Current Base Item</span>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-xs font-bold text-slate-200">Basic DJ (Console + 2 Speakers)</p>
                <p className="text-sm font-extrabold text-purple-400 mt-0.5">₹6,000</p>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col items-center justify-center text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">Swap With</span>
              <ChevronRight className="w-6 h-6 text-purple-400 hidden md:block" />
              <span className="text-xs font-bold text-purple-400 md:hidden">↓</span>
            </div>

            <div className="md:col-span-5 space-y-1">
              <span className="text-[11px] uppercase font-bold text-amber-400">Upgraded Premium Option</span>
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40">
                <p className="text-xs font-bold text-white">DJ + Intelligent Moving Lights Setup</p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-sm font-extrabold text-amber-300">₹10,000</p>
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    +₹4,000 Diff
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Trigger Button & Status */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onSimulateOverbudgetUpgrade();
                setSimulationApplied(true);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <RefreshCw className="w-4 h-4 text-purple-400" />
              <span>1. Apply Upgrade (Trigger +₹4,000 Overspend)</span>
            </button>

            {isOverBudget && (
              <button
                onClick={onFixMyBudget}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 active:scale-95 animate-pulse"
              >
                <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>2. ⚡ FIX MY BUDGET (Auto-Rebalance)</span>
              </button>
            )}
          </div>

          {/* Over-budget alert banner */}
          {isOverBudget && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in shake duration-300">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    ⚠️ YOUR EVENT IS NOW {formatINR(overAmount)} OVER BUDGET
                  </h4>
                  <p className="text-[11px] text-rose-200">
                    Click <strong>⚡ FIX MY BUDGET</strong> to protect your {event.priority} priority while trimming minor non-essential areas automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
