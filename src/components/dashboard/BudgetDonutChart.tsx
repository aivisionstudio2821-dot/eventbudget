import React, { useState } from 'react';
import { CategoryKey, CategoryAllocations, EventState } from '../../types';
import { CATEGORIES_INFO } from '../../data/initialData';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateCategoryTotals } from '../../utils/budgetCalculations';

interface BudgetDonutChartProps {
  event: EventState;
}

export const BudgetDonutChart: React.FC<BudgetDonutChartProps> = ({ event }) => {
  const [viewMode, setViewMode] = useState<'allocated' | 'selected'>('allocated');
  const [hoveredKey, setHoveredKey] = useState<CategoryKey | null>(null);

  const totalBudget = event.totalBudget || 1;
  const allocations = event.allocations;
  const selectedTotals = calculateCategoryTotals(event);

  const dataSource: Record<CategoryKey, number> = viewMode === 'allocated' ? allocations : selectedTotals;
  const dataSum = Object.values(dataSource).reduce((a, b) => a + b, 0) || 1;

  // Calculate SVG arc paths for the donut
  let cumulativePercent = 0;

  const slices = CATEGORIES_INFO.map((cat) => {
    const value = dataSource[cat.key] || 0;
    const percent = value / dataSum;
    const startAngle = cumulativePercent * 360;
    const endAngle = (cumulativePercent + percent) * 360;
    cumulativePercent += percent;

    return {
      key: cat.key,
      name: cat.name,
      color: cat.color,
      value,
      percent: percent * 100,
      startAngle,
      endAngle,
    };
  });

  // SVG coordinate helpers
  const getCoordinatesForPercent = (percent: number, radius: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x * radius, y * radius];
  };

  const createArcPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
    if (endAngle - startAngle >= 359.9) {
      // Full circle handling
      endAngle = 359.99;
    }
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = Math.cos(startRad) * outerRadius;
    const y1 = Math.sin(startRad) * outerRadius;
    const x2 = Math.cos(endRad) * outerRadius;
    const y2 = Math.sin(endRad) * outerRadius;

    const x3 = Math.cos(endRad) * innerRadius;
    const y3 = Math.sin(endRad) * innerRadius;
    const x4 = Math.cos(startRad) * innerRadius;
    const y4 = Math.sin(startRad) * innerRadius;

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };

  const hoveredSlice = slices.find(s => s.key === hoveredKey);

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#0f172a]/90 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col justify-between">
      
      {/* Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-white font-heading">Budget Breakdown Chart</h3>
          <p className="text-xs text-slate-400">Interactive category distribution</p>
        </div>
        <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('allocated')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'allocated'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Allocated Budget
          </button>
          <button
            onClick={() => setViewMode('selected')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'selected'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Selected Spend
          </button>
        </div>
      </div>

      {/* Donut Chart & Legend Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
        
        {/* SVG Graphic */}
        <div className="md:col-span-6 flex justify-center relative">
          <div className="w-52 h-52 sm:w-60 sm:h-60 relative flex items-center justify-center">
            <svg viewBox="-110 -110 220 220" className="w-full h-full transform -rotate-90">
              {slices.map((slice) => {
                if (slice.value <= 0) return null;
                const isHovered = hoveredKey === slice.key;
                const outerR = isHovered ? 100 : 92;
                const innerR = isHovered ? 56 : 60;
                return (
                  <path
                    key={slice.key}
                    d={createArcPath(slice.startAngle, slice.endAngle, outerR, innerR)}
                    fill={slice.color}
                    className="cursor-pointer transition-all duration-200 hover:opacity-90"
                    onMouseEnter={() => setHoveredKey(slice.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
              {hoveredSlice ? (
                <>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate max-w-[120px]">
                    {hoveredSlice.name}
                  </span>
                  <span className="text-base sm:text-lg font-black text-white">
                    {formatINR(hoveredSlice.value)}
                  </span>
                  <span className="text-[10px] font-bold text-purple-300">
                    {hoveredSlice.percent.toFixed(1)}% of total
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                    {viewMode === 'allocated' ? 'Total Budget' : 'Total Planned'}
                  </span>
                  <span className="text-base sm:text-xl font-extrabold text-white">
                    {formatINR(dataSum)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatINR(Math.round(dataSum / (event.guestCount || 1)))} / guest
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Legend Pills */}
        <div className="md:col-span-6 space-y-2">
          {slices.map((slice) => (
            <div
              key={slice.key}
              onMouseEnter={() => setHoveredKey(slice.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                hoveredKey === slice.key
                  ? 'bg-slate-800 border-purple-500 shadow-md'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-3 h-3 rounded-md shrink-0 shadow-sm"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-slate-300 font-semibold truncate">{slice.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-white">{formatINR(slice.value)}</span>
                <span className="text-[10px] text-slate-400 font-mono w-10 text-right">
                  {slice.percent.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
