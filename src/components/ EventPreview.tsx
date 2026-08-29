import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  UtensilsCrossed,
  Music,
  Camera,
  MapPin,
  WandSparkles,
} from 'lucide-react';

type PreviewLevel = 'Simple' | 'Standard' | 'Premium' | 'Luxury';

const previewData: Record<
  PreviewLevel,
  {
    min: number;
    title: string;
    subtitle: string;
    decor: string;
    food: string;
    entertainment: string;
    photography: string;
    guests: string;
    gradient: string;
    accent: string;
  }
> = {
  Simple: {
    min: 30000,
    title: 'INTIMATE & SMART',
    subtitle: 'A clean celebration focused on the essentials.',
    decor: 'Minimal backdrop + balloons',
    food: 'Essential multi-item menu',
    entertainment: 'Bluetooth / basic sound setup',
    photography: 'Basic photography',
    guests: '30–50 Guests',
    gradient:
      'linear-gradient(135deg, #f6ead4 0%, #e8d2aa 50%, #c49a57 100%)',
    accent: '#8b6329',
  },

  Standard: {
    min: 50000,
    title: 'BALANCED CELEBRATION',
    subtitle: 'A polished event without unnecessary overspending.',
    decor: 'Styled backdrop + entrance decor',
    food: 'Standard catering experience',
    entertainment: 'DJ + sound setup',
    photography: 'Event photography',
    guests: '40–70 Guests',
    gradient:
      'linear-gradient(135deg, #f7e8c8 0%, #d8b56b 45%, #8f6528 100%)',
    accent: '#765018',
  },

  Premium: {
    min: 100000,
    title: 'PREMIUM EXPERIENCE',
    subtitle: 'More visual impact, entertainment and guest comfort.',
    decor: 'Premium themed decoration',
    food: 'Expanded premium menu',
    entertainment: 'Professional DJ + lighting',
    photography: 'Photo + cinematic coverage',
    guests: '70–150 Guests',
    gradient:
      'linear-gradient(135deg, #312519 0%, #9c742f 48%, #efd792 100%)',
    accent: '#c9973d',
  },

  Luxury: {
    min: 200000,
    title: 'LUXURY CELEBRATION',
    subtitle: 'A high-impact experience designed to impress.',
    decor: 'Luxury stage + immersive decor',
    food: 'Premium catering experience',
    entertainment: 'DJ + lights + entertainment',
    photography: 'Premium photo & video team',
    guests: '100–250+ Guests',
    gradient:
      'linear-gradient(135deg, #17120d 0%, #5f4219 48%, #d8ad54 100%)',
    accent: '#e0bd69',
  },
};

const getLevel = (budget: number): PreviewLevel => {
  if (budget >= 200000) return 'Luxury';
  if (budget >= 100000) return 'Premium';
  if (budget >= 50000) return 'Standard';
  return 'Simple';
};

const formatBudget = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const EventPreview: React.FC = () => {
  const [budget, setBudget] = useState(50000);

  const level = getLevel(budget);
  const data = previewData[level];

  return (
    <section
      id="event-preview"
      className="relative overflow-hidden border-t border-[#b68b3c]/20 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b7832b]/30 bg-white/50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#8b6329]">
            <WandSparkles className="h-4 w-4" />
            Smart Event Visualizer
          </div>

          <h2 className="text-4xl font-black tracking-tight text-[#211b15] sm:text-5xl">
            WHAT COULD YOUR EVENT
            <span className="block text-[#ad7927]">LOOK LIKE?</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[#62584d]">
            Move the budget slider and see how the overall event experience
            can change.
          </p>
        </div>

        {/* Budget Slider */}
        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-[#b68b3c]/25 bg-white/60 p-6 shadow-lg backdrop-blur-sm sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8b6329]">
                Explore Budget
              </p>

              <p className="mt-1 text-3xl font-black text-[#211b15]">
                {formatBudget(budget)}
              </p>
            </div>

            <div className="rounded-full bg-[#211b15] px-4 py-2 text-sm font-black text-[#f4d991]">
              {level}
            </div>
          </div>

          <input
            type="range"
            min="30000"
            max="250000"
            step="5000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-7 w-full cursor-pointer accent-[#ad7927]"
          />

          <div className="mt-2 flex justify-between text-xs font-bold text-[#766858]">
            <span>₹30K</span>
            <span>₹50K</span>
            <span>₹1L</span>
            <span>₹2.5L</span>
          </div>
        </div>

        {/* Main Preview */}
        <div className="mt-8 overflow-hidden rounded-[32px] border border-[#b68b3c]/25 bg-white/60 shadow-xl">

          {/* Visual */}
          <div
            className="relative flex min-h-[330px] items-center justify-center overflow-hidden p-8 text-center sm:min-h-[390px]"
            style={{ background: data.gradient }}
          >
            <div className="absolute left-[12%] top-[18%] h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-[10%] right-[10%] h-44 w-44 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 max-w-2xl">

              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur-md">
                <Sparkles className="h-8 w-8 text-white" />
              </div>

              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/75">
                Your Event Preview
              </p>

              <h3 className="mt-3 text-4xl font-black text-white sm:text-6xl">
                {level.toUpperCase()}
              </h3>

              <p className="mt-3 text-xl font-bold text-white">
                {data.title}
              </p>

              <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-white/80 sm:text-base">
                {data.subtitle}
              </p>

              <div className="mt-7 inline-flex rounded-full border border-white/30 bg-black/20 px-5 py-2 text-sm font-black text-white backdrop-blur-md">
                {formatBudget(budget)} Event
              </div>

            </div>
          </div>

          {/* Features */}
          <div className="grid gap-px bg-[#b68b3c]/15 sm:grid-cols-2 lg:grid-cols-5">

            <PreviewItem
              icon={<Users />}
              label="Guest Experience"
              value={data.guests}
            />

            <PreviewItem
              icon={<MapPin />}
              label="Decoration"
              value={data.decor}
            />

            <PreviewItem
              icon={<UtensilsCrossed />}
              label="Food"
              value={data.food}
            />

            <PreviewItem
              icon={<Music />}
              label="Entertainment"
              value={data.entertainment}
            />

            <PreviewItem
              icon={<Camera />}
              label="Photography"
              value={data.photography}
            />

          </div>
        </div>

        {/* Explanation */}
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#b7832b]/20 bg-[#fffaf0]/70 p-5 text-center">
          <p className="text-sm font-semibold leading-relaxed text-[#62584d]">
            <span className="font-black text-[#8b6329]">
              EventBudget Insight:
            </span>{' '}
            Increasing the budget doesn't simply make the event more expensive.
            It changes where money can be invested across guest experience,
            food, decoration, entertainment and memories.
          </p>
        </div>

      </div>
    </section>
  );
};

const PreviewItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="bg-[#fffaf2] p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#211b15] text-[#e0bd69] [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </div>

      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#9b7228]">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold leading-snug text-[#211b15]">
        {value}
      </p>
    </div>
  );
};

export { EventPreview };