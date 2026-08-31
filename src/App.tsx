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

export const App: React.FC = () => {
  /*
   * LOAD EVENT
   */
  const [event, setEvent] = useState<EventState | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse localStorage plan', e);
    }

    return createDemoEvent();
  });

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

  /*
   * TOAST
   */
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
        prev.filter((toast) => toast.id !== id)
      );
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) =>
      prev.filter((toast) => toast.id !== id)
    );
  };

  /*
   * AUTO SAVE TO LOCAL STORAGE
   */
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

  /*
   * LOAD DEMO EVENT
   */
  const handleLoadDemo = () => {
    const demo = createDemoEvent();

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

  /*
   * CREATE EVENT
   */
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

  /*
   * SAVE EVENT
   */
  const handleSaveEvent = () => {
    if (!event) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...event,
        savedAt: new Date().toISOString(),
      })
    );

    setHasSavedChanges(true);

    showToast(
      'success',
      '💾 Plan Saved Locally',
      'Your event selections and vendor quotes are preserved.'
    );
  };

  /*
   * RESET EVENT
   */
  const handleResetEvent = () => {
    localStorage.removeItem(STORAGE_KEY);

    const demo = createDemoEvent();

    setEvent(demo);

    showToast(
      'info',
      '🔄 Event Reset',
      'Default demo plan reloaded.'
    );
  };

  /*
   * UPDATE EVENT
   */
  const handleUpdateEvent = (
    updated: EventState
  ) => {
    setEvent(updated);
    setHasSavedChanges(false);
  };

  /*
   * SELECT CATEGORY
   */
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

  /*
   * SAVE VENDOR QUOTE
   */
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

    handleUpdateEvent(updated);

    showToast(
      'success',
      '📝 Quote Saved!',
      `Quotation of ${formatINR(
        quote.quotedAmount
      )} from ${quote.vendorName} recorded.`
    );
  };

  /*
   * APPLY VENDOR QUOTE
   */
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

    handleUpdateEvent(updated);

    if (!isCurrentlyApplied) {
      showToast(
        'success',
        '✅ Quote Applied to Event Plan!',
        `${quote.vendorName}'s quote of ${formatINR(
          quote.quotedAmount
        )} is now active in ${
          quote.categoryName
        }.`
      );
    } else {
      showToast(
        'info',
        'Quote Unlinked',
        'Reverted back to estimated itemized pricing.'
      );
    }
  };

  /*
   * REMOVE QUOTE
   */
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
    ).forEach(([key, value]) => {
      if (value === quoteId) {
        newApplied[
          key as CategoryKey
        ] = undefined;
      }
    });

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

  /*
   * FIX MY BUDGET
   */
  const handleFixMyBudget = () => {
    if (!event) return;

    const plannedSpend =
      calculateTotalPlanned(event);

    let remainingOver = Math.max(
      0,
      plannedSpend - event.totalBudget
    );

    if (remainingOver <= 0) {
      showToast(
        'info',
        'Budget Already Balanced',
        'Your event is already within budget.'
      );

      return;
    }

    const {
      newAllocations,
    } = rebalanceEventAllocations(
      event,
      remainingOver
    );

    /*
     * Work on local copies first.
     */
    const customFoodPrices = {
      ...(event.customFoodPrices || {}),
    };

    const customPhotographyPrices = {
      ...(event.customPhotographyPrices || {}),
    };

    const customDecorPrices = {
      ...(event.customDecorPrices || {}),
    };

    const customEntertainmentPrices = {
      ...(event.customEntertainmentPrices || {}),
    };

    const customVenueAddonPrices = {
      ...(event.customVenueAddonPrices || {}),
    };

    let selectedFoodPackageId =
      event.selectedFoodPackageId;

    let customVenuePrice =
      event.customVenuePrice;

    /*
     * =====================================================
     * FOOD
     *
     * Important:
     * When a food package is active, calculateFoodTotal()
     * uses the package price instead of individual item
     * prices.
     *
     * Therefore Fix My Budget first converts the package
     * into manual item pricing while preserving the exact
     * current package total. Only then does it reduce food.
     *
     * Applied vendor quotes are intentionally protected.
     * =====================================================
     */

    const hasAppliedFoodQuote =
      Boolean(
        event.appliedQuoteIds?.food
      );

    const selectedFoodIds =
      Object.entries(
        event.selectedFoodItems || {}
      )
        .filter(([, selected]) => selected)
        .map(([id]) => id);

    if (
      remainingOver > 0 &&
      !hasAppliedFoodQuote &&
      selectedFoodIds.length > 0
    ) {
      /*
       * PACKAGE -> MANUAL CONVERSION
       *
       * Get the current food total BEFORE clearing
       * selectedFoodPackageId. At this moment this is
       * exactly the package total.
       */
      if (selectedFoodPackageId) {
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

        /*
         * Determine current item weights.
         *
         * The weights preserve the relative value of
         * each selected item while forcing their new
         * combined per-person total to equal the
         * package's real per-person price.
         */
        const currentItemPrices =
          selectedFoodIds.map((id) => {
            const isolatedFoodState: EventState = {
              ...event,

              /*
               * Clear package so the calculator uses
               * manual item pricing.
               */
              selectedFoodPackageId:
                undefined,

              selectedFoodItems: {
                [id]: true,
              },

              customFoodPrices: {
                ...(event.customFoodPrices || {}),
              },

              /*
               * Protect against an applied food quote
               * affecting the isolated calculation.
               */
              appliedQuoteIds: {
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
          });

        const rawCombinedPerPerson =
          currentItemPrices.reduce(
            (sum, item) =>
              sum +
              Math.max(
                0,
                item.perPerson
              ),
            0
          );

        /*
         * If the selected items have valid prices,
         * distribute the package price proportionally.
         *
         * Otherwise distribute it equally.
         */
        if (rawCombinedPerPerson > 0) {
          currentItemPrices.forEach(
            (item) => {
              const share =
                Math.max(
                  0,
                  item.perPerson
                ) /
                rawCombinedPerPerson;

              customFoodPrices[item.id] =
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
              customFoodPrices[id] =
                equalPrice;
            }
          );
        }

        /*
         * Package is now represented by manual item
         * prices with the SAME starting total.
         */
        selectedFoodPackageId =
          undefined;
      }

      /*
       * Reduce food prices.
       *
       * Food item prices are per-person, so reducing
       * ₹1 from an item's price saves ₹guestCount from
       * the total event cost.
       */
      const guestCount =
        Math.max(
          1,
          event.guestCount
        );

      for (
        const id of selectedFoodIds
      ) {
        if (remainingOver <= 0) {
          break;
        }

        /*
         * Determine current per-person price after
         * package conversion (or existing manual price).
         */
        let currentPerPerson =
          customFoodPrices[id];

        if (
          currentPerPerson ===
            undefined
        ) {
          const isolatedFoodState: EventState = {
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
            currentPerPerson || 0
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

        customFoodPrices[id] =
          Math.max(
            0,
            currentPerPerson -
              perPersonReduction
          );

        remainingOver -=
          reduction;
      }
    }

    /*
     * =====================================================
     * PHOTOGRAPHY
     * =====================================================
     */
    for (
      const [
        id,
        selected,
      ] of Object.entries(
        event.selectedPhotography || {}
      )
    ) {
      if (
        !selected ||
        remainingOver <= 0
      ) {
        continue;
      }

      const singleItemState: EventState = {
        ...event,

        selectedPhotography: {
          [id]: true,
        },
      };

      const currentPrice =
        customPhotographyPrices[id] ??
        calculateCategoryTotals(
          singleItemState
        ).photography;

      const reduction =
        Math.min(
          currentPrice,
          remainingOver
        );

      customPhotographyPrices[id] =
        Math.max(
          0,
          currentPrice -
            reduction
        );

      remainingOver -=
        reduction;
    }

    /*
     * =====================================================
     * DECORATION
     * =====================================================
     */
    for (
      const [
        id,
        selected,
      ] of Object.entries(
        event.selectedDecorItems || {}
      )
    ) {
      if (
        !selected ||
        remainingOver <= 0
      ) {
        continue;
      }

      const singleItemState: EventState = {
        ...event,

        selectedDecorItems: {
          [id]: true,
        },
      };

      const currentPrice =
        customDecorPrices[id] ??
        calculateCategoryTotals(
          singleItemState
        ).decoration;

      const reduction =
        Math.min(
          currentPrice,
          remainingOver
        );

      customDecorPrices[id] =
        Math.max(
          0,
          currentPrice -
            reduction
        );

      remainingOver -=
        reduction;
    }

    /*
     * =====================================================
     * DJ / ENTERTAINMENT
     * =====================================================
     */
    for (
      const [
        id,
        selected,
      ] of Object.entries(
        event.selectedEntertainment || {}
      )
    ) {
      if (
        !selected ||
        remainingOver <= 0
      ) {
        continue;
      }

      const singleItemState: EventState = {
        ...event,

        selectedEntertainment: {
          [id]: true,
        },
      };

      const currentPrice =
        customEntertainmentPrices[id] ??
        calculateCategoryTotals(
          singleItemState
        ).dj;

      const reduction =
        Math.min(
          currentPrice,
          remainingOver
        );

      customEntertainmentPrices[id] =
        Math.max(
          0,
          currentPrice -
            reduction
        );

      remainingOver -=
        reduction;
    }

    /*
     * =====================================================
     * VENUE ADD-ONS
     *
     * selectedVenueId is deliberately cleared in the
     * isolated calculation so the venue base price is
     * NOT accidentally counted as part of an add-on.
     * =====================================================
     */
    for (
      const [
        id,
        selected,
      ] of Object.entries(
        event.selectedVenueAddons || {}
      )
    ) {
      if (
        !selected ||
        remainingOver <= 0
      ) {
        continue;
      }

      const singleItemState: EventState = {
        ...event,

        selectedVenueId: '',

        customVenuePrice: 0,

        selectedVenueAddons: {
          [id]: true,
        },

        /*
         * Protect isolated calculation from a
         * vendor venue quote.
         */
        appliedQuoteIds: {
          ...event.appliedQuoteIds,
          venue: undefined,
        },
      };

      const currentPrice =
        customVenueAddonPrices[id] ??
        calculateCategoryTotals(
          singleItemState
        ).venue;

      const reduction =
        Math.min(
          currentPrice,
          remainingOver
        );

      customVenueAddonPrices[id] =
        Math.max(
          0,
          currentPrice -
            reduction
        );

      remainingOver -=
        reduction;
    }

    /*
     * =====================================================
     * VENUE BASE PRICE
     *
     * Add-ons are removed from this isolated state so
     * only the venue base price is measured.
     * =====================================================
     */
    if (
      remainingOver > 0 &&
      event.selectedVenueId
    ) {
      const venueOnlyState: EventState = {
        ...event,

        selectedVenueAddons: {},

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

    /*
     * =====================================================
     * UPDATED EVENT
     * =====================================================
     */
    const updated: EventState = {
      ...event,

      allocations:
        newAllocations,

      /*
       * Food package may have been safely converted
       * into equivalent manual item pricing.
       */
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

    const actualSaved =
      Math.max(
        0,
        plannedSpend -
          finalSpend
      );

    handleUpdateEvent(
      updated
    );

    /*
     * SUCCESS
     */
    if (
      finalSpend <=
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
        finalSpend -
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

  return (
    <div className="min-h-screen bg-transparent text-[#211b15] flex flex-col font-sans selection:bg-[#d8b97b] selection:text-[#211b15]">

      {/* TOASTS */}
      <ToastContainer
        toasts={toasts}
        onDismiss={
          dismissToast
        }
      />

      {/* NAVBAR */}
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

      {/* MAIN WEBSITE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* HERO */}
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

        {/* ACTIVE EVENT */}
        {event && (
          <>

            {/* BUDGET DASHBOARD */}
            <BudgetDashboard
              event={event}

              onUpdateEvent={
                handleUpdateEvent
              }

              onSelectCategory={
                handleSelectCategory
              }
            />

            {/* CATEGORY PLANNERS */}
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

                {/* CATEGORY BUTTONS */}
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

              {/* ACTIVE PLANNER */}
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

            {/* AHMEDABAD VENDORS */}
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

      {/* FOOTER */}
      <Footer />

      {/* CREATE EVENT */}
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

      {/* EVENT VISUALIZER */}
      <EventPreview />

      {/* INTERACTIVE CHALLENGE MODE */}
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

      {/* TEAM */}
      <TeamSection />

    </div>
  );
};

export default App;
