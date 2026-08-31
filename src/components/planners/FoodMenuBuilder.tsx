import React, { useState } from 'react';
import {
  Utensils,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
} from 'lucide-react';

import { EventState, FoodPackage } from '../../types';
import { FOOD_ITEMS, FOOD_PACKAGES } from '../../data/initialData';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateFoodTotal } from '../../utils/budgetCalculations';

interface FoodMenuBuilderProps {
  event: EventState;
  onUpdateEvent: (updated: EventState) => void;
}

type FoodTab =
  | 'all'
  | 'starters'
  | 'main_course'
  | 'live_counters'
  | 'desserts'
  | 'drinks';

export const FoodMenuBuilder: React.FC<FoodMenuBuilderProps> = ({
  event,
  onUpdateEvent,
}) => {
  const [activeTab, setActiveTab] = useState<FoodTab>('all');

  const guestCount = Math.max(1, event.guestCount || 1);
  const foodAllocated = event.allocations.food || 0;
  const currentFoodTotal = calculateFoodTotal(event);

  const foodDiff = foodAllocated - currentFoodTotal;
  const isFoodOverBudget = foodDiff < 0;

  const toggleFoodItem = (itemId: string) => {
    const isCurrentlySelected = !!event.selectedFoodItems?.[itemId];

    const updated: EventState = {
      ...event,

      // Manual item customization means package pricing should no longer
      // remain locked as the active total.
      selectedFoodPackageId: undefined,

      selectedFoodItems: {
        ...(event.selectedFoodItems || {}),
        [itemId]: !isCurrentlySelected,
      },
    };

    onUpdateEvent(updated);
  };

  const applyPackage = (pkg: FoodPackage) => {
    const newSelected: Record<string, boolean> = {};

    pkg.itemIds.forEach((id) => {
      newSelected[id] = true;
    });

    const updated: EventState = {
      ...event,
      selectedFoodPackageId: pkg.id,
      selectedFoodItems: newSelected,
    };

    onUpdateEvent(updated);
  };

  const handleSwapPaneerToFries = () => {
    const updated: EventState = {
      ...event,
      selectedFoodPackageId: undefined,
      selectedFoodItems: {
        ...(event.selectedFoodItems || {}),
        starter_paneer_tikka: false,
        starter_french_fries: true,
      },
    };

    onUpdateEvent(updated);
  };

  const handleRemoveMocktails = () => {
    const updated: EventState = {
      ...event,
      selectedFoodPackageId: undefined,
      selectedFoodItems: {
        ...(event.selectedFoodItems || {}),
        drink_mocktails: false,
        drink_soft_drinks: true,
      },
    };

    onUpdateEvent(updated);
  };

  const filteredItems =
    activeTab === 'all'
      ? FOOD_ITEMS
      : FOOD_ITEMS.filter((item) => item.category === activeTab);

  const selectedCount = Object.values(
    event.selectedFoodItems || {}
  ).filter(Boolean).length;

  const perPersonCost = Math.round(currentFoodTotal / guestCount);

  const tabs: Array<{
    key: FoodTab;
    label: string;
  }> = [
    { key: 'all', label: 'All Food Items' },
    { key: 'starters', label: '🍢 Starters' },
    { key: 'main_course', label: '🍛 Main Course' },
    { key: 'live_counters', label: '🔥 Live Counters' },
    { key: 'desserts', label: '🍨 Desserts' },
    { key: 'drinks', label: '🍹 Drinks & Water' },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="overflow-hidden rounded-[28px] border border-[#3a342b] bg-gradient-to-br from-[#211f1a] via-[#191816] to-[#11110f] p-6 shadow-[0_18px_50px_rgba(28,23,16,0.18)]">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#8b693b]/40 bg-[#c69b5a]/10">
                <Utensils className="h-4.5 w-4.5 text-[#d9ae68]" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c5a36d]">
                  Catering Planner
                </p>

                <h3 className="font-heading text-xl font-black text-white">
                  Food Menu & Catering Builder
                </h3>
              </div>

            </div>

            <p className="max-w-xl text-xs leading-relaxed text-[#b5aea3]">
              Build a practical menu for{' '}
              <strong className="text-[#f1e2c7]">
                {guestCount} guests
              </strong>
              . Food costs are calculated according to your selected package
              or individual menu items.
            </p>

          </div>

          {/* BUDGET SUMMARY */}

          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-[#39342d] bg-black/25">

            <div className="px-4 py-3">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#91897e]">
                Allocation
              </p>

              <p className="mt-1 whitespace-nowrap font-mono-num text-sm font-black text-white">
                {formatINR(foodAllocated)}
              </p>
            </div>

            <div className="border-x border-[#39342d] px-4 py-3">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#91897e]">
                Menu Total
              </p>

              <p
                className={`mt-1 whitespace-nowrap font-mono-num text-sm font-black ${
                  isFoodOverBudget
                    ? 'text-[#ef9a96]'
                    : 'text-[#dcb570]'
                }`}
              >
                {formatINR(currentFoodTotal)}
              </p>
            </div>

            <div className="px-4 py-3">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#91897e]">
                Per Guest
              </p>

              <p className="mt-1 whitespace-nowrap font-mono-num text-sm font-black text-[#e4c792]">
                ₹{perPersonCost}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* PRICING DISCLAIMER */}

      <div className="flex items-start gap-3 rounded-2xl border border-[#dec89f] bg-[#faf3e7] p-4">

        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#9e733b]" />

        <div>
          <p className="text-xs font-black text-[#6f5330]">
            Estimated Pricing
          </p>

          <p className="mt-0.5 text-[11px] leading-relaxed text-[#80705c]">
            These values are prototype estimates for early event planning.
            Actual vendor quotations may vary depending on date, location,
            quantity, menu customization and service requirements.
          </p>
        </div>

      </div>

      {/* OVER BUDGET WARNING */}

      {isFoodOverBudget && (
        <div className="space-y-4 rounded-[26px] border border-[#d89a92] bg-[#fff3f1] p-5">

          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

            <div className="flex items-center gap-2.5">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0d0cb]">
                <AlertTriangle className="h-4.5 w-4.5 text-[#9e4f48]" />
              </div>

              <div>
                <p className="text-sm font-black text-[#8e403a]">
                  Food budget exceeded
                </p>

                <p className="text-[11px] text-[#9a625d]">
                  Your current menu is{' '}
                  <strong>
                    {formatINR(Math.abs(foodDiff))}
                  </strong>{' '}
                  above the food allocation.
                </p>
              </div>

            </div>

            <div className="rounded-xl border border-[#e7c3be] bg-white/70 px-3 py-2 text-[10px] font-bold text-[#8c5f5a]">
              {formatINR(foodAllocated)} allocated •{' '}
              {formatINR(currentFoodTotal)} selected
            </div>

          </div>

          {/* SAVING OPTIONS */}

          {(event.selectedFoodItems?.starter_paneer_tikka ||
            event.selectedFoodItems?.drink_mocktails) && (
            <div className="rounded-2xl border border-[#ddd6ca] bg-white p-4">

              <p className="mb-3 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#7f633a]">
                <Sparkles className="h-3.5 w-3.5 text-[#b18a4e]" />
                Lower-cost alternatives
              </p>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                {event.selectedFoodItems?.starter_paneer_tikka && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-[#e4dfd7] bg-[#faf9f6] p-3">

                    <div>
                      <p className="text-xs font-black text-[#38332d]">
                        Paneer Tikka → French Fries
                      </p>

                      <p className="mt-1 text-[10px] font-bold text-[#60734f]">
                        Estimated saving ₹{50 * guestCount}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSwapPaneerToFries}
                      className="shrink-0 rounded-lg bg-[#5d704c] px-3 py-2 text-[10px] font-black text-white transition hover:bg-[#4f6041] active:scale-95"
                    >
                      Swap
                    </button>

                  </div>
                )}

                {event.selectedFoodItems?.drink_mocktails && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-[#e4dfd7] bg-[#faf9f6] p-3">

                    <div>
                      <p className="text-xs font-black text-[#38332d]">
                        Mocktails → Soft Drinks
                      </p>

                      <p className="mt-1 text-[10px] font-bold text-[#60734f]">
                        Estimated saving ₹{55 * guestCount}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveMocktails}
                      className="shrink-0 rounded-lg bg-[#5d704c] px-3 py-2 text-[10px] font-black text-white transition hover:bg-[#4f6041] active:scale-95"
                    >
                      Switch
                    </button>

                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      )}

      {/* PACKAGES */}

      <div className="space-y-5 rounded-[28px] border border-[#ded7cc] bg-[#f6f2ea] p-6">

        <div>

          <div className="mb-1 flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#a87f44]" />

            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9b7440]">
              Quick Start
            </p>
          </div>

          <h4 className="text-lg font-black text-[#2d2924]">
            Suggested Food Packages
          </h4>

          <p className="mt-1 text-xs text-[#7f756a]">
            Choose a package to create a starting menu, then customize it
            according to your event.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {FOOD_PACKAGES.map((pkg) => {
            const isSelectedPkg =
              event.selectedFoodPackageId === pkg.id;

            const packageTotal =
              pkg.pricePerPerson * guestCount;

            return (
              <div
                key={pkg.id}
                className={`flex flex-col justify-between rounded-[22px] border p-5 transition-all duration-200 ${
                  isSelectedPkg
                    ? 'border-[#b98b48] bg-[#fffaf0] shadow-[0_12px_30px_rgba(105,77,36,0.12)] ring-1 ring-[#c79c58]'
                    : 'border-[#ddd7cf] bg-white hover:-translate-y-0.5 hover:border-[#c8b18e] hover:shadow-md'
                }`}
              >

                <div>

                  <div className="mb-2 flex items-start justify-between gap-2">

                    <h5 className="text-sm font-black text-[#332e28]">
                      {pkg.name}
                    </h5>

                    {pkg.popular && (
                      <span className="rounded-full border border-[#dfc48e] bg-[#f9eacb] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#855f28]">
                        Popular
                      </span>
                    )}

                  </div>

                  <p className="mb-4 text-[11px] leading-relaxed text-[#7c7368]">
                    {pkg.description}
                  </p>

                </div>

                <div className="space-y-3 border-t border-[#e7e1d9] pt-4">

                  <div className="flex items-end justify-between gap-3">

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-[#9a9085]">
                        Estimated Total
                      </p>

                      <p className="mt-1 font-mono-num text-lg font-black text-[#2d2924]">
                        {formatINR(packageTotal)}
                      </p>
                    </div>

                    <p className="text-right text-[10px] font-bold text-[#8b6b40]">
                      ~₹{pkg.pricePerPerson}
                      <br />
                      per guest
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() => applyPackage(pkg)}
                    className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black transition-all active:scale-[0.98] ${
                      isSelectedPkg
                        ? 'bg-[#211d18] text-[#e9c888]'
                        : 'border border-[#ddd4c7] bg-[#f5f1ea] text-[#4b4339] hover:border-[#b8955f] hover:bg-[#eee6d9]'
                    }`}
                  >

                    {isSelectedPkg && (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}

                    {isSelectedPkg
                      ? 'Package Applied'
                      : 'Select Package'}

                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* TABS */}

      <div className="flex flex-wrap gap-2 border-b border-[#ded8cf] pb-4">

        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-xl px-3.5 py-2 text-xs font-black transition-all ${
              activeTab === tab.key
                ? 'bg-[#211d18] text-[#e5c17f] shadow-sm'
                : 'border border-[#ded8cf] bg-white text-[#71695e] hover:border-[#bfa77f] hover:bg-[#f7f3ec]'
            }`}
          >
            {tab.label}
          </button>
        ))}

      </div>

      {/* FOOD ITEMS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {filteredItems.map((item) => {
          const isSelected =
            !!event.selectedFoodItems?.[item.id];

          const customPrice =
            event.customFoodPrices?.[item.id];

          const currentPrice =
            customPrice !== undefined
              ? customPrice
              : item.defaultPrice;

          const itemTotal =
            currentPrice * guestCount;

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => toggleFoodItem(item.id)}
              className={`flex flex-col justify-between rounded-[20px] border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-[#b98a48] bg-[#fffaf1] shadow-[0_8px_24px_rgba(106,76,34,0.09)] ring-1 ring-[#d1ad71]'
                  : 'border-[#e0dbd3] bg-white hover:-translate-y-0.5 hover:border-[#c7b28f] hover:shadow-md'
              }`}
            >

              <div>

                <div className="mb-2 flex items-start justify-between gap-3">

                  <h5
                    className={`text-sm font-black ${
                      isSelected
                        ? 'text-[#332c23]'
                        : 'text-[#484139]'
                    }`}
                  >
                    {item.name}
                  </h5>

                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                      isSelected
                        ? 'border-[#9d743c] bg-[#211d18] text-[#e7c17f]'
                        : 'border-[#d8d1c7] bg-[#faf8f5]'
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                  </span>

                </div>

                <p className="text-[10px] leading-relaxed text-[#8a8176]">
                  Estimated range ₹{item.priceMin}–₹{item.priceMax} /{' '}
                  {item.unit}
                </p>

              </div>

              <div className="mt-4 flex items-end justify-between border-t border-[#ebe5dd] pt-3">

                <div>

                  <p className="text-xs font-black text-[#9b733b]">
                    ₹{currentPrice}/{item.unit}
                  </p>

                  <p className="mt-0.5 text-[9px] font-semibold text-[#aaa095]">
                    × {guestCount} guests
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-mono-num text-sm font-black text-[#37312b]">
                    {formatINR(itemTotal)}
                  </p>

                  <p
                    className={`mt-0.5 text-[9px] font-black ${
                      isSelected
                        ? 'text-[#99703a]'
                        : 'text-[#9b9288]'
                    }`}
                  >
                    {isSelected
                      ? '✓ Selected'
                      : '+ Click to add'}
                  </p>

                </div>

              </div>

            </button>
          );
        })}

      </div>

    </div>
  );
};
