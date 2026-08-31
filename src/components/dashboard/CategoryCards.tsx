import React from 'react';
import {
  Utensils,
  Sparkles,
  Music,
  Camera,
  Building,
  Gift,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

import { CategoryKey, EventState } from '../../types';
import { CATEGORIES_INFO } from '../../data/initialData';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateCategoryTotals } from '../../utils/budgetCalculations';

interface CategoryCardsProps {
  event: EventState;
  onSelectCategory: (key: CategoryKey) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  event,
  onSelectCategory,
}) => {
  const categoryTotals = calculateCategoryTotals(event);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils className="h-5 w-5" />;
      case 'Sparkles':
        return <Sparkles className="h-5 w-5" />;
      case 'Music':
        return <Music className="h-5 w-5" />;
      case 'Camera':
        return <Camera className="h-5 w-5" />;
      case 'Building':
        return <Building className="h-5 w-5" />;
      case 'Gift':
        return <Gift className="h-5 w-5" />;
      case 'ShieldAlert':
        return <ShieldAlert className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-5">

      {/* SECTION HEADER */}

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#a27b42]">
            Event Categories
          </p>

          <h3 className="font-heading text-xl font-black text-[#241c13]">
            Plan Every Part of Your Event
          </h3>

          <p className="mt-1 text-xs text-[#8b7962]">
            See your category budget, current selections and remaining amount.
          </p>
        </div>

        <div className="rounded-full border border-[#d9c7a8] bg-[#f6ead7] px-3 py-1.5 text-[10px] font-bold text-[#806b50]">
          Click any category to customize
        </div>
      </div>

      {/* CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {CATEGORIES_INFO.map((cat) => {
          const isBuffer = cat.key === 'buffer';

          const allocated =
            event.allocations[cat.key] || 0;

          const selected = isBuffer
            ? 0
            : categoryTotals[cat.key] || 0;

          const remaining =
            allocated - selected;

          const isOver =
            !isBuffer && remaining < 0;

          const isQuoteApplied =
            !isBuffer &&
            Boolean(
              event.appliedQuoteIds?.[cat.key]
            );

          const usedPercent =
            !isBuffer && allocated > 0
              ? Math.min(
                  100,
                  (selected / allocated) * 100
                )
              : 0;

          return (
            <div
              key={cat.key}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[24px] border p-5 transition-all duration-300 ${
                isOver
                  ? 'border-[#d9a29a] bg-gradient-to-br from-[#fff4f1] to-[#fbe8e3] shadow-[0_12px_30px_rgba(139,65,54,0.08)]'
                  : 'border-[#ded0ba] bg-gradient-to-br from-[#fffaf2] to-[#f7eddd] shadow-[0_10px_28px_rgba(70,49,26,0.07)] hover:-translate-y-1 hover:border-[#b99a69] hover:shadow-[0_18px_35px_rgba(70,49,26,0.11)]'
              }`}
            >

              {/* DECORATIVE GLOW */}

              <div
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-[0.08] blur-2xl"
                style={{
                  backgroundColor: cat.color,
                }}
              />

              <div className="relative">

                {/* HEADER */}

                <div className="mb-5 flex items-start justify-between gap-3">

                  <div className="flex min-w-0 items-center gap-3">

                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm"
                      style={{
                        backgroundColor: `${cat.color}12`,
                        borderColor: `${cat.color}30`,
                        color: cat.color,
                      }}
                    >
                      {getIcon(cat.iconName)}
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-black text-[#30261b] transition-colors group-hover:text-[#76562e]">
                        {cat.name}
                      </h4>

                      {isQuoteApplied && (
                        <span className="mt-1 flex items-center gap-1 text-[9px] font-bold text-[#63774c]">
                          <CheckCircle2 className="h-3 w-3" />
                          Vendor Quote Applied
                        </span>
                      )}
                    </div>

                  </div>

                  {/* STATUS */}

                  {!isBuffer && (
                    <span
                      className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-black ${
                        isOver
                          ? 'border-[#d89b93] bg-[#f7dcd7] text-[#a64d45]'
                          : 'border-[#bdc8a3] bg-[#eef1df] text-[#627348]'
                      }`}
                    >
                      {isOver
                        ? 'OVER'
                        : 'ON TRACK'}
                    </span>
                  )}

                </div>

                {/* AMOUNTS */}

                <div className="rounded-2xl border border-[#e3d6c2] bg-white/50 p-3.5">

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#98866e]">
                      Allocated
                    </span>

                    <span className="font-mono-num text-sm font-black text-[#352a1e]">
                      {formatINR(allocated)}
                    </span>
                  </div>

                  {!isBuffer && (
                    <>
                      <div className="my-2.5 h-px bg-[#e7dccb]" />

                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[#98866e]">
                          Selected
                        </span>

                        <span
                          className={`font-mono-num text-sm font-black ${
                            isOver
                              ? 'text-[#a74d44]'
                              : 'text-[#806039]'
                          }`}
                        >
                          {formatINR(selected)}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="my-2.5 h-px bg-[#e7dccb]" />

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-black uppercase tracking-wide text-[#75634d]">
                      {isBuffer
                        ? 'Reserved'
                        : 'Remaining'}
                    </span>

                    <span
                      className={`font-mono-num text-base font-black ${
                        isBuffer
                          ? 'text-[#86683e]'
                          : isOver
                          ? 'text-[#a74d44]'
                          : 'text-[#5f7044]'
                      }`}
                    >
                      {isBuffer
                        ? formatINR(allocated)
                        : remaining < 0
                        ? `-${formatINR(
                            Math.abs(remaining)
                          )}`
                        : formatINR(remaining)}
                    </span>
                  </div>

                </div>

                {/* SPEND BAR */}

                {!isBuffer && (
                  <div className="mt-4">

                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wide text-[#9b896f]">
                        Budget Used
                      </span>

                      <span
                        className={`text-[9px] font-black ${
                          isOver
                            ? 'text-[#a74d44]'
                            : 'text-[#7a684f]'
                        }`}
                      >
                        {allocated > 0
                          ? `${Math.round(
                              (selected /
                                allocated) *
                                100
                            )}%`
                          : '0%'}
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-[#e9ddca]">

                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver
                            ? 'bg-[#b85f55]'
                            : 'bg-[#9b7b4c]'
                        }`}
                        style={{
                          width: `${usedPercent}%`,
                        }}
                      />

                    </div>

                  </div>
                )}

              </div>

              {/* ACTION */}

              <div className="relative mt-5">

                {!isBuffer ? (
                  <button
                    type="button"
                    onClick={() =>
                      onSelectCategory(cat.key)
                    }
                    className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-[#241c13] px-3 py-3 text-[10px] font-black uppercase tracking-[0.08em] text-[#f1d9aa] shadow-[0_8px_18px_rgba(44,32,18,0.16)] transition-all hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_12px_24px_rgba(44,32,18,0.22)] active:translate-y-0"
                  >
                    <span>
                      Customize{' '}
                      {cat.name
                        .split(' ')[0]}
                    </span>

                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                ) : (
                  <div className="rounded-xl border border-[#dac9ad] bg-[#efe2ce]/65 px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-[#765e3d]">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      Safety Cushion
                    </div>

                    <p className="mt-1 text-[9px] leading-relaxed text-[#99856a]">
                      Reserved for unexpected event-day expenses.
                    </p>
                  </div>
                )}

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};
