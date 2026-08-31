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
    label: 'Balanced Plan',
    desc: 'Equal distribution across all categories',
    icon: '⚖️',
  },
  {
    id: 'Food',
    label: 'Food & Dining Focus',
    desc: 'Top tier catering, live counters & desserts',
    icon: '🍽️',
  },
  {
    id: 'Venue',
    label: 'Grand Venue Focus',
    desc: 'Premium banquet hall or sprawling lawns',
    icon: '🏰',
  },
  {
    id: 'Decoration',
    label: 'Aesthetic Decor Focus',
    desc: 'Floral arches, theme backdrop & lighting',
    icon: '✨',
  },
  {
    id: 'DJ / Music',
    label: 'DJ & Sound Focus',
    desc: 'High-energy sound, moving lights & concert vibes',
    icon: '🎧',
  },
  {
    id: 'Photography',
    label: 'Photography Focus',
    desc: 'Candid shots, drone & Instagram reels crew',
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

  const [
    eventType,
    setEventType,
  ] = useState<EventType>(
    'Birthday'
  );

  const [
    totalBudget,
    setTotalBudget,
  ] = useState<string>(
    '50000'
  );

  const [
    guestCount,
    setGuestCount,
  ] = useState<string>(
    '50'
  );

  const [
    city,
    setCity,
  ] = useState<string>(
    'Ahmedabad'
  );

  const [
    eventDate,
    setEventDate,
  ] = useState<string>(
    defaultDateStr
  );

  const [
    priority,
    setPriority,
  ] = useState<Priority>(
    'Balanced'
  );

  const [
    errors,
    setErrors,
  ] = useState<
    Record<string, string>
  >({});

  if (!isOpen) {
    return null;
  }

  const validate =
    (): boolean => {
      const errs:
        Record<string, string> =
        {};

      const budgetNum =
        Number(totalBudget);

      if (
        !totalBudget ||
        isNaN(budgetNum) ||
        budgetNum <= 0
      ) {
        errs.totalBudget =
          'Please enter a valid positive budget amount.';
      } else if (
        budgetNum < 5000
      ) {
        errs.totalBudget =
          'Minimum realistic event budget is ₹5,000.';
      }

      const guestNum =
        Number(guestCount);

      if (
        !guestCount ||
        isNaN(guestNum) ||
        guestNum <= 0
      ) {
        errs.guestCount =
          'Guest count must be at least 1 person.';
      } else if (
        guestNum > 5000
      ) {
        errs.guestCount =
          'Maximum supported guest count is 5,000.';
      }

      if (
        !city.trim()
      ) {
        errs.city =
          'Please enter your event city / area.';
      }

      if (!eventDate) {
        errs.eventDate =
          'Please select a valid event date.';
      } else {
        const selected =
          new Date(eventDate);

        const today =
          new Date();

        today.setHours(
          0,
          0,
          0,
          0
        );

        if (
          selected < today
        ) {
          errs.eventDate =
            'Event date cannot be in the past.';
        }
      }

      /*
       * FEASIBILITY ENGINE
       *
       * Only run when budget and
       * guest-count inputs themselves
       * are valid.
       */
      if (
        !errs.totalBudget &&
        !errs.guestCount
      ) {
        const feasibility =
          checkEventFeasibility({
            eventType,
            budget: budgetNum,
            guestCount:
              guestNum,
          });

        if (
          !feasibility.feasible
        ) {
          errs.feasibility =
            feasibility.message;
        }
      }

      setErrors(errs);

      return (
        Object.keys(errs)
          .length === 0
      );
    };

  const handleCreate = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const budgetNum =
      Number(totalBudget);

    const guestNum =
      Number(guestCount);

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
        guestCount:
          guestNum,
        priority,
        allocations,
      });

    const newEvent:
      EventState = {
      id:
        `event_${Date.now()}`,

      title:
        `${eventType} in ${city}`,

      eventType,

      totalBudget:
        budgetNum,

      guestCount:
        guestNum,

      city:
        city.trim(),

      eventDate,

      priority,

      allocations,

      ...autoPlan,

      miscItems: [
        {
          id: 'misc_cake',
          name:
            'Celebration Cake',
          price: 2000,
          selected: true,
        },
      ],

      quotes: [],

      appliedQuoteIds: {
        food: undefined,
        venue: undefined,
        decoration:
          undefined,
        dj: undefined,
        photography:
          undefined,
        misc: undefined,
        buffer: undefined,
      },

      savedAt:
        new Date()
          .toISOString(),
    };

    onSubmit(newEvent);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">

      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6">

        {/* HEADER */}

        <div className="relative px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">

              <Sparkles className="w-5 h-5 text-purple-400" />

            </div>

            <div>

              <h2 className="text-xl font-bold text-white font-heading">
                Plan Your Celebration
              </h2>

              <p className="text-xs text-slate-400">
                Set your budget & let our Smart Engine allocate every rupee
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={
            handleCreate
          }
          className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto"
        >

          {/* QUICK DEMO */}

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">

            <div className="text-xs text-amber-200">

              <span className="font-bold">
                Judge / Fast Demo?
              </span>{' '}

              Load our pre-configured ₹50,000 Ahmedabad Birthday Plan in 1-click.

            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onLoadDemo();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs hover:bg-amber-300 transition-all shrink-0 active:scale-95 shadow"
            >
              ⚡ Load Demo
            </button>

          </div>

          {/* EVENT TYPE */}

          <div>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">

              1. Event Type{' '}

              <span className="text-rose-400">
                *
              </span>

            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

              {EVENT_TYPES.map(
                type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setEventType(
                        type
                      );

                      if (
                        errors.feasibility
                      ) {
                        setErrors(
                          prev => {
                            const next = {
                              ...prev,
                            };

                            delete next.feasibility;

                            return next;
                          }
                        );
                      }
                    }}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                      eventType ===
                      type
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-md shadow-purple-950'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {type}
                  </button>
                )
              )}

            </div>

          </div>

          {/* BUDGET + GUESTS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* BUDGET */}

            <div>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">

                2. Total Budget (₹){' '}

                <span className="text-rose-400">
                  *
                </span>

              </label>

              <div className="relative">

                <IndianRupee className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                <input
                  type="number"
                  min="5000"
                  step="1000"
                  value={
                    totalBudget
                  }
                  onChange={e => {
                    setTotalBudget(
                      e.target.value
                    );

                    if (
                      errors.totalBudget ||
                      errors.feasibility
                    ) {
                      setErrors(
                        prev => {
                          const next = {
                            ...prev,
                          };

                          delete next.totalBudget;
                          delete next.feasibility;

                          return next;
                        }
                      );
                    }
                  }}
                  placeholder="e.g. 50000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white font-semibold text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />

              </div>

              {errors.totalBudget ? (

                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">

                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />

                  {
                    errors.totalBudget
                  }

                </p>

              ) : (

                <p className="mt-1 text-[11px] text-slate-500">
                  Suggested: ₹20,000 to ₹10,00,000
                </p>

              )}

            </div>

            {/* GUESTS */}

            <div>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">

                3. Number of Guests{' '}

                <span className="text-rose-400">
                  *
                </span>

              </label>

              <div className="relative">

                <Users className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={
                    guestCount
                  }
                  onChange={e => {
                    setGuestCount(
                      e.target.value
                    );

                    if (
                      errors.guestCount ||
                      errors.feasibility
                    ) {
                      setErrors(
                        prev => {
                          const next = {
                            ...prev,
                          };

                          delete next.guestCount;
                          delete next.feasibility;

                          return next;
                        }
                      );
                    }
                  }}
                  placeholder="e.g. 50"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white font-semibold text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />

              </div>

              {errors.guestCount && (

                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">

                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />

                  {
                    errors.guestCount
                  }

                </p>

              )}

            </div>

          </div>

          {/* CITY + DATE */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* CITY */}

            <div>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">

                4. City / Area{' '}

                <span className="text-rose-400">
                  *
                </span>

              </label>

              <div className="relative">

                <MapPin className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                <input
                  type="text"
                  value={city}
                  onChange={e => {
                    setCity(
                      e.target.value
                    );

                    if (
                      errors.city
                    ) {
                      setErrors(
                        prev => {
                          const next = {
                            ...prev,
                          };

                          delete next.city;

                          return next;
                        }
                      );
                    }
                  }}
                  placeholder="Ahmedabad, Gujarat"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white font-medium text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />

              </div>

              {errors.city ? (

                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">

                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />

                  {
                    errors.city
                  }

                </p>

              ) : (

                <p className="mt-1 text-[11px] text-slate-500">
                  Default demo market: Ahmedabad
                </p>

              )}

            </div>

            {/* DATE */}

            <div>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">

                5. Event Date{' '}

                <span className="text-rose-400">
                  *
                </span>

              </label>

              <div className="relative">

                <Calendar className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                <input
                  type="date"
                  value={
                    eventDate
                  }
                  min={
                    defaultDateStr
                  }
                  onChange={e => {
                    setEventDate(
                      e.target.value
                    );

                    if (
                      errors.eventDate
                    ) {
                      setErrors(
                        prev => {
                          const next = {
                            ...prev,
                          };

                          delete next.eventDate;

                          return next;
                        }
                      );
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white font-medium text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />

              </div>

              {errors.eventDate && (

                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">

                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />

                  {
                    errors.eventDate
                  }

                </p>

              )}

            </div>

          </div>

          {/* PRIORITY */}

          <div>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">

              6. Main Priority (Directs Smart Allocation){' '}

              <span className="text-rose-400">
                *
              </span>

            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">

              {PRIORITIES.map(
                p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      setPriority(
                        p.id
                      )
                    }
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      priority ===
                      p.id
                        ? 'bg-purple-600/25 border-purple-500 ring-1 ring-purple-500 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >

                    <span className="text-xl shrink-0 mt-0.5">
                      {p.icon}
                    </span>

                    <div>

                      <p
                        className={`text-xs font-bold ${
                          priority ===
                          p.id
                            ? 'text-purple-300'
                            : 'text-slate-200'
                        }`}
                      >
                        {p.label}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                        {p.desc}
                      </p>

                    </div>

                  </button>
                )
              )}

            </div>

          </div>
                    {/* FEASIBILITY WARNING */}

          {errors.feasibility && (

            <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4">

              <div className="flex items-start gap-3">

                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />

                <div>

                  <p className="text-sm font-bold text-rose-300">
                    Event Budget Not Realistically Feasible
                  </p>

                  <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">
                    {errors.feasibility}
                  </p>

                </div>

              </div>

            </div>

          )}

          {/* ACTION BUTTONS */}

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-sm hover:from-purple-500 hover:to-pink-500 transition-all active:scale-95 shadow-lg shadow-purple-950/40 flex items-center justify-center gap-2"
            >
              Create My Event Plan

              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

 
