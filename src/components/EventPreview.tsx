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

import simpleImage from '../assets/event-preview/simple.png';
import standardImage from '../assets/event-preview/standard.png';
import premiumImage from '../assets/event-preview/premium.png';
import luxuryImage from '../assets/event-preview/luxury.png';

type PreviewLevel = 'Simple' | 'Standard' | 'Premium' | 'Luxury';

const previewData: Record<
  PreviewLevel,
  {
    title: string;
    subtitle: string;
    decor: string;
    food: string;
    entertainment: string;
    photography: string;
    guests: string;
    image: string;
  }
> = {
  Simple: {
    title: 'INTIMATE & SMART',
    subtitle: 'A clean celebration focused on the essentials.',
    decor: 'Minimal backdrop + balloons',
    food: 'Essential multi-item menu',
    entertainment: 'Basic music setup',
    photography: 'Basic photography',
    guests: '30–50 Guests',
    image: simpleImage,
  },

  Standard: {
    title: 'BALANCED CELEBRATION',
    subtitle: 'A polished event without unnecessary overspending.',
    decor: 'Styled backdrop + entrance decor',
    food: 'Standard catering experience',
    entertainment: 'DJ + sound setup',
    photography: 'Event photography',
    guests: '40–70 Guests',
    image: standardImage,
  },

  Premium: {
    title: 'PREMIUM EXPERIENCE',
    subtitle: 'More visual impact, entertainment and guest comfort.',
    decor: 'Premium themed decoration',
    food: 'Expanded premium menu',
    entertainment: 'Professional DJ + lighting',
    photography: 'Photo + cinematic coverage',
    guests: '70–150 Guests',
    image: premiumImage,
  },

  Luxury: {
    title: 'LUXURY CELEBRATION',
    subtitle: 'A high-impact experience designed to impress.',
    decor: 'Luxury stage + immersive decor',
    food: 'Premium catering experience',
    entertainment: 'DJ + lights + entertainment',
    photography: 'Premium photo & video team',
    guests: '100–250+ Guests',
    image: luxuryImage,
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

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b7832b]/30 bg-white/60 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#8b6329]">
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

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-[#b68b3c]/25 bg-white/70 p-6 shadow-lg backdrop-blur-sm sm:p-8">
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

        <div className="mt-8 overflow-hidden rounded-[32px] border border-[#b68b3c]/25 bg-white/60 shadow-2xl">

          <div className="relative min-h-[360px] overflow-hidden sm:min-h-[470px]">

            <img
              src={data.image}
              alt={`${level} event preview`}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

            <div className="absolute inset-0 flex items-end justify-center p-6 text-center sm:p-10">

              <div className="max-w-2xl">

                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur-md">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>

                <p className="text-xs font-black uppercase tracking-[0.3em] text-white/80">
                  Your Event Preview
                </p>

                <h3 className="mt-2 text-4xl font-black text-white sm:text-6xl">
                  {level.toUpperCase()}
                </h3>

                <p className="mt-2 text-xl font-bold text-[#f3d99b]">
                  {data.title}
                </p>

                <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-white/85 sm:text-base">
                  {data.subtitle}
                </p>

                <div className="mt-6 inline-flex rounded-full border border-white/30 bg-black/35 px-5 py-2 text-sm font-black text-white backdrop-blur-md">
                  {formatBudget(budget)} Event
                </div>

              </div>
            </div>
          </div>

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

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#b7832b]/20 bg-[#fffaf0]/80 p-5 text-center">
          <p className="text-sm font-semibold leading-relaxed text-[#62584d]">
            <span className="font-black text-[#8b6329]">
              EventBudget Insight:
            </span>{' '}
            Increasing the budget changes the quality of the venue experience,
            decoration, food, entertainment and photography instead of simply
            increasing the total cost.
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
