import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

import {
  Sparkles,
  Utensils,
  Palette,
  Music,
  Camera,
  Building,
  Gift,
  Users,
  Wallet,
  MapPin,
  CalendarDays,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

import {
  EventState,
  CategoryKey,
  VendorQuote,
} from './types';

import { createDemoEvent } from './data/demoEvent';

import { EventPreview } from './components/EventPreview';
import { ChallengeMode } from './components/ChallengeMode';
import { Navbar } from './components/layout/Navbar';
import { TeamSection } from './components/TeamSection';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/landing/HeroSection';

import { CreateEventModal } from './components/eventForm/CreateEventModal';
import { BudgetDashboard } from './components/dashboard/BudgetDashboard';

import { FoodMenuBuilder } from './components/planners/FoodMenuBuilder';
import { DecorationPlanner } from './components/planners/DecorationPlanner';
import { EntertainmentPlanner } from './components/planners/EntertainmentPlanner';
import { PhotographyPlanner } from './components/planners/PhotographyPlanner';
import { VenuePlanner } from './components/planners/VenuePlanner';
import { MiscellaneousPlanner } from './components/planners/MiscellaneousPlanner';

import { VendorMarketplace } from './components/vendors/VendorMarketplace';

import {
  ToastContainer,
  ToastMessage,
} from './components/common/Toast';

import {
  rebalanceEventAllocations,
  calculateTotalPlanned,
  calculateCategoryTotals,
} from './utils/budgetCalculations';

import { formatINR } from './utils/currencyFormatter';

const STORAGE_KEY = 'eventbudget_active_plan_v1';

interface SharedPlanPayload {
  v: 1;
  title: string;
  eventType: string;
  totalBudget: number;
  guestCount: number;
  city: string;
  eventDate: string;
  priority: string;
  allocations: EventState['allocations'];
}

const decodeSharedPlan = (
  hash: string
): SharedPlanPayload | null => {
  try {
    if (!hash.startsWith('#share=')) {
      return null;
    }

    let encoded = hash.slice('#share='.length);

    if (!encoded) {
      return null;
    }

    encoded = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    while (encoded.length % 4 !== 0) {
      encoded += '=';
    }

    const binary = atob(encoded);

    const bytes = Uint8Array.from(
      binary,
      (character) => character.charCodeAt(0)
    );

    const json = new TextDecoder().decode(bytes);

    const parsed = JSON.parse(
      json
    ) as SharedPlanPayload;

    if (
      parsed.v !== 1 ||
      !parsed.title ||
      !parsed.eventType ||
      typeof parsed.totalBudget !== 'number' ||
      typeof parsed.guestCount !== 'number' ||
      !parsed.allocations
    ) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error(
      'Failed to decode shared EventBudget plan',
      error
    );

    return null;
  }
};

const SharedEventPlanView: React.FC<{
  plan: SharedPlanPayload;
}> = ({ plan }) => {
  const safeGuests = Math.max(
    1,
    plan.guestCount || 1
  );

  const budgetPerGuest = Math.round(
    plan.totalBudget / safeGuests
  );

  const allocationRows = [
    {
      key: 'food',
      label: 'Food & Catering',
      emoji: '🍽️',
      amount: plan.allocations.food || 0,
    },
    {
      key: 'venue',
      label: 'Venue',
      emoji: '🏛️',
      amount: plan.allocations.venue || 0,
    },
    {
      key: 'decoration',
      label: 'Decoration',
      emoji: '✨',
      amount: plan.allocations.decoration || 0,
    },
    {
      key: 'dj',
      label: 'DJ & Music',
      emoji: '🎵',
      amount: plan.allocations.dj || 0,
    },
    {
      key: 'photography',
      label: 'Photography',
      emoji: '📸',
      amount: plan.allocations.photography || 0,
    },
    {
      key: 'misc',
      label: 'Miscellaneous',
      emoji: '🎁',
      amount: plan.allocations.misc || 0,
    },
    {
      key: 'buffer',
      label: 'Safety Buffer',
      emoji: '🛡️',
      amount: plan.allocations.buffer || 0,
    },
  ];

  const totalAllocated =
    allocationRows.reduce(
      (sum, row) => sum + row.amount,
      0
    );

  const handleOpenEventBudget = () => {
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen bg-[#f6efe3] text-[#241d15]">
      {/* HEADER */}

      <header className="border-b border-[#433725] bg-[#18130e]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-lg font-black tracking-tight text-[#fff8eb]">
              EventBudget
            </p>

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8a96d]">
              Shared Event Plan
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenEventBudget}
            className="flex items-center gap-2 rounded-xl border border-[#d3b477]/25 bg-[#d3b477]/10 px-4 py-2.5 text-xs font-bold text-[#efd5a1] transition hover:bg-[#d3b477]/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Open EventBudget
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* HERO */}

        <section className="relative overflow-hidden rounded-[32px] border border-[#493b28] bg-gradient-to-br from-[#18130e] via-[#2d2419] to-[#19140f] p-6 shadow-[0_25px_70px_rgba(45,32,18,0.18)] sm:p-9">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#d0aa65]/10 blur-3xl" />

          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d6b477]/25 bg-[#d6b477]/10 px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#e1c17e]" />

              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#efd6a3]">
                Read-Only Shared Plan
              </span>
            </div>

            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bd9a5c]">
                  {plan.eventType}
                </p>

                <h1 className="mt-2 max-w-3xl font-heading text-3xl font-black text-[#fff9ef] sm:text-5xl">
                  {plan.title}
                </h1>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-[#cbbda8]">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#d5b16f]" />
                    {plan.city || 'Location not specified'}
                  </span>

                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#d5b16f]" />
                    {plan.guestCount} Guests
                  </span>

                  {plan.eventDate && (
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[#d5b16f]" />

                      {new Date(
                        plan.eventDate
                      ).toLocaleDateString(
                        'en-IN',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-[#d4b36e]/20 bg-white/5 p-5 lg:min-w-[230px]">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#bca98a]">
                  Event Budget
                </p>

                <p className="mt-2 font-mono-num text-3xl font-black text-[#f2d49d]">
                  {formatINR(
                    plan.totalBudget
                  )}
                </p>

                <p className="mt-1 text-[11px] text-[#a99b85]">
                  {formatINR(
                    budgetPerGuest
                  )}{' '}
                  available per guest
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SUMMARY */}

        <section className="mt-7 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[22px] border border-[#ddd0b9] bg-[#fffaf1] p-5 shadow-[0_10px_28px_rgba(71,51,29,0.06)]">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8d7b63]">
                Total Budget
              </p>

              <Wallet className="h-4 w-4 text-[#9e7539]" />
            </div>

            <p className="mt-2 text-2xl font-black text-[#2d2419]">
              {formatINR(
                plan.totalBudget
              )}
            </p>
          </div>

          <div className="rounded-[22px] border border-[#ddd0b9] bg-[#fffaf1] p-5 shadow-[0_10px_28px_rgba(71,51,29,0.06)]">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8d7b63]">
                Guest Count
              </p>

              <Users className="h-4 w-4 text-[#9e7539]" />
            </div>

            <p className="mt-2 text-2xl font-black text-[#2d2419]">
              {plan.guestCount}
            </p>
          </div>

          <div className="rounded-[22px] border border-[#ddd0b9] bg-[#fffaf1] p-5 shadow-[0_10px_28px_rgba(71,51,29,0.06)]">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8d7b63]">
              Planning Priority
            </p>

            <p className="mt-2 text-2xl font-black text-[#2d2419]">
              {plan.priority}
            </p>
          </div>
        </section>

        {/* ALLOCATION */}

        <section className="mt-7 overflow-hidden rounded-[30px] border border-[#dacbae] bg-[#fffaf3] shadow-[0_15px_45px_rgba(67,47,26,0.07)]">
          <div className="border-b border-[#ded1bb] bg-[#f0e3cf] px-6 py-5 sm:px-8">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9a743d]">
              Budget Allocation Plan
            </p>

            <h2 className="mt-1 text-xl font-black text-[#2c241b] sm:text-2xl">
              Where the budget is planned
            </h2>

            <p className="mt-1 text-xs leading-relaxed text-[#84735c]">
              This is the allocation snapshot that
              was shared from EventBudget.
            </p>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
            {allocationRows.map(
              (row) => {
                const percentage =
                  plan.totalBudget > 0
                    ? Math.round(
                        (row.amount /
                          plan.totalBudget) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={row.key}
                    className="rounded-2xl border border-[#e0d4c1] bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4eadb] text-lg">
                          {row.emoji}
                        </div>

                        <div>
                          <p className="text-xs font-black text-[#342b21]">
                            {row.label}
                          </p>

                          <p className="mt-0.5 text-[10px] font-semibold text-[#95836b]">
                            {percentage}% of total budget
                          </p>
                        </div>
                      </div>

                      <p className="font-mono-num text-sm font-black text-[#765425]">
                        {formatINR(
                          row.amount
                        )}
                      </p>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eee5d8]">
                      <div
                        className="h-full rounded-full bg-[#9c763e]"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              percentage
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-[#ded1bb] bg-[#f8f0e5] px-6 py-4 sm:flex-row sm:items-center sm:px-8">
            <p className="text-[11px] font-semibold text-[#7e6b52]">
              Total allocation shown
            </p>

            <p className="font-mono-num text-base font-black text-[#5d4425]">
              {formatINR(
                totalAllocated
              )}
            </p>
          </div>
        </section>

        {/* DISCLAIMER */}

        <section className="mt-6 flex items-start gap-3 rounded-2xl border border-[#d8c7a7] bg-[#eee2cf] p-4 sm:p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#866330]" />

          <div>
            <p className="text-xs font-black text-[#513d24]">
              Shared planning snapshot
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-[#78654b]">
              This page is read-only and contains
              budget planning information encoded
              inside the shared link. It does not
              provide access to the original
              editable event, local browser data,
              or vendor quotations. Planning
              amounts are estimates, not confirmed
              vendor prices.
            </p>
          </div>
        </section>

        <div className="py-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9b835c]">
            EVENTBUDGET
          </p>

          <p className="mt-2 text-sm font-bold text-[#5f503c]">
            You set the budget. We plan the celebration.
          </p>
        </div>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  const [event, setEvent] = useState<EventState | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(
        'Failed to parse localStorage plan',
        e
      );
    }

    return createDemoEvent();
  });

  const [
    sharedPlan,
    setSharedPlan,
  ] = useState<SharedPlanPayload | null>(() =>
    decodeSharedPlan(
      window.location.hash
    )
  );

  const [activeSection, setActiveSection] =
    useState('hero-section');

  const [
    isCreateModalOpen,
    setIsCreateModalOpen,
  ] = useState(false);

  const [
    activePlannerTab,
    setActivePlannerTab,
  ] = useState<CategoryKey>('food');

  const [
    hasSavedChanges,
    setHasSavedChanges,
  ] = useState(true);

  const [toasts, setToasts] =
    useState<ToastMessage[]>([]);

  const showToast = (
    type: 'success' | 'warning' | 'info',
    title: string,
    message?: string
  ) => {
    const id = `toast_${Date.now()}_${Math.random()}`;

    const newToast: ToastMessage = {
      id,
      type,
      title,
      message,
    };

    setToasts((prev) => [
      ...prev,
      newToast,
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter(
          (toast) => toast.id !== id
        )
      );
    }, 4500);
  };

  const dismissToast = (
    id: string
  ) => {
    setToasts((prev) =>
      prev.filter(
        (toast) => toast.id !== id
      )
    );
  };

  useEffect(() => {
    const handleHashChange = () => {
      setSharedPlan(
        decodeSharedPlan(
          window.location.hash
        )
      );
    };

    window.addEventListener(
      'hashchange',
      handleHashChange
    );

    return () => {
      window.removeEventListener(
        'hashchange',
        handleHashChange
      );
    };
  }, []);

  useEffect(() => {
    if (!event) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(event)
      );
    } catch (e) {
      console.error(
        'Failed to save to localStorage',
        e
      );
    }
  }, [event]);

  const handleLoadDemo = () => {
    const demo =
      createDemoEvent();

    setEvent(demo);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(demo)
    );

    showToast(
      'success',
      '⚡ Demo Event Loaded!',
      '₹50,000 Birthday Plan (50 Guests, Food Priority) is active.'
    );

    confetti({
      particleCount: 100,
      spread: 70,
      origin: {
        y: 0.5,
      },
    });

    setTimeout(() => {
      const element =
        document.getElementById(
          'dashboard-section'
        );

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }, 150);
  };

  const handleCreateEvent = (
    newEvent: EventState
  ) => {
    setEvent(newEvent);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(newEvent)
    );

    showToast(
      'success',
      '🎉 Event Created Successfully!',
      'Smart Budget Engine allocated your funds.'
    );

    confetti({
      particleCount: 80,
      spread: 60,
      origin: {
        y: 0.6,
      },
    });

    setTimeout(() => {
      const element =
        document.getElementById(
          'dashboard-section'
        );

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }, 200);
  };

  const handleSaveEvent = () => {
    if (!event) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...event,
        savedAt:
          new Date().toISOString(),
      })
    );

    setHasSavedChanges(true);

    showToast(
      'success',
      '💾 Plan Saved Locally',
      'Your event selections and vendor quotes are preserved.'
    );
  };

  const handleResetEvent = () => {
    localStorage.removeItem(
      STORAGE_KEY
    );

    const demo =
      createDemoEvent();

    setEvent(demo);

    showToast(
      'info',
      '🔄 Event Reset',
      'Default demo plan reloaded.'
    );
  };

  const handleUpdateEvent = (
    updated: EventState
  ) => {
    setEvent(updated);
    setHasSavedChanges(false);
  };

  const handleSelectCategory = (
    key: CategoryKey
  ) => {
    if (key === 'buffer') return;

    setActivePlannerTab(key);

    const element =
      document.getElementById(
        'planners-section'
      );

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  const handleSaveQuote = (
    quote: VendorQuote
  ) => {
    if (!event) return;

    const existingQuotes =
      event.quotes || [];

    const updated: EventState = {
      ...event,

      quotes: [
        ...existingQuotes,
        quote,
      ],
    };

    handleUpdateEvent(
      updated
    );

    showToast(
      'success',
      '📝 Quote Saved!',
      `Quotation of ${formatINR(
        quote.quotedAmount
      )} from ${quote.vendorName} recorded.`
    );
  };

  const handleApplyQuote = (
    quote: VendorQuote
  ) => {
    if (!event) return;

    const isCurrentlyApplied =
      event.appliedQuoteIds?.[
        quote.categoryKey
      ] === quote.id;

    const updatedApplied = {
      ...event.appliedQuoteIds,

      [quote.categoryKey]:
        isCurrentlyApplied
          ? undefined
          : quote.id,
    };

    const updated: EventState = {
      ...event,
      appliedQuoteIds:
        updatedApplied,
    };

    handleUpdateEvent(
      updated
    );

    if (!isCurrentlyApplied) {
      showToast(
        'success',
        '✅ Quote Applied to Event Plan!',
        `${quote.vendorName}'s quote of ${formatINR(
          quote.quotedAmount
        )} is now active in ${quote.categoryName}.`
      );
    } else {
      showToast(
        'info',
        'Quote Unlinked',
        'Reverted back to estimated itemized pricing.'
      );
    }
  };

  const handleRemoveQuote = (
    quoteId: string
  ) => {
    if (!event) return;

    const filtered = (
      event.quotes || []
    ).filter(
      (quote) =>
        quote.id !== quoteId
    );

    const newApplied = {
      ...event.appliedQuoteIds,
    };

    Object.entries(
      newApplied
    ).forEach(
      ([key, value]) => {
        if (value === quoteId) {
          newApplied[
            key as CategoryKey
          ] = undefined;
        }
      }
    );

    handleUpdateEvent({
      ...event,
      quotes: filtered,
      appliedQuoteIds:
        newApplied,
    });

    showToast(
      'info',
      'Quote Deleted'
    );
  };

  const handleFixMyBudget = () => {
    if (!event) return;

    const plannedSpend =
      calculateTotalPlanned(
        event
      );

    const bufferAllocated =
      event.allocations.buffer ||
      0;

    const totalCommitted =
      plannedSpend +
      bufferAllocated;

    let remainingOver =
      Math.max(
        0,
        totalCommitted -
          event.totalBudget
      );

    if (
      remainingOver <= 0
    ) {
      showToast(
        'info',
        'Budget Already Balanced',
        'Your event is already within budget.'
      );

      return;
    }

    const {
      newAllocations,
    } =
      rebalanceEventAllocations(
        event,
        remainingOver
      );

    const customFoodPrices = {
      ...(event.customFoodPrices ||
        {}),
    };

    const customPhotographyPrices =
      {
        ...(event.customPhotographyPrices ||
          {}),
      };

    const customDecorPrices = {
      ...(event.customDecorPrices ||
        {}),
    };

    const customEntertainmentPrices =
      {
        ...(event.customEntertainmentPrices ||
          {}),
      };

    const customVenueAddonPrices =
      {
        ...(event.customVenueAddonPrices ||
          {}),
      };

    let selectedFoodPackageId =
      event.selectedFoodPackageId;

    let customVenuePrice =
      event.customVenuePrice;

    const hasAppliedFoodQuote =
      Boolean(
        event.appliedQuoteIds
          ?.food
      );

    const selectedFoodIds =
      Object.entries(
        event.selectedFoodItems ||
          {}
      )
        .filter(
          ([, selected]) =>
            selected
        )
        .map(([id]) => id);

    if (
      remainingOver > 0 &&
      !hasAppliedFoodQuote &&
      selectedFoodIds.length >
        0
    ) {
      if (
        selectedFoodPackageId
      ) {
        const packageFoodTotal =
          calculateCategoryTotals(
            event
          ).food;

        const guestCount =
          Math.max(
            1,
            event.guestCount
          );

        const packagePerPerson =
          packageFoodTotal /
          guestCount;

        const currentItemPrices =
          selectedFoodIds.map(
            (id) => {
              const isolatedFoodState: EventState =
                {
                  ...event,

                  selectedFoodPackageId:
                    undefined,

                  selectedFoodItems:
                    {
                      [id]: true,
                    },

                  customFoodPrices:
                    {
                      ...(event.customFoodPrices ||
                        {}),
                    },

                  appliedQuoteIds:
                    {
                      ...event.appliedQuoteIds,
                      food: undefined,
                    },
                };

              const isolatedTotal =
                calculateCategoryTotals(
                  isolatedFoodState
                ).food;

              return {
                id,
                perPerson:
                  isolatedTotal /
                  guestCount,
              };
            }
          );

        const rawCombinedPerPerson =
          currentItemPrices.reduce(
            (
              sum,
              item
            ) =>
              sum +
              Math.max(
                0,
                item.perPerson
              ),
            0
          );

        if (
          rawCombinedPerPerson >
          0
        ) {
          currentItemPrices.forEach(
            (item) => {
              const share =
                Math.max(
                  0,
                  item.perPerson
                ) /
                rawCombinedPerPerson;

              customFoodPrices[
                item.id
              ] =
                packagePerPerson *
                share;
            }
          );
        } else {
          const equalPrice =
            packagePerPerson /
            selectedFoodIds.length;

          selectedFoodIds.forEach(
            (id) => {
              customFoodPrices[
                id
              ] = equalPrice;
            }
          );
        }

        selectedFoodPackageId =
          undefined;
      }

      const guestCount =
        Math.max(
          1,
          event.guestCount
        );

      for (const id of selectedFoodIds) {
        if (
          remainingOver <= 0
        ) {
          break;
        }

        let currentPerPerson =
          customFoodPrices[id];

        if (
          currentPerPerson ===
          undefined
        ) {
          const isolatedFoodState: EventState =
            {
              ...event,

              selectedFoodPackageId:
                undefined,

              selectedFoodItems: {
                [id]: true,
              },

              customFoodPrices: {
                ...customFoodPrices,
              },

              appliedQuoteIds: {
                ...event.appliedQuoteIds,
                food: undefined,
              },
            };

          currentPerPerson =
            calculateCategoryTotals(
              isolatedFoodState
            ).food /
            guestCount;
        }

        currentPerPerson =
          Math.max(
            0,
            currentPerPerson ||
              0
          );

        const currentItemTotal =
          currentPerPerson *
          guestCount;

        const reduction =
          Math.min(
            currentItemTotal,
            remainingOver
          );

        const perPersonReduction =
          reduction /
          guestCount;

        customFoodPrices[
          id
        ] = Math.max(
          0,
          currentPerPerson -
            perPersonReduction
        );

        remainingOver -=
          reduction;
      }
    }

    for (
      const [
        id,
        selected,
      ] of Object.entries(
        event.selectedPhotography ||
          {}
      )
    ) {
      if (
        !selected ||
        remainingOver <= 0
      ) {
        continue;
      }

      const singleItemState: EventState =
        {
          ...event,

          selectedPhotography:
            {
              [id]: true,
            },
        };

      const currentPrice =
        customPhotographyPrices[
          id
        ] ??
        calculateCategoryTotals(
          singleItemState
        ).photography;

      const reduction =
        Math.min(
          currentPrice,
          remainingOver
        );

      customPhotographyPrices[
        id
      ] = Math.max(
        0,
        currentPrice -
          reduction
      );

      remainingOver -=
        reduction;
    }

    for (
      const [
        id,
        selected,
      ] of Object.entries(
        event.selectedDecorItems ||
          {}
      )
    ) {
      if (
        !selected ||
        remainingOver <= 0
      ) {
        continue;
      }

      const singleItemState: EventState =
        {
          ...event,

          selectedDecorItems: {
            [id]: true,
          },
        };

      const currentPrice =
        customDecorPrices[
          id
        ] ??
        calculateCategoryTotals(
          singleItemState
        ).decoration;

      const reduction =
        Math.min(
          currentPrice,
          remainingOver
        );

      customDecorPrices[
        id
      ] = Math.max(
        0,
        currentPrice -
          reduction
      );

      remainingOver -=
        reduction;
    }

    for (
      const [
        id,
        selected,
      ] of Object.entries(
        event.selectedEntertainment ||
          {}
      )
    ) {
      if (
        !selected ||
        remainingOver <= 0
      ) {
        continue;
      }

      const singleItemState: EventState =
        {
          ...event,

          selectedEntertainment:
            {
              [id]: true,
            },
        };

      const currentPrice =
        customEntertainmentPrices[
          id
        ] ??
        calculateCategoryTotals(
          singleItemState
        ).dj;

      const reduction =
        Math.min(
          currentPrice,
          remainingOver
        );

      customEntertainmentPrices[
        id
      ] = Math.max(
        0,
        currentPrice -
          reduction
      );

      remainingOver -=
        reduction;
    }

    for (
      const [
        id,
        selected,
      ] of Object.entries(
        event.selectedVenueAddons ||
          {}
      )
    ) {
      if (
        !selected ||
        remainingOver <= 0
      ) {
        continue;
      }

      const singleItemState: EventState =
        {
          ...event,

          selectedVenueId: '',
          customVenuePrice: 0,

          selectedVenueAddons: {
            [id]: true,
          },

          appliedQuoteIds: {
            ...event.appliedQuoteIds,
            venue: undefined,
          },
        };

      const currentPrice =
        customVenueAddonPrices[
          id
        ] ??
        calculateCategoryTotals(
          singleItemState
        ).venue;

      const reduction =
        Math.min(
          currentPrice,
          remainingOver
        );

      customVenueAddonPrices[
        id
      ] = Math.max(
        0,
        currentPrice -
          reduction
      );

      remainingOver -=
        reduction;
    }

    if (
      remainingOver > 0 &&
      event.selectedVenueId
    ) {
      const venueOnlyState: EventState =
        {
          ...event,

          selectedVenueAddons:
            {},

          appliedQuoteIds: {
            ...event.appliedQuoteIds,
            venue: undefined,
          },
        };

      const currentVenuePrice =
        customVenuePrice ??
        calculateCategoryTotals(
          venueOnlyState
        ).venue;

      const reduction =
        Math.min(
          currentVenuePrice,
          remainingOver
        );

      customVenuePrice =
        Math.max(
          0,
          currentVenuePrice -
            reduction
        );

      remainingOver -=
        reduction;
    }

    const updated: EventState =
      {
        ...event,

        allocations:
          newAllocations,

        selectedFoodPackageId,
        customFoodPrices,

        customPhotographyPrices,
        customDecorPrices,
        customEntertainmentPrices,

        customVenuePrice,
        customVenueAddonPrices,
      };

    const finalSpend =
      calculateTotalPlanned(
        updated
      );

    const finalBuffer =
      updated.allocations
        .buffer || 0;

    const finalCommitted =
      finalSpend +
      finalBuffer;

    const actualSaved =
      Math.max(
        0,
        totalCommitted -
          finalCommitted
      );

    handleUpdateEvent(
      updated
    );

    if (
      finalCommitted <=
      event.totalBudget
    ) {
      showToast(
        'success',
        '⚡ Budget Fixed!',
        `₹${Math.round(
          actualSaved
        ).toLocaleString(
          'en-IN'
        )} successfully rebalanced.`
      );

      confetti({
        particleCount: 70,
        spread: 60,
        origin: {
          y: 0.6,
        },
      });
    } else {
      const stillOver =
        finalCommitted -
        event.totalBudget;

      showToast(
        'info',
        'Budget Partially Adjusted',
        `₹${Math.round(
          actualSaved
        ).toLocaleString(
          'en-IN'
        )} adjusted. ₹${Math.round(
          stillOver
        ).toLocaleString(
          'en-IN'
        )} still over budget.`
      );
    }
  };

  if (sharedPlan) {
    return (
      <SharedEventPlanView
        plan={sharedPlan}
      />
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-[#211b15] flex flex-col font-sans selection:bg-[#d8b97b] selection:text-[#211b15]">
      <ToastContainer
        toasts={toasts}
        onDismiss={
          dismissToast
        }
      />

      <Navbar
        event={event}
        onOpenCreateModal={() =>
          setIsCreateModalOpen(
            true
          )
        }
        onLoadDemo={
          handleLoadDemo
        }
        onResetEvent={
          handleResetEvent
        }
        onSaveEvent={
          handleSaveEvent
        }
        activeSection={
          activeSection
        }
        setActiveSection={
          setActiveSection
        }
        hasSavedChanges={
          hasSavedChanges
        }
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <HeroSection
          onOpenCreateModal={() =>
            setIsCreateModalOpen(
              true
            )
          }
          onLoadDemo={
            handleLoadDemo
          }
          hasActiveEvent={
            Boolean(event)
          }
          onScrollToDashboard={() => {
            const element =
              document.getElementById(
                'dashboard-section'
              );

            if (element) {
              element.scrollIntoView({
                behavior:
                  'smooth',
              });
            }
          }}
        />

        {event && (
          <>
            <BudgetDashboard
              event={event}
              onUpdateEvent={
                handleUpdateEvent
              }
              onSelectCategory={
                handleSelectCategory
              }
              onFixBudget={
                handleFixMyBudget
              }
            />

            <section
              id="planners-section"
              className="py-8 sm:py-12 space-y-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-4 pb-2">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />

                    <span>
                      Granular Item Selection
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    Explore What You Can Get Inside Each Category
                  </h2>
                </div>

                <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
                  {[
                    {
                      key: 'food',
                      label:
                        'Food Menu',
                      icon:
                        Utensils,
                    },

                    {
                      key:
                        'decoration',
                      label:
                        'Decor & Theme',
                      icon:
                        Palette,
                    },

                    {
                      key: 'dj',
                      label:
                        'DJ & Sound',
                      icon:
                        Music,
                    },

                    {
                      key:
                        'photography',
                      label:
                        'Photography',
                      icon:
                        Camera,
                    },

                    {
                      key:
                        'venue',
                      label:
                        'Venue & Hall',
                      icon:
                        Building,
                    },

                    {
                      key:
                        'misc',
                      label:
                        'Misc & Cake',
                      icon:
                        Gift,
                    },
                  ].map(
                    (tab) => {
                      const Icon =
                        tab.icon;

                      const isActive =
                        activePlannerTab ===
                        tab.key;

                      return (
                        <button
                          key={
                            tab.key
                          }
                          onClick={() =>
                            setActivePlannerTab(
                              tab.key as CategoryKey
                            )
                          }
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isActive
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />

                          <span>
                            {
                              tab.label
                            }
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="pt-2 animate-in fade-in duration-200">
                {activePlannerTab ===
                  'food' && (
                  <FoodMenuBuilder
                    event={
                      event
                    }
                    onUpdateEvent={
                      handleUpdateEvent
                    }
                  />
                )}

                {activePlannerTab ===
                  'decoration' && (
                  <DecorationPlanner
                    event={
                      event
                    }
                    onUpdateEvent={
                      handleUpdateEvent
                    }
                  />
                )}

                {activePlannerTab ===
                  'dj' && (
                  <EntertainmentPlanner
                    event={
                      event
                    }
                    onUpdateEvent={
                      handleUpdateEvent
                    }
                  />
                )}

                {activePlannerTab ===
                  'photography' && (
                  <PhotographyPlanner
                    event={
                      event
                    }
                    onUpdateEvent={
                      handleUpdateEvent
                    }
                  />
                )}

                {activePlannerTab ===
                  'venue' && (
                  <VenuePlanner
                    event={
                      event
                    }
                    onUpdateEvent={
                      handleUpdateEvent
                    }
                  />
                )}

                {activePlannerTab ===
                  'misc' && (
                  <MiscellaneousPlanner
                    event={
                      event
                    }
                    onUpdateEvent={
                      handleUpdateEvent
                    }
                  />
                )}
              </div>
            </section>

            <VendorMarketplace
              event={event}
              onSaveQuote={
                handleSaveQuote
              }
              onApplyQuote={
                handleApplyQuote
              }
              onRemoveQuote={
                handleRemoveQuote
              }
              onFixMyBudget={
                handleFixMyBudget
              }
            />
          </>
        )}
      </main>

      <Footer />

      <CreateEventModal
        isOpen={
          isCreateModalOpen
        }
        onClose={() =>
          setIsCreateModalOpen(
            false
          )
        }
        onSubmit={
          handleCreateEvent
        }
        onLoadDemo={
          handleLoadDemo
        }
      />

      <EventPreview />

      <ChallengeMode
        budget={
          event?.totalBudget ??
          50000
        }
        guestCount={
          event?.guestCount ??
          50
        }
        eventKey={
          event
            ? `${event.eventType}-${event.totalBudget}-${event.guestCount}-${event.priority}`
            : 'demo'
        }
      />

      <TeamSection />
    </div>
  );
};

export default App;
