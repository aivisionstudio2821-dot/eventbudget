import React from 'react';
import {
  Calculator,
  MapPin,
  Users,
  BadgeIndianRupee,
  FileCheck2,
  Info,
} from 'lucide-react';

export const PriceMethodology: React.FC = () => {
  const points = [
    {
      icon: MapPin,
      title: 'Ahmedabad-Focused',
      text: 'The current prototype is designed around Ahmedabad-style event planning and local cost expectations.',
    },
    {
      icon: Users,
      title: 'Guest-Based Costs',
      text: 'Costs such as catering are calculated using guest count, while other categories may use estimated fixed event costs.',
    },
    {
      icon: Calculator,
      title: 'Planning Estimates',
      text: 'Prices shown inside EventBudget are prototype estimates used to create an early event budget — not guaranteed quotations.',
    },
    {
      icon: FileCheck2,
      title: 'Vendor Quote Wins',
      text: 'When an actual vendor quotation is applied, EventBudget uses that quote in the event plan instead of relying only on the estimate.',
    },
  ];

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#d8c294] bg-[#fbf7ef] shadow-[0_20px_60px_rgba(69,52,29,0.08)]">
      <div className="bg-gradient-to-r from-[#191713] via-[#242018] to-[#151411] px-5 py-6 sm:px-7 sm:py-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#d8b56c]">
              <BadgeIndianRupee className="h-4 w-4" />
              Pricing Transparency
            </div>

            <h3 className="font-heading text-2xl font-extrabold text-[#fffaf0] sm:text-3xl">
              How Our Estimates Work
            </h3>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#d8d0c2]">
              EventBudget is a planning tool. Its estimated prices help users
              create a realistic starting budget before collecting final vendor
              quotations.
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#b8924e]/40 bg-[#d8b56c]/10">
            <Calculator className="h-7 w-7 text-[#e1bd72]" />
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          {points.map((point) => {
            const Icon = point.icon;

            return (
              <div
                key={point.title}
                className="rounded-2xl border border-[#e5d8bc] bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ead5]">
                  <Icon className="h-5 w-5 text-[#9a7133]" />
                </div>

                <h4 className="font-heading text-base font-extrabold text-[#211b15]">
                  {point.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-[#706354]">
                  {point.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex gap-3 rounded-2xl border border-[#ddc999] bg-[#f5eddd] p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#9b7337]" />

          <div>
            <p className="text-sm font-extrabold text-[#3b3023]">
              Important Pricing Note
            </p>

            <p className="mt-1 text-xs leading-5 text-[#756652] sm:text-sm">
              Actual prices can vary by vendor, event date, location, season,
              duration, availability, menu, equipment and customization.
              EventBudget estimates should be used for early-stage planning.
              Final booking decisions should be based on confirmed vendor
              quotations.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[#d9c69d] bg-[#211e18] px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#d8b56c]">
            EventBudget Principle
          </p>

          <p className="mt-1 text-sm font-semibold leading-6 text-[#f7f0e4]">
            Estimate first → customize the plan → compare real quotations →
            replace estimates with confirmed vendor pricing.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PriceMethodology;
