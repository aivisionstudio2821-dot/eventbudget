import { EventState, HealthScoreBreakdown } from '../types';
import { calculateCategoryTotals, calculateTotalPlanned } from './budgetCalculations';

export function calculateEventHealthScore(state: EventState): HealthScoreBreakdown {
  const totalBudget = state.totalBudget || 0;
  const guestCount = Math.max(1, state.guestCount || 1);
  const plannedSpend = calculateTotalPlanned(state);
  const totals = calculateCategoryTotals(state);
  const bufferAllocated = state.allocations.buffer || 0;
  const totalCommitment = plannedSpend + bufferAllocated;

  const explanations: string[] = [];
  const recommendations: string[] = [];

  if (totalBudget <= 0) {
    return {
      overallScore: 0,
      status: 'High Risk',
      statusColor: '#ef4444',
      budgetControl: 0,
      emergencyBuffer: 0,
      foodPlanning: 0,
      priorityProtection: 0,
      flexibility: 0,
      explanations: ['Event total budget has not been set.'],
      recommendations: ['Enter a valid total event budget to calculate health score.'],
    };
  }

  // 1. Budget Control (Weight 30%)
  let budgetControl = 100;
  const budgetDiff = totalBudget - plannedSpend;
  if (budgetDiff < 0) {
    // Over budget penalty
    const overPercent = (Math.abs(budgetDiff) / totalBudget) * 100;
    budgetControl = Math.max(10, 100 - overPercent * 4);
    explanations.push(`Over budget by ₹${Math.abs(budgetDiff).toLocaleString('en-IN')}. Immediate rebalancing needed.`);
    recommendations.push(`Use the "⚡ Fix My Budget" feature or reduce non-essential add-ons to restore balance.`);
  } else if (budgetDiff === 0) {
    budgetControl = 98;
    explanations.push(`Budget is 100% maximized with zero unallocated waste.`);
  } else {
    budgetControl = 95;
    explanations.push(`Within total budget with ₹${budgetDiff.toLocaleString('en-IN')} remaining cushion.`);
  }

  // 2. Emergency Buffer (Weight 20%)
  let emergencyBuffer = 85;
  const bufferRatio = (bufferAllocated / totalBudget) * 100;
  if (bufferRatio >= 8 && bufferRatio <= 15) {
    emergencyBuffer = 98;
    explanations.push(`Ideal safety buffer of ${bufferRatio.toFixed(1)}% (₹${bufferAllocated.toLocaleString('en-IN')}) is secured.`);
  } else if (bufferRatio >= 5) {
    emergencyBuffer = 85;
    explanations.push(`Acceptable emergency buffer of ${bufferRatio.toFixed(1)}% allocated.`);
  } else if (bufferRatio > 0) {
    emergencyBuffer = 65;
    explanations.push(`Low buffer allocation (${bufferRatio.toFixed(1)}%). Small unexpected expenses could push you over.`);
    recommendations.push(`Increase Emergency Buffer to at least 8% of total budget.`);
  } else {
    emergencyBuffer = 30;
    explanations.push(`No emergency buffer allocated! Any on-day mishap will cause deficit.`);
    recommendations.push(`Allocate at least ₹${Math.round(totalBudget * 0.08).toLocaleString('en-IN')} to Emergency Buffer.`);
  }

  // 3. Food Planning (Weight 20%)
  let foodPlanning = 85;
  const foodTotal = totals.food;
  const foodPerGuest = foodTotal / guestCount;
  const foodAllocated = state.allocations.food || 0;

  if (foodTotal > foodAllocated && foodAllocated > 0) {
    const foodOver = foodTotal - foodAllocated;
    foodPlanning = Math.max(40, 85 - (foodOver / foodAllocated) * 60);
    explanations.push(`Food selections exceed food allocation by ₹${foodOver.toLocaleString('en-IN')}.`);
    recommendations.push(`Check the Food alternatives suggestions to optimize menu cost.`);
  } else if (foodPerGuest < 120 && guestCount > 20) {
    foodPlanning = 60;
    explanations.push(`Food cost per guest (₹${Math.round(foodPerGuest)}/person) is quite low for standard catering.`);
    recommendations.push(`Ensure selected menu adequately satisfies guest meal expectations.`);
  } else {
    foodPlanning = 92;
    explanations.push(`Food catering cost of ₹${Math.round(foodPerGuest)}/guest aligns well with Gujarat market standards.`);
  }

  // 4. Priority Protection (Weight 15%)
  let priorityProtection = 90;
  const priorityKeyMap: Record<string, string> = {
    'Food': 'food',
    'Venue': 'venue',
    'Decoration': 'decoration',
    'DJ / Music': 'dj',
    'Photography': 'photography',
  };
  const pKey = priorityKeyMap[state.priority];
  if (pKey) {
    const allocatedP = (state.allocations as any)[pKey] || 0;
    const spentP = (totals as any)[pKey] || 0;
    if (allocatedP > 0 && spentP >= allocatedP * 0.7) {
      priorityProtection = 96;
      explanations.push(`Your top priority (${state.priority}) is strongly funded and prioritized.`);
    } else {
      priorityProtection = 80;
    }
  } else {
    priorityProtection = 88;
    explanations.push(`Balanced allocation structure maintained across all categories.`);
  }

  // 5. Flexibility & Vendor Quotes (Weight 15%)
  let flexibility = 75;
  const quotesCount = state.quotes?.length || 0;
  const appliedCount = Object.values(state.appliedQuoteIds || {}).filter(Boolean).length;
  
  if (appliedCount >= 2) {
    flexibility = 98;
    explanations.push(`${appliedCount} actual vendor quotations verified and applied to lock in real prices.`);
  } else if (quotesCount >= 1) {
    flexibility = 85;
    explanations.push(`Vendor quotes being compared. You are negotiating real rates.`);
    recommendations.push(`Apply verified vendor quotes to replace generic market estimates.`);
  } else {
    flexibility = 72;
    recommendations.push(`Connect with local Ahmedabad vendors via WhatsApp to get verified quotations.`);
  }

  // Calculate Weighted Overall Score
  const rawScore =
    budgetControl * 0.30 +
    emergencyBuffer * 0.20 +
    foodPlanning * 0.20 +
    priorityProtection * 0.15 +
    flexibility * 0.15;

  const overallScore = Math.min(100, Math.max(10, Math.round(rawScore)));

  let status: 'Healthy' | 'Tight' | 'High Risk';
  let statusColor: string;

  if (overallScore >= 80) {
    status = 'Healthy';
    statusColor = '#10b981'; // Green
  } else if (overallScore >= 60) {
    status = 'Tight';
    statusColor = '#f59e0b'; // Amber
  } else {
    status = 'High Risk';
    statusColor = '#ef4444'; // Red
  }

  return {
    overallScore,
    status,
    statusColor,
    budgetControl: Math.round(budgetControl),
    emergencyBuffer: Math.round(emergencyBuffer),
    foodPlanning: Math.round(foodPlanning),
    priorityProtection: Math.round(priorityProtection),
    flexibility: Math.round(flexibility),
    explanations,
    recommendations,
  };
}
