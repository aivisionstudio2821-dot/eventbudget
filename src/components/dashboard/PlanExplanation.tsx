import React from 'react';
import {
  Calculator,
  Target,
  ShieldCheck,
  Users,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

import { EventState, CategoryKey } from '../../types';
import { formatINR } from '../../utils/currencyFormatter';

interface PlanExplanationProps {
  event: EventState;
}

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  food: 'Food',
  venue: 'Venue',
  decoration: 'Decoration',
  dj: 'DJ / Music',
  photography: 'Photography',
  misc: 'Miscellaneous',
  buffer: 'Safety Buffer',
};

export const PlanExplanation: React.FC<PlanExplanationProps> = ({
  event,
}) => {
  const totalBudget = Math.max(1, event.totalBudget || 1);
  const guestCount = Math.max(1, event.guestCount || 1);

  const allocationEntries = Object.entries(
    event.allocations
  ) as [CategoryKey, number][];

  const sortedAllocations = [...allocationEntries].sort(
    (a, b) => b[1] - a[1]
  );

  const topCategory = sortedAllocations[0];

  const foodPercent = Math.round(
    ((event.allocations.food || 0) / totalBudget) * 100
  );

  const venuePercent = Math.round(
    ((event.allocations.venue || 0) / totalBudget) * 100
  );

  const decorPercent = Math.round(
    ((event.allocations.decoration || 0) / totalBudget) * 100
  );

  const djPercent = Math.round(
    ((event.allocations.dj || 0) / totalBudget) * 100
  );

  const photoPercent = Math.round(
    ((event.allocations.photography || 0) / totalBudget) *
      100
  );

  const bufferPercent = Math.round(
    ((event.allocations.buffer || 0) / totalBudget) * 100
  );

  const availablePerGuest = Math.round(
    totalBudget / guestCount
  );

  const priorityLabel =
    event.priority === 'Balanced'
      ? 'Balanced planning'
      : `${event.priority} priority`;

  const priorityExplanation =
    event.priority === 'Balanced'
      ? 'No single category was intentionally given preference, so the budget is distributed using the standard event-type planning pattern.'
      : `${event.priority} was selected as the main priority, so the planner gives additional weight to that area while reducing flexible portions of other categories.`;

  const guestExplanation =
    guestCount > 100
      ? `Because the event has ${guestCount} guests, guest-linked spending such as food becomes more important and receives additional planning weight.`
      : guestCount < 30
      ? `Because this is a smaller ${guestCount}-guest event, the planner reduces some food weight and allows relatively more room for presentation and decoration.`
      : `With ${guestCount} guests, the plan uses the normal guest-range allocation without a large-event or small-event adjustment.`;

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#d8c294] bg-[#fbf7ef] shadow-[0_20px_60px_rgba(69,52,29,0.08)]">
      {/* HEADER */}

      <div className="bg-gradient-to-r from-[#181713] via-[#242018] to-[#151411] px-5 py-6 sm:px-7 sm:py-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#d8b56c]">
              <Sparkles className="h-4 w-4" />
              Planning Logic
            </div>

            <h3 className="font-heading text-2xl font-extrabold text-[#fffaf0] sm:text-3xl">
              Why This Plan?
            </h3>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#d8d0c2]">
              EventBudget uses your event type, total budget,
              guest count and selected priority to create a
              structured starting allocation.
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#b8924e]/40 bg-[#d8b56c]/10">
            <Calculator className="h-7 w-7 text-[#e1bd72]" />
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* SUMMARY CARDS */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#e5d8bc] bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ead5]">
              <Target className="h-5 w-5 text-[#9a7133]" />
            </div>

            <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#9a7133]">
              Main Priority
            </p>

            <h4 className="mt-1 text-lg font-black text-[#211b15]">
              {priorityLabel}
            </h4>

            <p className="mt-2 text-xs leading-5 text-[#786b5c]">
              Used while adjusting category weights.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5d8bc] bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ead5]">
              <Users className="h-5 w-5 text-[#9a7133]" />
            </div>

            <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#9a7133]">
              Guest Count
            </p>

            <h4 className="mt-1 text-lg font-black text-[#211b15]">
              {guestCount} Guests
            </h4>

            <p className="mt-2 text-xs leading-5 text-[#786b5c]">
              Approx. {formatINR(availablePerGuest)} total
              budget available per guest.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5d8bc] bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ead5]">
              <ArrowRight className="h-5 w-5 text-[#9a7133]" />
            </div>

            <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#9a7133]">
              Largest Allocation
            </p>

            <h4 className="mt-1 text-lg font-black text-[#211b15]">
              {topCategory
                ? CATEGORY_LABELS[topCategory[0]]
                : '—'}
            </h4>

            <p className="mt-2 text-xs leading-5 text-[#786b5c]">
              {topCategory
                ? `${Math.round(
                    (topCategory[1] / totalBudget) * 100
                  )}% of the current budget plan.`
                : 'No allocation data available.'}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5d8bc] bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ead5]">
              <ShieldCheck className="h-5 w-5 text-[#9a7133]" />
            </div>

            <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#9a7133]">
              Safety Buffer
            </p>

            <h4 className="mt-1 text-lg font-black text-[#211b15]">
              {bufferPercent}%
            </h4>

            <p className="mt-2 text-xs leading-5 text-[#786b5c]">
              Reserved for unexpected or last-minute expenses.
            </p>
          </div>
        </div>

        {/* EXPLANATION */}

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#e2d2b2] bg-[#fffdf8] p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#9b7337]">
              01 — Event Type
            </p>

            <h4 className="mt-2 text-base font-black text-[#2a2118]">
              {event.eventType} planning pattern
            </h4>

            <p className="mt-2 text-sm leading-6 text-[#706354]">
              Different events need different spending patterns.
              EventBudget starts with a predefined allocation
              pattern designed for the selected event type before
              applying guest and priority adjustments.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2d2b2] bg-[#fffdf8] p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#9b7337]">
              02 — Guest Adjustment
            </p>

            <h4 className="mt-2 text-base font-black text-[#2a2118]">
              Guest count changes the plan
            </h4>

            <p className="mt-2 text-sm leading-6 text-[#706354]">
              {guestExplanation}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2d2b2] bg-[#fffdf8] p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#9b7337]">
              03 — Priority Adjustment
            </p>

            <h4 className="mt-2 text-base font-black text-[#2a2118]">
              Your preference affects allocation
            </h4>

            <p className="mt-2 text-sm leading-6 text-[#706354]">
              {priorityExplanation}
            </p>
          </div>
        </div>

        {/* ALLOCATION BREAKDOWN */}

        <div className="mt-6 rounded-[24px] border border-[#dbc79f] bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b7337]">
                Current Allocation
              </p>

              <h4 className="mt-1 text-xl font-black text-[#211b15]">
                How the budget is divided
              </h4>
            </div>

            <p className="text-xs text-[#8c7d68]">
              Based on the current event settings
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AllocationRow
              label="Food"
              percent={foodPercent}
              amount={event.allocations.food || 0}
            />

            <AllocationRow
              label="Venue"
              percent={venuePercent}
              amount={event.allocations.venue || 0}
            />

            <AllocationRow
              label="Decoration"
              percent={decorPercent}
              amount={event.allocations.decoration || 0}
            />

            <AllocationRow
              label="DJ / Music"
              percent={djPercent}
              amount={event.allocations.dj || 0}
            />

            <AllocationRow
              label="Photography"
              percent={photoPercent}
              amount={event.allocations.photography || 0}
            />

            <AllocationRow
              label="Safety Buffer"
              percent={bufferPercent}
              amount={event.allocations.buffer || 0}
            />
          </div>
        </div>

        {/* RULE BASED NOTE */}

        <div className="mt-5 rounded-2xl border border-[#d9c69d] bg-[#211e18] px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#d8b56c]">
            Constraint-Based Planning Engine
          </p>

          <p className="mt-2 text-sm font-semibold leading-6 text-[#f7f0e4]">
            EventBudget does not randomly generate these numbers.
            It applies predefined event-type allocation rules,
            adjusts them for guest count and user priority, then
            normalizes the plan to fit the total available budget.
          </p>
        </div>

        {event.isCustomAllocation && (
          <div className="mt-4 rounded-2xl border border-[#d9c69d] bg-[#f5eddd] px-5 py-4">
            <p className="text-sm font-extrabold text-[#3b3023]">
              Custom allocation active
            </p>

            <p className="mt-1 text-xs leading-5 text-[#756652]">
              You manually changed the recommended category
              allocations. The percentages shown above now reflect
              your customized plan rather than only the original
              automatic recommendation.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

interface AllocationRowProps {
  label: string;
  percent: number;
  amount: number;
}

const AllocationRow: React.FC<AllocationRowProps> = ({
  label,
  percent,
  amount,
}) => {
  return (
    <div className="rounded-2xl border border-[#eadfc9] bg-[#fdfaf4] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold text-[#30261c]">
          {label}
        </p>

        <span className="rounded-full bg-[#eee0c4] px-2.5 py-1 text-xs font-black text-[#805e2d]">
          {percent}%
        </span>
      </div>

      <p className="mt-2 font-mono-num text-lg font-black text-[#6e4e27]">
        {formatINR(amount)}
      </p>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eee8dc]">
        <div
          className="h-full rounded-full bg-[#b98b46]"
          style={{
            width: `${Math.min(
              100,
              Math.max(0, percent)
            )}%`,
          }}
        />
      </div>
    </div>
  );
};

export default PlanExplanation;
