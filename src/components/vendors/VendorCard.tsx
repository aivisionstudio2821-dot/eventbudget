import React from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Star,
  FileText,
} from 'lucide-react';

import { Vendor, EventState } from '../../types';
import { formatINR } from '../../utils/currencyFormatter';

interface VendorCardProps {
  vendor: Vendor;
  event: EventState | null;
  onOpenQuoteModal: (vendor: Vendor) => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  event,
  onOpenQuoteModal,
}) => {
  const categoryBudget = event
    ? event.allocations[vendor.categoryKey] || 0
    : 0;

  const generateWhatsAppUrl = () => {
    if (!event) {
      const defaultText = encodeURIComponent(
        `Hi ${vendor.name}, I found your service on EventBudget. Please share your event packages and availability.`
      );

      return `https://wa.me/${vendor.whatsapp}?text=${defaultText}`;
    }

    const eventDateFormatted = new Date(
      event.eventDate
    ).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const message = `Hi ${vendor.name}, I found your service through EventBudget.
I am planning a ${event.eventType} event in ${event.city} for ${event.guestCount} guests on ${eventDateFormatted}.
My approximate budget for ${vendor.category} is ${formatINR(categoryBudget)}.
Please share your quotation and availability.`;

    return `https://wa.me/${vendor.whatsapp}?text=${encodeURIComponent(
      message
    )}`;
  };

  return (
    <div className="group flex flex-col justify-between rounded-[24px] border border-[#ded5c8] bg-white p-5 shadow-[0_10px_30px_rgba(40,32,22,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b8955f] hover:shadow-[0_18px_38px_rgba(40,32,22,0.11)]">

      <div>

        {/* TOP ROW */}

        <div className="mb-4 flex items-center justify-between gap-2">

          <span className="rounded-full border border-[#d6c3a3] bg-[#f5ead9] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-[#7f6137]">
            {vendor.category}
          </span>

          <div className="flex items-center gap-1 text-xs font-black text-[#a77a35]">
            <Star className="h-3.5 w-3.5 fill-[#c99b50] text-[#c99b50]" />
            <span>{vendor.rating || 4.9}</span>
          </div>

        </div>

        {/* VENDOR NAME */}

        <div className="mb-3">

          <div className="flex items-center gap-1.5">

            <h4 className="text-base font-black text-[#2e2923] transition-colors group-hover:text-[#8d6938]">
              {vendor.name}
            </h4>

            {vendor.verified && (
              <span title="Verified Service Provider">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#738257]" />
              </span>
            )}

          </div>

          <p className="mt-1 flex items-center gap-1 text-xs text-[#82796d]">
            <MapPin className="h-3 w-3 shrink-0 text-[#b78843]" />
            <span>
              {vendor.area}, {vendor.city}
            </span>
          </p>

        </div>

        {/* DESCRIPTION */}

        <p className="mb-4 text-xs leading-relaxed text-[#71695f]">
          {vendor.description}
        </p>

        {/* TAGS */}

        <div className="mb-4 flex flex-wrap gap-1.5">

          {vendor.tags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-md border border-[#e2ddd5] bg-[#f6f4f0] px-2 py-1 text-[10px] font-semibold text-[#6f675c]"
            >
              {tag}
            </span>
          ))}

        </div>

        {/* CATEGORY BUDGET */}

        {event && categoryBudget > 0 && (
          <div className="mb-4 rounded-xl border border-[#dac5a3] bg-[#f7efe1] p-3">

            <div className="flex items-center justify-between gap-2">

              <span className="text-[10px] font-bold uppercase tracking-wide text-[#88765e]">
                Your {vendor.category} Budget
              </span>

              <strong className="text-sm font-black text-[#856134]">
                {formatINR(categoryBudget)}
              </strong>

            </div>

            <p className="mt-1 text-[10px] leading-relaxed text-[#928574]">
              Contact the vendor and compare their quotation with this target.
            </p>

          </div>
        )}

      </div>

      {/* ACTIONS */}

      <div className="space-y-2 border-t border-[#e6e0d7] pt-4">

        <div className="grid grid-cols-2 gap-2">

          <a
            href={`tel:${vendor.phone}`}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#ddd6cc] bg-[#f5f3ef] px-3 py-2.5 text-xs font-black text-[#403a33] transition-all hover:bg-[#ebe7df] active:scale-95"
          >
            <Phone className="h-3.5 w-3.5 text-[#8b6738]" />
            Call
          </a>

          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2.5 text-xs font-black text-[#102516] shadow-sm transition-all hover:bg-[#20bd5a] active:scale-95"
          >
            <MessageCircle className="h-3.5 w-3.5 fill-[#102516]" />
            WhatsApp
          </a>

        </div>

        <button
          type="button"
          onClick={() => onOpenQuoteModal(vendor)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#b9965e] bg-[#211d18] px-3 py-2.5 text-xs font-black text-[#e5c17f] transition-all hover:bg-black active:scale-95"
        >
          <FileText className="h-3.5 w-3.5" />
          Enter Vendor Quote
        </button>

      </div>

    </div>
  );
};
