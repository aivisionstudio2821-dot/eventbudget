import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  GitCompareArrows,
  Sparkles,
  UtensilsCrossed,
  Building2,
  Palette,
  Music2,
  Camera,
  ShieldCheck,
} from 'lucide-react';

import {
  EventState,
  Priority,
  CategoryAllocations,
} from '../../types';

import { formatINR } from '../../utils/currencyFormatter';
import { calculateSmartAllocations } from '../../utils/budgetCalculations';

interface PlanComparisonProps {
  event: EventState;
  onApplyPlan: (
    priority: Priority,
    allocations: CategoryAllocations
  ) => void;
}

interface CategoryRow {
  key: keyof CategoryAllocations;
  label: string;
  icon: React.ReactNode;
}

const categories: CategoryRow[] = [
  {
    key: 'food',
    label: 'Food',
    icon: <UtensilsCrossed className="h-4 w-4" />,
  },
  {
    key: 'venue',
    label: 'Venue',
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    key: 'decoration',
    label: 'Decoration',
    icon: <Palette className="h-4 w-4" />,
  },
  {
    key: 'dj',
    label: 'DJ / Music',
    icon: <Music2 className="h-4 w-4" />,
  },
  {
    key: 'photography',
    label: 'Photography',
    icon: <Camera className="h-4 w-4" />,
  },
  {
    key: 'buffer',
    label: 'Buffer',
    icon: <ShieldCheck className="h-4 w-4" />,
  },
];

const priorityOptions: {
  value: Priority;
  label: string;
}[] = [
  {
    value: 'Food',
    label: 'Food First',
  },
  {
    value: 'Venue',
    label: 'Venue First',
  },
  {
    value: 'Decoration',
    label: 'Decoration First',
  },
  {
    value: 'DJ / Music',
    label: 'Entertainment First',
  },
  {
    value: 'Photography',
    label: 'Photography First',
  },
  {
    value: 'Balanced',
    label: 'Balanced',
  },
];

export const PlanComparison: React.FC<
  PlanComparisonProps
