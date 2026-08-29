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
      {/* Soft luxury background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-amber-300/10 blur-[120px]" />
        <div className="absolute right-[-120px] top-32 h-[320px] w-[320px] rounded-full bg-emerald-400/10 blur-[100px]" />
        <div className="absolute bottom-[-160px] left-[-100px] h-[360px] w-[360px] rounded-full bg-[#d8b97b]/10 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tagline */}
        <div className="mb-7 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8b97b]/60 bg-[#211b15] px-4 py-2 shadow-lg shadow-[#211b15]/10">
            <Sparkles className="h-4 w-4 text-[#e6c675]" />
            <span className="text-xs font-bold tracking-wide text-[#f7e7bd] sm:text-sm">
              “You set the budget. We plan the celebration.”
            </span>
          </div>
        </div>

        {/* Main Hero */}
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-[#211b15] sm:text-6xl lg:text-7xl">
            PLAN THE EVENT.
            <span className="mt-1 block bg-gradient-to-r from-[#a87924] via-[#d4aa4f] to-[#b88324] bg-clip-text text-transparent">
              NOT THE OVERSPENDING.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-relaxed text-[#62584d] sm:text-lg lg:text-xl">
            Tell us your budget and guest list.{' '}
            <span className="font-extrabold text-[#211b15]">
              EventBudget
            </span>{' '}
            turns it into a realistic, itemized event plan with smart
            allocations and local Ahmedabad vendor options.
          </p>

          {/* Main Buttons */}
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={onOpenCreateModal}
              className="group inline-flex min-w-[235px] items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#c89b3c] via-[#e0bd69] to-[#c99b3d] px-7 py-4 text-sm font-black tracking-wide text-[#211b15] shadow-xl shadow-[#c89b3c]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#c89b3c]/30"
            >
              PLAN MY EVENT
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={onLoadDemo}
              className="group inline-flex min-w-[280px] items-center justify-center gap-3 rounded-2xl border border-[#c9a85e]/50 bg-white/70 px-7 py-4 text-sm font-black tracking-wide text-[#9b7228] shadow-lg shadow-[#211b15]/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#c89b3c] hover:bg-white hover:text-[#76531b]"
            >
              <Zap className="h-5 w-5 text-[#c5912d]" />
              LOAD DEMO EVENT (₹50k Birthday)
            </button>
          </div>

          {/* Active event button */}
          {hasActiveEvent && (
            <div className="mt-5 flex justify-center">
              <button
                onClick={onScrollToDashboard}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50/90 px-5 py-2.5 text-xs font-bold text-emerald-800 shadow-sm transition-all hover:border-emerald-600/40 hover:bg-emerald-100"
              >
                <LayoutDashboard className="h-4 w-4" />
                Active Event Loaded! — Jump to Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Trust points */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#62584d]">
              <ShieldCheck className="h-5 w-5 text-emerald-700" />
              Zero Silent Overspending
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-[#62584d]">
              <TrendingUp className="h-5 w-5 text-[#b6852d]" />
              Real Market Price Ranges
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-[#62584d]">
              <MessageCircle className="h-5 w-5 text-emerald-700" />
              Direct WhatsApp Quotes
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="h-px bg-gradient-to-r from-transparent via-[#c9a85e]/50 to-transparent" />

          <p className="mt-5 text-center text-[10px] font-black uppercase tracking-[0.28em] text-[#8b7658] sm:text-xs">
            Everything you need to plan smarter & celebrate better
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;