import React, { useMemo, useState } from 'react';
import { Users, ArrowRight, Sparkles } from 'lucide-react';

import { EventState } from '../../types';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateSmartAllocations } from '../../utils/budgetCalculations';

interface GuestImpactSimulatorProps {
  event: EventState;
}

export const GuestImpactSimulator: React.FC<GuestImpactSimulatorProps> = ({ event }) => {
  const currentGuests = Math.max(1, event.guestCount || 1);
  const [newGuestCount, setNewGuestCount] = useState(Math.min(5000, currentGuests + 25));

  const simulation = useMemo(() => {
    const safeGuests = Math.max(1, Math.min(5000, newGuestCount || 1));
    const simulatedAllocations = calculateSmartAllocations(event.eventType, event.totalBudget, safeGuests, event.priority);

    const currentFood = event.allocations.food || 0;
    const simulatedFood = simulatedAllocations.food || 0;
    const currentFoodPerGuest = currentFood / currentGuests;
    const estimatedFoodNeed = currentFoodPerGuest * safeGuests;
    const guestDifference = safeGuests - currentGuests;

    return {
      safeGuests,
      simulatedAllocations,
      currentFood,
      simulatedFood,
      estimatedFoodNeed,
      guestDifference,
    };
  }, [event, newGuestCount, currentGuests]);

  const isIncrease = simulation.guestDifference > 0;

  return (
    <section className="rounded-[24px] border border-[#d7c7aa] bg-[#fffaf1] p-5 shadow-[0_16px_35px_rgba(64,47,28,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ead5] text-[#8d6938]">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8d6938]">Guest impact</p>
            <h3 className="mt-1 text-lg font-black text-[#201b15]">What if guest count changes?</h3>
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ead5] text-[#8d6938]">
          <Users className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#e2d7c6] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-[#706354]">Current plan</p>
            <p className="mt-1 text-lg font-black text-[#201b15]">{currentGuests} guests</p>
          </div>

          <ArrowRight className="h-4 w-4 text-[#b28a4e]" />

          <div>
            <p className="text-xs font-bold text-[#706354]">Simulation</p>
            <p className="mt-1 text-lg font-black text-[#201b15]">{simulation.safeGuests} guests</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b6b5b]">
            <span>Guest count</span>
            <span>{simulation.safeGuests}</span>
          </div>
          <input
            type="range"
            min={1}
            max={Math.min(5000, Math.max(250, currentGuests + 500))}
            step={1}
            value={simulation.safeGuests}
            onChange={(e) => setNewGuestCount(Number(e.target.value))}
            className="w-full accent-[#a77c3d]"
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#e2d7c6] bg-[#f7efe2] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#7b6b5b]">Estimated food need</p>
            <p className="mt-1 font-mono-num text-base font-black text-[#2a2118]">{formatINR(simulation.estimatedFoodNeed)}</p>
          </div>
          <div className="rounded-xl border border-[#e2d7c6] bg-[#f7efe2] p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#7b6b5b]">Budget signal</p>
            <p className={`mt-1 text-sm font-black ${isIncrease ? 'text-[#8b5e36]' : 'text-[#4a664d]'}`}>
              {isIncrease ? 'More guests may require extra spend' : 'Current plan stays steadier'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuestImpactSimulator;
