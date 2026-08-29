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
  Zap,
  ArrowRight,
  TrendingDown,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { EventState, CategoryKey, VendorQuote, CategoryAllocations } from './types';
import { createDemoEvent } from './data/demoEvent';
import { Navbar } from './components/layout/Navbar';
import { TeamSection } from './components/TeamSection';
import { Footer } from './components/layout/Footer';
import { BusinessModel } from './components/layout/BusinessModel';
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
import { ToastContainer, ToastMessage } from './components/common/Toast';
import {
  rebalanceEventAllocations,
  calculateTotalPlanned,
  calculateCategoryTotals
} from './utils/budgetCalculations';
import { formatINR } from './utils/currencyFormatter';
const STORAGE_KEY = 'eventbudget_active_plan_v1';

export const App: React.FC = () => {
  // Load initial event from localStorage or default to demo event
  const [event, setEvent] = useState<EventState | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse localStorage plan', e);
    }
    return createDemoEvent(); // Default to instant working demo for judges
  });

  const [activeSection, setActiveSection] = useState('hero-section');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activePlannerTab, setActivePlannerTab] = useState<CategoryKey>('food');
  const [hasSavedChanges, setHasSavedChanges] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Show toast utility
  const showToast = (type: 'success' | 'warning' | 'info', title: string, message?: string) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage on change
  useEffect(() => {
    if (event) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(event));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    }
  }, [event]);

  // Load 1-Click Demo Event
  const handleLoadDemo = () => {
    const demo = createDemoEvent();
    setEvent(demo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    showToast(
      'success',
      '⚡ Demo Event Loaded!',
      '₹50,000 Birthday Plan (50 Guests, Food Priority) is active.'
    );
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 },
    });

    // Scroll to dashboard
    setTimeout(() => {
      const el = document.getElementById('dashboard-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Handle Event Creation
  const handleCreateEvent = (newEvent: EventState) => {
    setEvent(newEvent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvent));
    showToast('success', '🎉 Event Created Successfully!', 'Smart Budget Engine allocated your funds.');
    
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      const el = document.getElementById('dashboard-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  // Save Event
  const handleSaveEvent = () => {
    if (event) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...event, savedAt: new Date().toISOString() }));
      setHasSavedChanges(true);
      showToast('success', '💾 Plan Saved Locally', 'Your event selections and vendor quotes are preserved.');
    }
  };

  // Reset Event
  const handleResetEvent = () => {
    localStorage.removeItem(STORAGE_KEY);
    const demo = createDemoEvent();
    setEvent(demo);
    showToast('info', '🔄 Event Reset', 'Default demo plan reloaded.');
  };

  // Event State Update
  const handleUpdateEvent = (updated: EventState) => {
    setEvent(updated);
    setHasSavedChanges(false);
  };

  // Navigate to category planner tab
  const handleSelectCategory = (key: CategoryKey) => {
    if (key === 'buffer') return;
    setActivePlannerTab(key);
    const el = document.getElementById('planners-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Save a new vendor quote
  const handleSaveQuote = (quote: VendorQuote) => {
    if (!event) return;
    const existingQuotes = event.quotes || [];
    const updated: EventState = {
      ...event,
      quotes: [...existingQuotes, quote],
    };
    handleUpdateEvent(updated);
    showToast('success', '📝 Quote Saved!', `Quotation of ${formatINR(quote.quotedAmount)} from ${quote.vendorName} recorded.`);
  };

  // Apply quote to override estimate
  const handleApplyQuote = (quote: VendorQuote) => {
    if (!event) return;
    const isCurrentlyApplied = event.appliedQuoteIds?.[quote.categoryKey] === quote.id;
    
    const updatedApplied = {
      ...event.appliedQuoteIds,
      [quote.categoryKey]: isCurrentlyApplied ? undefined : quote.id,
    };

    const updated: EventState = {
      ...event,
      appliedQuoteIds: updatedApplied,
    };

    handleUpdateEvent(updated);

    if (!isCurrentlyApplied) {
      showToast(
        'success',
        '✅ Quote Applied to Event Plan!',
        `${quote.vendorName}'s quote of ${formatINR(quote.quotedAmount)} is now active in ${quote.categoryName}.`
      );
    } else {
      showToast('info', 'Quote Unlinked', 'Reverted back to estimated itemized pricing.');
    }
  };

  // Remove a vendor quote
  const handleRemoveQuote = (quoteId: string) => {
    if (!event) return;
    const filtered = (event.quotes || []).filter(q => q.id !== quoteId);
    
    // If it was applied, remove application
    const newApplied = { ...event.appliedQuoteIds };
    Object.entries(newApplied).forEach(([k, v]) => {
      if (v === quoteId) {
        newApplied[k as CategoryKey] = undefined;
      }
    });

    handleUpdateEvent({
      ...event,
      quotes: filtered,
      appliedQuoteIds: newApplied,
    });
    showToast('info', 'Quote Deleted');
  };

  // Auto Rebalance Trigger from anywhere
  

  
      const handleFixMyBudget = () => {
  if (!event) return;

  const plannedSpend = calculateTotalPlanned(event);
  let remainingOver = Math.max(0, plannedSpend - event.totalBudget);

  if (remainingOver <= 0) {
    showToast(
      'info',
      'Budget Already Balanced',
      'Your event is already within budget.'
    );
    return;
  }

  const { newAllocations } = rebalanceEventAllocations(
    event,
    remainingOver
  );

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

  let customVenuePrice = event.customVenuePrice;

  // PHOTOGRAPHY
  for (const [id, selected] of Object.entries(
    event.selectedPhotography || {}
  )) {
    if (!selected || remainingOver <= 0) continue;

    const singleItemState: EventState = {
      ...event,
      selectedPhotography: { [id]: true },
    };

    const currentPrice =
      customPhotographyPrices[id] ??
      calculateCategoryTotals(singleItemState).photography;

    const reduction = Math.min(currentPrice, remainingOver);

    customPhotographyPrices[id] = Math.max(
      0,
      currentPrice - reduction
    );

    remainingOver -= reduction;
  }

  // DECORATION
  for (const [id, selected] of Object.entries(
    event.selectedDecorItems || {}
  )) {
    if (!selected || remainingOver <= 0) continue;

    const singleItemState: EventState = {
      ...event,
      selectedDecorItems: { [id]: true },
    };

    const currentPrice =
      customDecorPrices[id] ??
      calculateCategoryTotals(singleItemState).decoration;

    const reduction = Math.min(currentPrice, remainingOver);

    customDecorPrices[id] = Math.max(
      0,
      currentPrice - reduction
    );

    remainingOver -= reduction;
  }

  // DJ / ENTERTAINMENT
  for (const [id, selected] of Object.entries(
    event.selectedEntertainment || {}
  )) {
    if (!selected || remainingOver <= 0) continue;

    const singleItemState: EventState = {
      ...event,
      selectedEntertainment: { [id]: true },
    };

    const currentPrice =
      customEntertainmentPrices[id] ??
      calculateCategoryTotals(singleItemState).dj;

    const reduction = Math.min(currentPrice, remainingOver);

    customEntertainmentPrices[id] = Math.max(
      0,
      currentPrice - reduction
    );

    remainingOver -= reduction;
  }

  // VENUE ADD-ONS
  for (const [id, selected] of Object.entries(
    event.selectedVenueAddons || {}
  )) {
    if (!selected || remainingOver <= 0) continue;

    const singleItemState: EventState = {
      ...event,
      selectedVenueId: null,
      selectedVenueAddons: { [id]: true },
    };

    const currentPrice =
      customVenueAddonPrices[id] ??
      calculateCategoryTotals(singleItemState).venue;

    const reduction = Math.min(currentPrice, remainingOver);

    customVenueAddonPrices[id] = Math.max(
      0,
      currentPrice - reduction
    );

    remainingOver -= reduction;
  }

  // VENUE BASE PRICE — fallback
  if (
    remainingOver > 0 &&
    event.selectedVenueId
  ) {
    const venueOnlyState: EventState = {
      ...event,
      selectedVenueAddons: {},
    };

    const currentVenuePrice =
      customVenuePrice ??
      calculateCategoryTotals(venueOnlyState).venue;

    const reduction = Math.min(
      currentVenuePrice,
      remainingOver
    );

    customVenuePrice = Math.max(
      0,
      currentVenuePrice - reduction
    );

    remainingOver -= reduction;
  }

  const updated: EventState = {
    ...event,
    allocations: newAllocations,
    customPhotographyPrices,
    customDecorPrices,
    customEntertainmentPrices,
    customVenuePrice,
    customVenueAddonPrices,
  };

  const finalSpend = calculateTotalPlanned(updated);
  const actualSaved = Math.max(0, plannedSpend - finalSpend);

  handleUpdateEvent(updated);

  if (finalSpend <= event.totalBudget) {
    showToast(
      'success',
      '⚡ Budget Fixed!',
      `₹${Math.round(actualSaved).toLocaleString(
        'en-IN'
      )} successfully rebalanced.`
    );

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
  } else {
    const stillOver = finalSpend - event.totalBudget;

    showToast(
      'info',
      'Budget Partially Adjusted',
      `₹${Math.round(actualSaved).toLocaleString(
        'en-IN'
      )} adjusted. ₹${Math.round(
        stillOver
      ).toLocaleString('en-IN')} still over budget.`
    );
  }
};


  return (
    <div className="min-h-screen bg-transparent text-[#211b15] flex flex-col font-sans selection:bg-[#d8b97b] selection:text-[#211b15]">
      
      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Navigation */}
      <Navbar
        event={event}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onLoadDemo={handleLoadDemo}
        onResetEvent={handleResetEvent}
        onSaveEvent={handleSaveEvent}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        hasSavedChanges={hasSavedChanges}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Landing Hero */}
        <HeroSection
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onLoadDemo={handleLoadDemo}
          hasActiveEvent={Boolean(event)}
          onScrollToDashboard={() => {
            const el = document.getElementById('dashboard-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Active Event Experience */}
        {event && (
          <>
            {/* Dashboard & Smart Engine */}
            <BudgetDashboard
              event={event}
              onUpdateEvent={handleUpdateEvent}
              onSelectCategory={handleSelectCategory}
            />

            {/* Category Deep Planners */}
            <section id="planners-section" className="py-8 sm:py-12 space-y-6">
              
              {/* Category Navigation Pills */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-2">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Granular Item Selection</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    Explore What You Can Get Inside Each Category
                  </h2>
                </div>

                {/* Tab Switchers */}
                <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
                  {[
                    { key: 'food', label: 'Food Menu', icon: Utensils },
                    { key: 'decoration', label: 'Decor & Theme', icon: Palette },
                    { key: 'dj', label: 'DJ & Sound', icon: Music },
                    { key: 'photography', label: 'Photography', icon: Camera },
                    { key: 'venue', label: 'Venue & Hall', icon: Building },
                    { key: 'misc', label: 'Misc & Cake', icon: Gift },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activePlannerTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActivePlannerTab(tab.key as CategoryKey)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Planner View */}
              <div className="pt-2 animate-in fade-in duration-200">
                {activePlannerTab === 'food' && (
                  <FoodMenuBuilder event={event} onUpdateEvent={handleUpdateEvent} />
                )}
                {activePlannerTab === 'decoration' && (
                  <DecorationPlanner event={event} onUpdateEvent={handleUpdateEvent} />
                )}
                {activePlannerTab === 'dj' && (
                  <EntertainmentPlanner event={event} onUpdateEvent={handleUpdateEvent} />
                )}
                {activePlannerTab === 'photography' && (
                  <PhotographyPlanner event={event} onUpdateEvent={handleUpdateEvent} />
                )}
                {activePlannerTab === 'venue' && (
                  <VenuePlanner event={event} onUpdateEvent={handleUpdateEvent} />
                )}
                {activePlannerTab === 'misc' && (
                  <MiscellaneousPlanner event={event} onUpdateEvent={handleUpdateEvent} />
                )}
              </div>

            </section>

            {/* Local Ahmedabad Vendors Marketplace & Quotations */}
            <VendorMarketplace
              event={event}
              onSaveQuote={handleSaveQuote}
              onApplyQuote={handleApplyQuote}
              onRemoveQuote={handleRemoveQuote}
              onFixMyBudget={handleFixMyBudget}
            />
          </>
        )}

        {/* Business Model / Monetization Section */}
        <BusinessModel />

      </main>

      {/* Footer */}
      <Footer />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
        onLoadDemo={handleLoadDemo}
      />
      <TeamSection />
    </div>
  );
};
export default App;
