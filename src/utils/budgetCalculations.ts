import {
  EventType,
  Priority,
  CategoryKey,
  CategoryAllocations,
  EventState,
  FoodItem,
} from '../types';
import {
  FOOD_ITEMS,
  DECOR_ITEMS,
  ENTERTAINMENT_ITEMS,
  PHOTOGRAPHY_ITEMS,
  VENUE_TYPES,
  VENUE_ADDONS,
} from '../data/initialData';

/**
 * Calculates dynamic initial allocations based on event type, guest count, total budget, and priority.
 */
export function calculateSmartAllocations(
  eventType: EventType,
  totalBudget: number,
  guestCount: number,
  priority: Priority
): CategoryAllocations {
  if (totalBudget <= 0) {
    return {
      food: 0,
      venue: 0,
      decoration: 0,
      dj: 0,
      photography: 0,
      misc: 0,
      buffer: 0,
    };
  }

  // Base weights depending on EventType
  let weights: Record<CategoryKey, number>;

  switch (eventType) {
    case 'Birthday':
      weights = { food: 0.42, venue: 0.16, decoration: 0.14, dj: 0.08, photography: 0.06, misc: 0.04, buffer: 0.10 };
      break;
    case 'Wedding':
      weights = { food: 0.38, venue: 0.20, decoration: 0.16, dj: 0.06, photography: 0.10, misc: 0.04, buffer: 0.06 };
      break;
    case 'Engagement':
    case 'Anniversary':
      weights = { food: 0.40, venue: 0.18, decoration: 0.15, dj: 0.07, photography: 0.08, misc: 0.04, buffer: 0.08 };
      break;
    case 'Garba':
      weights = { food: 0.25, venue: 0.25, decoration: 0.15, dj: 0.20, photography: 0.05, misc: 0.03, buffer: 0.07 };
      break;
    case 'Corporate Event':
      weights = { food: 0.40, venue: 0.26, decoration: 0.10, dj: 0.08, photography: 0.06, misc: 0.04, buffer: 0.06 };
      break;
    case 'House Party':
      weights = { food: 0.50, venue: 0.02, decoration: 0.16, dj: 0.14, photography: 0.04, misc: 0.06, buffer: 0.08 };
      break;
    case 'Baby Shower':
      weights = { food: 0.38, venue: 0.18, decoration: 0.20, dj: 0.05, photography: 0.09, misc: 0.04, buffer: 0.06 };
      break;
    case 'School / College Event':
      weights = { food: 0.32, venue: 0.18, decoration: 0.12, dj: 0.22, photography: 0.06, misc: 0.04, buffer: 0.06 };
      break;
    default:
      weights = { food: 0.38, venue: 0.18, decoration: 0.14, dj: 0.10, photography: 0.08, misc: 0.04, buffer: 0.08 };
      break;
  }

  // Adjust for guest count pressure on food
  // High guest count puts higher ratio requirement on food
  if (guestCount > 100) {
    weights.food += 0.05;
    weights.misc -= 0.02;
    weights.buffer -= 0.03;
  } else if (guestCount < 30) {
    weights.food -= 0.03;
    weights.decoration += 0.03;
  }

  // Adjust for Priority
  switch (priority) {
    case 'Food':
      weights.food += 0.08;
      weights.venue -= 0.03;
      weights.photography -= 0.02;
      weights.dj -= 0.03;
      break;
    case 'Venue':
      weights.venue += 0.08;
      weights.food -= 0.04;
      weights.decoration -= 0.02;
      weights.dj -= 0.02;
      break;
    case 'Decoration':
      weights.decoration += 0.08;
      weights.food -= 0.03;
      weights.photography -= 0.02;
      weights.dj -= 0.03;
      break;
    case 'DJ / Music':
      weights.dj += 0.08;
      weights.food -= 0.03;
      weights.decoration -= 0.03;
      weights.venue -= 0.02;
      break;
    case 'Photography':
      weights.photography += 0.08;
      weights.food -= 0.03;
      weights.venue -= 0.03;
      weights.dj -= 0.02;
      break;
    case 'Balanced':
    default:
      // Keep naturally balanced
      break;
  }

  // Normalize weights so they sum to exactly 1.0
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const normalizedKeys: CategoryKey[] = ['food', 'venue', 'decoration', 'dj', 'photography', 'misc', 'buffer'];
  
  const rawAllocations: Record<CategoryKey, number> = {} as Record<CategoryKey, number>;
  let sumAllocated = 0;

  normalizedKeys.forEach((key, index) => {
    if (index === normalizedKeys.length - 1) {
      // Last category absorbs rounding difference
      rawAllocations[key] = Math.max(0, totalBudget - sumAllocated);
    } else {
      const share = (weights[key] / totalWeight) * totalBudget;
      // Round to neat 100s for cleaner figures
      const rounded = Math.round(share / 100) * 100;
      rawAllocations[key] = rounded;
      sumAllocated += rounded;
    }
  });

  return rawAllocations;
}

