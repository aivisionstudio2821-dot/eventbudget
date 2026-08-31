import { EventType } from '../types';

interface FeasibilityInput {
  eventType: EventType;
  budget: number;
  guestCount: number;
}

export interface FeasibilityResult {
  feasible: boolean;
  estimatedMinimumBudget: number;
  minimumPerGuest: number;
  fixedEssentialCost: number;
  budgetGap: number;
  maximumRecommendedGuests: number;
  costPerGuestAvailable: number;
  message: string;
}

/**
 * Conservative prototype feasibility rules.
 *
 * These values are NOT guaranteed vendor quotations.
 * They are minimum planning estimates used to stop
 * obviously unrealistic event plans.
 *
 * Formula:
 * estimated minimum =
 * fixed essential cost + (minimum per guest × guests)
 */
const EVENT_MINIMUMS: Record<
  EventType,
  {
    perGuest: number;
    fixed: number;
  }
> = {
  Birthday: {
    perGuest: 245,
    fixed: 9000,
  },

  Wedding: {
    perGuest: 350,
    fixed: 30000,
  },

  Engagement: {
    perGuest: 300,
    fixed: 18000,
  },

  Anniversary: {
    perGuest: 275,
    fixed: 12000,
  },

  Garba: {
    perGuest: 220,
    fixed: 18000,
  },

  'School / College Event': {
    perGuest: 200,
    fixed: 12000,
  },

  'Corporate Event': {
    perGuest: 300,
    fixed: 18000,
  },

  'House Party': {
    perGuest: 200,
    fixed: 5000,
  },

  'Baby Shower': {
    perGuest: 250,
    fixed: 10000,
  },

  Other: {
    perGuest: 250,
    fixed: 10000,
  },
};

export function checkEventFeasibility({
  eventType,
  budget,
  guestCount,
}: FeasibilityInput): FeasibilityResult {
  const safeBudget = Math.max(
    0,
    Number.isFinite(budget) ? budget : 0
  );

  const safeGuests = Math.max(
    1,
    Number.isFinite(guestCount)
      ? Math.floor(guestCount)
      : 1
  );

  const rule =
    EVENT_MINIMUMS[eventType] ??
    EVENT_MINIMUMS.Other;

  const estimatedMinimumBudget =
    rule.fixed +
    rule.perGuest * safeGuests;

  const rawBudgetGap =
    estimatedMinimumBudget - safeBudget;

  const budgetGap =
    Math.max(0, rawBudgetGap);

  const usableForGuests =
    Math.max(
      0,
      safeBudget - rule.fixed
    );

  const maximumRecommendedGuests =
    Math.max(
      0,
      Math.floor(
        usableForGuests /
          rule.perGuest
      )
    );

  const costPerGuestAvailable =
    safeGuests > 0
      ? Math.round(
          safeBudget / safeGuests
        )
      : 0;

  const feasible =
    safeBudget >=
    estimatedMinimumBudget;

  let message: string;

  if (feasible) {
    message =
      `This budget appears workable for ` +
      `${safeGuests.toLocaleString('en-IN')} guests ` +
      `using an essentials-first ${eventType} plan.`;
  } else {
    const minimumText =
      estimatedMinimumBudget.toLocaleString(
        'en-IN'
      );

    const gapText =
      budgetGap.toLocaleString(
        'en-IN'
      );

    if (
      maximumRecommendedGuests > 0
    ) {
      message =
        `This combination is not realistically feasible ` +
        `under the current prototype estimates. ` +
        `Estimated minimum budget: ₹${minimumText}. ` +
        `You are short by approximately ₹${gapText}. ` +
        `At ₹${safeBudget.toLocaleString('en-IN')}, ` +
        `try around ${maximumRecommendedGuests.toLocaleString('en-IN')} ` +
        `guests or increase the budget.`;
    } else {
      message =
        `This combination is not realistically feasible ` +
        `under the current prototype estimates. ` +
        `Estimated minimum budget: ₹${minimumText}. ` +
        `You are short by approximately ₹${gapText}. ` +
        `Increase the event budget before creating this plan.`;
    }
  }

  return {
    feasible,
    estimatedMinimumBudget,
    minimumPerGuest:
      rule.perGuest,
    fixedEssentialCost:
      rule.fixed,
    budgetGap,
    maximumRecommendedGuests,
    costPerGuestAvailable,
    message,
  };
        }