> = ({
  event,
  onApplyPlan,
}) => {
  const [planAPriority, setPlanAPriority] =
    useState<Priority>('Food');

  const [planBPriority, setPlanBPriority] =
    useState<Priority>('Decoration');

  const [appliedPlan, setAppliedPlan] = useState<
    'A' | 'B' | null
  >(null);

  const planA = useMemo(() => {
    return calculateSmartAllocations(
      event.eventType,
      event.totalBudget,
      event.guestCount,
      planAPriority
    );
  }, [
    event.eventType,
    event.totalBudget,
    event.guestCount,
    planAPriority,
  ]);

  const planB = useMemo(() => {
    return calculateSmartAllocations(
      event.eventType,
      event.totalBudget,
      event.guestCount,
      planBPriority
    );
  }, [
    event.eventType,
    event.totalBudget,
    event.guestCount,
    planBPriority,
  ]);

  const handleApplyA = () => {
    onApplyPlan(planAPriority, planA);
    setAppliedPlan('A');

    window.setTimeout(() => {
      setAppliedPlan(null);
    }, 2500);
  };

  const handleApplyB = () => {
    onApplyPlan(planBPriority, planB);
    setAppliedPlan('B');

    window.setTimeout(() => {
      setAppliedPlan(null);
    }, 2500);
  };

  const getPercentage = (amount: number) => {
    if (!event.totalBudget) return 0;

    return Math.round(
      (amount / event.totalBudget) * 100
    );
  };

  return (
    <section className="overflow-hidden rounded-[30px] border border-[#d9c8a9] bg-[#fffaf1] shadow-[0_18px_50px_rgba(64,47,28,0.08)]">
      {/* HEADER */}

      <div className="relative overflow-hidden bg-gradient-to-r from-[#201910] via-[#30261a] to-[#17120d] p-5 sm:p-6">
        <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#d3aa65]/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#d8b875]/25 bg-[#d8b875]/10">
              <GitCompareArrows className="h-5 w-5 text-[#e5c787]" />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c8a466]">
                Plan Comparison
              </p>

              <h3 className="mt-1 text-xl font-black text-[#fff8ec]">
                Same budget. Different priorities.
              </h3>

              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#c4b49c]">
                Compare how EventBudget changes the
                category allocation when your event
                priority changes.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[9px] font-black uppercase tracking-wider text-[#a99a84]">
              Comparison Budget
            </p>

            <p className="mt-1 font-mono-num text-lg font-black text-[#f0d59e]">
              {formatINR(event.totalBudget)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* DESCRIPTION */}

        <div className="mb-5 rounded-2xl border border-[#e0d3bd] bg-[#f8f1e5] p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#a77b3d]" />

            <p className="text-[11px] leading-relaxed text-[#776a57]">
              Both plans use the same{' '}
              <strong className="text-[#4c3a25]">
                {event.eventType}
              </strong>
              ,{' '}
              <strong className="text-[#4c3a25]">
                {event.guestCount} guests
              </strong>{' '}
              and{' '}
              <strong className="text-[#4c3a25]">
                {formatINR(event.totalBudget)}
              </strong>{' '}
              budget. Only the planning priority changes.
            </p>
          </div>
        </div>

        {/* PLAN SELECTORS */}

        <div className="grid gap-4 lg:grid-cols-2">
          {/* PLAN A */}

          <div className="rounded-[24px] border border-[#d8c5a4] bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9c7946]">
                  Plan A
                </p>

                <h4 className="mt-1 text-lg font-black text-[#30251a]">
                  {priorityOptions.find(
                    (option) =>
                      option.value === planAPriority
                  )?.label || planAPriority}
                </h4>
              </div>

              <select
                value={planAPriority}
                onChange={(e) =>
                  setPlanAPriority(
                    e.target.value as Priority
                  )
                }
                className="rounded-xl border border-[#d8c9af] bg-[#fffaf1] px-3 py-2.5 text-xs font-bold text-[#5e4b34] outline-none transition focus:border-[#aa8147]"
              >
                {priorityOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 space-y-3">
              {categories.map((category) => {
                const amount =
                  planA[category.key] || 0;

                const percentage =
                  getPercentage(amount);

                const otherAmount =
                  planB[category.key] || 0;

                const difference =
                  amount - otherAmount;

                return (
                  <div
                    key={category.key}
                    className="rounded-xl border border-[#eee4d4] bg-[#fffdf8] p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[#9b7440]">
                          {category.icon}
                        </span>

                        <span className="text-[11px] font-bold text-[#655744]">
                          {category.label}
                        </span>
                      </div>

                      <div className="text-right">
                        <p className="font-mono-num text-sm font-black text-[#35291d]">
                          {formatINR(amount)}
                        </p>

                        <p className="text-[9px] font-bold text-[#a1937d]">
                          {percentage}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eee5d7]">
                      <div
                        className="h-full rounded-full bg-[#a67b42]"
                        style={{
                          width: `${Math.min(
                            100,
                            percentage
                          )}%`,
                        }}
                      />
                    </div>

                    {difference !== 0 && (
                      <p
                        className={`mt-2 text-[9px] font-bold ${
                          difference > 0
                            ? 'text-[#667849]'
                            : 'text-[#a05b51]'
                        }`}
                      >
                        {difference > 0 ? '+' : ''}
                        {formatINR(difference)} vs Plan B
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleApplyA}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2a2118] px-5 py-3.5 text-xs font-black text-[#fff6e8] shadow-[0_10px_25px_rgba(42,33,24,0.15)] transition hover:-translate-y-0.5 hover:bg-[#3a2d20]"
            >
              {appliedPlan === 'A' ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#d8c48d]" />
                  Plan A Applied
                </>
              ) : (
                <>
                  Apply Plan A
                  <ArrowRight className="h-4 w-4 text-[#dfc487]" />
                </>
              )}
            </button>
          </div>

          {/* PLAN B */}

          <div className="rounded-[24px] border border-[#c8cfb4] bg-[#fafaf1] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#78815d]">
                  Plan B
                </p>

                <h4 className="mt-1 text-lg font-black text-[#303524]">
                  {priorityOptions.find(
                    (option) =>
                      option.value === planBPriority
                  )?.label || planBPriority}
                </h4>
              </div>

              <select
                value={planBPriority}
                onChange={(e) =>
                  setPlanBPriority(
                    e.target.value as Priority
                  )
                }
                className="rounded-xl border border-[#cfd5bd] bg-white px-3 py-2.5 text-xs font-bold text-[#596047] outline-none transition focus:border-[#879462]"
              >
                {priorityOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 space-y-3">
              {categories.map((category) => {
                const amount =
                  planB[category.key] || 0;

                const percentage =
                  getPercentage(amount);

                const otherAmount =
                  planA[category.key] || 0;

                const difference =
                  amount - otherAmount;

                return (
                  <div
                    key={category.key}
                    className="rounded-xl border border-[#e4e7d8] bg-white p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[#758153]">
                          {category.icon}
                        </span>

                        <span className="text-[11px] font-bold text-[#626752]">
                          {category.label}
                        </span>
                      </div>

                      <div className="text-right">
                        <p className="font-mono-num text-sm font-black text-[#303524]">
                          {formatINR(amount)}
                        </p>

                        <p className="text-[9px] font-bold text-[#959b83]">
                          {percentage}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e9ebdf]">
                      <div
                        className="h-full rounded-full bg-[#7b865b]"
                        style={{
                          width: `${Math.min(
                            100,
                            percentage
                          )}%`,
                        }}
                      />
                    </div>

                    {difference !== 0 && (
                      <p
                        className={`mt-2 text-[9px] font-bold ${
                          difference > 0
                            ? 'text-[#667849]'
                            : 'text-[#a05b51]'
                        }`}
                      >
                        {difference > 0 ? '+' : ''}
                        {formatINR(difference)} vs Plan A
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleApplyB}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#748052] bg-[#687548] px-5 py-3.5 text-xs font-black text-white shadow-[0_10px_25px_rgba(80,94,55,0.14)] transition hover:-translate-y-0.5 hover:bg-[#59663c]"
            >
              {appliedPlan === 'B' ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Plan B Applied
                </>
              ) : (
                <>
                  Apply Plan B
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* FOOTER */}

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#ded1bb] bg-[#f7efe2] p-4">
          <GitCompareArrows className="mt-0.5 h-4 w-4 shrink-0 text-[#9b7541]" />

          <p className="text-[10px] leading-relaxed text-[#83745f]">
            This comparison uses EventBudget&apos;s
            constraint-based allocation rules. It does
            not change your selected vendors, food
            package or other event items until you apply
            a plan. Applying a plan changes the planning
            priority and category allocations.
          </p>
        </div>
      </div>
    </section>
  );
};
