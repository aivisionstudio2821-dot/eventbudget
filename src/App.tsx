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

    handleUpdateEvent(updated);

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

  const handleFixMyBudget = () => {
    if (!event) return;

    const plannedSpend =
      calculateTotalPlanned(event);

    const bufferAllocated =
      event.allocations.buffer || 0;

    const totalCommitted =
      plannedSpend + bufferAllocated;

    let remainingOver = Math.max(
      0,
      totalCommitted - event.totalBudget
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

        const currentItemPrices =
          selectedFoodIds.map((id) => {
            const isolatedFoodState: EventState = {
              ...event,

              selectedFoodPackageId:
                undefined,

              selectedFoodItems: {
                [id]: true,
              },

              customFoodPrices: {
                ...(event.customFoodPrices || {}),
              },

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

        selectedFoodPackageId =
          undefined;
      }

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

    const updated: EventState = {
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
      updated.allocations.buffer || 0;

    const finalCommitted =
      finalSpend + finalBuffer;

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
