import React from 'react';
import {
  Music,
  Sparkles,
  CheckCircle2,
  Info,
  Volume2,
} from 'lucide-react';

import { EventState } from '../../types';
import { ENTERTAINMENT_ITEMS } from '../../data/initialData';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateDJTotal } from '../../utils/budgetCalculations';

interface EntertainmentPlannerProps {
  event: EventState;
  onUpdateEvent: (updated: EventState) => void;
}

export const EntertainmentPlanner: React.FC<EntertainmentPlannerProps> = ({
  event,
  onUpdateEvent,
}) => {
  const djAllocated = event.allocations.dj || 0;
  const currentDJTotal = calculateDJTotal(event);

  const diff = djAllocated - currentDJTotal;
  const isOver = diff < 0;

  const toggleItem = (itemId: string) => {
    const isSelected = !!event.selectedEntertainment?.[itemId];

    const updated: EventState = {
      ...event,
      selectedEntertainment: {
        ...(event.selectedEntertainment || {}),
        [itemId]: !isSelected,
      },
    };

    onUpdateEvent(updated);
  };

  const djSetups = ENTERTAINMENT_ITEMS.filter(
    (item) => item.type === 'dj' && !item.isAdditional
  );

  const addOnPerformers = ENTERTAINMENT_ITEMS.filter(
    (item) => item.isAdditional
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="overflow-hidden rounded-[28px] border border-[#3a342b] bg-gradient-to-br from-[#211f1a] via-[#191816] to-[#11110f] p-6 shadow-[0_18px_50px_rgba(28,23,16,0.18)]">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#8b693b]/40 bg-[#c69b5a]/10">
                <Music className="h-4.5 w-4.5 text-[#d9ae68]" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c5a36d]">
                  Entertainment Planner
                </p>

                <h3 className="font-heading text-xl font-black text-white">
                  DJ, Sound & Entertainment Planner
                </h3>
              </div>

            </div>

            <p className="max-w-xl text-xs leading-relaxed text-[#b5aea3]">
              Choose your DJ setup, sound system, lighting, live artists and
              optional stage effects while keeping the entertainment budget
              under control.
            </p>

          </div>

          {/* BUDGET SUMMARY */}

          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[#39342d] bg-black/25">

            <div className="px-5 py-3">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#91897e]">
                DJ Allocation
              </p>

              <p className="mt-1 whitespace-nowrap font-mono-num text-sm font-black text-white">
                {formatINR(djAllocated)}
              </p>
            </div>

            <div className="border-l border-[#39342d] px-5 py-3">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#91897e]">
                Selected Spend
              </p>

              <p
                className={`mt-1 whitespace-nowrap font-mono-num text-sm font-black ${
                  isOver
                    ? 'text-[#ef9a96]'
                    : 'text-[#e4c792]'
                }`}
              >
                {formatINR(currentDJTotal)}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* PRICING NOTE */}

      <div className="flex items-start gap-3 rounded-2xl border border-[#dec89f] bg-[#faf3e7] p-4">

        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#9e733b]" />

        <div>
          <p className="text-xs font-black text-[#6f5330]">
            Estimated Pricing
          </p>

          <p className="mt-0.5 text-[11px] leading-relaxed text-[#80705c]">
            Actual entertainment quotes may vary depending on event duration,
            equipment requirements, venue size, artist availability, power
            backup and event date.
          </p>
        </div>

      </div>

      {/* OVER BUDGET WARNING */}

      {isOver && (
        <div className="rounded-[24px] border border-[#d99d96] bg-[#fff3f1] p-4">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-black text-[#8f433d]">
                Entertainment budget exceeded
              </p>

              <p className="mt-0.5 text-[11px] text-[#9d625d]">
                Your current entertainment selections are{' '}
                <strong>{formatINR(Math.abs(diff))}</strong> above the
                allocated budget.
              </p>
            </div>

            <div className="rounded-xl border border-[#e7c3be] bg-white/70 px-3 py-2 text-[10px] font-bold text-[#8c5f5a]">
              {formatINR(djAllocated)} allocated •{' '}
              {formatINR(currentDJTotal)} selected
            </div>

          </div>

        </div>
      )}

      {/* CORE DJ SETUPS */}

      <div className="space-y-4 rounded-[28px] border border-[#ded7cc] bg-[#f6f2ea] p-6">

        <div>

          <div className="mb-1 flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-[#a87f44]" />

            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9b7440]">
              Core Setup
            </p>
          </div>

          <h4 className="text-lg font-black text-[#2d2924]">
            DJ & Sound Packages
          </h4>

          <p className="mt-1 text-xs text-[#7f756a]">
            Pick the main entertainment setup that suits your event size and
            budget.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {djSetups.map((item) => {
            const isSelected =
              !!event.selectedEntertainment?.[item.id];

            const customPrice =
              event.customEntertainmentPrices?.[item.id];

            const price =
              customPrice !== undefined
                ? customPrice
                : item.defaultPrice;

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex flex-col justify-between rounded-[22px] border p-5 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-[#b98b48] bg-[#fffaf0] shadow-[0_12px_30px_rgba(105,77,36,0.12)] ring-1 ring-[#c79c58]'
                    : 'border-[#ddd7cf] bg-white hover:-translate-y-0.5 hover:border-[#c8b18e] hover:shadow-md'
                }`}
              >

                <div>

                  <div className="mb-2 flex items-start justify-between gap-3">

                    <h5 className="text-sm font-black text-[#332e28]">
                      {item.name}
                    </h5>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
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
                    Estimated range ₹
                    {item.priceMin.toLocaleString('en-IN')} – ₹
                    {item.priceMax.toLocaleString('en-IN')}
                  </p>

                </div>

                <div className="mt-5 flex items-end justify-between border-t border-[#ebe5dd] pt-4">

                  <p className="font-mono-num text-base font-black text-[#8f6935]">
                    {formatINR(price)}
                  </p>

                  <p
                    className={`text-[9px] font-black ${
                      isSelected
                        ? 'text-[#99703a]'
                        : 'text-[#9b9288]'
                    }`}
                  >
                    {isSelected
                      ? '✓ Selected'
                      : '+ Select Setup'}
                  </p>

                </div>

              </button>
            );
          })}

        </div>

      </div>

      {/* ADD-ONS */}

      <div className="space-y-4">

        <div>

          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#a87f44]" />

            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9b7440]">
              Optional Upgrades
            </p>
          </div>

          <h4 className="text-lg font-black text-[#2d2924]">
            Lighting, Live Artists & Stage FX
          </h4>

          <p className="mt-1 text-xs text-[#7f756a]">
            Add extras only when they fit comfortably inside your total event
            plan.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {addOnPerformers.map((item) => {
            const isSelected =
              !!event.selectedEntertainment?.[item.id];

            const customPrice =
              event.customEntertainmentPrices?.[item.id];

            const price =
              customPrice !== undefined
                ? customPrice
                : item.defaultPrice;

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex flex-col justify-between rounded-[20px] border p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-[#c69a59] bg-[#fffaf2] shadow-[0_8px_24px_rgba(106,76,34,0.09)] ring-1 ring-[#d6b679]'
                    : 'border-[#e0dbd3] bg-white hover:-translate-y-0.5 hover:border-[#c7b28f] hover:shadow-md'
                }`}
              >

                <div>

                  <div className="mb-2 flex items-start justify-between gap-3">

                    <h5 className="text-sm font-black text-[#403931]">
                      {item.name}
                    </h5>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        isSelected
                          ? 'border-[#9d743c] bg-[#d2aa67] text-[#2b241b]'
                          : 'border-[#d8d1c7] bg-[#faf8f5]'
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                    </span>

                  </div>

                  <p className="text-[10px] leading-relaxed text-[#8a8176]">
                    Estimated range ₹
                    {item.priceMin.toLocaleString('en-IN')} – ₹
                    {item.priceMax.toLocaleString('en-IN')}
                  </p>

                </div>

                <div className="mt-4 flex items-end justify-between border-t border-[#ebe5dd] pt-3">

                  <p className="font-mono-num text-sm font-black text-[#936d37]">
                    {formatINR(price)}
                  </p>

                  <p
                    className={`text-[9px] font-black ${
                      isSelected
                        ? 'text-[#99703a]'
                        : 'text-[#9b9288]'
                    }`}
                  >
                    {isSelected
                      ? '✓ Added'
                      : '+ Add Upgrade'}
                  </p>

                </div>

              </button>
            );
          })}

        </div>

      </div>

    </div>
  );
};
