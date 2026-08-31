import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Users,
  MapPin,
  IndianRupee,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

import {
  EventType,
  Priority,
  EventState,
} from '../../types';

import {
  calculateSmartAllocations,
} from '../../utils/budgetCalculations';

import {
  autoSelectEventPlan,
} from '../../utils/autoPlan';

import {
  checkEventFeasibility,
} from '../../utils/feasibility';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newEvent: EventState) => void;
  onLoadDemo: () => void;
}

const EVENT_TYPES: EventType[] = [
  'Birthday',
  'Wedding',
  'Engagement',
  'Anniversary',
  'Garba',
  'School / College Event',
  'Corporate Event',
  'House Party',
  'Baby Shower',
  'Other',
];

const PRIORITIES: {
  id: Priority;
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    id: 'Balanced',
    label: 'Balanced',
    desc: 'Keep spending reasonably balanced across categories',
    icon: '⚖️',
  },
  {
    id: 'Food',
    label: 'Food & Catering',
    desc: 'Protect more budget for catering and guest dining',
    icon: '🍽️',
  },
  {
    id: 'Venue',
    label: 'Venue',
    desc: 'Reserve more money for the event space',
    icon: '🏛️',
  },
  {
    id: 'Decoration',
    label: 'Decoration',
    desc: 'Prioritize theme, backdrop and visual setup',
    icon: '✨',
  },
  {
    id: 'DJ / Music',
    label: 'Music & Entertainment',
    desc: 'Protect more budget for sound and entertainment',
    icon: '🎧',
  },
  {
    id: 'Photography',
    label: 'Photography',
    desc: 'Prioritize photo and video coverage',
    icon: '📸',
  },
];

export const CreateEventModal: React.FC<
  CreateEventModalProps
