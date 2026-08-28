import React from 'react';
import {
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  CheckCircle2,
  Users,
  Building,
  Utensils,
  Camera,
  Music,
  HeartHandshake
} from 'lucide-react';
import { formatINR } from '../../utils/currencyFormatter';

interface HeroSectionProps {
  onOpenCreateModal: () => void;
  onLoadDemo: () => void;
  hasActiveEvent: boolean;
  onScrollToDashboard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenCreateModal,
  onLoadDemo,
  hasActiveEvent,
  onScrollToDashboard,
}) => {
  const highlights = [
    { icon: '💰', title: 'Smart Budget Planning', desc: 'Dynamic allocation by event type & priority' },
    { icon: '🍽️', title: 'Food Menu Builder', desc: 'Per-plate calculation with live counters' },
    { icon: '🎈', title: 'Decoration Planner', desc: '10+ themes & customizable stage setups' },
    { icon: '🎧', title: 'DJ & Entertainment', desc: 'Sound packages, lighting, dhol & live artists' },
    { icon: '📸', title: 'Photography Planning', desc: 'Candid, traditional, drone & Instagram reels' },
    { icon: '📍', title: 'Local Ahmedabad Vendors', desc: 'Direct phone & pre-filled WhatsApp quotes' },
    { icon: '💬', title: 'Quote Comparison', desc: 'Real vendor quotes override estimates' },
    { icon: '⚡', title: 'Instant Budget Fix', desc: '1-click AI rebalancing protecting top priority' },
  ];

  return (
    <section id="hero-section" className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-purple-600/20 via-pink-600/15 to-blue-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-pink-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tagline Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-purple-500/30 text-xs sm:text-sm font-semibold text-purple-300 shadow-lg shadow-purple-950/40">
            <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-ping" />
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>“You set the budget. We plan the celebration.”</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] font-heading">
            PLAN THE EVENT.{' '}
            <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
              NOT THE OVERSPENDING.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Tell us your budget and guest list. <strong className="text-white font-semibold">EventBudget</strong> turns it into a realistic, itemized event plan with local Ahmedabad vendor connections.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
            <button
              onClick={onOpenCreateModal}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-purple-600/35 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <span>PLAN MY EVENT</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onLoadDemo}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl text-base font-extrabold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 shadow-lg shadow-amber-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
            >
              <Zap className="w-5 h-5 fill-amber-300 text-amber-300 animate-pulse" />
              <span>⚡ LOAD DEMO EVENT (₹50k Birthday)</span>
            </button>
          </div>

          {/* Quick Active Event Banner if loaded */}
          {hasActiveEvent && (
            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200">
              <span className="font-semibold">✨ Active Event Loaded!</span>
              <button
                onClick={onScrollToDashboard}
                className="underline hover:text-white font-bold flex items-center gap-1"
              >
                Jump to Dashboard ↓
              </button>
            </div>
          )}

          {/* Trust points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Silent Overspending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-purple-400" />
              <span>Real Market Price Ranges</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-pink-400" />
              <span>Direct WhatsApp Quotes</span>
            </div>
          </div>

        </div>

        {/* Feature Grid Showcase */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center mb-8">
            <p className="text-xs uppercase font-bold tracking-widest text-slate-400">
              Everything you need to plan smarter & celebrate better
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0f172a]/70 backdrop-blur-md border border-slate-800 hover:border-purple-500/40 hover:bg-[#15213b]/90 transition-all duration-200 group shadow-md"
              >
                <div className="text-2xl mb-3 group-hover:scale-110 transition-transform inline-block">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