/**
 * Calculates current selected cost for food
 */
export function calculateFoodTotal(state: EventState): number {
  // If a vendor quote is applied, use quote amount
  const appliedQuoteId = state.appliedQuoteIds?.food;
  if (appliedQuoteId) {
    const quote = state.quotes.find(q => q.id === appliedQuoteId);
    if (quote) return quote.quotedAmount;
  }

  const guestCount = Math.max(1, state.guestCount || 1);
  let perPersonTotal = 0;

  Object.entries(state.selectedFoodItems || {}).forEach(([itemId, isSelected]) => {
    if (isSelected) {
      const customPrice = state.customFoodPrices?.[itemId];
      const item = FOOD_ITEMS.find(f => f.id === itemId);
      const price = customPrice !== undefined ? customPrice : (item?.defaultPrice || 0);
      perPersonTotal += price;
    }
  });

  return perPersonTotal * guestCount;
}

/**
 * Calculates current selected cost for decoration
 */
export function calculateDecorTotal(state: EventState): number {
  const appliedQuoteId = state.appliedQuoteIds?.decoration;
  if (appliedQuoteId) {
    const quote = state.quotes.find(q => q.id === appliedQuoteId);
    if (quote) return quote.quotedAmount;
  }

  let total = 0;
  Object.entries(state.selectedDecorItems || {}).forEach(([itemId, isSelected]) => {
    if (isSelected) {
      const customPrice = state.customDecorPrices?.[itemId];
      const item = DECOR_ITEMS.find(d => d.id === itemId);
      const price = customPrice !== undefined ? customPrice : (item?.defaultPrice || 0);
      total += price;
    }
  });
  return total;
}

/**
 * Calculates current selected cost for DJ & Entertainment
 */
export function calculateDJTotal(state: EventState): number {
  const appliedQuoteId = state.appliedQuoteIds?.dj;
  if (appliedQuoteId) {
    const quote = state.quotes.find(q => q.id === appliedQuoteId);
    if (quote) return quote.quotedAmount;
  }

  let total = 0;
  Object.entries(state.selectedEntertainment || {}).forEach(([itemId, isSelected]) => {
    if (isSelected) {
      const customPrice = state.customEntertainmentPrices?.[itemId];
      const item = ENTERTAINMENT_ITEMS.find(e => e.id === itemId);
      const price = customPrice !== undefined ? customPrice : (item?.defaultPrice || 0);
      total += price;
    }
  });
  return total;
}

/**
 * Calculates current selected cost for Photography
 */
export function calculatePhotoTotal(state: EventState): number {
  const appliedQuoteId = state.appliedQuoteIds?.photography;
  if (appliedQuoteId) {
    const quote = state.quotes.find(q => q.id === appliedQuoteId);
    if (quote) return quote.quotedAmount;
  }

  let total = 0;
  Object.entries(state.selectedPhotography || {}).forEach(([itemId, isSelected]) => {
    if (isSelected) {
      const customPrice = state.customPhotographyPrices?.[itemId];
      const item = PHOTOGRAPHY_ITEMS.find(p => p.id === itemId);
      const price = customPrice !== undefined ? customPrice : (item?.defaultPrice || 0);
      total += price;
    }
  });
  return total;
}

/**
 * Calculates current selected cost for Venue
 */
export function calculateVenueTotal(state: EventState): number {
  const appliedQuoteId = state.appliedQuoteIds?.venue;
  if (appliedQuoteId) {
    const quote = state.quotes.find(q => q.id === appliedQuoteId);
    if (quote) return quote.quotedAmount;
  }

  let basePrice = 0;
  if (state.selectedVenueId) {
    const venue = VENUE_TYPES.find(v => v.id === state.selectedVenueId);
    basePrice = state.customVenuePrice !== undefined ? state.customVenuePrice : (venue?.defaultPrice || 0);
  }

  let addonsTotal = 0;
  Object.entries(state.selectedVenueAddons || {}).forEach(([addonId, isSelected]) => {
    if (isSelected) {
      const customPrice = state.customVenueAddonPrices?.[addonId];
      const addon = VENUE_ADDONS.find(a => a.id === addonId);
      const price = customPrice !== undefined ? customPrice : (addon?.defaultPrice || 0);
      addonsTotal += price;
    }
  });

  return basePrice + addonsTotal;
}

