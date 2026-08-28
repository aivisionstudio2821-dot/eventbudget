import React from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Trash2,
  Sparkles,
  Zap,
  Layers
} from 'lucide-react';
import { EventState, VendorQuote, CategoryKey } from '../../types';
import { formatINR } from '../../utils/currencyFormatter';
import { CATEGORIES_INFO } from '../../data/initialData';

interface QuoteComparisonProps {
  event: EventState;
  onApplyQuote: (quote: VendorQuote) => void;
  onRemoveQuote: (quoteId: string) => void;
  onFixMyBudget: () => void;
}

export const QuoteComparison: React.FC<QuoteComparisonProps> = ({
  event,
  onApplyQuote,
  onRemoveQuote,
  onFixMyBudget,
}) => {
  const quotes = event.quotes || [];

  if (quotes.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
          <FileText className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">No Vendor Quotes Added Yet</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Contact vendors in the directory below via WhatsApp or Call, then click <strong>“+ Enter Vendor Quote”</strong> to compare bids.
        </p>
      </div>
    );
  }

  // Group quotes by categoryKey
  const quotesByCategory: Record<string, VendorQuote[]> = {};
  quotes.forEach((q) => {
    if (!quotesByCategory[q.categoryKey]) {
      quotesByCategory[q.categoryKey] = [];
    }
    quotesByCategory[q.categoryKey].push(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-white font-heading">Real Vendor Quotation Comparison</h3>
          <p className="text-xs text-slate-400">
            Compare actual received bids against your category budgets and apply them to override estimates.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
          {quotes.length} Quotes Recorded
        </span>
      </div>

      <div className="space-y-6">
        {Object.entries(quotesByCategory).map(([catKey, catQuotes]) => {
          const categoryKey = catKey as CategoryKey;
          const catInfo = CATEGORIES_INFO.find((c) => c.key === categoryKey);
          const allocatedBudget = event.allocations[categoryKey] || 0;

          // Compute lowest and price range
          const amounts = catQuotes.map((q) => q.quotedAmount);
          const lowestQuote = Math.min(...amounts);
          const highestQuote = Math.max(...amounts);
          const priceDiff = highestQuote - lowestQuote;

          const activeAppliedId = event.appliedQuoteIds?.[categoryKey];

          return (
            <div
              key={catKey}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: catInfo?.color || '#a855f7' }}
                  />
                  <h4 className="text-base font-bold text-white">{catInfo?.name || catKey}</h4>
                  <span className="text-xs text-slate-400 font-semibold">
                    (Target Budget: <strong className="text-amber-300">{formatINR(allocatedBudget)}</strong>)
                  </span>
                </div>

                {catQuotes.length > 1 && (
                  <div className="flex items-center gap-3 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400">
                      Lowest: <strong className="text-emerald-400">{formatINR(lowestQuote)}</strong>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">
                      Spread: <strong className="text-purple-300">{formatINR(priceDiff)}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Quote Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catQuotes.map((quote) => {
                  const isApplied = activeAppliedId === quote.id;
                  const diff = quote.quotedAmount - allocatedBudget;
                  const isOver = diff > 0;

                  return (
                    <div
                      key={quote.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isApplied
                          ? 'bg-emerald-950/20 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        {/* Vendor Name & Status */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h5 className="text-sm font-bold text-white">{quote.vendorName}</h5>
                            <span className="text-[10px] text-slate-500">Logged on {quote.date}</span>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isOver
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            }`}
                          >
                            {isOver ? `+${formatINR(diff)} Over` : '🟢 Fits Budget'}
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="my-3">
                          <span className="text-xl font-extrabold text-white font-mono-num">
                            {formatINR(quote.quotedAmount)}
                          </span>
                          {quote.quotedAmount === lowestQuote && catQuotes.length > 1 && (
                            <span className="ml-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              ★ Lowest Bid
                            </span>
                          )}
                        </div>

                        {/* Notes */}
                        {quote.notes && (
                          <p className="text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed mb-3">
                            "{quote.notes}"
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onRemoveQuote(quote.id)}
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete quote"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onApplyQuote(quote)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                            isApplied
                              ? 'bg-emerald-500 text-slate-950 shadow'
                              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Applied to Plan</span>
                            </>
                          ) : (
                            <>
                              <span>USE THIS QUOTE</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
