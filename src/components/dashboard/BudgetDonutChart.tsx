import React, { useState } from 'react';
import { CategoryKey, EventState } from '../../types';
import { CATEGORIES_INFO } from '../../data/initialData';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateCategoryTotals } from '../../utils/budgetCalculations';

interface BudgetDonutChartProps {
  event: EventState;
}

export const BudgetDonutChart: React.FC<BudgetDonutChartProps> = ({ event }) => {
  const [viewMode, setViewMode] = useState<'allocated' | 'selected'>('allocated');
  const [hoveredKey, setHoveredKey] = useState<CategoryKey | null>(null);

  const allocations = event.allocations;
  const selectedTotals = calculateCategoryTotals(event);

  const dataSource: Record<CategoryKey, number> =
    viewMode === 'allocated' ? allocations : selectedTotals;

  const dataSum =
    Object.values(dataSource).reduce((a, b) => a + b, 0) || 1;

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

  const createArcPath = (
    startAngle: number,
    endAngle: number,
    outerRadius: number,
    innerRadius: number
  ) => {
    if (endAngle - startAngle >= 359.9) {
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

    return `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
  };

  const hoveredSlice = slices.find(
    (slice) => slice.key === hoveredKey
  );

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[#d9c9ad] bg-gradient-to-br from-[#fffaf1] via-[#fbf3e5] to-[#f4e7d2] p-5 shadow-[0_18px_45px_rgba(74,52,27,0.08)] sm:p-7">

      {/* subtle luxury background glow */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#c89b53]/10 blur-3xl" />

      <div className="relative">

        {/* HEADER */}

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#a27b42]">
              Budget Overview
            </p>

            <h3 className="font-heading text-lg font-black text-[#241c13] sm:text-xl">
              Where Your Budget Goes
            </h3>

            <p className="mt-1 text-xs text-[#8c7b65]">
              Compare your planned allocation with what you have actually selected.
            </p>
          </div>

          {/* TOGGLE */}

          <div className="flex self-start rounded-xl border border-[#d8c6a7] bg-[#eee0ca]/65 p-1 sm:self-auto">

            <button
              type="button"
              onClick={() => setViewMode('allocated')}
              className={`rounded-lg px-3.5 py-2 text-[11px] font-extrabold transition-all ${
                viewMode === 'allocated'
                  ? 'bg-[#241c13] text-[#f4deb4] shadow-md'
                  : 'text-[#76654f] hover:bg-white/50 hover:text-[#30261b]'
              }`}
            >
              Planned Allocation
            </button>

            <button
              type="button"
              onClick={() => setViewMode('selected')}
              className={`rounded-lg px-3.5 py-2 text-[11px] font-extrabold transition-all ${
                viewMode === 'selected'
                  ? 'bg-[#241c13] text-[#f4deb4] shadow-md'
                  : 'text-[#76654f] hover:bg-white/50 hover:text-[#30261b]'
              }`}
            >
              Selected Spend
            </button>

          </div>
        </div>

        {/* CHART + LEGEND */}

        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">

          {/* DONUT */}

          <div className="relative flex justify-center md:col-span-6">

            <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">

              {/* soft ring background */}

              <div className="absolute inset-[15%] rounded-full border border-[#e2d4bd] bg-[#fffaf2] shadow-inner" />

              <svg
                viewBox="-110 -110 220 220"
                className="relative h-full w-full -rotate-90 drop-shadow-sm"
              >
                {slices.map((slice) => {
                  if (slice.value <= 0) return null;

                  const isHovered = hoveredKey === slice.key;

                  const outerRadius = isHovered ? 100 : 93;
                  const innerRadius = isHovered ? 56 : 61;

                  return (
                    <path
                      key={slice.key}
                      d={createArcPath(
                        slice.startAngle,
                        slice.endAngle,
                        outerRadius,
                        innerRadius
                      )}
                      fill={slice.color}
                      className="cursor-pointer transition-all duration-200 hover:opacity-90"
                      onMouseEnter={() => setHoveredKey(slice.key)}
                      onMouseLeave={() => setHoveredKey(null)}
                    />
                  );
                })}
              </svg>

              {/* CENTER */}

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-5 text-center">

                {hoveredSlice ? (
                  <>
                    <span className="max-w-[125px] truncate text-[10px] font-black uppercase tracking-[0.12em] text-[#8a7964]">
                      {hoveredSlice.name}
                    </span>

                    <span className="mt-1 text-lg font-black text-[#2a2117] sm:text-xl">
                      {formatINR(hoveredSlice.value)}
                    </span>

                    <span className="mt-0.5 text-[10px] font-bold text-[#a17b42]">
                      {hoveredSlice.percent.toFixed(1)}% of total
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9a8973]">
                      {viewMode === 'allocated'
                        ? 'Allocated'
                        : 'Selected'}
                    </span>

                    <span className="mt-1 text-lg font-black text-[#2a2117] sm:text-xl">
                      {formatINR(dataSum)}
                    </span>

                    <span className="mt-1 text-[10px] font-semibold text-[#95836d]">
                      {formatINR(
                        Math.round(
                          dataSum /
                            Math.max(1, event.guestCount || 1)
                        )
                      )}{' '}
                      / guest
                    </span>
                  </>
                )}

              </div>

            </div>

          </div>

          {/* LEGEND */}

          <div className="space-y-2.5 md:col-span-6">

            {slices.map((slice) => {
              const active = hoveredKey === slice.key;

              return (
                <div
                  key={slice.key}
                  onMouseEnter={() => setHoveredKey(slice.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                    active
                      ? 'translate-x-1 border-[#b99761] bg-[#f2e2c8] shadow-[0_7px_18px_rgba(80,58,31,0.08)]'
                      : 'border-[#e1d5c1] bg-white/55 hover:border-[#cdb68f] hover:bg-[#fffaf2]'
                  }`}
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <span
                      className="h-3 w-3 shrink-0 rounded-[4px] shadow-sm"
                      style={{
                        backgroundColor: slice.color,
                      }}
                    />

                    <span className="truncate text-xs font-bold text-[#554736]">
                      {slice.name}
                    </span>

                  </div>

                  <div className="ml-3 flex shrink-0 items-center gap-3">

                    <span className="text-xs font-black text-[#2d241a]">
                      {formatINR(slice.value)}
                    </span>

                    <span className="w-9 text-right font-mono text-[10px] font-bold text-[#9b876c]">
                      {slice.percent.toFixed(0)}%
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

        {/* FOOT NOTE */}

        <div className="mt-7 flex items-start gap-2 rounded-xl border border-[#dfd0b7] bg-[#f2e6d3]/60 px-4 py-3">

          <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#aa8045]" />

          <p className="text-[10px] leading-relaxed text-[#81705b]">
            <strong className="text-[#5b4831]">
              Planned Allocation
            </strong>{' '}
            shows how EventBudget distributes your budget.
            {' '}
            <strong className="text-[#5b4831]">
              Selected Spend
            </strong>{' '}
            shows the current cost of the items and services you have chosen.
          </p>

        </div>

      </div>

    </div>
  );
};
