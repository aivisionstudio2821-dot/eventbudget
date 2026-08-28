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
  AlertTriangle
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
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Music': return <Music className="w-5 h-5" />;
      case 'Camera': return <Camera className="w-5 h-5" />;
      case 'Building': return <Building className="w-5 h-5" />;
      case 'Gift': return <Gift className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-white font-heading">Category Allocations & Spend</h3>
          <p className="text-xs text-slate-400">Allocated budget vs current selected selections</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CATEGORIES_INFO.map((cat) => {
          const isBuffer = cat.key === 'buffer';
          const allocated = event.allocations[cat.key] || 0;
          const selected = isBuffer ? 0 : (categoryTotals[cat.key] || 0);
          const remaining = allocated - selected;
          const isOver = !isBuffer && remaining < 0;
          const isQuoteApplied = !isBuffer && Boolean(event.appliedQuoteIds?.[cat.key]);

          return (
            <div
              key={cat.key}
              className={`p-5 rounded-3xl bg-[#0f172a]/80 border transition-all duration-200 flex flex-col justify-between group shadow-lg ${
                isOver
                  ? 'border-rose-500/50 bg-rose-950/10 hover:border-rose-500'
                  : 'border-slate-800/80 hover:border-purple-500/40 hover:bg-[#141d34]/90'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: `${cat.color}25`, color: cat.color }}
                    >
                      {getIcon(cat.iconName)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        {cat.name}
                      </h4>
                      {isQuoteApplied && (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Real Quote Applied
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status indicator */}
                  {!isBuffer && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isOver
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {isOver ? 'Over Budget' : 'Within Budget'}
                    </span>
                  )}
                </div>

                {/* Amount Matrix */}
                <div className="space-y-2 py-2 border-y border-slate-800/60 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Allocated Budget:</span>
                    <span className="font-semibold text-slate-200">{formatINR(allocated)}</span>
                  </div>

                  {!isBuffer && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Selected Items:</span>
                      <span className={`font-bold ${isOver ? 'text-rose-400' : 'text-purple-300'}`}>
                        {formatINR(selected)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
                    <span className="font-semibold text-slate-300">
                      {isBuffer ? 'Buffer Reserve:' : 'Remaining:'}
                    </span>
                    <span
                      className={`font-black text-sm ${
                        isBuffer
                          ? 'text-indigo-400'
                          : isOver
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {isBuffer ? formatINR(allocated) : (remaining < 0 ? `-${formatINR(Math.abs(remaining))}` : formatINR(remaining))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                {!isBuffer ? (
                  <button
                    onClick={() => onSelectCategory(cat.key)}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-purple-600 hover:text-white border border-slate-700 hover:border-purple-500 transition-all flex items-center justify-center gap-1.5 group/btn"
                  >
                    <span>VIEW {cat.name.split(' ')[0].toUpperCase()} OPTIONS</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <div className="py-2 px-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-[11px] text-slate-400">
                    🛡️ Emergency On-Day Cushion
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