/**
 * Calculates current selected cost for Miscellaneous
 */
export function calculateMiscTotal(state: EventState): number {
  const appliedQuoteId = state.appliedQuoteIds?.misc;
  if (appliedQuoteId) {
    const quote = state.quotes.find(q => q.id === appliedQuoteId);
    if (quote) return quote.quotedAmount;
  }

  return (state.miscItems || [])
    .filter(m => m.selected !== false)
    .reduce((sum, item) => sum + (item.price || 0), 0);
}

/**
 * Calculates total planned across all categories
 */
export function calculateCategoryTotals(state: EventState): Record<CategoryKey, number> {
  return {
    food: calculateFoodTotal(state),
    venue: calculateVenueTotal(state),
    decoration: calculateDecorTotal(state),
    dj: calculateDJTotal(state),
    photography: calculatePhotoTotal(state),
    misc: calculateMiscTotal(state),
    buffer: state.allocations.buffer || 0,
  };
}

export function calculateTotalPlanned(state: EventState): number {
  const totals = calculateCategoryTotals(state);
  return (
    totals.food +
    totals.venue +
    totals.decoration +
    totals.dj +
    totals.photography +
    totals.misc
  );
}

/**
 * Rebalance helper to automatically fix an over-budget event
 */
export function rebalanceEventAllocations(
  state: EventState,
  targetExcess?: number
): {
  newAllocations: CategoryAllocations;
  savedAmount: number;
  adjustments: { category: string; amount: number }[];
} {
  const totalBudget = state.totalBudget;
  const totals = calculateCategoryTotals(state);
  const plannedExBuffer = calculateTotalPlanned(state);
  const bufferAllocated = state.allocations.buffer || 0;
  
  // Total commitment vs budget
  const overspend = plannedExBuffer + bufferAllocated - totalBudget;
  const deficit = targetExcess !== undefined ? targetExcess : Math.max(0, overspend);

  const adjustments: { category: string; amount: number }[] = [];
  let remainingDeficit = deficit;

  const newAllocations = { ...state.allocations };

  if (remainingDeficit <= 0) {
    return { newAllocations, savedAmount: 0, adjustments };
  }

  // 1. Try to absorb deficit from unused buffers or categories with surplus
  const categoriesToTrim: { key: CategoryKey; name: string; priorityScore: number }[] = [
    { key: 'buffer', name: 'Emergency Buffer', priorityScore: 1 },
    { key: 'misc', name: 'Miscellaneous', priorityScore: 2 },
    { key: 'decoration', name: 'Decoration', priorityScore: 3 },
    { key: 'photography', name: 'Photography', priorityScore: 4 },
    { key: 'dj', name: 'DJ & Entertainment', priorityScore: 5 },
    { key: 'venue', name: 'Venue', priorityScore: 6 },
    { key: 'food', name: 'Food & Catering', priorityScore: 7 },
  ];

  // If user selected a priority, make that category highest priority (lowest chance to trim)
  categoriesToTrim.forEach(c => {
    if (
      (state.priority === 'Food' && c.key === 'food') ||
      (state.priority === 'Venue' && c.key === 'venue') ||
      (state.priority === 'Decoration' && c.key === 'decoration') ||
      (state.priority === 'DJ / Music' && c.key === 'dj') ||
      (state.priority === 'Photography' && c.key === 'photography')
    ) {
      c.priorityScore = 99; // Protected priority!
    }
  });

  // Sort by lowest priorityScore first (cut buffer and misc first)
  categoriesToTrim.sort((a, b) => a.priorityScore - b.priorityScore);

  categoriesToTrim.forEach(cat => {
    if (remainingDeficit <= 0) return;

    const currentAlloc = newAllocations[cat.key] || 0;
    const currentActual = cat.key === 'buffer' ? 0 : totals[cat.key];

    // How much can we safely trim from this category?
    // If allocated > actual, we can trim the excess immediately
    const excess = Math.max(0, currentAlloc - currentActual);
    if (excess > 0) {
      const cut = Math.min(remainingDeficit, excess);
      newAllocations[cat.key] = currentAlloc - cut;
      remainingDeficit -= cut;
      adjustments.push({ category: cat.name, amount: cut });
    }
  });

  // If still remaining deficit, trim non-priority categories down proportionally
  if (remainingDeficit > 0) {
    categoriesToTrim.forEach(cat => {
      if (remainingDeficit <= 0 || cat.priorityScore >= 90) return;
      const currentAlloc = newAllocations[cat.key] || 0;
      // Allow trimming up to 30% of current allocation
      const maxCut = Math.floor(currentAlloc * 0.3);
      if (maxCut > 0) {
        const cut = Math.min(remainingDeficit, maxCut);
        newAllocations[cat.key] = currentAlloc - cut;
        remainingDeficit -= cut;
        adjustments.push({ category: cat.name, amount: cut });
      }
    });
  }

  // Ensure sum matches totalBudget
  const totalNew = Object.values(newAllocations).reduce((a, b) => a + b, 0);
  if (totalNew !== totalBudget) {
    newAllocations.buffer = Math.max(0, (newAllocations.buffer || 0) + (totalBudget - totalNew));
  }

  return {
    newAllocations,
    savedAmount: deficit - remainingDeficit,
    adjustments,
  };
}

