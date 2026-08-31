import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  LifeBuoy,
  TrendingDown,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

import { EventState } from '../../types';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateTotalPlanned } from '../../utils/budgetCalculations';

interface BudgetRescueProps {
  event: EventState;
  onFixBudget: () => void;
}

interface RescueSnapshot {
  before: number;
  after: number;
  rescued: number;
}

export const BudgetRescue: React.FC<BudgetRescueProps> = ({
  event,
  onFixBudget,
}) => {
  const [snapshot, setSnapshot] =
    useState<RescueSnapshot | null>(null);

  const [waitingForFix, setWaitingForFix] =
    useState(false);

  const beforeRef = useRef<number | null>(null);

  const plannedSpend = calculateTotalPlanned(event);

  const buffer = event.allocations.buffer || 0;

  const totalCommitted = plannedSpend + buffer;

  const overBudgetBy = Math.max(
    0,
    totalCommitted - event.totalBudget
  );

  const isOverBudget = overBudgetBy > 0;

  useEffect(() => {
    if (!waitingForFix || beforeRef.current === null) {
      return;
    }

    const before = beforeRef.current;
    const after = totalCommitted;

    /*
      Wait until the parent event has actually changed.
      This prevents us from showing the old value as
      both "Before" and "After".
    */
    if (after === before) {
      return;
    }

    const rescued = Math.max(0, before - after);

    setSnapshot({
      before,
      after,
      rescued,
    });

    setWaitingForFix(false);
    beforeRef.current = null;
  }, [totalCommitted, waitingForFix]);

  const handleRescue = () => {
    beforeRef.current = totalCommitted;

    setSnapshot(null);
    setWaitingForFix(true);

    onFixBudget();
  };

  const handleResetResult = () => {
    setSnapshot(null);
  };

  /*
    If the event becomes over-budget again after a
    previous rescue, the old result should not look
    like the current state.
  */
  useEffect(() => {
    if (
      snapshot &&
      totalCommitted !== snapshot.after &&
      isOverBudget
    ) {
      setSnapshot(null);
    }
  }, [
    totalCommitted,
    isOverBudget,
    snapshot,
  ]);

  if (!isOverBudget && !snapshot) {
    return (
      <section className="overflow-hidden rounded-[26px] border border-[#cbd2b8] bg-[#f8f8ed] shadow-[0_12px_35px_rgba(64,47,28,0.06)]">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7ead8]">
              <CheckCircle2 className="h-5 w-5 text-[#667548]" />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#78815f]">
                Budget Rescue
              </p>

              <h3 className="mt-1 text-lg font-black text-[#30291f]">
                Your current plan is within budget.
              </h3>

              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#827765]">
                If your selections push the event over
                budget, EventBudget can rebalance the
                plan and show the impact here.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#d7dcc8] bg-white/70 px-4 py-3 text-right">
            <p className="text-[9px] font-black uppercase tracking-wider text-[#918975]">
              Current Commitment
            </p>

            <p className="mt-1 font-mono-num text-lg font-black text-[#5f6d43]">
              {formatINR(totalCommitted)}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (snapshot) {
    const finalOverBudget = Math.max(
      0,
      snapshot.after - event.totalBudget
    );

    const successful = finalOverBudget <= 0;

    return (
      <section className="relative overflow-hidden rounded-[28px] border border-[#d4c29f] bg-[#fffaf1] shadow-[0_16px_45px_rgba(64,47,28,0.09)]">
        <div className="border-b border-[#dfd1b8] bg-gradient-to-r from-[#211a12] via-[#30271c] to-[#1a150f] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d7b571]/25 bg-[#d7b571]/10">
                <LifeBuoy className="h-5 w-5 text-[#e4c789]" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c9a86c]">
                  Budget Rescue Result
                </p>

                <h3 className="mt-1 text-lg font-black text-[#fff8ec]">
                  {successful
                    ? 'Plan brought back within budget.'
                    : 'Budget pressure reduced.'}
                </h3>

                <p className="mt-1 text-xs text-[#c5b69e]">
                  See the impact of EventBudget&apos;s
                  rebalancing.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetResult}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold text-[#d7c9b3] transition hover:bg-white/10"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Hide Result
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div className="rounded-2xl border border-[#e1c5c0] bg-[#fff3f1] p-4">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#9b6b64]">
                Before
              </p>

              <p className="mt-1 font-mono-num text-2xl font-black text-[#a24e46]">
                {formatINR(snapshot.before)}
              </p>

              <p className="mt-1 text-[10px] font-semibold text-[#a47b75]">
                Over budget plan
              </p>
            </div>

            <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#eee2cd] sm:flex">
              <ArrowRight className="h-4 w-4 text-[#8e6b37]" />
            </div>

            <div
              className={`rounded-2xl border p-4 ${
                successful
                  ? 'border-[#ccd4b8] bg-[#f7f8ed]'
                  : 'border-[#e1d1b8] bg-[#fff9ed]'
              }`}
            >
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#7b765e]">
                After
              </p>

              <p
                className={`mt-1 font-mono-num text-2xl font-black ${
                  successful
                    ? 'text-[#627246]'
                    : 'text-[#856126]'
                }`}
              >
                {formatINR(snapshot.after)}
              </p>

              <p className="mt-1 text-[10px] font-semibold text-[#8e856f]">
                {successful
                  ? 'Within total budget'
                  : `${formatINR(
                      finalOverBudget
                    )} still above budget`}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[#dcc9a6] bg-[#f3e7d3] p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-[#87632f]" />

                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#87632f]">
                    Budget Pressure Reduced
                  </p>
                </div>

                <p className="mt-2 font-mono-num text-2xl font-black text-[#4c3922]">
                  {formatINR(snapshot.rescued)}
                </p>
              </div>

              <div className="max-w-md rounded-xl border border-[#d9c39c] bg-[#fff9ef]/70 px-4 py-3">
                <p className="text-[11px] leading-relaxed text-[#77664e]">
                  EventBudget adjusted flexible parts
                  of the plan while respecting the
                  available event budget and existing
                  planning rules.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-3 text-[10px] leading-relaxed text-[#998b77]">
            Planning result only. Actual vendor prices
            and confirmed quotations may change the
            final event cost.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[#d7a29a] bg-[#fff5f2] shadow-[0_16px_45px_rgba(93,48,40,0.08)]">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f2d9d5]">
              <AlertTriangle className="h-5 w-5 text-[#a64e46]" />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#a45c53]">
                Budget Rescue
              </p>

              <h3 className="mt-1 text-xl font-black text-[#38251f]">
                Your plan needs a rescue.
              </h3>

              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8c6f68]">
                Your selected plan plus safety buffer is
                currently above the event budget.
                EventBudget can try to rebalance flexible
                spending.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#dfb9b3] bg-white/60 px-3 py-1.5 text-[10px] font-bold text-[#8d554e]">
                  Budget {formatINR(event.totalBudget)}
                </span>

                <span className="rounded-full border border-[#dfb9b3] bg-white/60 px-3 py-1.5 text-[10px] font-bold text-[#8d554e]">
                  Plan {formatINR(totalCommitted)}
                </span>

                <span className="rounded-full border border-[#d99e96] bg-[#f8dfdb] px-3 py-1.5 text-[10px] font-black text-[#a1443c]">
                  +{formatINR(overBudgetBy)} over
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRescue}
            disabled={waitingForFix}
            className="flex min-w-[190px] items-center justify-center gap-2 rounded-2xl bg-[#2a2118] px-5 py-3.5 text-xs font-black text-[#fff7e9] shadow-[0_10px_25px_rgba(42,33,24,0.18)] transition hover:-translate-y-0.5 hover:bg-[#3a2d20] disabled:cursor-wait disabled:opacity-60"
          >
            <LifeBuoy className="h-4 w-4 text-[#e1c181]" />

            {waitingForFix
              ? 'Rebalancing...'
              : 'Rescue My Budget'}
          </button>
        </div>
      </div>
    </section>
  );
};
