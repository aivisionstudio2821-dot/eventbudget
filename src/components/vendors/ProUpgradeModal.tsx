import React from 'react';
import {
  X,
  Sparkles,
  Lock,
  Check,
  IndianRupee,
} from 'lucide-react';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateDeveloperMode: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  onActivateDeveloperMode,
}) => {
  if (!isOpen) return null;

  const features = [
    'Real Vendor Packages & Prices',
    'Direct WhatsApp / Call with Vendors',
    'Request Real Quotes',
    'Compare Vendor Quotes',
    'Add Selected Quote to Event Budget',
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#090b0d]/80 px-4 py-6 backdrop-blur-md">
      <div className="w-full max-w-lg overflow-hidden rounded-[28px] border border-[#d7b67a]/25 bg-[#120f0d] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between border-b border-[#31281d] bg-gradient-to-r from-[#1b140f] via-[#221d18] to-[#17120f] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d9b770]/30 bg-[#d9b770]/10 text-[#f3d18a]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d0a864]">
                Upgrade
              </p>
              <h2 className="text-xl font-black text-[#fff6e5]">EventBudget PRO</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#4b3d2b] bg-[#17120f] p-2 text-[#e8d7b5] transition hover:border-[#deba76] hover:text-white"
            aria-label="Close upgrade modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="rounded-2xl border border-[#d9b770]/20 bg-[#f7eedb]/5 p-4 text-center">
            <div className="mb-2 flex items-center justify-center gap-2 text-[#f3d18a]">
              <IndianRupee className="h-4 w-4" />
              <span className="text-3xl font-black text-[#fff6e5]">₹99</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d0a864]">
              per event · introductory / developer test pricing
            </p>
          </div>

          <div className="rounded-2xl border border-[#31281d] bg-[#17120f] p-4">
            <div className="mb-3 flex items-center gap-2 text-[#f5d999]">
              <Lock className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-[0.18em]">
                Included with PRO
              </span>
            </div>

            <ul className="space-y-2.5">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-[#f7efe3]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d9b770]/15 text-[#f3d18a]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <button
              type="button"
              onClick={onActivateDeveloperMode}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#c89542] via-[#f0d890] to-[#c89542] px-4 py-3 text-sm font-black text-[#1b140e] shadow-[0_10px_30px_rgba(192,144,67,0.35)] transition hover:brightness-110 active:scale-[0.99]"
            >
              Unlock PRO Demo
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-[#4b3d2b] bg-[#17120f] px-4 py-3 text-sm font-bold text-[#f2e2b5] transition hover:border-[#d6b066] hover:text-white"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
