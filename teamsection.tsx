import React from 'react';
import { Crown, Presentation } from 'lucide-react';

const TeamSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-t border-[#b68b3c]/20 py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">

        <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-[#9b7228]">
          The People Behind EventBudget
        </p>

        <h2 className="text-4xl font-black tracking-tight text-[#211b15] sm:text-5xl">
          MEET THE <span className="text-[#b7832b]">TEAM</span>
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-[#62584d]">
          The team turning smarter event planning into reality.
        </p>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">

          {/* Kaustubh */}
          <div className="rounded-3xl border border-[#b68b3c]/30 bg-white/60 p-8 shadow-lg backdrop-blur-sm">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#211b15]">
              <Crown className="h-6 w-6 text-[#e0bd69]" />
            </div>

            <h3 className="text-xl font-black text-[#211b15]">
              Kaustubh Shukla
            </h3>

            <p className="mt-2 text-sm font-bold text-[#9b7228]">
              Project Lead
            </p>

            <p className="mt-3 text-sm font-semibold text-[#62584d]">
              Concept • Design • Research
            </p>
          </div>

          {/* Devshree */}
          <div className="rounded-3xl border border-[#b68b3c]/30 bg-white/60 p-8 shadow-lg backdrop-blur-sm">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#211b15]">
              <Presentation className="h-6 w-6 text-[#e0bd69]" />
            </div>

            <h3 className="text-xl font-black text-[#211b15]">
              Devshree Patel
            </h3>

            <p className="mt-2 text-sm font-bold text-[#9b7228]">
              Presentation
            </p>

            <p className="mt-3 text-sm font-semibold text-[#62584d]">
              Team EventBudget
            </p>
          </div>

        </div>

        <div className="mx-auto mt-14 h-px max-w-2xl bg-gradient-to-r from-transparent via-[#b7832b]/50 to-transparent" />

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#6e5a3e]">
          Built for the Class 11–12 Innovation Competition
        </p>

        <p className="mt-3 text-sm font-bold text-[#9b7228]">
          You set the budget. We plan the celebration.
        </p>

      </div>
    </section>
  );
};

export { TeamSection };