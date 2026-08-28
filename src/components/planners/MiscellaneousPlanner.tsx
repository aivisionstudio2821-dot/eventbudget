import React, { useState } from 'react';
import {
  Gift,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info
} from 'lucide-react';
import { EventState, MiscItem } from '../../types';
import { MISC_OPTIONS } from '../../data/initialData';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateMiscTotal } from '../../utils/budgetCalculations';

interface MiscellaneousPlannerProps {
  event: EventState;
  onUpdateEvent: (updated: EventState) => void;
}

export const MiscellaneousPlanner: React.FC<MiscellaneousPlannerProps> = ({
  event,
  onUpdateEvent,
}) => {
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');

  const miscAllocated = event.allocations.misc || 0;
  const currentMiscTotal = calculateMiscTotal(event);
  const diff = miscAllocated - currentMiscTotal;
  const isOver = diff < 0;

  // Initialize with initial misc options if none present
  const allItems: MiscItem[] = (event.miscItems && event.miscItems.length > 0)
    ? event.miscItems
    : MISC_OPTIONS.map(m => ({ ...m, selected: m.id === 'misc_cake' }));

  const toggleItem = (itemId: string) => {
    const updatedItems = allItems.map(item => {
      if (item.id === itemId) {
        return { ...item, selected: item.selected === false ? true : false };
      }
      return item;
    });

    onUpdateEvent({
      ...event,
      miscItems: updatedItems,
    });
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const priceNum = parseFloat(customPrice) || 0;

    const newItem: MiscItem = {
      id: `custom_misc_${Date.now()}`,
      name: customName.trim(),
      price: priceNum,
      isCustom: true,
      selected: true,
    };

    onUpdateEvent({
      ...event,
      miscItems: [...allItems, newItem],
    });

    setCustomName('');
    setCustomPrice('');
  };

  const handleDeleteCustom = (itemId: string) => {
    onUpdateEvent({
      ...event,
      miscItems: allItems.filter(item => item.id !== itemId),
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Overview */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-extrabold text-white font-heading">Miscellaneous & Custom Expenses Planner</h3>
          </div>
          <p className="text-xs text-slate-400">
            Log designer cake, guest return gifts, ushers staff, permissions, and create custom expenses.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800 self-start md:self-auto">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Misc Budget</p>
            <p className="text-base font-black text-white font-mono-num">{formatINR(miscAllocated)}</p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Selected Spend</p>
            <p className={`text-base font-black font-mono-num ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatINR(currentMiscTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Add Custom Expense Form */}
      <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Expense</span>
        </h4>
        
        <form onSubmit={handleAddCustom} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-7">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Return Gift Bags or VIP Car Rental"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium text-xs focus:border-purple-500"
            />
          </div>
          <div className="sm:col-span-3">
            <input
              type="number"
              min="0"
              step="100"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              placeholder="Price (₹)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs focus:border-purple-500"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full h-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Item</span>
            </button>
          </div>
        </form>
      </div>

      {/* Items Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {allItems.map((item) => {
          const isSelected = item.selected !== false;

          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-emerald-950/20 border-emerald-500 ring-1 ring-emerald-500/50 shadow-md'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold' : 'border-slate-700 bg-slate-950'
                }`}>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </span>
                
                <div className="min-w-0">
                  <h5 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {item.name}
                  </h5>
                  {item.isCustom && (
                    <span className="text-[9px] uppercase font-bold text-purple-400">Custom Item</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-black text-emerald-300 font-mono-num">
                  {formatINR(item.price)}
                </span>
                {item.isCustom && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCustom(item.id);
                    }}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
