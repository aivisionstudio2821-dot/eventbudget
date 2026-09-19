import React from 'react';
import { Calculator, Info } from 'lucide-react';

export const PriceMethodology: React.FC = () => {
  return (
    <section className="rounded-[24px] border border-[#d7c7aa] bg-[#fffaf1] p-5 shadow-[0_16px_35px_rgba(64,47,28,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ead5] text-[#8d6938]">
            <Calculator className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8d6938]">Pricing</p>
            <h3 className="mt-1 text-lg font-black text-[#1f1a15]">How are estimates calculated?</h3>
          </div>
        </div>

        <Info className="h-4 w-4 text-[#8d6938]" />
      </div>

      <p className="mt-4 text-sm leading-6 text-[#5f5248]">
        EventBudget figures are indicative planning estimates for a realistic starting budget. They are not guaranteed vendor quotes, and actual prices can vary by guest count, date, venue, menu, equipment, and customization.
      </p>

      <div className="mt-4 rounded-2xl border border-[#e2d7c6] bg-[#f7efe2] p-3 text-xs leading-5 text-[#4d4338]">
        Final pricing decisions should be based on confirmed vendor quotations and direct discussions with the service provider.
      </div>
    </section>
  );
};

export default PriceMethodology;
