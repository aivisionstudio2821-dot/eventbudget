import React from 'react';
import {
  Sparkles,
  Palette,
  CheckCircle2,
  AlertTriangle,
  Info,
  Star,
  WandSparkles,
  ShieldCheck,
} from 'lucide-react';

import {
  EventState,
  DecorTheme,
} from '../../types';

import {
  DECOR_THEMES,
  DECOR_ITEMS,
} from '../../data/initialData';

import { formatINR } from '../../utils/currencyFormatter';

import { calculateDecorTotal } from '../../utils/budgetCalculations';

interface DecorationPlannerProps {
  event: EventState;
  onUpdateEvent: (updated: EventState) => void;
}

export const DecorationPlanner: React.FC<
  DecorationPlannerProps
> = ({
  event,
  onUpdateEvent,
}) => {
  const decorAllocated =
    event.allocations.decoration || 0;

  const currentDecorTotal =
    calculateDecorTotal(event);

  const diff =
    decorAllocated - currentDecorTotal;

  const isOver = diff < 0;

  const currentTheme =
    DECOR_THEMES.find(
      (theme) =>
        theme.id === event.selectedThemeId
    ) || DECOR_THEMES[0];

  const handleSelectTheme = (
    theme: DecorTheme
  ) => {
    const newItems: Record<
      string,
      boolean
    > = {
      ...(event.selectedDecorItems || {}),
    };

    theme.suggestedItemIds.forEach(
      (id) => {
        newItems[id] = true;
      }
    );

    const updated: EventState = {
      ...event,
      selectedThemeId: theme.id,
      selectedDecorItems: newItems,
    };

    onUpdateEvent(updated);
  };

  const toggleDecorItem = (
    itemId: string
  ) => {
    const isSelected =
      !!event.selectedDecorItems?.[
        itemId
      ];

    const updated: EventState = {
      ...event,

      selectedDecorItems: {
        ...(event.selectedDecorItems ||
          {}),

        [itemId]: !isSelected,
      },
    };

    onUpdateEvent(updated);
  };

  const basicItems =
    DECOR_ITEMS.filter(
      (item) =>
        item.tier === 'basic'
    );

  const premiumItems =
    DECOR_ITEMS.filter(
      (item) =>
        item.tier === 'premium'
    );

  const usagePercentage =
    decorAllocated > 0
      ? Math.min(
          100,
          Math.round(
            (currentDecorTotal /
              decorAllocated) *
              100
          )
        )
      : 0;

  return (
    <div className="space-y-7">

      {/* HEADER */}

      <section className="relative overflow-hidden rounded-[30px] border border-[#493b28] bg-gradient-to-br from-[#18130e] via-[#2c2318] to-[#15110d] p-5 shadow-[0_22px_55px_rgba(45,32,18,0.20)] sm:p-7">

        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#d7b36e]/10 blur-3xl" />

        <div className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-purple-500/5 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

          <div className="max-w-2xl">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d4b26e]/20 bg-[#d4b26e]/10 px-3 py-1.5">

              <Sparkles className="h-3.5 w-3.5 text-[#e6c57f]" />

              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#e7c98d]">
                Decoration Planner
              </span>

            </div>

            <h3 className="font-heading text-2xl font-black text-[#fff9ef] sm:text-3xl">
              Build the look of your event.
            </h3>

            <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#c8baa6] sm:text-sm">
              Choose a visual theme,
              explore basic and premium
              decor elements, and keep
              decoration spending aligned
              with your allocated budget.
            </p>

          </div>

          {/* HEADER STATS */}

          <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[420px]">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#a99a84]">
                Decor Budget
              </p>

              <p className="mt-1 font-mono-num text-lg font-black text-[#f1d49c]">
                {formatINR(
                  decorAllocated
                )}
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#a99a84]">
                Selected Spend
              </p>

              <p
                className={`mt-1 font-mono-num text-lg font-black ${
                  isOver
                    ? 'text-[#e99489]'
                    : 'text-[#d9c795]'
                }`}
              >
                {formatINR(
                  currentDecorTotal
                )}
              </p>

            </div>

            <div className="col-span-2 rounded-2xl border border-purple-300/15 bg-purple-400/5 p-4 sm:col-span-1">

              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#b6a6c7]">
                Active Theme
              </p>

              <p className="mt-1 truncate text-sm font-black text-[#e6d9f0]">
                {currentTheme.name}
              </p>

            </div>

          </div>

        </div>

        {/* BUDGET PROGRESS */}

        <div className="relative mt-6">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-[10px] font-bold text-[#a99b86]">
              Decoration budget usage
            </span>

            <span
              className={`text-[10px] font-black ${
                isOver
                  ? 'text-[#ef9e94]'
                  : 'text-[#d7c089]'
              }`}
            >
              {isOver
                ? `${formatINR(
                    Math.abs(diff)
                  )} over`
                : `${formatINR(
                    diff
                  )} available`}
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">

            <div
              className={`h-full rounded-full transition-all ${
                isOver
                  ? 'bg-[#bd6258]'
                  : 'bg-gradient-to-r from-[#9c743c] to-[#e0c485]'
              }`}
              style={{
                width: `${usagePercentage}%`,
              }}
            />

          </div>

        </div>

      </section>

      {/* BUDGET WARNING / SAFE */}

      {isOver ? (
        <div className="flex items-start gap-3 rounded-2xl border border-[#dca29b] bg-[#fff1ef] p-4">

          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#aa5148]" />

          <div>
            <p className="text-xs font-black text-[#793b35]">
              Decoration budget exceeded
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-[#92635d]">
              Your current decor selections
              exceed the allocated decoration
              budget by{' '}
              <strong>
                {formatINR(
                  Math.abs(diff)
                )}
              </strong>
              . Remove optional items or
              rebalance your event budget.
            </p>
          </div>

        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl border border-[#c8cfb4] bg-[#f7f7ec] p-4">

          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#6b794f]" />

          <div>
            <p className="text-xs font-black text-[#4d5938]">
              Decoration budget is healthy
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-[#768061]">
              You currently have{' '}
              <strong>
                {formatINR(diff)}
              </strong>{' '}
              remaining inside your
              decoration allocation.
            </p>
          </div>

        </div>
      )}

      {/* PRICING NOTE */}

      <div className="flex items-start gap-3 rounded-2xl border border-[#dcc69c] bg-[#f5ead6] p-4">

        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#9a7138]" />

        <div>

          <p className="text-[11px] leading-relaxed text-[#78654c]">

            <span className="font-black text-[#614a2d]">
              Estimated planning prices.
            </span>{' '}

            Final decoration pricing can
            vary depending on vendor,
            venue dimensions, event date,
            flower availability, materials
            and custom fabrication.

          </p>

        </div>

      </div>

      {/* THEME SELECTOR */}

      <section className="overflow-hidden rounded-[28px] border border-[#ddcfb8] bg-[#fffaf1] shadow-[0_14px_38px_rgba(65,47,27,0.06)]">

        <div className="border-b border-[#e1d5c2] bg-[#f4eadc] px-5 py-5 sm:px-6">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ead8ba]">

              <Palette className="h-4 w-4 text-[#8d6735]" />

            </div>

            <div>

              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9a743e]">
                Step 1
              </p>

              <h4 className="mt-1 text-base font-black text-[#30261b]">
                Choose Event Theme
              </h4>

              <p className="mt-1 text-[11px] leading-relaxed text-[#84725d]">
                Selecting a theme
                automatically highlights
                recommended decoration
                elements for that aesthetic.
              </p>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 sm:p-6 lg:grid-cols-5">

          {DECOR_THEMES.map(
            (theme) => {

              const isSelected =
                event.selectedThemeId ===
                theme.id;

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() =>
                    handleSelectTheme(
                      theme
                    )
                  }
                  className={`group relative min-h-[150px] rounded-[22px] border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-[#a98247] bg-gradient-to-br from-[#f6ead5] to-[#fffaf4] shadow-[0_12px_28px_rgba(90,64,31,0.11)] ring-1 ring-[#bd9557]/30'
                      : 'border-[#e3d7c5] bg-white hover:-translate-y-1 hover:border-[#bea477] hover:shadow-[0_12px_25px_rgba(74,52,28,0.08)]'
                  }`}
                >

                  {isSelected && (
                    <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#2d251b]">

                      <CheckCircle2 className="h-3.5 w-3.5 text-[#e5c781]" />

                    </div>
                  )}

                  <span className="mb-3 block text-3xl">
                    {theme.icon}
                  </span>

                  <p
                    className={`pr-4 text-xs font-black ${
                      isSelected
                        ? 'text-[#3f3020]'
                        : 'text-[#514536]'
                    }`}
                  >
                    {theme.name}
                  </p>

                  <p className="mt-1.5 line-clamp-3 text-[10px] leading-relaxed text-[#91806a]">
                    {theme.description}
                  </p>

                  {isSelected && (
                    <p className="mt-3 flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#98703a]">

                      <Sparkles className="h-3 w-3" />

                      Active Theme

                    </p>
                  )}

                </button>
              );
            }
          )}

        </div>

      </section>

      {/* BASIC ITEMS */}

      <section className="space-y-4">

        <div className="flex items-end justify-between gap-4">

          <div>

            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#9b7744]">
              Step 2
            </p>

            <h4 className="mt-1 text-lg font-black text-[#34291e]">
              Basic Decor Essentials
            </h4>

            <p className="mt-1 text-[11px] text-[#8a7963]">
              Essential visual elements
              suitable for most events.
            </p>

          </div>

          <div className="hidden rounded-xl border border-[#dfd1ba] bg-[#fff9ef] px-3 py-2 text-[10px] font-bold text-[#806b50] sm:block">
            🎈 Foundation Setup
          </div>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {basicItems.map(
            (item) => {

              const isSelected =
                !!event
                  .selectedDecorItems?.[
                  item.id
                ];

              const customPrice =
                event
                  .customDecorPrices?.[
                  item.id
                ];

              const price =
                customPrice !== undefined
                  ? customPrice
                  : item.defaultPrice;

              const isSuggested =
                currentTheme.suggestedItemIds.includes(
                  item.id
                );

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    toggleDecorItem(
                      item.id
                    )
                  }
                  className={`group flex min-h-[175px] flex-col justify-between rounded-[24px] border p-5 text-left transition-all ${
                    isSelected
                      ? 'border-[#b9935d] bg-gradient-to-br from-[#fff8eb] to-[#f4e7d3] shadow-[0_13px_30px_rgba(83,59,31,0.09)]'
                      : 'border-[#e0d4c3] bg-[#fffdf8] hover:-translate-y-1 hover:border-[#c5aa81] hover:shadow-[0_12px_26px_rgba(66,47,28,0.07)]'
                  }`}
                >

                  <div>

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h5 className="text-sm font-black text-[#3b3025]">
                          {item.name}
                        </h5>

                        <p className="mt-1 text-[10px] leading-relaxed text-[#8e7d68]">
                          Estimated range:{' '}
                          ₹
                          {item.priceMin.toLocaleString(
                            'en-IN'
                          )}{' '}
                          – ₹
                          {item.priceMax.toLocaleString(
                            'en-IN'
                          )}
                        </p>

                      </div>

                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition ${
                          isSelected
                            ? 'border-[#2f281f] bg-[#2f281f] text-[#ecd29b]'
                            : 'border-[#d9cbb5] bg-white text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </div>

                    </div>

                    {isSuggested && (
                      <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-[#d7bc8d] bg-[#f3e6cf] px-2.5 py-1">

                        <Star className="h-3 w-3 fill-[#a87d3d] text-[#a87d3d]" />

                        <span className="text-[9px] font-black text-[#7e5d2e]">
                          Recommended for{' '}
                          {currentTheme.name}
                        </span>

                      </div>
                    )}

                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#e7ddcf] pt-4">

                    <p className="font-mono-num text-sm font-black text-[#765328]">
                      {formatINR(price)}
                    </p>

                    <span
                      className={`text-[10px] font-black ${
                        isSelected
                          ? 'text-[#6e794f]'
                          : 'text-[#9a8569]'
                      }`}
                    >
                      {isSelected
                        ? '✓ Added'
                        : '+ Add to Setup'}
                    </span>

                  </div>

                </button>
              );
            }
          )}

        </div>

      </section>

      {/* PREMIUM ITEMS */}

      <section className="overflow-hidden rounded-[30px] border border-purple-200/60 bg-gradient-to-br from-[#fcf8ff] via-[#fffaf3] to-[#f5ecfa] shadow-[0_16px_42px_rgba(83,56,90,0.07)]">

        <div className="relative overflow-hidden border-b border-purple-100 bg-gradient-to-r from-[#33263d] via-[#2e2336] to-[#201925] px-5 py-5 sm:px-6">

          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-purple-400/10 blur-3xl" />

          <div className="relative flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-300/20 bg-purple-300/10">

              <WandSparkles className="h-4 w-4 text-[#d7b9e8]" />

            </div>

            <div>

              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#b99ac9]">
                Premium Options
              </p>

              <h4 className="mt-1 text-lg font-black text-white">
                Premium & Experiential Decor
              </h4>

              <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-[#cbbbcf]">
                Higher-impact decor
                additions for guests who
                want a more distinctive,
                immersive event setup.
              </p>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">

          {premiumItems.map(
            (item) => {

              const isSelected =
                !!event
                  .selectedDecorItems?.[
                  item.id
                ];

              const customPrice =
                event
                  .customDecorPrices?.[
                  item.id
                ];

              const price =
                customPrice !== undefined
                  ? customPrice
                  : item.defaultPrice;

              const isSuggested =
                currentTheme.suggestedItemIds.includes(
                  item.id
                );

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    toggleDecorItem(
                      item.id
                    )
                  }
                  className={`group flex min-h-[180px] flex-col justify-between rounded-[24px] border p-5 text-left transition-all ${
                    isSelected
                      ? 'border-purple-400/60 bg-gradient-to-br from-white to-purple-50 shadow-[0_14px_30px_rgba(96,68,109,0.10)] ring-1 ring-purple-300/20'
                      : 'border-purple-100 bg-white/90 hover:-translate-y-1 hover:border-purple-300 hover:shadow-[0_12px_28px_rgba(90,60,104,0.08)]'
                  }`}
                >

                  <div>

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h5 className="text-sm font-black text-[#352a39]">
                          {item.name}
                        </h5>

                        <p className="mt-1 text-[10px] leading-relaxed text-[#8e7b92]">
                          Estimated range:{' '}
                          ₹
                          {item.priceMin.toLocaleString(
                            'en-IN'
                          )}{' '}
                          – ₹
                          {item.priceMax.toLocaleString(
                            'en-IN'
                          )}
                        </p>

                      </div>

                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition ${
                          isSelected
                            ? 'border-[#6f4b80] bg-[#6f4b80] text-white'
                            : 'border-purple-200 bg-white text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </div>

                    </div>

                    {isSuggested && (
                      <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1">

                        <Star className="h-3 w-3 fill-[#896099] text-[#896099]" />

                        <span className="text-[9px] font-black text-[#765181]">
                          Recommended for{' '}
                          {currentTheme.name}
                        </span>

                      </div>
                    )}

                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-purple-100 pt-4">

                    <p className="font-mono-num text-sm font-black text-[#765181]">
                      {formatINR(price)}
                    </p>

                    <span
                      className={`text-[10px] font-black ${
                        isSelected
                          ? 'text-[#765181]'
                          : 'text-[#9b889e]'
                      }`}
                    >
                      {isSelected
                        ? '✓ Added'
                        : '+ Add Premium'}
                    </span>

                  </div>

                </button>
              );
            }
          )}

        </div>

      </section>

    </div>
  );
};
