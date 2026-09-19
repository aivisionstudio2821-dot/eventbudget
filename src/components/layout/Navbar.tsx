import React, { useState } from 'react';
import {
  Sparkles,
  PlusCircle,
  RotateCcw,
  Save,
  Menu,
  X,
  Store,
  Wallet,
  Building2,
} from 'lucide-react';

import { EventState } from '../../types';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateTotalPlanned } from '../../utils/budgetCalculations';

interface NavbarProps {
  event: EventState | null;
  onOpenCreateModal: () => void;
  onOpenVendorOnboarding: () => void;
  onLoadDemo: () => void;
  onResetEvent: () => void;
  onSaveEvent: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  hasSavedChanges: boolean;
  isProActive: boolean;
  onUpgradeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  event,
  onOpenCreateModal,
  onOpenVendorOnboarding,
  onLoadDemo,
  onResetEvent,
  onSaveEvent,
  activeSection,
  setActiveSection,
  hasSavedChanges,
  isProActive,
  onUpgradeClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const plannedTotal = event ? calculateTotalPlanned(event) : 0;
  const isOverBudget = event ? plannedTotal + (event.allocations.buffer || 0) > event.totalBudget : false;

  const scrollTo = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);

    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'hero-section', label: 'Plan', icon: PlusCircle },
    { id: 'dashboard-section', label: 'Budget', icon: Wallet },
    { id: 'vendors-section', label: 'Vendors', icon: Store },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#413626]/30 bg-[#0b0d0e]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-18">
          <div className="flex items-center gap-3" onClick={() => scrollTo('hero-section')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d5b06c]/35 bg-[#1a140f] shadow-[0_8px_22px_rgba(0,0,0,0.18)]">
              <Sparkles className="h-5 w-5 text-[#f0cd7b]" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white sm:text-2xl">
                Event
                <span className="bg-gradient-to-r from-[#f6e3ac] via-[#d6b36a] to-[#f0c96c] bg-clip-text text-transparent">Budget</span>
              </span>
              {isProActive && (
                <span className="inline-flex items-center rounded-full border border-[#f3d18a]/40 bg-[#f3d18a]/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#f8dc96]">
                  PRO
                </span>
              )}
            </div>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                    isActive ? 'bg-[#1d1915] text-[#f2d59f] ring-1 ring-[#d0ab68]/25' : 'text-slate-300 hover:bg-[#171411] hover:text-[#f7e8bf]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={onOpenVendorOnboarding}
              className="inline-flex items-center gap-2 rounded-xl border border-[#d7c39e]/25 bg-[#17120f] px-3 py-2 text-sm font-medium text-[#f5e7c6] transition hover:border-[#d2a75d]/40 hover:bg-[#201a16]"
            >
              <Building2 className="h-4 w-4 text-[#d9b76d]" />
              For Vendors
            </button>
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            {event && (
              <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${isOverBudget ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'}`}>
                <span className={`h-2 w-2 rounded-full ${isOverBudget ? 'bg-red-400' : 'bg-emerald-400'}`} />
                {event.eventType}: {formatINR(event.totalBudget)}
              </div>
            )}

            <button
              type="button"
              onClick={onOpenCreateModal}
              className="rounded-xl border border-[#d0ae6e]/35 bg-gradient-to-r from-[#c99a42] via-[#f0d58a] to-[#c99a42] px-3.5 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#1c150d] shadow-[0_8px_20px_rgba(201,154,66,0.2)] transition hover:brightness-105"
            >
              New Event
            </button>

            <button
              type="button"
              onClick={onSaveEvent}
              className="inline-flex items-center gap-2 rounded-xl border border-[#2e3838] bg-[#101416] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-[#4a5858] hover:bg-[#171d1e]"
            >
              <Save className="h-3.5 w-3.5 text-[#ddb770]" />
              {hasSavedChanges ? 'Save' : 'Saved'}
            </button>

            <button
              type="button"
              onClick={onResetEvent}
              className="inline-flex items-center gap-2 rounded-xl border border-[#2e3838] bg-[#101416] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-[#6c4a4a] hover:bg-[#1e1717]"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#d9b5a1]" />
              Reset
            </button>

            <button
              type="button"
              onClick={isProActive ? undefined : onUpgradeClick}
              className={`rounded-xl px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${isProActive ? 'border border-[#f3d18a]/40 bg-[#f3d18a]/10 text-[#f8dc96]' : 'border border-[#d2a75d]/40 bg-[#f7e2b4]/10 text-[#f3d08c] hover:bg-[#f7e2b4]/15'}`}
            >
              {isProActive ? 'PRO' : 'Upgrade'}
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="rounded-xl border border-[#d0ae6e]/35 bg-gradient-to-r from-[#c99a42] via-[#f0d58a] to-[#c99a42] px-2.5 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#1c150d]"
            >
              New
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl border border-[#2e3838] bg-[#111718] p-2 text-slate-200"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-[#413626]/30 bg-[#090d0e] px-4 py-3 lg:hidden">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="flex w-full items-center gap-2 rounded-xl border border-[#201c17] bg-[#121315] px-3 py-2.5 text-left text-sm font-medium text-slate-200"
                >
                  <Icon className="h-4 w-4 text-[#d9b76d]" />
                  {item.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={onOpenVendorOnboarding}
              className="flex w-full items-center gap-2 rounded-xl border border-[#201c17] bg-[#121315] px-3 py-2.5 text-left text-sm font-medium text-slate-200"
            >
              <Building2 className="h-4 w-4 text-[#d9b76d]" />
              For Vendors
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button type="button" onClick={onSaveEvent} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2e3838] bg-[#101416] px-3 py-2 text-xs font-semibold text-slate-200">
                <Save className="h-3.5 w-3.5 text-[#ddb770]" />
                {hasSavedChanges ? 'Save' : 'Saved'}
              </button>
              <button type="button" onClick={onResetEvent} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2e3838] bg-[#101416] px-3 py-2 text-xs font-semibold text-slate-200">
                <RotateCcw className="h-3.5 w-3.5 text-[#d9b5a1]" />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
