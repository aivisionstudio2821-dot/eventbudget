import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  PlusCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { EventState, CategoryKey } from '../../types';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateTotalPlanned } from '../../utils/budgetCalculations';

interface CanIAddThisModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventState;
  onAddCustomExpense: (name: string, price: number) => void;
}

export const CanIAddThisModal: React.FC<CanIAddThisModalProps> = ({
  isOpen,
  onClose,
  event,
  onAddCustomExpense,
}) => {
  const [expenseName, setExpenseName] = useState('Intelligent Moving DJ Lights');
  const [costInput, setCostInput] = useState('4000');

  if (!isOpen) return null;

  const cost = parseFloat(costInput) || 0;
  const currentPlanned = calculateTotalPlanned(event);
  const totalBudget = event.totalBudget || 0;
  const currentRemaining = totalBudget - (currentPlanned + (event.allocations.buffer || 0));

  const newTotalWithExpense = currentPlanned + (event.allocations.buffer || 0) + cost;
  const overspend = Math.max(0, newTotalWithExpense - totalBudget);
  const isAffordable = cost <= Math.max(0, currentRemaining);

  // Quick simulated expense presets
  const presets = [
    { name: 'Intelligent Moving DJ Lights', cost: 4000 },
    { name: 'Cold Pyro Sparkler Jets (4 Pcs)', cost: 3500 },
    { name: 'Live Hot Jalebi Counter', cost: 2500 },
    { name: '4K Aerial Drone Coverage', cost: 6000 },
    { name: 'Fairytale Ceiling Drapes', cost: 7000 },
    { name: 'Luxury Fondant 3-Tier Cake', cost: 3000 },
  ];

  const handleApply = () => {
    if (!expenseName.trim() || cost <= 0) return;
    onAddCustomExpense(expenseName.trim(), cost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0f172a] border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-heading">“Can I Add This?” Tool</h2>
              <p className="text-xs text-slate-400">Test an unexpected expense before spending a rupee</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select or test popular add-on:
            </label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setExpenseName(p.name);
                    setCostInput(p.cost.toString());
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    expenseName === p.name && costInput === p.cost.toString()
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.name} ({formatINR(p.cost)})
                </button>
              ))}
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Expense Name
              </label>
              <input
                type="text"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                placeholder="e.g. Extra DJ Lights"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-sm focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={costInput}
                onChange={(e) => setCostInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-purple-500"
              />
            </div>
          </div>

          {/* Evaluation Result Card */}
          <div className="p-5 rounded-2xl border transition-all space-y-3 bg-slate-950/80 border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Current Available Cushion:</span>
              <span className="font-bold text-white">{formatINR(Math.max(0, currentRemaining))}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Proposed Expense Cost:</span>
              <span className="font-bold text-purple-300">+{formatINR(cost)}</span>
            </div>

            <div className="pt-3 border-t border-slate-800">
              {isAffordable ? (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>🟢 SAFE TO ADD! FITS WITHIN YOUR BUDGET</span>
                  </div>
                  <p className="text-[11px] text-emerald-400/90 pl-6">
                    You will still have {formatINR(currentRemaining - cost)} buffer remaining after adding this item.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
                    <span>⚠️ ADDING THIS WILL MAKE YOU {formatINR(overspend)} OVER BUDGET</span>
                  </div>
                  <p className="text-[11px] text-rose-300/90 pl-6">
                    To afford this safely, you could reduce non-essential categories or use our <strong>⚡ Fix My Budget</strong> auto-rebalancer.
                  </p>
                </div>
              )}
            </div>

            {/* Smart Suggested Reductions */}
            {!isAffordable && (
              <div className="pt-2">
                <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                  💡 How you can afford this:
                </p>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                    <span>Trim Decoration & Props</span>
                    <span className="font-bold text-amber-300">−{formatINR(Math.round(cost * 0.4))}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                    <span>Switch 1 Starter to French Fries</span>
                    <span className="font-bold text-amber-300">−{formatINR(Math.round(cost * 0.4))}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                    <span>Reduce Emergency Buffer</span>
                    <span className="font-bold text-amber-300">−{formatINR(Math.round(cost * 0.2))}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white font-medium text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md shadow-purple-600/30 flex items-center gap-1.5 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add to My Event Plan</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
