import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  PartyPopper,
  RefreshCcw,
  Sparkles,
  Zap,
} from 'lucide-react';

type Challenge = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  extraCost: number;
  fixes: {
    label: string;
    amount: number;
  }[];
};

const challenges: Challenge[] = [
  {
    id: 'extra-guests',
    emoji: '😱',
    title: '+25 SURPRISE GUESTS',
    description: 'Your guest list suddenly jumped from 50 to 75 people.',
    extraCost: 8450,
    fixes: [
      { label: 'Decoration reduced', amount: 3000 },
      { label: 'Photography optimized', amount: 2500 },
      { label: 'Venue add-ons reduced', amount: 2950 },
    ],
  },
  {
    id: 'budget-cut',
    emoji: '💸',
    title: '₹10,000 BUDGET CUT',
    description: 'Your total event budget has suddenly been reduced.',
    extraCost: 10000,
    fixes: [
      { label: 'Decoration simplified', amount: 4000 },
      { label: 'Entertainment optimized', amount: 2500 },
      { label: 'Miscellaneous reduced', amount: 3500 },
    ],
  },
  {
    id: 'dj-upgrade',
    emoji: '🎧',
    title: 'DJ UPGRADE REQUESTED',
    description: 'The party needs a stronger DJ and lighting setup.',
    extraCost: 6500,
    fixes: [
      { label: 'Venue add-ons reduced', amount: 2000 },
      { label: 'Decoration optimized', amount: 2500 },
      { label: 'Photography adjusted', amount: 2000 },
    ],
  },
  {
    id: 'instagram',
    emoji: '📸',
    title: 'MAKE IT INSTAGRAM READY',
    description: 'The client wants better decor and photography for social media.',
    extraCost: 7500,
    fixes: [
      { label: 'Venue extras reduced', amount: 2500 },
      { label: 'Food extras optimized', amount: 2000 },
      { label: 'Miscellaneous reduced', amount: 3000 },
    ],
  },
  {
    id: 'venue-increase',
    emoji: '🏛️',
    title: 'VENUE COST +20%',
    description: 'The venue increased its price at the last minute.',
    extraCost: 9000,
    fixes: [
      { label: 'Decoration reduced', amount: 3500 },
      { label: 'Photography optimized', amount: 2500 },
      { label: 'Entertainment adjusted', amount: 3000 },
    ],
  },
  {
    id: 'last-minute',
    emoji: '🎂',
    title: '₹5,000 LAST-MINUTE EXPENSE',
    description: 'An unexpected event expense has appeared one day before the celebration.',
    extraCost: 5000,
    fixes: [
      { label: 'Miscellaneous buffer used', amount: 2000 },
      { label: 'Decor extras reduced', amount: 1500 },
      { label: 'Venue add-ons reduced', amount: 1500 },
    ],
  },
  {
    id: 'vip',
    emoji: '👑',
    title: 'VIP GUESTS ARRIVING',
    description: 'A few important guests are coming and the experience needs an upgrade.',
    extraCost: 7000,
    fixes: [
      { label: 'Decoration optimized', amount: 2500 },
      { label: 'Entertainment reduced', amount: 2000 },
      { label: 'Miscellaneous adjusted', amount: 2500 },
    ],
  },
];

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const ChallengeMode: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [saved, setSaved] = useState(false);

  const baseBudget = 50000;

  const finalSpend = useMemo(() => {
    if (!challenge) return baseBudget;

    const totalSaved = challenge.fixes.reduce(
      (sum, fix) => sum + fix.amount,
      0
    );

    return baseBudget + challenge.extraCost - totalSaved;
  }, [challenge]);

  const spinChallenge = () => {
    setSaved(false);
    setIsSpinning(true);
    setChallenge(null);

    setTimeout(() => {
      const random =
        challenges[Math.floor(Math.random() * challenges.length)];

      setChallenge(random);
      setIsSpinning(false);
    }, 1400);
  };

  return (
    <section className="relative overflow-hidden border-t border-[#b68b3c]/20 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b7832b]/30 bg-white/60 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#8b6329]">
            <Zap className="h-4 w-4" />
            Interactive Judge Demo
          </div>

          <h2 className="text-4xl font-black tracking-tight text-[#211b15] sm:text-5xl">
            EVENTBUDGET
            <span className="block text-[#ad7927]">CHALLENGE MODE</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[#62584d]">
            Think your event plan is safe? Let the judge challenge it.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-[32px] border border-[#b68b3c]/25 bg-white/70 p-6 shadow-xl backdrop-blur-sm sm:p-10">

          {!challenge && (
            <div className="text-center">
              <div
                className={`mx-auto flex h-44 w-44 items-center justify-center rounded-full border-8 border-[#d6b260] bg-[#211b15] shadow-2xl transition-transform duration-700 ${
                  isSpinning ? 'rotate-[1080deg]' : ''
                }`}
              >
                <div className="text-center">
                  <Sparkles className="mx-auto h-10 w-10 text-[#e7c970]" />
                  <p className="mt-3 text-sm font-black uppercase tracking-[0.15em] text-[#f7e7bd]">
                    Challenge
                  </p>
                </div>
              </div>

              <button
                onClick={spinChallenge}
                disabled={isSpinning}
                className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#8b611f] via-[#c08b2e] to-[#8b611f] px-8 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <RefreshCcw
                  className={`h-5 w-5 ${isSpinning ? 'animate-spin' : ''}`}
                />

                {isSpinning ? 'SPINNING...' : 'SPIN THE CHALLENGE'}
              </button>

              <p className="mt-5 text-sm font-semibold text-[#766858]">
                Let the judge spin and give EventBudget a real-world problem.
              </p>
            </div>
          )}

          {challenge && !saved && (
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#211b15] text-4xl shadow-lg">
                {challenge.emoji}
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-red-700">
                Surprise Challenge
              </p>

              <h3 className="mt-2 text-3xl font-black text-[#211b15] sm:text-4xl">
                {challenge.title}
              </h3>

              <p className="mx-auto mt-4 max-w-xl text-[#62584d]">
                {challenge.description}
              </p>

              <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
                <StatCard
                  label="Original Budget"
                  value={formatINR(baseBudget)}
                />

                <StatCard
                  label="Extra Pressure"
                  value={`+${formatINR(challenge.extraCost)}`}
                  danger
                />

                <StatCard
                  label="Projected Spend"
                  value={formatINR(baseBudget + challenge.extraCost)}
                  danger
                />
              </div>

              <div className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-3 rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-red-800">
                <AlertTriangle className="h-5 w-5 shrink-0" />

                <p className="text-sm font-black">
                  EVENT WILL OVERSPEND BY {formatINR(challenge.extraCost)}
                </p>
              </div>

              <button
                onClick={() => setSaved(true)}
                className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#211b15] px-8 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#f4d991] shadow-xl transition hover:scale-105"
              >
                <Zap className="h-5 w-5" />
                SAVE MY EVENT
              </button>
            </div>
          )}

          {challenge && saved && (
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <PartyPopper className="h-10 w-10 text-emerald-700" />
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-emerald-700">
                Smart Rebalancing Complete
              </p>

              <h3 className="mt-2 text-4xl font-black text-[#211b15]">
                EVENT SAVED 🎉
              </h3>

              <p className="mx-auto mt-4 max-w-xl text-[#62584d]">
                EventBudget protected the experience and adjusted lower-priority
                spending.
              </p>

              <div className="mx-auto mt-8 max-w-2xl space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                    <span className="font-black text-[#211b15]">
                      Food Priority Protected
                    </span>
                  </div>

                  <span className="font-black text-emerald-700">SAFE</span>
                </div>

                {challenge.fixes.map((fix) => (
                  <div
                    key={fix.label}
                    className="flex items-center justify-between rounded-2xl border border-[#b68b3c]/20 bg-[#fffaf2] p-4"
                  >
                    <span className="font-bold text-[#51473d]">
                      {fix.label}
                    </span>

                    <span className="font-black text-[#9b7228]">
                      −{formatINR(fix.amount)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mx-auto mt-8 max-w-xl rounded-3xl bg-[#211b15] p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#dcb967]">
                  Final Event Spend
                </p>

                <p className="mt-2 text-4xl font-black text-white">
                  {formatINR(finalSpend)}
                </p>

                <p className="mt-2 text-sm font-bold text-emerald-300">
                  Within {formatINR(baseBudget)} budget ✅
                </p>
              </div>

              <button
                onClick={spinChallenge}
                className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[#b7832b]/30 bg-white px-5 py-3 text-sm font-black text-[#765018] transition hover:bg-[#fff8e8]"
              >
                <RefreshCcw className="h-4 w-4" />
                TRY ANOTHER CHALLENGE
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

const StatCard = ({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) => {
  return (
    <div className="rounded-2xl border border-[#b68b3c]/20 bg-[#fffaf2] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8b6329]">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-black ${
          danger ? 'text-red-700' : 'text-[#211b15]'
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export { ChallengeMode };
