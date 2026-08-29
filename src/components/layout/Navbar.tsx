import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  PlusCircle,
  RotateCcw,
  Save,
  Menu,
  X,
  TrendingUp,
  Store,
  FileText
} from 'lucide-react';

import { EventState } from '../../types';
import { formatINR } from '../../utils/currencyFormatter';
import { calculateTotalPlanned } from '../../utils/budgetCalculations';

interface NavbarProps {
  event: EventState | null;
  onOpenCreateModal: () => void;
  onLoadDemo: () => void;
  onResetEvent: () => void;
  onSaveEvent: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  hasSavedChanges: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  event,
  onOpenCreateModal,
  onLoadDemo,
  onResetEvent,
  onSaveEvent,
  activeSection,
  setActiveSection,
  hasSavedChanges,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const plannedTotal = event ? calculateTotalPlanned(event) : 0;

  const isOverBudget = event
    ? (plannedTotal + (event.allocations.buffer || 0)) > event.totalBudget
    : false;

  const scrollTo = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);

    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#06090b]/92 backdrop-blur-xl border-b border-amber-900/25 transition-all">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => scrollTo('hero-section')}
          >

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#a8792c] via-[#e2c46f] to-[#2dd4a3] p-[2px] shadow-lg shadow-amber-900/25">

              <div className="w-full h-full bg-[#080c0e] rounded-[10px] flex items-center justify-center">

                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />

              </div>

            </div>

            <div>

              <div className="flex items-center gap-1.5">

                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-heading">

                  Event

                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7e7b0] via-[#d6b36a] to-[#f0c96c]">
                    Budget
                  </span>

                </span>

                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  MVP
                </span>

              </div>

              <p className="hidden sm:block text-[11px] text-slate-400 tracking-normal font-medium -mt-1">
                You set the budget. We plan the celebration.
              </p>

            </div>

          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">

            <button
              onClick={() => scrollTo('hero-section')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeSection === 'hero-section'
                  ? 'text-amber-300 bg-amber-500/10'
                  : 'text-slate-300 hover:text-amber-200 hover:bg-slate-800/30'
              }`}
            >
              Overview
            </button>

            {event && (
              <>

                <button
                  onClick={() => scrollTo('dashboard-section')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    activeSection === 'dashboard-section'
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/30'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Budget Dashboard
                </button>

                <button
                  onClick={() => scrollTo('planners-section')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === 'planners-section'
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/30'
                  }`}
                >
                  Category Planners
                </button>

                <button
                  onClick={() => scrollTo('vendors-section')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    activeSection === 'vendors-section'
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/30'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  Ahmedabad Vendors
                </button>

              </>
            )}

            <button
              onClick={() => scrollTo('business-model')}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-amber-200 hover:bg-slate-800/30 flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-4 h-4" />
              Startup Model
            </button>

          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">

            {event && (
              <div
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                  isOverBudget
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}
              >

                <span
                  className={`w-2 h-2 rounded-full ${
                    isOverBudget
                      ? 'bg-red-500 animate-ping'
                      : 'bg-emerald-500'
                  }`}
                />

                <span>
                  {event.eventType}: {formatINR(event.totalBudget)}
                </span>

              </div>
            )}

            {/* Demo */}
            <button
              onClick={onLoadDemo}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-400 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Load instant ₹50,000 Ahmedabad Birthday Demo"
            >

              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />

              <span>⚡ DEMO EVENT</span>

            </button>

            {event ? (

              <div className="flex items-center gap-1.5">

                <button
                  onClick={onSaveEvent}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-[#111718] hover:bg-[#182020] border border-slate-700 transition-all flex items-center gap-1.5 active:scale-95"
                  title="Save event to localStorage"
                >

                  <Save className="w-3.5 h-3.5 text-amber-400" />

                  <span>
                    {hasSavedChanges ? 'Save Plan' : 'Saved'}
                  </span>

                </button>

                <button
                  onClick={onResetEvent}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-all"
                  title="Reset Event"
                >

                  <RotateCcw className="w-3.5 h-3.5" />

                </button>

              </div>

            ) : (

              <button
                onClick={onOpenCreateModal}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#080a0b] bg-gradient-to-r from-[#c99a42] via-[#f0d58a] to-[#c99a42] hover:from-[#ddb35e] hover:via-[#ffe7a6] hover:to-[#ddb35e] shadow-md shadow-amber-900/25 transition-all flex items-center gap-1.5 active:scale-95"
              >

                <PlusCircle className="w-4 h-4" />

                <span>PLAN MY EVENT</span>

              </button>

            )}

          </div>

          {/* Mobile Hamburger */}
          <div className="flex lg:hidden items-center gap-2">

            <button
              onClick={onLoadDemo}
              className="sm:hidden px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 active:scale-95 flex items-center gap-1"
            >

              <Zap className="w-3 h-3 fill-amber-300" />

              <span>⚡ DEMO</span>

            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-amber-200 bg-[#111718]/80 border border-slate-700"
              aria-label="Toggle navigation menu"
            >

              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}

            </button>

          </div>

        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (

        <div className="lg:hidden bg-[#090d0e] border-b border-amber-900/20 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-4 duration-200">

          {event && (

            <div className="p-3 mb-2 rounded-xl bg-[#0e1314]/90 border border-slate-800 flex items-center justify-between">

              <div>

                <p className="text-xs text-slate-400">
                  Current Active Event
                </p>

                <p className="text-sm font-bold text-white">
                  {event.eventType} ({event.guestCount} Guests)
                </p>

              </div>

              <div className="text-right">

                <p className="text-xs text-slate-400">
                  Budget
                </p>

                <p className="text-sm font-extrabold text-amber-400">
                  {formatINR(event.totalBudget)}
                </p>

              </div>

            </div>

          )}

          <div className="grid grid-cols-1 gap-1">

            <button
              onClick={() => scrollTo('hero-section')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-amber-200 hover:bg-slate-800"
            >
              🏠 Home & Overview
            </button>

            {event && (
              <>

                <button
                  onClick={() => scrollTo('dashboard-section')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                >
                  📊 Budget Dashboard & Engine
                </button>

                <button
                  onClick={() => scrollTo('planners-section')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-amber-200 hover:bg-slate-800"
                >
                  🍽️ Category Planners (Food, Decor, DJ...)
                </button>

                <button
                  onClick={() => scrollTo('vendors-section')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-amber-200 hover:bg-slate-800"
                >
                  📍 Ahmedabad Local Vendors & Quotes
                </button>

              </>
            )}

            <button
              onClick={() => scrollTo('business-model')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-amber-200 hover:bg-slate-800"
            >
              💼 Startup Business Model
            </button>

          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCreateModal();
              }}
              className="w-full py-2.5 rounded-xl text-center text-sm font-bold text-[#080a0b] bg-gradient-to-r from-[#c99a42] via-[#f0d58a] to-[#c99a42] shadow-md shadow-amber-900/25"
            >

              {event ? '+ CREATE NEW EVENT' : 'PLAN MY EVENT'}

            </button>

            {event && (

              <div className="grid grid-cols-2 gap-2">

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSaveEvent();
                  }}
                  className="py-2 rounded-xl text-xs font-semibold text-slate-200 bg-[#111718] border border-slate-700 text-center"
                >
                  Save Local Plan
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onResetEvent();
                  }}
                  className="py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-800/40 text-center"
                >
                  Reset All
                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </header>
  );
};
