import React from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MessageCircle,
  Zap,
  LayoutDashboard,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenCreateModal: () => void;
  onLoadDemo: () => void;
  hasActiveEvent: boolean;
  onScrollToDashboard: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenCreateModal,
  onLoadDemo,
  hasActiveEvent,
  onScrollToDashboard,
}) => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      
      {/* Luxury background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-[#d8b97b]/20 blur-[120px]" />
        
        <div className="absolute right-[-120px] top-32 h-[320px] w-[320px] rounded-full bg-emerald-500/10 blur-[100px]" />
        
        <div className="absolute bottom-[-160px] left-[-100px] h-[360px] w-[360px] rounded-full bg-[#b88732]/10 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Tagline */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#9b7228]/40 bg-[#211b15] px-5 py-2.5 shadow-lg shadow-[#211b15]/15">
            
            <Sparkles className="h-4 w-4 text-[#e0bd69]" />
            
            <span className="text-xs font-extrabold tracking-wide text-[#f7e7bd] sm:text-sm">
              You set the budget. We plan the celebration.
            </span>

          </div>
        </div>

        {/* Hero Content */}
        <div className="mx-auto max-w-5xl text-center">

          {/* Main Heading */}
          <h1 className="text-4xl font-black leading-[1.04] tracking-tight text-[#211b15] sm:text-6xl lg:text-7xl">
            
            PLAN THE EVENT.

            <span className="mt-2 block bg-gradient-to-r from-[#765018] via-[#c08b2e] to-[#8a621f] bg-clip-text text-transparent">
              NOT THE OVERSPENDING.
            </span>

          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-3xl text-base font-semibold leading-relaxed text-[#51473d] sm:text-lg lg:text-xl">
            
            Give us your budget and guest list.{' '}
            
            <span className="font-black text-[#17130f]">
              EventBudget
            </span>{' '}
            
            turns it into a realistic, itemized event plan with smart
            category allocations and local Ahmedabad vendor connections.

          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

            {/* Plan Event */}
            <button
              onClick={onOpenCreateModal}
              className="group inline-flex min-w-[235px] items-center justify-center gap-3 rounded-2xl border border-[#ad7d27] bg-gradient-to-r from-[#b7832b] via-[#e0bd69] to-[#b7832b] px-7 py-4 text-sm font-black tracking-wide text-[#211b15] shadow-xl shadow-[#b7832b]/25 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#b7832b]/30"
            >
              
              PLAN MY EVENT

              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            
            </button>

            {/* Demo Event */}
            <button
              onClick={onLoadDemo}
              className="group inline-flex min-w-[280px] items-center justify-center gap-3 rounded-2xl border-2 border-[#9b7228] bg-[#211b15] px-7 py-4 text-sm font-black tracking-wide text-[#f7e7bd] shadow-xl shadow-[#211b15]/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-[#30271f] hover:text-white hover:shadow-2xl"
            >
              
              <Zap className="h-5 w-5 text-[#e0bd69]" />
              
              LOAD DEMO EVENT (₹50k Birthday)

            </button>

          </div>

          {/* Active Event */}
          {hasActiveEvent && (
            <div className="mt-6 flex justify-center">

              <button
                onClick={onScrollToDashboard}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-700/30 bg-emerald-50 px-5 py-2.5 text-xs font-black text-emerald-900 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-700/50 hover:bg-emerald-100"
              >
                
                <LayoutDashboard className="h-4 w-4 text-emerald-700" />

                Active Event Loaded! — Jump to Dashboard

                <ArrowRight className="h-3.5 w-3.5" />

              </button>

            </div>
          )}

          {/* Feature Points */}
          <div className="mt-11 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">

            {/* Overspending */}
            <div className="flex items-center gap-2.5 text-sm font-bold text-[#51473d]">
              
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-800" />
              </div>

              Zero Silent Overspending

            </div>

            {/* Market Prices */}
            <div className="flex items-center gap-2.5 text-sm font-bold text-[#51473d]">
              
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ead8b3]">
                <TrendingUp className="h-4.5 w-4.5 text-[#8a621f]" />
              </div>

              Real Market Price Ranges

            </div>

            {/* WhatsApp */}
            <div className="flex items-center gap-2.5 text-sm font-bold text-[#51473d]">
              
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                <MessageCircle className="h-4.5 w-4.5 text-emerald-800" />
              </div>

              Direct WhatsApp Quotes

            </div>

          </div>

        </div>

        {/* Bottom separator */}
        <div className="mx-auto mt-16 max-w-5xl">

          <div className="h-px bg-gradient-to-r from-transparent via-[#9b7228]/50 to-transparent" />

          <p className="mt-5 text-center text-[10px] font-black uppercase tracking-[0.28em] text-[#6e5a3e] sm:text-xs">
            Everything you need to plan smarter & celebrate better
          </p>

        </div>

      </div>
    </section>
  );
};

export { HeroSection };