> = ({
  isOpen,
  onClose,
  onSubmit,
  onLoadDemo,
}) => {
  const tomorrow = new Date();

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  const defaultDateStr =
    tomorrow
      .toISOString()
      .split('T')[0];

  const [eventType, setEventType] =
    useState<EventType>('Birthday');

  const [totalBudget, setTotalBudget] =
    useState<string>('50000');

  const [guestCount, setGuestCount] =
    useState<string>('50');

  const [city, setCity] =
    useState<string>('Ahmedabad');

  const [eventDate, setEventDate] =
    useState<string>(defaultDateStr);

  const [priority, setPriority] =
    useState<Priority>('Balanced');

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  if (!isOpen) {
    return null;
  }

  const clearErrors = (...keys: string[]) => {
    setErrors(prev => {
      const next = { ...prev };

      keys.forEach(key => {
        delete next[key];
      });

      return next;
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    const budgetNum = Number(totalBudget);

    if (
      !totalBudget ||
      isNaN(budgetNum) ||
      budgetNum <= 0
    ) {
      errs.totalBudget =
        'Please enter a valid positive budget amount.';
    } else if (budgetNum < 5000) {
      errs.totalBudget =
        'Minimum supported event budget is ₹5,000.';
    } else if (budgetNum > 50000000) {
      errs.totalBudget =
        'Maximum supported event budget is ₹5,00,00,000.';
    }

    const guestNum = Number(guestCount);

    if (
      !guestCount ||
      isNaN(guestNum) ||
      guestNum <= 0
    ) {
      errs.guestCount =
        'Guest count must be at least 1 person.';
    } else if (guestNum > 5000) {
      errs.guestCount =
        'Maximum supported guest count is 5,000.';
    }

    if (!city.trim()) {
      errs.city =
        'Please enter your event city or area.';
    }

    if (!eventDate) {
      errs.eventDate =
        'Please select a valid event date.';
    } else {
      const selected = new Date(eventDate);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selected < today) {
        errs.eventDate =
          'Event date cannot be in the past.';
      }
    }

    if (
      !errs.totalBudget &&
      !errs.guestCount
    ) {
      const feasibility =
        checkEventFeasibility({
          eventType,
          budget: budgetNum,
          guestCount: guestNum,
        });

      if (!feasibility.feasible) {
        errs.feasibility =
          feasibility.message;
      }
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleCreate = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const budgetNum = Number(totalBudget);
    const guestNum = Number(guestCount);

    const allocations =
      calculateSmartAllocations(
        eventType,
        budgetNum,
        guestNum,
        priority
      );

    const autoPlan =
      autoSelectEventPlan({
        eventType,
        guestCount: guestNum,
        priority,
        allocations,
      });

    const newEvent: EventState = {
      id: `event_${Date.now()}`,

      title: `${eventType} in ${city}`,

      eventType,

      totalBudget: budgetNum,

      guestCount: guestNum,

      city: city.trim(),

      eventDate,

      priority,

      allocations,

      ...autoPlan,

      miscItems: [
        {
          id: 'misc_cake',
          name: 'Celebration Cake',
          price: 2000,
          selected: true,
        },
      ],

      quotes: [],

      appliedQuoteIds: {
        food: undefined,
        venue: undefined,
        decoration: undefined,
        dj: undefined,
        photography: undefined,
        misc: undefined,
        buffer: undefined,
      },

      savedAt: new Date().toISOString(),
    };

    onSubmit(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#17130d]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl my-6 overflow-hidden rounded-[28px] border border-[#d9c9ad] bg-[#f8f3e9] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">

        {/* HEADER */}
        <div className="relative flex items-center justify-between gap-4 border-b border-[#ded1ba] bg-gradient-to-r from-[#f3eadb] via-[#fbf7ef] to-[#efe3d0] px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#caa96c]/40 bg-[#ead8b8]/60 shadow-sm">
              <Sparkles className="h-5 w-5 text-[#9a6e2f]" />
            </div>

            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a6e2f]">
                EventBudget Planner
              </p>

              <h2 className="font-heading text-xl font-extrabold tracking-tight text-[#211a12] sm:text-2xl">
                Plan Your Celebration
              </h2>

              <p className="mt-1 text-xs leading-relaxed text-[#786b58]">
                Tell us your budget, guests and priorities. We’ll build a practical starting plan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-xl border border-transparent p-2.5 text-[#776b5b] transition-all hover:border-[#d7c7aa] hover:bg-white/60 hover:text-[#201a12]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleCreate}
          className="max-h-[80vh] space-y-7 overflow-y-auto p-5 sm:p-8"
        >
          {/* DEMO */}
          <div className="flex flex-col gap-3 rounded-2xl border border-[#d7bd8c] bg-[#f2e6cf]/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#6d4a19]">
                <Sparkles className="h-3.5 w-3.5" />
                Quick Demo
              </div>

              <p className="mt-1 text-xs leading-relaxed text-[#806b4d]">
                Open a pre-configured ₹50,000 Ahmedabad birthday plan instantly.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onLoadDemo();
              }}
              className="shrink-0 rounded-xl bg-[#221c14] px-4 py-2.5 text-xs font-extrabold text-[#f6e6c8] shadow-md transition-all hover:-translate-y-0.5 hover:bg-black active:translate-y-0"
            >
              Load Demo
            </button>
          </div>

          {/* EVENT TYPE */}
          <section>
            <label className="mb-3 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#675c4d]">
              1. Event Type
              <span className="ml-1 text-[#a45b52]">*</span>
            </label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {EVENT_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setEventType(type);
                    clearErrors('feasibility');
                  }}
                  className={`rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition-all ${
                    eventType === type
                      ? 'border-[#9f7a40] bg-[#241d14] text-[#f7ead2] shadow-md'
                      : 'border-[#dfd3c1] bg-white/55 text-[#695e4e] hover:border-[#c5ae85] hover:bg-white hover:text-[#272016]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          {/* BUDGET + GUESTS */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* BUDGET */}
            <div>
              <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#675c4d]">
                2. Total Budget
                <span className="ml-1 text-[#a45b52]">*</span>
              </label>

              <div className="relative">
                <IndianRupee className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9f7a40]" />

                <input
                  type="number"
                  min="5000"
                  max="50000000"
                  step="1000"
                  value={totalBudget}
                  onChange={e => {
                    setTotalBudget(e.target.value);
                    clearErrors(
                      'totalBudget',
                      'feasibility'
                    );
                  }}
                  placeholder="e.g. 50000"
                  className="w-full rounded-xl border border-[#d8cbb8] bg-white/70 py-3.5 pl-10 pr-4 text-sm font-bold text-[#241d14] outline-none transition-all placeholder:text-[#aaa08f] focus:border-[#a17a3c] focus:ring-2 focus:ring-[#d9bd8b]/30"
                />
              </div>

              {errors.totalBudget ? (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#a44e47]">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.totalBudget}
                </p>
              ) : (
                <p className="mt-2 text-[11px] text-[#918572]">
                  Supported range: ₹5,000 – ₹5,00,00,000
                </p>
              )}
            </div>

            {/* GUESTS */}
            <div>
              <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#675c4d]">
                3. Number of Guests
                <span className="ml-1 text-[#a45b52]">*</span>
              </label>

              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9f7a40]" />

                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={guestCount}
                  onChange={e => {
                    setGuestCount(e.target.value);
                    clearErrors(
                      'guestCount',
                      'feasibility'
                    );
                  }}
                  placeholder="e.g. 50"
                  className="w-full rounded-xl border border-[#d8cbb8] bg-white/70 py-3.5 pl-10 pr-4 text-sm font-bold text-[#241d14] outline-none transition-all placeholder:text-[#aaa08f] focus:border-[#a17a3c] focus:ring-2 focus:ring-[#d9bd8b]/30"
                />
              </div>

              {errors.guestCount ? (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#a44e47]">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.guestCount}
                </p>
              ) : (
                <p className="mt-2 text-[11px] text-[#918572]">
                  Maximum supported guest count: 5,000
                </p>
              )}
            </div>
          </div>

          {/* CITY + DATE */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* CITY */}
            <div>
              <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#675c4d]">
                4. City / Area
                <span className="ml-1 text-[#a45b52]">*</span>
              </label>

              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9f7a40]" />

                <input
                  type="text"
                  value={city}
                  onChange={e => {
                    setCity(e.target.value);
                    clearErrors('city');
                  }}
                  placeholder="Ahmedabad, Gujarat"
                  className="w-full rounded-xl border border-[#d8cbb8] bg-white/70 py-3.5 pl-10 pr-4 text-sm font-semibold text-[#241d14] outline-none transition-all placeholder:text-[#aaa08f] focus:border-[#a17a3c] focus:ring-2 focus:ring-[#d9bd8b]/30"
                />
              </div>

              {errors.city ? (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#a44e47]">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.city}
                </p>
              ) : (
                <p className="mt-2 text-[11px] text-[#918572]">
                  Current prototype pricing is focused on Ahmedabad.
                </p>
              )}
            </div>

            {/* DATE */}
            <div>
              <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#675c4d]">
                5. Event Date
                <span className="ml-1 text-[#a45b52]">*</span>
              </label>

              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9f7a40]" />

                <input
                  type="date"
                  value={eventDate}
                  min={defaultDateStr}
                  onChange={e => {
                    setEventDate(e.target.value);
                    clearErrors('eventDate');
                  }}
                  className="w-full rounded-xl border border-[#d8cbb8] bg-white/70 py-3.5 pl-10 pr-4 text-sm font-semibold text-[#241d14] outline-none transition-all focus:border-[#a17a3c] focus:ring-2 focus:ring-[#d9bd8b]/30"
                />
              </div>

              {errors.eventDate && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#a44e47]">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.eventDate}
                </p>
              )}
            </div>
          </div>

          {/* PRIORITY */}
          <section>
            <div className="mb-3">
              <label className="block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#675c4d]">
                6. What matters most?
                <span className="ml-1 text-[#a45b52]">*</span>
              </label>

              <p className="mt-1 text-[11px] leading-relaxed text-[#918572]">
                Your selected priority receives extra protection when the budget is allocated.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {PRIORITIES.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setPriority(p.id)
                  }
                  className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                    priority === p.id
                      ? 'border-[#9f7a40] bg-[#efe1c6] shadow-sm ring-1 ring-[#caa96c]/40'
                      : 'border-[#ddd0bd] bg-white/50 hover:border-[#c4ac83] hover:bg-white/80'
                  }`}
                >
                  <span className="mt-0.5 shrink-0 text-xl">
                    {p.icon}
                  </span>

                  <div>
                    <p
                      className={`text-xs font-extrabold ${
                        priority === p.id
                          ? 'text-[#6d4a19]'
                          : 'text-[#33291e]'
                      }`}
                    >
                      {p.label}
                    </p>

                    <p className="mt-1 text-[11px] leading-relaxed text-[#817461]">
                      {p.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* PLANNING LOGIC NOTE */}
          <div className="rounded-2xl border border-[#ddd0bd] bg-white/45 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#8f6a34]" />

              <div>
                <p className="text-xs font-extrabold text-[#33291e]">
                  Constraint-Based Planning
                </p>

                <p className="mt-1 text-[11px] leading-relaxed text-[#817461]">
                  EventBudget uses your event type, guest count, total budget and selected priority to create a practical starting allocation.
                </p>
              </div>
            </div>
          </div>

          {/* FEASIBILITY WARNING */}
          {errors.feasibility && (
            <div className="rounded-2xl border border-[#d6a49d] bg-[#f6e3df] p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#9d4d45]" />

                <div>
                  <p className="text-sm font-extrabold text-[#773b35]">
                    This plan may not be realistically feasible
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-[#8d554f]">
                    {errors.feasibility}
                  </p>

                  <p className="mt-2 text-[11px] leading-relaxed text-[#9b6b65]">
                    Try increasing the budget, reducing the guest count, or choosing a different event setup.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col items-center justify-end gap-3 border-t border-[#ded1ba] pt-5 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl px-5 py-3 text-sm font-bold text-[#746957] transition-all hover:bg-[#eee4d5] hover:text-[#2c241a] sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#211a12] px-7 py-3.5 text-sm font-extrabold text-[#f7e7ca] shadow-[0_10px_25px_rgba(46,34,19,0.20)] transition-all hover:-translate-y-0.5 hover:bg-black active:translate-y-0 sm:w-auto"
            >
              Build My Event Plan
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
