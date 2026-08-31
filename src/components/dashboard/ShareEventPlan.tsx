import React, { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Smartphone,
  ShieldCheck,
  X,
} from 'lucide-react';

import { EventState } from '../../types';
import { formatINR } from '../../utils/currencyFormatter';

interface ShareEventPlanProps {
  event: EventState;
}

interface SharedPlanPayload {
  v: 1;
  title: string;
  eventType: string;
  totalBudget: number;
  guestCount: number;
  city: string;
  eventDate: string;
  priority: string;
  allocations: EventState['allocations'];
}

const encodePlan = (payload: SharedPlanPayload) => {
  const json = JSON.stringify(payload);

  const bytes = new TextEncoder().encode(json);

  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

export const ShareEventPlan: React.FC<
  ShareEventPlanProps
> = ({ event }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    const payload: SharedPlanPayload = {
      v: 1,
      title: event.title,
      eventType: event.eventType,
      totalBudget: event.totalBudget,
      guestCount: event.guestCount,
      city: event.city,
      eventDate: event.eventDate,
      priority: event.priority,
      allocations: event.allocations,
    };

    const encoded = encodePlan(payload);

    return `${window.location.origin}/#share=${encoded}`;
  }, [event]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      const textarea =
        document.createElement('textarea');

      textarea.value = shareUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      document.execCommand('copy');

      document.body.removeChild(textarea);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const budgetPerGuest =
    event.guestCount > 0
      ? Math.round(
          event.totalBudget / event.guestCount
        )
      : 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-[#d0ae6e]/35 bg-[#d0ae6e]/10 px-4 py-2.5 text-xs font-bold text-[#efd7a9] transition-all hover:-translate-y-0.5 hover:bg-[#d0ae6e]/20 active:translate-y-0"
      >
        <Share2 className="h-4 w-4" />

        <span>Share Event Plan</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[30px] border border-[#d7c39c] bg-[#f8f1e5] shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
            {/* HEADER */}

            <div className="relative overflow-hidden rounded-t-[29px] bg-gradient-to-r from-[#18130e] via-[#2b2218] to-[#17120d] px-6 py-6 sm:px-8">
              <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-[#d0a65f]/10 blur-3xl" />

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#e8d8bb] transition hover:bg-white/10"
                aria-label="Close share event plan"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative pr-10">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d6b477]/25 bg-[#d6b477]/10 px-3 py-1.5">
                  <QrCode className="h-3.5 w-3.5 text-[#e5c486]" />

                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#efd8aa]">
                    Shareable Plan
                  </span>
                </div>

                <h2 className="font-heading text-2xl font-black text-[#fff9ef] sm:text-3xl">
                  Share Your Event Plan
                </h2>

                <p className="mt-2 max-w-lg text-xs leading-relaxed text-[#c9bba6] sm:text-sm">
                  Scan the QR code or copy the link to
                  open a read-only summary of this
                  EventBudget plan.
                </p>
              </div>
            </div>

            {/* CONTENT */}

            <div className="p-5 sm:p-8">
              <div className="grid gap-6 md:grid-cols-[260px_1fr]">
                {/* QR */}

                <div className="flex flex-col items-center">
                  <div className="rounded-[24px] border border-[#d9c9ae] bg-white p-5 shadow-[0_14px_35px_rgba(66,48,28,0.10)]">
                    <QRCodeSVG
                      value={shareUrl}
                      size={210}
                      level="M"
                      includeMargin={false}
                      bgColor="#ffffff"
                      fgColor="#1f1912"
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-[#786a56]">
                    <Smartphone className="h-4 w-4 text-[#a37b40]" />

                    Scan with any phone camera
                  </div>
                </div>

                {/* PLAN SUMMARY */}

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#a17b43]">
                    Event Preview
                  </p>

                  <h3 className="mt-2 text-xl font-black text-[#241d15]">
                    {event.title}
                  </h3>

                  <p className="mt-1 text-xs text-[#81735f]">
                    {event.eventType} • {event.city}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-[#dfd1ba] bg-[#fffaf2] p-3.5">
                      <p className="text-[9px] font-black uppercase tracking-wider text-[#9a8a74]">
                        Budget
                      </p>

                      <p className="mt-1 font-mono-num text-base font-black text-[#2c241b]">
                        {formatINR(event.totalBudget)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#dfd1ba] bg-[#fffaf2] p-3.5">
                      <p className="text-[9px] font-black uppercase tracking-wider text-[#9a8a74]">
                        Guests
                      </p>

                      <p className="mt-1 font-mono-num text-base font-black text-[#2c241b]">
                        {event.guestCount}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#dfd1ba] bg-[#fffaf2] p-3.5">
                      <p className="text-[9px] font-black uppercase tracking-wider text-[#9a8a74]">
                        Budget / Guest
                      </p>

                      <p className="mt-1 font-mono-num text-base font-black text-[#2c241b]">
                        {formatINR(budgetPerGuest)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#dfd1ba] bg-[#fffaf2] p-3.5">
                      <p className="text-[9px] font-black uppercase tracking-wider text-[#9a8a74]">
                        Priority
                      </p>

                      <p className="mt-1 truncate text-sm font-black text-[#2c241b]">
                        {event.priority}
                      </p>
                    </div>
                  </div>

                  {/* COPY */}

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#211a12] px-5 py-3.5 text-xs font-black uppercase tracking-wide text-[#f1d6a3] shadow-[0_10px_24px_rgba(39,28,17,0.18)] transition-all hover:-translate-y-0.5 hover:bg-black active:translate-y-0"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Link Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Share Link
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#d9c8a8] bg-[#efe4d1] p-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#86642f]" />

                    <p className="text-[10px] leading-relaxed text-[#74634c]">
                      The shared link contains only a
                      compact event summary. It does not
                      give the viewer access to your
                      editable EventBudget plan,
                      localStorage, or vendor quotations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-[#dfd0b8] pt-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9a896f]">
                  EVENTBUDGET
                </p>

                <p className="mt-1 text-xs font-semibold text-[#6f604c]">
                  You set the budget. We plan the
                  celebration.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