/**
 * Suggestions for cheaper alternatives if Food or any category is over budget
 */
export function getSmartAlternatives(state: EventState): {
  type: 'food' | 'decor' | 'entertainment' | 'venue';
  title: string;
  description: string;
  savings: number;
  action: () => void;
}[] {
  const suggestions: {
    type: 'food' | 'decor' | 'entertainment' | 'venue';
    title: string;
    description: string;
    savings: number;
    action: () => void;
  }[] = [];

  const guests = Math.max(1, state.guestCount || 1);

  // Food Alternatives
  if (state.selectedFoodItems?.starter_paneer_tikka && !state.selectedFoodItems?.starter_french_fries) {
    const paneerPrice = state.customFoodPrices?.starter_paneer_tikka ?? 100;
    const friesPrice = 50;
    const savePerPerson = paneerPrice - friesPrice;
    const totalSavings = savePerPerson * guests;
    suggestions.push({
      type: 'food',
      title: 'Replace Paneer Tikka with French Fries',
      description: `Save ₹${savePerPerson}/person (Total savings: ₹${totalSavings.toLocaleString('en-IN')}) with a crowd-favorite classic starter.`,
      savings: totalSavings,
      action: () => {}
    });
  }

  if (state.selectedFoodItems?.drink_mocktails) {
    const mocktailPrice = state.customFoodPrices?.drink_mocktails ?? 95;
    const softDrinkPrice = 40;
    const totalSavings = (mocktailPrice - softDrinkPrice) * guests;
    suggestions.push({
      type: 'food',
      title: 'Switch Signature Mocktails to Chilled Soft Drinks',
      description: `Save ₹${totalSavings.toLocaleString('en-IN')} by serving refreshing soft drinks instead of custom mocktails.`,
      savings: totalSavings,
      action: () => {}
    });
  }

  if (state.selectedFoodItems?.main_north_indian_buffet && !state.selectedFoodItems?.main_punjabi) {
    const buffetPrice = state.customFoodPrices?.main_north_indian_buffet ?? 350;
    const punjabiPrice = 250;
    const totalSavings = (buffetPrice - punjabiPrice) * guests;
    suggestions.push({
      type: 'food',
      title: 'Switch North Indian Buffet to Punjabi Meal Platter',
      description: `Save ₹${totalSavings.toLocaleString('en-IN')} without compromising on rich taste and satisfaction.`,
      savings: totalSavings,
      action: () => {}
    });
  }

  // Decor alternatives
  if (state.selectedDecorItems?.decor_floral) {
    suggestions.push({
      type: 'decor',
      title: 'Switch Floral Decor to Custom 3D Backdrop',
      description: 'Save ₹6,500 by using modern 3D theme backdrop styling instead of fresh imported florals.',
      savings: 6500,
      action: () => {}
    });
  }

  // DJ alternatives
  if (state.selectedEntertainment?.ent_dj_premium_sound && !state.selectedEntertainment?.ent_dj_std_sound) {
    suggestions.push({
      type: 'entertainment',
      title: 'Switch DJ Premium Line-Array to Standard Sound',
      description: 'Save ₹8,000 with a powerful 4-speaker setup perfectly suited for under 100 guests.',
      savings: 8000,
      action: () => {}
    });
  }

  return suggestions;
}
