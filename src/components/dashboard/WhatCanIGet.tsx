import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Zap,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

import { EventState } from '../../types';
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
  const [selectedTab, setSelectedTab] = useState<
    'curated' | 'replaceSimulator'
  >('curated');

  const [simulationApplied, setSimulationApplied] = useState(false);

  const budget = event.totalBudget || 0;
  const guests = Math.max(1, event.guestCount || 1);

  const cards = [
    {
      title: 'Food & Catering',
      icon: '🍽️',
      amount: event.allocations.food || Math.round(budget * 0.44),
      items: [
        'Punjabi main course',
        'Paneer starter',
        'Soft drinks',
        'Ice cream / dessert',
      ],
      note: `Approx. ${formatINR(
        Math.round(
          (event.allocations.food || budget * 0.44) / guests
        )
      )} per guest`,
    },
    {
      title: 'Decoration',
      icon: '🎈',
      amount:
        event.allocations.decoration || Math.round(budget * 0.14),
      items: [
        'Theme backdrop',
        'Balloon / decorative setup',
        'Welcome board',
      ],
      note: 'A practical visual setup within the category allocation',
    },
    {
      title: 'DJ & Music',
      icon: '🎧',
      amount: event.allocations.dj || Math.round(budget * 0.12),
      items: [
        'DJ console',
        'Basic sound setup',
        'Event music coverage',
      ],
      note: 'Final setup depends on venue size and vendor pricing',
    },
    {
      title: 'Photography',
      icon: '📸',
      amount:
        event.allocations.photography || Math.round(budget * 0.1),
      items: [
        'Event photography',
        'Important moment coverage',
        'Edited digital photographs',
      ],
      note: 'Coverage can be customized in the Photography planner',
    },
    {
      title: 'Venue & Space',
      icon: '🏛️',
      amount: event.allocations.venue || Math.round(budget * 0.12),
      items: [
        'Venue / hall allocation',
        'Basic event space',
        'Essential venue requirements',
      ],
      note: 'Actual venue suitability depends on guests and availability',
    },
    {
      title: 'Misc & Buffer',
      icon: '🛡️',
      amount:
        (event.allocations.misc || 0) +
        (event.allocations.buffer || 0),
      items: [
        'Small miscellaneous expenses',
        'Unexpected event-day costs',
        'Reserved safety amount',
      ],
      note: 'Keeps part of the budget protected for uncertainty',
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[#3a342b] bg-gradient-to-br from-[#181713] via-[#211f1a] to-[#11110f] p-5 shadow-[0_24px_60px_rgba(25,20,14,0.22)] sm:p-8">

      {/* BACKGROUND DETAILS */}

      <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#c89a51]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-white/[0.03] blur-3xl" />

      <div className="relative z-10">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-center">

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#c7a366]/25 bg-[#c7a366]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#e5c68d]">
              <Sparkles className="h-3.5 w-3.5" />
              Suggested Event Plan
            </div>

            <h2 className="font-heading text-2xl font-black tracking-tight text-[#fffaf0] sm:text-3xl">
              WHAT CAN I GET IN MY{' '}
              <span className="text-[#e4bd77]">
                {formatINR(budget)}
              </span>{' '}
              BUDGET?
            </h2>

            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[#aaa293] sm:text-sm">
              A practical starting blueprint for{' '}
              <strong className="text-[#f4ead9]">
                {guests} guests
              </strong>{' '}
              in{' '}
              <strong className="text-[#f4ead9]">
                {event.city}
              </strong>
              , with extra budget protection for{' '}
              <strong className="text-[#e4bd77]">
                {event.priority}
              </strong>
              .
            </p>
          </div>

          {/* TABS */}

          <div className="flex shrink-0 self-start rounded-xl border border-white/10 bg-black/30 p-1 md:self-auto">

            <button
              type="button"
              onClick={() => setSelectedTab('curated')}
              className={`rounded-lg px-3.5 py-2 text-[11px] font-black transition-all ${
                selectedTab === 'curated'
                  ? 'bg-[#e0bb78] text-[#1d1811] shadow-lg'
                  : 'text-[#aaa293] hover:bg-white/5 hover:text-white'
              }`}
            >
              Suggested Plan
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('replaceSimulator')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[11px] font-black transition-all ${
                selectedTab === 'replaceSimulator'
                  ? 'bg-[#e0bb78] text-[#1d1811] shadow-lg'
                  : 'text-[#aaa293] hover:bg-white/5 hover:text-white'
              }`}
            >
              <RefreshCw className="h-3 w-3" />
              Upgrade Simulator
            </button>

          </div>
        </div>

        {/* ======================================================
            SUGGESTED PLAN
        ====================================================== */}

        {selectedTab === 'curated' && (
          <div className="mt-6 space-y-6">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {cards.map((card) => (
                <div
                  key={card.title}
                  className="group rounded-[22px] border border-white/10 bg-[#f8f6f1] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.13)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c6a266]/50 hover:shadow-[0_18px_35px_rgba(0,0,0,0.2)]"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ded4c4] bg-white text-lg shadow-sm">
                        {card.icon}
                      </div>

                      <h3 className="text-xs font-black uppercase tracking-[0.08em] text-[#41382c]">
                        {card.title}
                      </h3>
                    </div>

                    <span className="shrink-0 font-mono-num text-sm font-black text-[#8b6633]">
                      {formatINR(card.amount)}
                    </span>

                  </div>

                  <div className="my-4 h-px bg-[#e2ddd4]" />

                  <ul className="space-y-2">
                    {card.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[11px] leading-relaxed text-[#665e52]"
                      >
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#71805a]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 border-t border-[#e3ded5] pt-3 text-[10px] leading-relaxed text-[#958a7b]">
                    {card.note}
                  </p>

                </div>
              ))}

            </div>

            {/* APPLY PLAN CTA */}

            <div className="flex flex-col items-start justify-between gap-4 rounded-[22px] border border-[#c7a366]/25 bg-gradient-to-r from-[#2a261f] to-[#201d18] p-5 sm:flex-row sm:items-center">

              <div>
                <p className="text-sm font-black text-[#fff6e7]">
                  Want to use this as your starting point?
                </p>

                <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-[#a9a092]">
                  Apply the suggested selections, then customize food,
                  decoration, entertainment, photography and venue according
                  to your event.
                </p>
              </div>

              <button
                type="button"
                onClick={onApplyPresetPackage}
                className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#e0bb78] px-6 py-3 text-[11px] font-black uppercase tracking-[0.08em] text-[#211a12] shadow-[0_10px_24px_rgba(224,187,120,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#ebca8d] active:translate-y-0 sm:w-auto"
              >
                Apply Suggested Plan
                <ArrowRight className="h-4 w-4" />
              </button>

            </div>

          </div>
        )}

        {/* ======================================================
            UPGRADE SIMULATOR
        ====================================================== */}

        {selectedTab === 'replaceSimulator' && (
          <div className="mt-6 space-y-5">

            {/* EXPLANATION */}

            <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5">

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c7a366]/20 bg-[#c7a366]/10">
                  <RefreshCw className="h-4 w-4 text-[#e0bb78]" />
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#fff7e9]">
                    See what happens when your event gets upgraded
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-[#aaa293]">
                    This demo adds a higher-cost DJ setup to your current
                    event. If the change pushes the event beyond your budget,
                    EventBudget detects the gap and lets you rebalance it.
                  </p>
                </div>
              </div>

            </div>

            {/* BEFORE / AFTER */}

            <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-12">

              {/* CURRENT */}

              <div className="rounded-[22px] border border-white/10 bg-[#f8f6f1] p-5 md:col-span-5">

                <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8e8374]">
                  Current Setup
                </span>

                <div className="mt-3 flex items-start justify-between gap-3">

                  <div>
                    <p className="text-sm font-black text-[#302a22]">
                      Basic DJ Setup
                    </p>

                    <p className="mt-1 text-[11px] text-[#756c60]">
                      Console + standard sound setup
                    </p>
                  </div>

                  <span className="font-mono-num text-lg font-black text-[#735a36]">
                    ₹6,000
                  </span>

                </div>

              </div>

              {/* ARROW */}

              <div className="flex flex-col items-center justify-center md:col-span-2">

                <span className="mb-1 text-[9px] font-black uppercase tracking-[0.15em] text-[#c9aa74]">
                  Upgrade
                </span>

                <ChevronRight className="hidden h-7 w-7 text-[#d8b675] md:block" />

                <span className="text-xl text-[#d8b675] md:hidden">
                  ↓
                </span>

              </div>

              {/* UPGRADE */}

              <div className="rounded-[22px] border border-[#d1ad6e]/40 bg-gradient-to-br from-[#30281d] to-[#211d17] p-5 md:col-span-5">

                <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#e1bd7a]">
                  Upgraded Setup
                </span>

                <div className="mt-3 flex items-start justify-between gap-3">

                  <div>
                    <p className="text-sm font-black text-[#fff7e8]">
                      DJ + Moving Lights
                    </p>

                    <p className="mt-1 text-[11px] text-[#b8ad9b]">
                      Expanded sound and lighting setup
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono-num text-lg font-black text-[#edcb8d]">
                      ₹10,000
                    </p>

                    <span className="mt-1 inline-block rounded-full border border-[#c76d61]/25 bg-[#c76d61]/10 px-2 py-0.5 text-[9px] font-black text-[#e6a29a]">
                      +₹4,000
                    </span>
                  </div>

                </div>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={() => {
                  onSimulateOverbudgetUpgrade();
                  setSimulationApplied(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-xs font-black text-[#f4ead9] transition-all hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0 sm:w-auto"
              >
                <RefreshCw className="h-4 w-4 text-[#e0bb78]" />
                Apply ₹4,000 Upgrade
              </button>

              {isOverBudget && (
                <button
                  type="button"
                  onClick={onFixMyBudget}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e0bb78] px-6 py-3 text-xs font-black text-[#211a12] shadow-[0_10px_24px_rgba(224,187,120,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#ebca8d] active:translate-y-0 sm:w-auto"
                >
                  <Zap className="h-4 w-4 fill-[#211a12]" />
                  Fix My Budget
                </button>
              )}

            </div>

            {/* RESULT */}

            {isOverBudget ? (
              <div className="rounded-[20px] border border-[#b65e54]/35 bg-[#8f4138]/10 p-5">

                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#e09389]" />

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-[#e9a097]">
                      Budget exceeded
                    </p>

                    <h4 className="mt-1 text-lg font-black text-[#fff0ed]">
                      {formatINR(overAmount)} needs to be adjusted
                    </h4>

                    <p className="mt-1 text-xs leading-relaxed text-[#c9aaa5]">
                      The upgraded selection has pushed the plan beyond the
                      available event budget. Use Fix My Budget to reduce
                      flexible spending.
                    </p>
                  </div>
                </div>

              </div>
            ) : simulationApplied ? (
              <div className="rounded-[20px] border border-[#74835b]/35 bg-[#71805a]/10 p-5">

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#a9ba89]" />

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-[#b7c996]">
                      Upgrade applied
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-[#c1cbb0]">
                      The upgraded setup still fits within the current event
                      budget.
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">

                <p className="text-[11px] leading-relaxed text-[#938b7e]">
                  Apply the upgrade to test how your current plan reacts to an
                  extra ₹4,000 expense.
                </p>

              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
