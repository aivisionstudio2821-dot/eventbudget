import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Award,
  ShieldCheck,
  Zap,
  Users,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const BusinessModel: React.FC = () => {
  const streams = [
    {
      icon: Award,
      title: 'Featured Vendor Listings',
      badge: 'B2B Advertising',
      tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      description: 'Top placement in local category marketplace searches. Caterers, DJs and Banquet halls pay for boosted visibility in high-demand localities like Ahmedabad.',
      metrics: '₹2,500 – ₹10,000 / month per featured vendor'
    },
    {
      icon: Zap,
      title: 'Verified Vendor Lead Fees',
      badge: 'Pay-Per-Lead',
      tagColor: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
      description: 'Vendors receive pre-qualified, budget-matched leads with guaranteed event dates and guest counts via instant WhatsApp integrations.',
      metrics: '₹150 – ₹500 per verified customer inquiry'
    },
    {
      icon: TrendingUp,
      title: 'Booking Commission Escrow',
      badge: 'Transaction Fee',
      tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'End-to-end milestone payment security. Users get guaranteed service delivery while EventBudget charges a minimal take-rate on successful bookings.',
      metrics: '3% – 5% on verified vendor bookings'
    },
    {
      icon: Building2,
      title: 'Vendor Pro SaaS Subscription',
      badge: 'Recurring SaaS',
      tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      description: 'White-labeled digital quotation generator, customer CRM, availability calendar and automated contract manager for caterers and decorators.',
      metrics: '₹1,499 / month or ₹14,999 / year'
    },
    {
      icon: Users,
      title: 'EventBudget Plus (Host Premium)',
      badge: 'B2C Upgrade',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Dedicated human event coordinator assistance, AI on-call budget advisor, customized 3D theme mockups and multi-vendor negotiation concierge.',
      metrics: '₹999 – ₹4,999 one-time event pass'
    }
  ];

  return (
    <section id="business-model" className="py-16 sm:py-24 border-t border-slate-800/80 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <DollarSign className="w-3.5 h-3.5 text-purple-400" />
            Startup Monetization Framework
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            HOW <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">EVENTBUDGET</span> MAKES MONEY
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-400">
            A high-margin, dual-sided marketplace model combining B2B vendor SaaS, qualified lead generation, and B2C concierge upgrades.
          </p>
        </div>

        {/* Revenue Streams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0f1523]/80 border border-slate-800/80 hover:border-purple-500/40 hover:bg-[#141c30]/90 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.tagColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item.metrics}</span>
                </div>
              </div>
            );
          })}

          {/* Unit Economics Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 via-slate-900/80 to-slate-950/90 border border-purple-500/30 flex flex-col justify-between shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-300 px-2.5 py-1 rounded-md bg-purple-500/20 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                Scalable Unit Economics
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Zero Inventory & Hyperlocal Scale</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                By solving the initial budget mismatch for hosts, we capture 100% intent before vendors are contacted, creating unmatched lead conversion rates.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-purple-500/20 text-xs text-slate-400 flex items-center justify-between">
              <span>Target TAM (India Events):</span>
              <span className="font-bold text-white text-sm">₹50,000+ Cr</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
