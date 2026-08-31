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
  Sparkles,
  Sliders,
  HelpCircle,
} from 'lucide-react';

import {
  EventState,
  CategoryKey,
  CategoryAllocations,
} from '../../types';

import { formatINR } from '../../utils/currencyFormatter';

import {
  calculateTotalPlanned,
  rebalanceEventAllocations,
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

  const costPerGuest = Math.round(
    plannedSpend / guestCount
  );

  const healthData = calculateEventHealthScore(event);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: [
        '#b58a47',
        '#ead7ad',
        '#f5efe4',
        '#2c2419',
      ],
    });
  };

  // --------------------------------------------------
  // FIX MY BUDGET
  // --------------------------------------------------

  const handleFixMyBudget = () => {
    if (overAmount <= 0) return;

    const { newAllocations } =
      rebalanceEventAllocations(
        event,
        overAmount
      );

    let updated: EventState = {
      ...event,

      allocations: newAllocations,

      customFoodPrices: {
        ...event.customFoodPrices,
      },

      customDecorPrices: {
        ...event.customDecorPrices,
      },

      customEntertainmentPrices: {
        ...event.customEntertainmentPrices,
      },

      customPhotographyPrices: {
        ...event.customPhotographyPrices,
      },

      customVenueAddonPrices: {
        ...event.customVenueAddonPrices,
      },

      miscItems: (event.miscItems || []).map(
        item => ({
          ...item,
        })
      ),
    };

    let remaining =
      calculateTotalPlanned(updated) +
      (updated.allocations.buffer || 0) -
      totalBudget;

    const reduceItems = (
      selected: Record<string, boolean>,
      prices: Record<string, number>,
      items: Array<{
        id: string;
        defaultPrice: number;
      }>
    ) => {
      for (
        const [id, isSelected] of Object.entries(
          selected || {}
        )
      ) {
        if (
          !isSelected ||
          remaining <= 0
        ) {
          continue;
        }

        const item = items.find(
          x => x.id === id
        );

        const currentPrice =
          prices[id] !== undefined
            ? prices[id]
            : item?.defaultPrice || 0;

        const reduction = Math.min(
          currentPrice,
          remaining
        );

        prices[id] =
          currentPrice - reduction;

        remaining -= reduction;
      }
    };

    // Miscellaneous expenses first
    for (
      const item of updated.miscItems || []
    ) {
      if (remaining <= 0) break;

      if (
        item.selected === false ||
        item.price <= 0
      ) {
        continue;
      }

      const reduction = Math.min(
        item.price,
        remaining
      );

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
    if (
      remaining > 0 &&
      updated.selectedVenueId
    ) {
      const venue = VENUE_TYPES.find(
        v =>
          v.id === updated.selectedVenueId
      );

      const currentVenuePrice =
        updated.customVenuePrice !== undefined
          ? updated.customVenuePrice
          : venue?.defaultPrice || 0;

      const reduction = Math.min(
        currentVenuePrice,
        remaining
      );

      updated.customVenuePrice =
        currentVenuePrice - reduction;

      remaining -= reduction;
    }

    // Food reduced last
    if (remaining > 0) {
      const guests = Math.max(
        1,
        updated.guestCount || 1
      );

      for (
        const [id, isSelected] of Object.entries(
          updated.selectedFoodItems || {}
        )
      ) {
        if (
          !isSelected ||
          remaining <= 0
        ) {
          continue;
        }

        const item = FOOD_ITEMS.find(
          x => x.id === id
        );

        const perGuest =
          updated.customFoodPrices[id] !==
          undefined
            ? updated.customFoodPrices[id]
            : item?.defaultPrice || 0;

        const totalItemCost =
          perGuest * guests;

        const reduction = Math.min(
          totalItemCost,
          remaining
        );

        updated.customFoodPrices[id] =
          Math.max(
            0,
            perGuest -
              reduction / guests
          );

        remaining -= reduction;
      }
    }

    onUpdateEvent(updated);

    const finalCommitted =
      calculateTotalPlanned(updated) +
      (updated.allocations.buffer || 0);

    if (
      finalCommitted <=
      totalBudget + 1
    ) {
      triggerConfetti();
    }
  };

  // --------------------------------------------------
  // CURATED PLAN
  // --------------------------------------------------

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

      selectedVenueId:
        'venue_society_hall',
    };

    onUpdateEvent(updated);
    triggerConfetti();
  };

  const handleSimulateUpgrade = () => {
    const updated: EventState = {
      ...event,

      selectedEntertainment: {
        ent_basic_dj: true,
        ent_dj_lights: true,
      },

      customEntertainmentPrices: {
        ...event.customEntertainmentPrices,
        ent_basic_dj: 6000,
        ent_dj_lights: 4000,
      },
    };

    onUpdateEvent(updated);
  };

  const handleAddCustomExpense = (
    name: string,
    price: number
  ) => {
    const newItem = {
      id: `custom_${Date.now()}`,
      name,
      price,
      isCustom: true,
      selected: true,
    };

    const updated: EventState = {
      ...event,

      miscItems: [
        ...(event.miscItems || []),
        newItem,
      ],
    };

    onUpdateEvent(updated);
  };

  const handleUpdateAllocations = (
    newAllocations: CategoryAllocations
  ) => {
    onUpdateEvent({
      ...event,
      allocations: newAllocations,
      isCustomAllocation: true,
    });
  };

  return (
    <section
      id="dashboard-section"
      className="space-y-8 py-8 sm:py-12"
    >
      {/* EVENT DETAILS */}

      <div className="relative overflow-hidden rounded-[26px] border border-[#d7c7aa] bg-gradient-to-r from-[#211a12] via-[#2c2419] to-[#17130e] p-5 shadow-[0_18px_50px_rgba(43,32,20,0.18)] sm:p-6">
        <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-[#c89c55]/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#d5b575]/25 bg-[#f2dfba]/10 text-2xl">
              🎉
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-lg font-black text-[#fff9ee] sm:text-xl">
                  {event.title}
                </h2>

                <span className="rounded-full border border-[#d3ae6b]/30 bg-[#d3ae6b]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#efd6a4]">
                  {event.eventType}
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-[#c8baa4]">
                📍 {event.city}
                &nbsp; • &nbsp;
                👥 {event.guestCount} Guests
                &nbsp; • &nbsp;
                📅{' '}
                {new Date(
                  event.eventDate
                ).toLocaleDateString(
                  'en-IN',
                  {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }
                )}
              </p>

              <p className="mt-1 text-[11px] text-[#a99a84]">
                Planning priority:{' '}
                <strong className="text-[#e6c88f]">
                  {event.priority}
                </strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                setShowCanIAddModal(true)
              }
              className="flex items-center gap-2 rounded-xl border border-[#cbb996]/25 bg-white/5 px-4 py-2.5 text-xs font-bold text-[#efe5d4] transition-all hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0"
            >
              <HelpCircle className="h-4 w-4 text-[#d9ba7d]" />

              <span>
                Can I Add This?
              </span>
            </button>

            <button
              onClick={() =>
                setShowEditor(!showEditor)
              }
              className="flex items-center gap-2 rounded-xl border border-[#d0ae6e]/35 bg-[#d0ae6e]/10 px-4 py-2.5 text-xs font-bold text-[#efd7a9] transition-all hover:-translate-y-0.5 hover:bg-[#d0ae6e]/20 active:translate-y-0"
            >
              <Sliders className="h-4 w-4" />

              <span>
                {showEditor
                  ? 'Hide Budget Editor'
                  : 'Edit Budget'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">

        {/* TOTAL BUDGET */}

        <div className="rounded-2xl border border-[#ddd0bb] bg-[#fffaf1] p-4 shadow-[0_8px_24px_rgba(64,47,28,0.06)] sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#877966]">
              Total Budget
            </span>

            <Wallet className="h-4 w-4 text-[#a77c3d]" />
          </div>

          <p className="mt-2 font-mono-num text-xl font-black text-[#241d15] sm:text-2xl">
            {formatINR(totalBudget)}
          </p>

          <p className="mt-1 text-[10px] text-[#9b8d79]">
            Your spending limit
          </p>
        </div>

        {/* PLANNED */}

        <div className="rounded-2xl border border-[#ddd0bb] bg-[#fffaf1] p-4 shadow-[0_8px_24px_rgba(64,47,28,0.06)] sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#877966]">
              Planned Spend
            </span>

            <TrendingDown className="h-4 w-4 text-[#9c7240]" />
          </div>

          <p className="mt-2 font-mono-num text-xl font-black text-[#765125] sm:text-2xl">
            {formatINR(plannedSpend)}
          </p>

          <p className="mt-1 text-[10px] text-[#9b8d79]">
            Selected event items
          </p>
        </div>

        {/* REMAINING */}

        <div
          className={`rounded-2xl border p-4 shadow-[0_8px_24px_rgba(64,47,28,0.06)] transition-all sm:p-5 ${
            remainingBudget < 0
              ? 'border-[#d7a09a] bg-[#fff1ef]'
              : 'border-[#c9d1b5] bg-[#f8f8ed]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#877966]">
              Remaining
            </span>

            <CheckCircle2
              className={`h-4 w-4 ${
                remainingBudget < 0
                  ? 'text-[#ad554d]'
                  : 'text-[#6f8052]'
              }`}
            />
          </div>

          <p
            className={`mt-2 font-mono-num text-xl font-black sm:text-2xl ${
              remainingBudget < 0
                ? 'text-[#a44840]'
                : 'text-[#607044]'
            }`}
          >
            {formatINR(
              remainingBudget
            )}
          </p>

          <p className="mt-1 text-[10px] text-[#9b8d79]">
            {remainingBudget >= 0
              ? 'Available balance'
              : 'Selections exceed budget'}
          </p>
        </div>

        {/* BUFFER */}

        <div className="rounded-2xl border border-[#ddd0bb] bg-[#fffaf1] p-4 shadow-[0_8px_24px_rgba(64,47,28,0.06)] sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#877966]">
              Safety Buffer
            </span>

            <ShieldCheck className="h-4 w-4 text-[#987344]" />
          </div>

          <p className="mt-2 font-mono-num text-xl font-black text-[#75572f] sm:text-2xl">
            {formatINR(
              bufferAllocated
            )}
          </p>

          <p className="mt-1 text-[10px] text-[#9b8d79]">
            {(
              (bufferAllocated /
                (totalBudget || 1)) *
              100
            ).toFixed(0)}
            % contingency
          </p>
        </div>

        {/* COST / GUEST */}

        <div className="rounded-2xl border border-[#ddd0bb] bg-[#fffaf1] p-4 shadow-[0_8px_24px_rgba(64,47,28,0.06)] sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#877966]">
              Cost / Guest
            </span>

            <Users className="h-4 w-4 text-[#a77c3d]" />
          </div>

          <p className="mt-2 font-mono-num text-xl font-black text-[#75572f] sm:text-2xl">
            {formatINR(
              costPerGuest
            )}
          </p>

          <p className="mt-1 text-[10px] text-[#9b8d79]">
            For {guestCount} guests
          </p>
        </div>

        {/* HEALTH */}

        <button
          type="button"
          onClick={() =>
            setShowHealthModal(true)
          }
          className="group rounded-2xl border border-[#d1bd98] bg-gradient-to-br from-[#f6ead5] to-[#fffaf1] p-4 text-left shadow-[0_8px_24px_rgba(64,47,28,0.08)] transition-all hover:-translate-y-1 hover:border-[#aa8147] hover:shadow-[0_14px_30px_rgba(64,47,28,0.12)] sm:p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#877966]">
              Health Score
            </span>

            <Activity className="h-4 w-4 text-[#9b7136] transition-transform group-hover:scale-110" />
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            <p
              className="font-mono-num text-xl font-black sm:text-2xl"
              style={{
                color:
                  healthData.statusColor,
              }}
            >
              {healthData.overallScore}
            </p>

            <span className="text-xs font-bold text-[#9b8d79]">
              /100
            </span>
          </div>

          <p
            className="mt-1 flex items-center gap-1.5 text-[10px] font-bold"
            style={{
              color:
                healthData.statusColor,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor:
                  healthData.statusColor,
              }}
            />

            {healthData.status}
            <span>→</span>
          </p>
        </button>
      </div>

      {/* BUDGET STATUS */}

      <div>
        {isOverBudget ? (
          <div className="relative overflow-hidden rounded-[26px] border border-[#d79c94] bg-gradient-to-r from-[#fff0ed] via-[#fff6f2] to-[#f8e6df] p-5 shadow-[0_15px_40px_rgba(128,62,51,0.10)]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#ba5b50]/10 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#cf8178]/30 bg-[#e8b2ab]/25">
                  <AlertTriangle className="h-5 w-5 text-[#a54d45]" />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#a45b52]">
                    Budget Alert
                  </p>

                  <h3 className="mt-1 text-base font-black text-[#6f302b]">
                    {formatINR(
                      overAmount
                    )}{' '}
                    over your event budget
                  </h3>

                  <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#8d5d57]">
                    Your current selections and safety buffer exceed the total budget. EventBudget can reduce flexible spending to help bring the plan back within your limit.
                  </p>
                </div>
              </div>

              <button
                onClick={
                  handleFixMyBudget
                }
                className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#211a12] px-6 py-3.5 text-xs font-black uppercase tracking-wide text-[#f4dfb8] shadow-[0_10px_25px_rgba(43,31,18,0.22)] transition-all hover:-translate-y-0.5 hover:bg-black active:translate-y-0 sm:w-auto"
              >
                <Zap className="h-4 w-4 fill-[#e5c17d] text-[#e5c17d]" />

                FIX MY BUDGET
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-[26px] border border-[#c6ceb1] bg-gradient-to-r from-[#f5f5e9] via-[#fbf9f0] to-[#f1f1e3] p-5 shadow-[0_12px_35px_rgba(71,83,47,0.07)]">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#91a169]/25 bg-[#cfd7b7]/30">
                  <CheckCircle2 className="h-5 w-5 text-[#667847]" />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#748052]">
                    Budget Status
                  </p>

                  <h3 className="mt-1 text-base font-black text-[#3f4b2c]">
                    Your event fits your budget
                  </h3>

                  <p className="mt-1.5 text-xs leading-relaxed text-[#71805b]">
                    Your current selections fit within{' '}
                    <strong>
                      {formatINR(
                        totalBudget
                      )}
                    </strong>{' '}
                    while keeping{' '}
                    <strong>
                      {formatINR(
                        bufferAllocated
                      )}
                    </strong>{' '}
                    as a safety buffer.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  triggerConfetti
                }
                className="flex items-center gap-2 rounded-xl border border-[#9ba878]/35 bg-white/50 px-4 py-2.5 text-xs font-bold text-[#657348] transition-all hover:bg-white"
              >
                <Sparkles className="h-4 w-4" />
                Celebrate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BUDGET EDITOR */}

      {showEditor && (
        <InteractiveBudgetEditor
          event={event}
          onUpdateAllocations={
            handleUpdateAllocations
          }
        />
      )}

      {/* CHART */}

      <BudgetDonutChart
        event={event}
      />

      {/* WHAT CAN I GET */}

      <WhatCanIGet
        event={event}
        onApplyPresetPackage={
          handleApplyCuratedPackage
        }
        onSimulateOverbudgetUpgrade={
          handleSimulateUpgrade
        }
        onFixMyBudget={
          handleFixMyBudget
        }
        isOverBudget={
          isOverBudget
        }
        overAmount={overAmount}
      />

      {/* CATEGORY CARDS */}

      <CategoryCards
        event={event}
        onSelectCategory={
          onSelectCategory
        }
      />

      {/* MODALS */}

      <CanIAddThisModal
        isOpen={
          showCanIAddModal
        }
        onClose={() =>
          setShowCanIAddModal(false)
        }
        event={event}
        onAddCustomExpense={
          handleAddCustomExpense
        }
      />

      <HealthScoreModal
        isOpen={
          showHealthModal
        }
        onClose={() =>
          setShowHealthModal(false)
        }
        event={event}
      />
    </section>
  );
};
