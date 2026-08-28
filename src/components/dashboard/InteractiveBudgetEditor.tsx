import React from 'react';
import {
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info
} from 'lucide-react';
import { CategoryKey, EventState, CategoryAllocations } from '../../types';
import { CATEGORIES_INFO } from '../../data/initialData';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateSmartAllocations } from '../../utils/budgetCalculations';

interface InteractiveBudgetEditorProps {
  event: EventState;
  onUpdateAllocations: (newAllocations: CategoryAllocations) => void;
}

export const InteractiveBudgetEditor: React.FC<InteractiveBudgetEditorProps> = ({
  event,
  onUpdateAllocations,
}) => {
  const totalBudget = event.totalBudget || 0;
  const currentSum = Object.values(event.allocations).reduce((a, b) => a + b, 0);
  const diff = currentSum - totalBudget;

  const handleSliderChange = (key: CategoryKey, newValue: number) => {
    const updated = {
      ...event.allocations,
      [key]: newValue,
    };
    onUpdateAllocations(updated);
  };

  const handleInputChange = (key: CategoryKey, valueStr: string) => {
    const val = parseInt(valueStr, 10);
    const updated = {
      ...event.allocations,
      [key]: isNaN(val) || val < 0 ? 0 : val,
    };
    onUpdateAllocations(updated);
  };

  const handleResetToSmart = () => {
    const fresh = calculateSmartAllocations(
      event.eventType,
      event.totalBudget,
      event.guestCount,
      event.priority
    );
    onUpdateAllocations(fresh);
  };

  return (
    <div className="p-5 sm:p-7 rounded-3xl bg-[#0f172a]/95 border border-slate-800 backdrop-blur-md shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white font-heading">Interactive Budget Slider Editor</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Fine-tune how much money is earmarked for each category. Updates everything instantly.
          </p>
        </div>

        <button
          onClick={handleResetToSmart}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Reset Smart Ratios</span>
        </button>
      </div>

      {/* Allocation Balance Status Banner */}
      <div className="my-5">
        {diff === 0 ? (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">🟢 100% PERFECTLY ALLOCATED ({formatINR(totalBudget)})</span>
            </div>
            <span className="font-mono font-bold">₹0 Left to Allocate</span>
          </div>
        ) : diff > 0 ? (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
              <span className="font-semibold">🔴 ALLOCATIONS EXCEED BUDGET BY {formatINR(diff)}</span>
            </div>
            <span className="font-mono font-bold">Trim sliders below</span>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold">🟡 {formatINR(Math.abs(diff))} UNALLOCATED SURPLUS</span>
            </div>
            <span className="font-mono font-bold">Add to buffer or categories</span>
          </div>
        )}
      </div>

      {/* Category Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CATEGORIES_INFO.map((cat) => {
          const allocValue = event.allocations[cat.key] || 0;
          const percent = totalBudget > 0 ? Math.round((allocValue / totalBudget) * 100) : 0;
          const maxLimit = Math.max(totalBudget, 100000);

          return (
            <div
              key={cat.key}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm font-bold text-slate-200">{cat.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {percent}%
                </span>
              </div>

              {/* Number Input & Controls */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max={maxLimit}
                  step="500"
                  value={allocValue}
                  onChange={(e) => handleSliderChange(cat.key, parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />

                <div className="relative w-32 shrink-0">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={allocValue}
                    onChange={(e) => handleInputChange(cat.key, e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs focus:border-purple-500 text-right"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
