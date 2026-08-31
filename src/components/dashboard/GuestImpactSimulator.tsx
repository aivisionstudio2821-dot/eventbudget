import React, { useMemo, useState } from 'react';
import {
  Users,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  UtensilsCrossed,
  Wallet,
  Sparkles,
} from 'lucide-react';

import { EventState } from '../../types';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateAllocations } from '../../utils/budgetCalculations';

interface GuestImpactSimulatorProps {
  event: EventState;
}

export const GuestImpactSimulator: React.FC<
  GuestImpactSimulatorProps
> = ({ event }) => {
  const currentGuests = Math.max(1, event.guestCount || 1);

  const [newGuestCount, setNewGuestCount] = useState(
    Math.min(5000, currentGuests + 25)
  );

  const simulation = useMemo(() => {
    const safeGuests = Math.max(
      1,
      Math.min(5000, newGuestCount || 1)
    );

    const currentAllocations = event.allocations;

    const simulatedAllocations = calculateAllocations(
      event.totalBudget,
      safeGuests,
      event.eventType,
      event.priority
    );

    const currentFood =
      currentAllocations.food || 0;

    const simulatedFood =
      simulatedAllocations.food || 0;

    const currentFoodPerGuest =
      currentFood / currentGuests;

    const estimatedFoodNeed =
      currentFoodPerGuest * safeGuests;

    const foodGap =
      estimatedFoodNeed - simulatedFood;

    const guestDifference =
      safeGuests - currentGuests;

    const budgetPerGuest =
      event.totalBudget / safeGuests;

    const currentBudgetPerGuest =
      event.totalBudget / currentGuests;

    return {
      safeGuests,
      simulatedAllocations,
      currentFood,
      simulatedFood,
      estimatedFoodNeed,
      foodGap,
      guestDifference,
      budgetPerGuest,
      currentBudgetPerGuest,
    };
  }, [event, newGuestCount, currentGuests]);

  const isIncrease =
    simulation.guestDifference > 0;

  const isDecrease =
    simulation.guestDifference < 0;

  const foodPressure =
    simulation.foodGap > 0;

  const percentageChange =
    currentGuests > 0
      ? Math.round(
          (Math.abs(simulation.guestDifference) /
            currentGuests) *
            100
        )
      : 0;

  const resetGuests = () => {
    setNewGuestCount(
      Math.min(5000, currentGuests + 25)
    );
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#d8c294] bg-[#fbf7ef] shadow-[0_20px_60px_rgba(69,52,29,0.08)]">
      {/* HEADER */}

      <div className="bg-gradient-to-r from-[#181713] via-[#242018] to-[#151411] px-5 py-6 sm:px-7 sm:py-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#d8b56c]">
              <Sparkles className="h-4 w-4" />
              What-If Simulator
            </div>

            <h3 className="font-heading text-2xl font-extrabold text-[#fffaf0] sm:text-3xl">
              What If More Guests Come?
            </h3>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#d8d0c2]">
              Test how changing your guest count could affect
              your event budget before changing the actual plan.
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#b8924e]/40 bg-[#d8b56c]/10">
            <Users className="h-7 w-7 text-[#e1bd72]" />
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* GUEST CONTROL */}

        <div className="rounded-[24px] border border-[#dfcfaf] bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b7337]">
                Simulate Guest Count
              </p>

              <h4 className="mt-1 text-xl font-black text-[#211b15]">
                {currentGuests} guests
                <ArrowRight className="mx-2 inline h-5 w-5 text-[#b28a4e]" />
                {simulation.safeGuests} guests
              </h4>

              <p className="mt-2 text-sm text-[#786b5c]">
                Your real event plan will not be changed.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() =>
                    setNewGuestCount(
                      Math.min(
                        5000,
                        currentGuests + amount
                      )
                    )
                  }
                  className="rounded-xl border border-[#d8c294] bg-[#f8f0e1] px-4 py-2.5 text-xs font-extrabold text-[#765528] transition-all hover:border-[#aa8147] hover:bg-[#f0e1c4]"
                >
                  +{amount}
                </button>
              ))}

              <button
                type="button"
                onClick={resetGuests}
                className="rounded-xl bg-[#211a12] px-4 py-2.5 text-xs font-extrabold text-[#f4dfb8] transition-all hover:bg-black"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-[#706354]">
                Guest count
              </span>

              <span className="rounded-full bg-[#f0e2c8] px-3 py-1 text-xs font-black text-[#765528]">
                {simulation.safeGuests}
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={Math.min(
                5000,
                Math.max(250, currentGuests + 500)
              )}
              step={1}
              value={simulation.safeGuests}
              onChange={(e) =>
                setNewGuestCount(
                  Number(e.target.value)
                )
              }
              className="w-full accent-[#a77c3d]"
            />

            <div className="mt-2 flex justify-between text-[10px] font-bold text-[#a09381]">
              <span>1 Guest</span>
              <span>
                {Math.min(
                  5000,
                  Math.max(250, currentGuests + 500)
                )}{' '}
                Guests
              </span>
            </div>
          </div>
        </div>

        {/* CHANGE SUMMARY */}

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#e5d8bc] bg-white p-5">
            <Users className="h-5 w-5 text-[#9a7133]" />

            <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#9a7133]">
              Guest Change
            </p>

            <p className="mt-1 text-xl font-black text-[#211b15]">
              {simulation.guestDifference > 0
                ? '+'
                : ''}
              {simulation.guestDifference}
            </p>

            <p className="mt-1 text-xs text-[#786b5c]">
              {simulation.guestDifference === 0
                ? 'No change'
                : `${percentageChange}% ${
                    isIncrease
                      ? 'increase'
                      : 'decrease'
                  }`}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5d8bc] bg-white p-5">
            <Wallet className="h-5 w-5 text-[#9a7133]" />

            <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#9a7133]">
              Budget / Guest
            </p>

            <p className="mt-1 text-xl font-black text-[#211b15]">
              {formatINR(
                Math.round(
                  simulation.budgetPerGuest
                )
              )}
            </p>

            <p className="mt-1 text-xs text-[#786b5c]">
              Previously{' '}
              {formatINR(
                Math.round(
                  simulation.currentBudgetPerGuest
                )
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5d8bc] bg-white p-5">
            <UtensilsCrossed className="h-5 w-5 text-[#9a7133]" />

            <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#9a7133]">
              Food Allocation
            </p>

            <p className="mt-1 text-xl font-black text-[#211b15]">
              {formatINR(
                simulation.simulatedFood
              )}
            </p>

            <p className="mt-1 text-xs text-[#786b5c]">
              Recalculated planning allocation
            </p>
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              foodPressure
                ? 'border-[#d7a09a] bg-[#fff3f0]'
                : 'border-[#c9d1b5] bg-[#f8f8ed]'
            }`}
          >
            {foodPressure ? (
              <AlertTriangle className="h-5 w-5 text-[#ad554d]" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-[#667847]" />
            )}

            <p
              className={`mt-4 text-xs font-extrabold uppercase tracking-wider ${
                foodPressure
                  ? 'text-[#a75a52]'
                  : 'text-[#6f8052]'
              }`}
            >
              Food Pressure
            </p>

            <p
              className={`mt-1 text-xl font-black ${
                foodPressure
                  ? 'text-[#923f38]'
                  : 'text-[#536238]'
              }`}
            >
              {foodPressure
                ? formatINR(
                    Math.round(
                      simulation.foodGap
                    )
                  )
                : 'Covered'}
            </p>

            <p className="mt-1 text-xs text-[#786b5c]">
              {foodPressure
                ? 'Estimated additional food pressure'
                : 'Food allocation can absorb this scenario'}
            </p>
          </div>
        </div>

        {/* RESULT */}

        <div
          className={`mt-5 rounded-[24px] border p-5 sm:p-6 ${
            foodPressure
              ? 'border-[#d7a09a] bg-gradient-to-r from-[#fff1ef] to-[#fff8f3]'
              : 'border-[#c7cfb2] bg-gradient-to-r from-[#f5f6e9] to-[#fbfaf2]'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                foodPressure
                  ? 'bg-[#efd0cb]'
                  : 'bg-[#dce2c8]'
              }`}
            >
              {foodPressure ? (
                <AlertTriangle className="h-5 w-5 text-[#a54d45]" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-[#607044]" />
              )}
            </div>

            <div>
              <p
                className={`text-xs font-extrabold uppercase tracking-[0.15em] ${
                  foodPressure
                    ? 'text-[#a45b52]'
                    : 'text-[#6f8052]'
                }`}
              >
                Simulation Result
              </p>

              <h4
                className={`mt-1 text-lg font-black ${
                  foodPressure
                    ? 'text-[#6f302b]'
                    : 'text-[#3f4b2c]'
                }`}
              >
                {simulation.guestDifference === 0
                  ? 'This is your current guest count.'
                  : foodPressure
                  ? `${simulation.safeGuests} guests would put extra pressure on the current food budget.`
                  : `${simulation.safeGuests} guests appear manageable within the simulated allocation.`}
              </h4>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#756652]">
                {isIncrease
                  ? `Adding ${simulation.guestDifference} guests reduces the available total budget per guest from ${formatINR(
                      Math.round(
                        simulation.currentBudgetPerGuest
                      )
                    )} to ${formatINR(
                      Math.round(
                        simulation.budgetPerGuest
                      )
                    )}. EventBudget recalculates category allocations so you can see the likely pressure before editing the actual event.`
                  : isDecrease
                  ? `Reducing the guest count by ${Math.abs(
                      simulation.guestDifference
                    )} increases the amount of budget available per guest and may create more room for upgrades in other categories.`
                  : 'Move the slider or use the quick buttons to test a different guest count.'}
              </p>
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}

        <div className="mt-4 rounded-2xl border border-[#d9c69d] bg-[#211e18] px-5 py-4">
          <div className="flex gap-3">
            <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-[#d8b56c]" />

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#d8b56c]">
                Scenario Simulator
              </p>

              <p className="mt-1 text-sm font-semibold leading-6 text-[#f7f0e4]">
                This is a planning simulation, not a vendor
                quotation. It estimates the effect of guest-count
                changes using EventBudget&apos;s current allocation
                rules without modifying your saved event.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuestImpactSimulator;
