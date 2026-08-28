import React from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Star,
  PlusCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { Vendor, EventState, CategoryKey } from '../../types';
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
  // Compute category budget for this vendor
  const categoryBudget = event ? (event.allocations[vendor.categoryKey] || 0) : 0;

  // Generate dynamic pre-filled WhatsApp message URL
  const generateWhatsAppUrl = () => {
    if (!event) {
      const defaultText = encodeURIComponent(
        `Hi ${vendor.name}, I found your service on EventBudget. Please share your event packages and availability.`
      );
      return `https://wa.me/${vendor.whatsapp}?text=${defaultText}`;
    }

    const eventDateFormatted = new Date(event.eventDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const message = `Hi ${vendor.name}, I found your service through EventBudget.
I am planning a ${event.eventType} event in ${event.city} for ${event.guestCount} guests on ${eventDateFormatted}.
My approximate budget for ${vendor.category} is ${formatINR(categoryBudget)}.
Please share your quotation and availability.`;

    return `https://wa.me/${vendor.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="p-5 rounded-3xl bg-[#0f172a]/80 border border-slate-800 hover:border-purple-500/40 hover:bg-[#141d33]/90 transition-all duration-200 flex flex-col justify-between group shadow-lg">
      
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase tracking-wider">
            {vendor.category}
          </span>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{vendor.rating || 4.9}</span>
          </div>
        </div>

        {/* Vendor Title */}
        <div className="mb-2">
          <div className="flex items-center gap-1.5">
            <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              {vendor.name}
            </h4>
            {vendor.verified && (
              <span title="Verified Service Provider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{vendor.area}, {vendor.city}</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          {vendor.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {vendor.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Smart Category Budget Context */}
        {event && categoryBudget > 0 && (
          <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 mb-4 text-[11px] text-purple-200">
            <span>Your {vendor.category} Budget: </span>
            <strong className="text-amber-300 font-bold">{formatINR(categoryBudget)}</strong>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Contact vendor for a quote within this budget target.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          
          {/* Tel: Call Button */}
          <a
            href={`tel:${vendor.phone}`}
            className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all flex items-center justify-center gap-1.5 active:scale-95 text-center"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Call</span>
          </a>

          {/* WhatsApp Direct Action */}
          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-950 bg-[#25D366] hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow text-center"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
            <span>WhatsApp</span>
          </a>

        </div>

        {/* Add Quote Button */}
        <button
          type="button"
          onClick={() => onOpenQuoteModal(vendor)}
          className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-purple-300 hover:text-white hover:bg-purple-600/30 border border-purple-500/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>+ Enter Vendor Quote</span>
        </button>
      </div>

    </div>
  );
};
